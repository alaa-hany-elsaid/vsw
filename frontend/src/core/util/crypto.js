import * as crypto from "crypto";
import bcryptjs from 'bcryptjs';
import JSEncrypt from 'jsencrypt';


const bcrypt = {
    hash: (text, rounds) => {
        return bcryptjs.hashSync(text, bcryptjs.genSaltSync(rounds));
    },
    compare: (left, right) => {
        return bcryptjs.compareSync(left, right);
    },
};


const rsa = {
    encrypt: (value, key, type) => {
        const js_rsa = new JSEncrypt();
        if (type === 'public') {
            js_rsa.setPublicKey(key);
        } else {
            js_rsa.setPrivateKey(key)
        }
        return js_rsa.encrypt(value);
    },
    decrypt: (value, key, type) => {
        const js_rsa = new JSEncrypt();
        if (type === 'public') {
            js_rsa.setPublicKey(key);
        } else {
            js_rsa.setPrivateKey(key)
        }
        return js_rsa.decrypt(value);
    },
    generateKeyPairs: (keySize) => {
        const jsEncrypt = new JSEncrypt({default_key_size: keySize});
        jsEncrypt.getKey()
        return {
            publicKey: jsEncrypt.getPublicKey(),
            privateKey: jsEncrypt.getPrivateKey(),
        };
    },
};

const checksum = (content, hasher) => {
    const hash = crypto.createHash(hasher);
    hash.update(content);
    return hash.digest('hex');
};
export default {
    checksum,
    bcrypt,
    rsa,
};
