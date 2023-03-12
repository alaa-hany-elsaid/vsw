import AesDesCryptor from "../views/pages/common/AesDesCryptor.jsx";
import AsciiNativeConverter from "../views/pages/common/AsciiNativeConverter.jsx";
import Base64Converter from "../views/pages/common/Base64Converter.jsx";
import Base64ImageDecoder from "../views/pages/common/Base64ImageDecoder.jsx";
import Base64ImageEncoder from "../views/pages/common/Base64ImageEncoder.jsx";
import BcryptEncryptor from "../views/pages/common/BcryptEncryptor.jsx";
import ByteCalculator from "../views/pages/common/ByteCalculator.jsx";
import ColorPicker from "../views/pages/common/ColorPicker.jsx";


let tools = [
    {
        title: 'AES/DES Cryptor',
        keywords: 'aes,des,triple,tdes,crypto',
        path: '/tools/aes-des-cryptor',
        element: <AesDesCryptor/>
    },
    {
        path: '/tools/ascii-native',
        title: 'ASCII/Native Converter',
        keywords: 'ascii,native,converter',
        element: <AsciiNativeConverter/>,
    },
    {
        path: '/tools/base64-converter',
        title: 'Base64 Converter',
        keywords: 'base64,converter',
        element: <Base64Converter/>,
    },

    {
        path: '/tools/base64-image-decoder',
        title: 'Base64 Image Decoder',
        keywords: 'base64,image,decode',
        element: <Base64ImageDecoder/>,
    },
    {
        path: '/tools/base64-image-encoder',
        title: 'Base64 Image Encoder',
        keywords: 'base64,image,encode',
        element: <Base64ImageEncoder/>,
    },
    {
        path: '/tools/bcrypt-encryptor',
        title: 'Bcrypt Encryptor',
        keywords: 'bcrypt,crypto',
        element: <BcryptEncryptor/>,
    },
    {
        path: '/tools/byte-calculator',
        title: 'Byte Calculator',
        keywords: 'byte',
        element: <ByteCalculator/>
    },
    {
        path: '/tools/color-picker',
        title: 'Color Picker',
        keywords: 'color',
        element: <ColorPicker/>
    }


]
let commonPages = [
    ...tools
];
let userPages = [

];


export {
    commonPages,
    userPages,
    tools
};
