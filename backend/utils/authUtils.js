// authUtils.js
const forge = require('node-forge');

const privateKeyPem = `-----BEGIN PRIVATE KEY-----\n${process.env.ACCESS_TOKEN_SECRET_KEY.replace(/\\n/g, '\n')}\n-----END PRIVATE KEY-----`;
const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLIC_KEY.replace(/\\n/g, '\n')}\n-----END PUBLIC KEY-----`;

const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

// Encryption utility using node-forge
const encrypt = (data) => {
  try {
    const encrypted = publicKey.encrypt(forge.util.encodeUtf8(JSON.stringify(data)), 'RSA-OAEP');
    return forge.util.encode64(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

// Decryption utility using node-forge
const decryptData = (encryptedData) => {
  try {
    const decodedData = forge.util.decode64(encryptedData);
    const decrypted = privateKey.decrypt(decodedData, 'RSA-OAEP');
    const decryptedString = forge.util.decodeUtf8(decrypted);

    // Try to parse as JSON, if it fails return the string as is
    try {
      return JSON.parse(decryptedString);
    } catch (e) {
      return decryptedString;
    }
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Function to decrypt data and return as an object (if JSON)
const decryptObjectData = (encryptedData) => {
  try {
    const decodedData = forge.util.decode64(encryptedData);
    const decrypted = privateKey.decrypt(decodedData, 'RSA-OAEP');
    const decryptedString = forge.util.decodeUtf8(decrypted);

    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

module.exports = {
  decryptData,
  decryptObjectData,
  encrypt
};