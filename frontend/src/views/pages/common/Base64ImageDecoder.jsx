import * as React from 'react';
import {Form, Icon, Image, Segment} from 'semantic-ui-react';
import * as constants from '../../../core/util/constants.js';
import LayoutResolver from "../../layouts/layout-resolver.jsx";

const imageSizeOptions = [
    {key: 'small', value: 'small', text: 'Small'},
    {key: 'medium', value: 'medium', text: 'Medium'},
    {key: 'large', value: 'large', text: 'Large'},
    {key: 'big', value: 'big', text: 'Big'},
];

const mimeTypeOptions = [
    {
        key: 'data:image/svg+xml;base64',
        value: 'data:image/svg+xml;base64',
        text: 'svg',
    },
    {key: 'data:image/gif;base64', value: 'data:image/gif;base64', text: 'gif'},
    {key: 'data:image/png;base64', value: 'data:image/png;base64', text: 'png'},
    {
        key: 'data:image/webp;base64',
        value: 'data:image/webp;base64',
        text: 'webp',
    },
    {
        key: 'data:image/jpeg;base64',
        value: 'data:image/jpeg;base64',
        text: 'jpeg',
    },
    {
        key: 'data:image/x-icon;base64',
        value: 'data:image/x-icon;base64',
        text: 'ico',
    },
];

export default function Base64ImageDecoder() {
    const [rawValue, setRawValue] = React.useState('');
    const [mimeType, setMimeType] = React.useState('png');
    const [imageSize, setImageSize] = React.useState('medium');

    const onImageSizeChange = (value) => {
        localStorage.setItem(constants.KEY_BASE64_IMAGE_DECODER_IMAGE_SIZE, value);
        setImageSize(value);
    };

    const onImageTypeChange = (value) => {
        localStorage.setItem(constants.KEY_BASE64_IMAGE_DECODER_IMAGE_TYPE, value);
        setMimeType(value);
    };

    const download = () => {
        let ext = '';
        for (let i = 0; i < mimeTypeOptions.length; i += 1) {
            const item = mimeTypeOptions[i];
            if (item.key === mimeType) {
                ext = `.${item.text}`;
                break;
            }
        }
        const link = document.createElement('a');
        link.download = `image${new Date().getTime()}${ext}`;
        link.href = `${mimeType},${rawValue}`;
        link.click();
    };

    React.useEffect(() => {
        if (mimeType.startsWith('data:image/')) {
            for (let i = 0; i < mimeTypeOptions.length; i += 1) {
                const opt = mimeTypeOptions[i];
                if (rawValue.startsWith(opt.value)) {
                    setRawValue(rawValue.substring(opt.value.length + 1));
                    setMimeType(opt.value);
                    break;
                }
            }
        }
    }, [rawValue]);

    React.useEffect(() => {
        const storedImageSize = localStorage.getItem(
            constants.KEY_BASE64_IMAGE_DECODER_IMAGE_SIZE) ?? imageSize;
        const storedImageType = localStorage.getItem(
            constants.KEY_BASE64_IMAGE_DECODER_IMAGE_TYPE,
        ) ?? mimeType;
        setImageSize(storedImageSize);
        setMimeType(storedImageType);
    }, []);

    return (
        <LayoutResolver>
            <Form>
                <Form.TextArea
                    rows={15}
                    value={rawValue}
                    label="Base64 String"
                    placeholder="Enter or paste base64 string here"
                    onChange={(e) => setRawValue(e.currentTarget.value)}
                />
                <Form.Group inline>
                    <Form.Select
                        value={mimeType}
                        label="Image Type"
                        onChange={(_e, {value}) =>
                            value !== undefined && onImageTypeChange(value.toString())
                        }
                        placeholder="Set image type"
                        options={mimeTypeOptions}
                    />
                    <Form.Select
                        value={imageSize}
                        label="Preview"
                        onChange={(_e, {value}) =>
                            value !== undefined && onImageSizeChange(value.toString())
                        }
                        placeholder="Set image preview size"
                        options={imageSizeOptions}
                    />
                </Form.Group>

                <Segment textAlign="center" className="image-box">
                    <Image
                        inline
                        src={
                            rawValue === '' || mimeType === '' ? '' : `${mimeType},${rawValue}`
                        }
                        size={imageSize}
                    />
                </Segment>
                <Form.Button onClick={download}>
                    <Icon name="save"/>
                    Save
                </Form.Button>
            </Form>
        </LayoutResolver>
    );
}
