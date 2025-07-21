import React, { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

import "./App.css";

const contractAddress = "0x9D1eb059977D71E1A21BdebD1F700d4A39744A70";

function App() {
  const [text, setText] = useState("");
  const [address, setAddress] = useState("");
  const [result, setResult] = useState("");
  let signer;

  React.useEffect(function () {
    if (!window.ethereum) {
      connectWallet();
    }
  });

  async function connectWallet() {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      const addy = `${signer.address.slice(0, 5)}.....${signer.address.slice(
        -5
      )}`;

      setAddress(addy);
    } else {
      console.error(
        "MetaMask not found. Please install MetaMask to use this application."
      );
    }
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();

      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.setMessage(text);
      const txReceipt = await tx.wait();
      console.log("Transaction successful:", txReceipt);

      setText("");
    } catch (error) {
      console.error("Error setting message:", error);
      alert(error.message || error);
    }
  };

  async function handleGet() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.getMessage();
      const txReceipt = await tx;
      setResult(txReceipt);
      console.log("Transaction get:", txReceipt);
    } catch (err) {
      console.error("Error setting message:", err);
      alert(err.message || err);
    }
  }

  return (
    <div className="wrapper">
      <button onClick={connectWallet} className="btn">
        {address ? address : "Connect wallet"}
      </button>
      <h1 className="heading">Set Message on Smart Contract</h1>
      <input
        className="text"
        type="text"
        placeholder="Set message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {!!result && <p className="result">{result}</p>}
      <div>
        <button className="btn" onClick={handleSet}>
          Set Message
        </button>
        <button className="btn" onClick={handleGet}>
          Get Message
        </button>
      </div>
    </div>
  );
}

export default App;
