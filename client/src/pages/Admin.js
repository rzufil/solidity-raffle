import React, { useState, useEffect } from "react";
import RaffleContract from "./../contracts/Raffle.json";
import getWeb3 from "./../getWeb3";
import Nav from "./../components/Nav";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../App.css";

const Admin = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [paused, setPaused] = useState(undefined);
  const [joiningFee, setJoiningFee] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [gameFee, setGameFee] = useState("");
  const [addressTo, setAddressTo] = useState("");
  const [admin, setAdmin] = useState(false);
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

  const loadWeb3 = async () => {
    const web3 = await getWeb3();
    setWeb3(web3);
    return web3;
  };

  const loadWeb3Accounts = async (web3) => {
    const accounts = await web3.eth.getAccounts();
    setAccounts(accounts);
  };

  const loadWeb3Contract = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = RaffleContract.networks[networkId];
    const contract = new web3.eth.Contract(
      RaffleContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    setContract(contract);
    return contract;
  };

  const loadInfo = async (contract) => {
    const pause = await contract.methods.pause().call();
    setPaused(pause);
  };

  const changeJoiningFee = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    await contract.methods.changeJoiningFee(web3.utils.toWei(String(joiningFee), "ether")).send({ from: accounts[0] }, async (error) => {
      if (!error) {
        setJoiningFee("");
        setSuccessMessage("Joining fee has been changed");
      } else {
        setErrorMessage(`An error occurred while changing the joining fee. ${error.message}`);
      }
    });
  };

  const changeMaxPlayers = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    await contract.methods.changeMaxPlayers(maxPlayers).send({ from: accounts[0] }, async (error) => {
      if (!error) {
        setMaxPlayers("");
        setSuccessMessage("Max players has been changed");
      } else {
        setErrorMessage(`An error occurred while changing the max players. ${error.message}`);
      }
    });
  };

  const changeGameFee = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    await contract.methods.changeGameFee(gameFee).send({ from: accounts[0] }, async (error) => {
      if (!error) {
        setGameFee("");
        setSuccessMessage("Game fee has been changed");
      } else {
        setErrorMessage(`An error occurred while joining the raffle. ${error.message}`);
      }
    });
  };

  const withdraw = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    await contract.methods.withdraw(addressTo).send({ from: accounts[0] }, async (error) => {
      if (!error) {
        setAddressTo("");
        setSuccessMessage("Withdraw successful.");
      } else {
        setErrorMessage(`An error occurred while withdrawing. ${error.message}`);
      }
    });
  };

  const pauseRaffle = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    await contract.methods.schedulePause().send({ from: accounts[0] }, async (error) => {
      if (!error) {
        setPaused(!paused);
        setSuccessMessage(paused ? "Raffle has been unpaused." : "Raffle has been paused.");
      } else {
        setErrorMessage(`An error occurred while pausing the raffle. ${error.message}`);
      }
    });
  };

  const listenForAccountChange = () => {
    window.ethereum.on('accountsChanged', function (accounts) {
      setAccounts(accounts);
    })
  };

  const checkIfAdmin = async () => {
    const isAdmin = await contract.methods.owner().call();
    setAdmin(isAdmin.toLowerCase() === accounts[0].toLowerCase());
  };

  useEffect(async () => {
    if (accounts.length) {
      checkIfAdmin();
    }
  }, [accounts]);

  useEffect(async () => {
    try {
      const web3 = await loadWeb3();
      const contract = await loadWeb3Contract(web3);
      const accounts = await loadWeb3Accounts(web3);
      await loadInfo(contract);
      listenForAccountChange(accounts);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }, []);

  if (typeof web3 === 'undefined' || accounts.length === 0) {
    return <div>Loading Web3, accounts, and contract...</div>;
  } else if (!admin) {
    return (
      <div className="App">
        <Nav account={accounts[0]} admin={admin} />
        <div className="container-fluid mt-5">
          <div className="row mt-1">
            <div className="col d-flex flex-column align-items-center">
              <h1 className="display-5 fw-bold">Restricted Access</h1>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="App">
        <Nav account={accounts[0]} admin={admin} />
        <div className="container-fluid mt-5">
          <div className="row mt-1">
            <div className="col d-flex flex-column align-items-center">
              <h1 className="display-5 fw-bold">Admin</h1>
            </div>
          </div>
          <div className="row mt-1">
            <div className="col-sm-6 mb-3 d-flex flex-column align-items-center mx-auto">
              <label htmlFor="joiningFee">Change Joining Fee</label>
              <input
                type="text"
                className="mb-2"
                id="joiningFee"
                value={joiningFee}
                onChange={(e) => setJoiningFee(e.target.value)}
                placeholder="New joining fee"
              />
              <button className="btn btn-primary" onClick={changeJoiningFee}>Submit</button>
            </div>
            <div className="col-sm-6 mb-3 d-flex flex-column align-items-center mx-auto">
              <label htmlFor="gameFee">Change Max Players</label>
              <input
                type="text"
                className="mb-2"
                id="maxPlayers"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
                placeholder="New max players"
              />
              <button className="btn btn-primary" onClick={changeMaxPlayers}>Submit</button>
            </div>
          </div>
          <div className="row mt-1">
            <div className="col-sm-6 mb-3 d-flex flex-column align-items-center mx-auto">
              <label htmlFor="gameFee">Change Game Fee</label>
              <input
                type="text"
                className="mb-2"
                id="gameFee"
                value={gameFee}
                onChange={(e) => setGameFee(e.target.value)}
                placeholder="New game fee"
              />
              <button className="btn btn-primary" onClick={changeGameFee}>Submit</button>
            </div>
            <div className="col-sm-6 mb-3 d-flex flex-column align-items-center mx-auto">
              <label>Withdraw</label>
              <input
                type="text"
                className="mb-2"
                value={addressTo}
                onChange={(e) => setAddressTo(e.target.value)}
                placeholder="Address"
              />
              <button className="btn btn-primary" onClick={withdraw}>Submit</button>
            </div>
          </div>
          <div className="row mt-1">
            <div className="col-sm-12 mb-3 d-flex flex-column align-items-center mx-auto">
              {(paused === undefined)
                ? <button className="btn btn-primary">Loading...</button>
                : <button className="btn btn-primary" onClick={pauseRaffle}>{paused ? "Unpause Raffle" : "Pause Raffle"}</button>}
            </div>
          </div>
          <div className="row mt-1">
            <div className="col d-flex flex-column align-items-center">
              <div className="col-6 mb-3 lead text-center">
              {(successMessage != null) ? <p className="text-success">{successMessage}</p> : <></>}
              {(errorMessage != null) ? <p className="text-danger">{errorMessage}</p> : <></>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Admin;
