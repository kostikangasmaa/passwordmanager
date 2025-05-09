import aesjs from "aes-js";

export const decryptPassword = async (encryptedData, hashedKey) => {
    try {
        // Split the encrypted data into the encrypted password and IV
        const [encryptedPasswordHex, ivHex] = encryptedData.split(":");

        // Convert encrypted password and IV to bytes
        const encryptedBytes = aesjs.utils.hex.toBytes(encryptedPasswordHex);
        const iv = aesjs.utils.hex.toBytes(ivHex);

        // Convert hashed key (already SHA-256) to bytes
        const keyBytes = aesjs.utils.hex.toBytes(hashedKey);

        // Decrypt the password using AES-CBC
        const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, iv);
        const decryptedBytes = aesjs.padding.pkcs7.strip(aesCbc.decrypt(encryptedBytes));

        // Convert decrypted data back to UTF-8
        return aesjs.utils.utf8.fromBytes(decryptedBytes);
    } catch (error) {
        console.error("Error decrypting password:", error);
        throw error;
    }
};