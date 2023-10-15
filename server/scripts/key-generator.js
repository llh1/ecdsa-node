const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = toHex(secp256k1.utils.randomPrivateKey());
console.log(`PrivateKey: ${privateKey}`);

const publicKey = toHex(secp256k1.getPublicKey(privateKey));
console.log(`PublicKey: ${publicKey}`);