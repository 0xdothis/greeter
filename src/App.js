import React, { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

import "./App.css";

const contractAddress = "0x9D1eb059977D71E1A21BdebD1F700d4A39744A70";

function App() {
  const [text, setText] = useState("");
  const [address, setAddress] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function connectWallet() {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
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
        setError("Please enter a message before setting.");
        setResult("");
        return;
      }

      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text);
        const txReceipt = await tx.wait();
        console.log("Transaction successful:", txReceipt);
        setText("");
      } else {
        setError(
          "MetaMask not found. Please install MetaMask to use this application."
        );
      }
    } catch (error) {
      setError(`Error setting message: ${error}`);
    }
  };

  const handleGet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);

        const contract = new ethers.Contract(contractAddress, abi, provider);

        const tx = await contract.getMessage();

        setResult(tx);
        console.log("Transaction successful:", tx);
        setError("");
      } else {
        setError(
          "MetaMask not found. Please install MetaMask to use this application."
        );
      }
    } catch (error) {
      setError(`Error setting message: ${error.message}`);
    }
  };

  return (
    <div className="wrapper">
      <button onClick={connectWallet} className="btn">
        {address ? address : "Connect wallet"}
      </button>
      {address && (
        <>
          <h1 className="heading">Set Message on Smart Contract</h1>
          <input
            className="text"
            type="text"
            placeholder="Set message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {result && <p className="result">{result}</p>}
          {error && <p className="result">{error}</p>}

          <div>
            <button className="btn" onClick={handleSet}>
              Set Message
            </button>
            <button className="btn" onClick={handleGet}>
              Get Message
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
