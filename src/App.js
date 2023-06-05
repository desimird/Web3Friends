import React, { useState, useEffect } from "react";
import Web3 from "web3";
import LibraryContract from "../src/artifacts/Library.json";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [libraryContract, setLibraryContract] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  async function loadWeb3() {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      setWeb3(web3);
    }
  }

  async function loadBlockchainData() {
    if (web3) {
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LibraryContract.networks[networkId];
      console.log(deployedNetwork);
      const contract = new web3.eth.Contract(
        LibraryContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      setLibraryContract(contract);
    }
  }

  async function callLibraryMethod() {
    console.log(libraryContract)
    if (libraryContract) {
      try {
        const result = await libraryContract.methods.someMethod().call({ from: accounts[0] });
        setResult(result);
        console.log(libraryContract);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div>
      <h1>Interact with Library Contract</h1>
      <button onClick={callLibraryMethod}>Call Library Method</button>
      {result && <p>Result: {result}</p>}
    </div>
  );
}

export default App;
