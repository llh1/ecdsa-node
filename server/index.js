const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "02cd4318708dd0b04ce354f2798cf27c6037795d66227d5b504a80a5b53c3b5764": 100, // cd7f0d80946600e0788f9692b3883e2351399e3eb3f3a3f76e9c3b9ed4da8b30
  "0290c939c5a256433f38017d65abc50eb826eadb45cea0ffa5eba6caa16c618596": 50, // 5bee379417f8ee30c21cc0d109dd4ffefdb8e9a541d129fd90d403818d75ddf9
  "0282e5dff7cd5db87abc5c96d2176ae5bf3f119448ec134dce2c123c313ab5179a": 75, // be9a545e5ac1c7e61ad7389e2b136f149b96cc4c6c326493b388f6476e84fcc6
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, transaction } = req.body;

  let signatureRecovered = secp256k1.Signature.fromCompact(signature);
  signatureRecovered = signatureRecovered.addRecoveryBit(1);

  const transactionHash = keccak256(utf8ToBytes(JSON.stringify(transaction)));
  const sender = toHex(signatureRecovered.recoverPublicKey(transactionHash).toRawBytes());

  const { recipient, amount } = transaction;
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
