import * as CryptoJS from 'crypto-js';


export class AesUtils {
    keySize: number;
    iterationCount: number;
    constructor(keySize, iterationCount) {
        this.keySize = keySize / 32;
        this.iterationCount = iterationCount;
    }
    generateKey(salt, passPhrase) {
        const key = CryptoJS.PBKDF2(
            passPhrase,
            CryptoJS.enc.Hex.parse(salt),
            { keySize: this.keySize, iterations: this.iterationCount });
        return key;
    }

   /* encrypt(salt, iv, passPhrase, plainText) {
        var key = this.generateKey(salt, passPhrase);
        var encrypted = CryptoJS.AES.encrypt(
            plainText,
            key,
            { iv: CryptoJS.enc.Hex.parse(iv) });
        return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    }*/
    decrypt(salt, iv, passPhrase, cipherText) {
        const key = this.generateKey(salt, passPhrase);
       /* var cipherParams = CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(cipherText)
        });*/
        const decrypted = CryptoJS.AES.decrypt(
            cipherText,
            key,
            { iv: CryptoJS.enc.Hex.parse(iv) });
        return decrypted.toString(CryptoJS.enc.Utf8);
    };
}
