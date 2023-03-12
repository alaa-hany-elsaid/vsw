import * as React from 'react';
import {Form, Icon, Label, Tab} from 'semantic-ui-react';
import CryptoJS from 'crypto-js';
import utils from '../../../core/util/helper';
import LayoutResolver from "../../layouts/layout-resolver.jsx";

const algorithmOptions = [
    {key: 'AES', value: 'AES', text: 'AES'},
    {key: 'DES', value: 'DES', text: 'DES'},
    {key: 'TDES', value: 'TDES', text: 'TripleDES'},
];

const modeOptions = [
    {key: 'ECB', value: 'ECB', text: 'ECB'},
    {key: 'CBC', value: 'CBC', text: 'CBC'},
];

const toCryptoJSMode = (key) => {
    if (key === 'CBC') {
        return CryptoJS.mode.CBC;
    }
    if (key === 'ECB') {
        return CryptoJS.mode.ECB;
    }
    return null;
};

const paddingOptions = [
    {key: 'Pkcs7', value: 'Pkcs7', text: 'Pkcs7'},
    {key: 'AnsiX923', value: 'AnsiX923', text: 'AnsiX923'},
    {key: 'Iso10126', value: 'Iso10126', text: 'Iso10126'},
    {key: 'Iso97971', value: 'Iso97971', text: 'Iso97971'},
    {key: 'NoPadding', value: 'NoPadding', text: 'NoPadding'},
    {key: 'ZeroPadding', value: 'ZeroPadding', text: 'ZeroPadding'},
];

const toCryptoJSPadding = (key) => {
    if (key === 'AnsiX923') {
        return CryptoJS.pad.AnsiX923;
    }
    if (key === 'Iso10126') {
        return CryptoJS.pad.Iso10126;
    }
    if (key === 'Iso97971') {
        return CryptoJS.pad.Iso97971;
    }
    if (key === 'NoPadding') {
        return CryptoJS.pad.NoPadding;
    }
    if (key === 'ZeroPadding') {
        return CryptoJS.pad.ZeroPadding;
    }
    return CryptoJS.pad.Pkcs7;
};

const isHexString = (value) => {
    const pattern = '^[a-fA-F0-9\\s]+$';
    const regex = new RegExp(pattern);
    return regex.test(value);
};

const noborderLabel = {
    borderLeft: 'none',
    color: 'grey',
    textAlign: 'right',
    fontWeight: 'normal',
};

const TabAesDesEncryptor = () => {
    const [rawValue, setRawValue] = React.useState('');
    const [resultValue, setResultValue] = React.useState('');
    const [outputTextFormat, setOutputTextFormat] = React.useState('base64');
    const [algorithm, setAlgorithm] = React.useState('AES');
    const [mode, setMode] = React.useState('ECB');
    const [padding, setPadding] = React.useState('Pkcs7');

    const [iv, setIv] = React.useState('');
    const [secretKey, setSecretKey] = React.useState('');

    const onEncrypt = () => {
        setResultValue('');
        try {
            if (algorithm === 'AES') {
                if (
                    secretKey.length !== 16 &&
                    secretKey.length !== 24 &&
                    secretKey.length !== 32
                ) {
                    utils.toast.error(
                        'The secret key should be 16/24/32 characters long!'
                    );
                    return;
                }

                if (mode === 'CBC' && iv.length !== 16) {
                    utils.toast.error(
                        'The initialization vector should be 16 characters long!'
                    );
                    return;
                }
            }

            if (algorithm === 'DES') {
                if (mode === 'CBC' && iv.length === 0) {
                    utils.toast.error('The initialization vector required!');
                    return;
                }
            }

            if (algorithm === 'TDES') {
                if (secretKey.length !== 24) {
                    utils.toast.error('The secret key should be 24 characters long!');
                    return;
                }

                if (mode === 'CBC' && iv.length !== 8) {
                    utils.toast.error(
                        'The initialization vector should be 8 characters long!'
                    );
                    return;
                }
            }

            const keyValue = CryptoJS.enc.Utf8.parse(secretKey);
            const ivValue = CryptoJS.enc.Utf8.parse(iv);
            let result = null;
            if (algorithm === 'AES') {
                result = CryptoJS.AES.encrypt(rawValue, keyValue, {
                    iv: mode === 'CBC' ? ivValue : undefined,
                    mode: toCryptoJSMode(mode),
                    padding: toCryptoJSPadding(padding),
                });
            } else if (algorithm === 'DES') {
                result = CryptoJS.DES.encrypt(rawValue, keyValue, {
                    iv: mode === 'CBC' ? ivValue : undefined,
                    mode: toCryptoJSMode(mode),
                    padding: toCryptoJSPadding(padding),
                });
            } else if (algorithm === 'TDES') {
                result = CryptoJS.TripleDES.encrypt(rawValue, keyValue, {
                    iv: mode === 'CBC' ? ivValue : undefined,
                    mode: toCryptoJSMode(mode),
                    padding: toCryptoJSPadding(padding),
                });
            }

            if (result == null) return;

            if (outputTextFormat === 'base64') {
                setResultValue(result.toString());
            } else if (outputTextFormat === 'hex') {
                setResultValue(result.ciphertext.toString());
            }
        } catch (error) {
            utils.toast.error('Encrypt failed!');
        }
    };

    const onCopy = () => {
        utils.copy(resultValue);
    };

    const onReset = () => {
        setRawValue('');
        setResultValue('');
        setSecretKey('');
        setIv('');
    };

    const onModeChange = (value) => {
        if (value !== 'CBC') setIv('');
        setMode(value);
    };

    return (
        <Tab.Pane>
            <Form>
                <Form.TextArea
                    rows={8}
                    value={rawValue}
                    label="Text"
                    onChange={(e) => setRawValue(e.currentTarget.value)}
                    placeholder="Enter plain text here"
                />
                <Form.Group widths="equal">
                    <Form.Select
                        label="Algorithm"
                        value={algorithm}
                        onChange={(_e, {value}) =>
                            value !== undefined && setAlgorithm(value.toString())
                        }
                        placeholder="Select algorithm"
                        options={algorithmOptions}
                    />
                    <Form.Select
                        label="Mode"
                        value={mode}
                        onChange={(_e, {value}) =>
                            value !== undefined && onModeChange(value.toString())
                        }
                        placeholder="Select mode"
                        options={modeOptions}
                    />
                    <Form.Select
                        label="Padding"
                        value={padding}
                        onChange={(_e, {value}) =>
                            value !== undefined && setPadding(value.toString())
                        }
                        placeholder="Select padding scheme"
                        options={paddingOptions}
                    />
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Input
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.currentTarget.value)}
                        label="Secret Key"
                        placeholder="Enter secret key"
                        labelPosition="right"
                    >
                        <input/>
                        <Label basic style={noborderLabel}>
                            Length: {secretKey.length}
                        </Label>
                    </Form.Input>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Input
                        value={iv}
                        disabled={mode !== 'CBC'}
                        onChange={(e) => setIv(e.currentTarget.value)}
                        label="IV"
                        placeholder="Enter initialization vector"
                        labelPosition="right"
                    >
                        <input/>
                        <Label basic style={noborderLabel}>
                            Length: {iv.length}
                        </Label>
                    </Form.Input>
                </Form.Group>
                <Form.Group inline>
                    <label>Output Text Format </label>
                    <Form.Radio
                        label="Base64"
                        value="base64"
                        checked={outputTextFormat === 'base64'}
                        onChange={(_e, {value}) =>
                            value !== undefined && setOutputTextFormat(value.toString())
                        }
                    />
                    <Form.Radio
                        label="Hex"
                        value="hex"
                        checked={outputTextFormat === 'hex'}
                        onChange={(_e, {value}) =>
                            value !== undefined && setOutputTextFormat(value.toString())
                        }
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Button primary onClick={onEncrypt}>
                        Encrypt
                    </Form.Button>
                </Form.Group>
                <Form.TextArea rows={8} value={resultValue} label="Output Text"/>
                <Form.Group inline>
                    <Form.Button onClick={onCopy}>
                        <Icon name="copy"/>
                        Copy
                    </Form.Button>
                    <Form.Button onClick={onReset}>Reset</Form.Button>
                </Form.Group>
            </Form>
        </Tab.Pane>
    );
};

const TabAesDesDecryptor = () => {
    const [rawValue, setRawValue] = React.useState('');
    const [resultValue, setResultValue] = React.useState('');
    const [decodedResultValue, setDecodedResultValue] = React.useState('');
    const [inputTextFormat, setInputTextFormat] = React.useState('base64');
    const [algorithm, setAlgorithm] = React.useState('AES');
    const [mode, setMode] = React.useState('ECB');
    const [padding, setPadding] = React.useState('Pkcs7');

    const [iv, setIv] = React.useState('');
    const [secretKey, setSecretKey] = React.useState('');

    const onDecrypt = () => {
        setResultValue('');
        setDecodedResultValue('');
        try {
            if (algorithm === 'AES') {
                if (
                    secretKey.length !== 16 &&
                    secretKey.length !== 24 &&
                    secretKey.length !== 32
                ) {
                    utils.toast.error(
                        'The secret key should be 16/24/32 characters long!'
                    );
                    return;
                }

                if (mode === 'CBC' && iv.length !== 16) {
                    utils.toast.error(
                        'The initialization vector should be 16 characters long!'
                    );
                    return;
                }
            }

            if (algorithm === 'DES') {
                if (mode === 'CBC' && iv.length === 0) {
                    utils.toast.error('The initialization vector required!');
                    return;
                }
            }

            if (algorithm === 'TDES') {
                if (secretKey.length !== 24) {
                    utils.toast.error('The secret key should be 24 characters long!');
                    return;
                }

                if (mode === 'CBC' && iv.length !== 8) {
                    utils.toast.error(
                        'The initialization vector should be 8 characters long!'
                    );
                    return;
                }
            }

            let rawText = rawValue.trim();
            if (inputTextFormat === 'hex') {
                rawText = rawText.replaceAll(' ', '').toLowerCase();
                const encryptedHexStr = CryptoJS.enc.Hex.parse(rawText);
                rawText = CryptoJS.enc.Base64.stringify(encryptedHexStr);
            }

            const keyValue = CryptoJS.enc.Utf8.parse(secretKey);
            const ivValue = CryptoJS.enc.Utf8.parse(iv);
            let result;
            if (algorithm === 'AES') {
                result = CryptoJS.AES.decrypt(rawText, keyValue, {
                    iv: mode === 'CBC' ? ivValue : undefined,
                    mode: toCryptoJSMode(mode),
                    padding: toCryptoJSPadding(padding),
                });
            } else if (algorithm === 'DES') {
                result = CryptoJS.DES.decrypt(rawText, keyValue, {
                    iv: mode === 'CBC' ? ivValue : undefined,
                    mode: toCryptoJSMode(mode),
                    padding: toCryptoJSPadding(padding),
                });
            } else if (algorithm === 'TDES') {
                result = CryptoJS.TripleDES.decrypt(rawText, keyValue, {
                    iv: mode === 'CBC' ? ivValue : undefined,
                    mode: toCryptoJSMode(mode),
                    padding: toCryptoJSPadding(padding),
                });
            }

            if (result == null) return;

            setResultValue(result.toString());
            setDecodedResultValue(result.toString(CryptoJS.enc.Utf8));
        } catch (error) {
            utils.toast.error('Decrypt failed!');
        }
    };

    const onCopy = () => {
        utils.copy(resultValue);
    };

    const onModeChange = (value) => {
        if (value !== 'CBC') setIv('');
        setMode(value);
    };

    const onReset = () => {
        setRawValue('');
        setResultValue('');
        setSecretKey('');
        setIv('');
        setDecodedResultValue('');
    };

    React.useEffect(() => {
        if (isHexString(rawValue)) {
            setInputTextFormat('hex');
        } else {
            setInputTextFormat('base64');
        }
    }, [rawValue]);

    return (
        <Tab.Pane>
            <Form>
                <Form.TextArea
                    rows={8}
                    value={rawValue}
                    label="Text"
                    onChange={(e) => setRawValue(e.currentTarget.value)}
                    placeholder="Enter encrypted text here"
                />
                <Form.Group inline>
                    <label>Input Text Format </label>
                    <Form.Radio
                        label="Base64"
                        value="base64"
                        checked={inputTextFormat === 'base64'}
                        onChange={(_e, {value}) =>
                            value !== undefined && setInputTextFormat(value.toString())
                        }
                    />
                    <Form.Radio
                        label="Hex"
                        value="hex"
                        checked={inputTextFormat === 'hex'}
                        onChange={(_e, {value}) =>
                            value !== undefined && setInputTextFormat(value.toString())
                        }
                    />
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Select
                        label="Algorithm"
                        value={algorithm}
                        onChange={(_e, {value}) =>
                            value !== undefined && setAlgorithm(value.toString())
                        }
                        placeholder="Select algorithm"
                        options={algorithmOptions}
                    />
                    <Form.Select
                        label="Mode"
                        value={mode}
                        onChange={(_e, {value}) =>
                            value !== undefined && onModeChange(value.toString())
                        }
                        placeholder="Select mode"
                        options={modeOptions}
                    />
                    <Form.Select
                        disabled={algorithm === 'DES'}
                        label="Padding"
                        value={padding}
                        onChange={(_e, {value}) =>
                            value !== undefined && setPadding(value.toString())
                        }
                        placeholder="Select padding scheme"
                        options={paddingOptions}
                    />
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Input
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.currentTarget.value)}
                        label="Secret Key"
                        placeholder="Enter secret key"
                        labelPosition="right"
                    >
                        <input/>
                        <Label basic style={noborderLabel}>
                            Length: {secretKey.length}
                        </Label>
                    </Form.Input>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Input
                        value={iv}
                        disabled={mode !== 'CBC'}
                        onChange={(e) => setIv(e.currentTarget.value)}
                        label="IV"
                        placeholder="Enter initialization vector"
                        labelPosition="right"
                    >
                        <input/>
                        <Label basic style={noborderLabel}>
                            Length: {iv.length}
                        </Label>
                    </Form.Input>
                </Form.Group>
                <Form.Group>
                    <Form.Button primary onClick={onDecrypt}>
                        Decrypt
                    </Form.Button>
                </Form.Group>
                <Form.TextArea rows={8} value={resultValue} label="Output Text(Hex)"/>
                <Form.Group inline>
                    <Form.Button onClick={onCopy}>
                        <Icon name="copy"/>
                        Copy
                    </Form.Button>
                    <Form.Button onClick={onReset}>Reset</Form.Button>
                </Form.Group>
                <Form.TextArea
                    rows={8}
                    value={decodedResultValue}
                    label="Decoded(Plain Text)"
                />
            </Form>
        </Tab.Pane>
    );
};

const tabAesDesEncryptor = () => <TabAesDesEncryptor/>;
const tabAesDesDecryptor = () => <TabAesDesDecryptor/>;

const panes = [
    {menuItem: 'Encryption', render: tabAesDesEncryptor},
    {menuItem: 'Decryption', render: tabAesDesDecryptor},
];

export default function AesDesCryptor() {
    return <LayoutResolver> <Tab menu={{secondary: true, pointing: true}} panes={panes}/> </LayoutResolver>;
}
