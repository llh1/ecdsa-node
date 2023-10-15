import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils.js";
import server from "./server";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    try {
      const privateKey = evt.target.value;
      setPrivateKey(privateKey);

      const address = toHex(secp256k1.getPublicKey(privateKey));
      setAddress(address);

      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    } catch(ex) {
      setBalance(0);
      setAddress("");
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Private Key" value={privateKey} onChange={onChange}></input>
      </label>

      <label>
        Wallet Address
        <p>{address}</p>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
