import React, { useState, useEffect } from "react";
import RaffleContract from "../contracts/Raffle.json";
import getWeb3 from "../getWeb3";
import Nav from "../components/Nav";
import FormatDate from "../utils/FormatDate";
import "bootstrap/dist/css/bootstrap.min.css";

import "../App.css";

const Home = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [events, setEvents] = useState([]);
  const [joiningFee, setJoiningFee] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [playerCount, setPlayerCount] = useState("");
  const [gameFee, setGameFee] = useState("");
  const [playerName, setPlayerName] = useState("");
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
    const fee = await contract.methods.joiningFee().call();
    setJoiningFee(fee);
    const players = await contract.methods.maxPlayers().call();
    setMaxPlayers(players);
    const participants = await contract.methods.participants().call();
    setPlayerCount(participants);
    const houseFee = await contract.methods.gameFee().call();
    setGameFee(houseFee);
  };

  const joinRaffle = () => {
    setErrorMessage(null);
    contract.methods.enter(playerName).send({ from: accounts[0], value: joiningFee }, async (error) => {
      if (!error) {
        window.location.reload();
      } else {
        const start = error.message.indexOf("{");
        const end = error.message.lastIndexOf("}");
        if (start && end) {
          const errorJson = JSON.parse(error.message.substring(start, end + 1));
          // Check if JSON string is valid
          if (errorJson && typeof errorJson === "object") {
            const jsonData = errorJson.value.data.data;
            setErrorMessage(jsonData[Object.keys(jsonData)[0]].reason);
            return;
          }
        }
        setErrorMessage("An error occurred while joining the raffle.");
      }
    });
  };

  const loadContractEvents = async (web3, contract) => {
    let contractEvents = [];
    const maxWinEvents = 3;
    const maxPlayers = await contract.methods.maxPlayers().call();
    const maxEnterEvents = maxWinEvents * maxPlayers;
    const raffleEndedEvents = await contract.getPastEvents("RaffleEnded", {
      fromBlock: 0,
      toBlock: "latest"
    });
    // Limiting events
    // Reverse the RaffleEnded event array and get the last 3 win events
    await raffleEndedEvents.reverse().slice(0, maxWinEvents).map((data) => {
      let _event = [];
      _event["message"] = `Raffle ended! ${data.returnValues["winner"]} has won ${web3.utils.fromWei(String(data.returnValues["amount"]), "ether")} ether!`;
      _event["time"] = FormatDate(parseInt(data.returnValues["timestamp"]) + 1);
      _event["win"] = true;
      contractEvents.push(_event);
    });
    const playerEnteredEvents = await contract.getPastEvents("PlayerEntered", {
      fromBlock: 0,
      toBlock: "latest"
    });
    // Reverse the PlayerEntered event array and get the last 3 x 3 enter events
    await playerEnteredEvents.reverse().slice(0, maxEnterEvents).map((data) => {
      let _event = [];
      _event["message"] = data.returnValues["playerName"];
      _event["time"] = FormatDate(parseInt(data.returnValues["timestamp"]));
      _event["win"] = false;
      contractEvents.push(_event);
    });
    contractEvents.sort((a, b) => new Date(a["time"]).getTime() - new Date(b["time"]).getTime());
    setEvents(contractEvents.reverse());
  };

  const listenForAccountChange = () => {
    window.ethereum.on("accountsChanged", function (accounts) {
      setAccounts(accounts);
    })
  };

  useEffect(async () => {
    try {
      const web3 = await loadWeb3();
      await loadWeb3Accounts(web3);
      const contract = await loadWeb3Contract(web3);
      await loadInfo(contract);
      await loadContractEvents(web3, contract);
      listenForAccountChange();
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }, []);

  if (typeof web3 === "undefined") {
    return <div>Loading Web3, accounts, and contract...</div>;
  } else {
    return (
      <div className="App">
        <Nav account={accounts[0]} />
        <div className="container-fluid mt-5">
          <div className="row mt-1">
            <div className="col d-flex flex-column align-items-center">
              <h1 className="display-5 fw-bold">Rules</h1>
              <div className="col-6 mb-3 lead text-center">
                <p>Joining fee is: {web3.utils.fromWei(String(joiningFee), "ether")} ETH</p>
                <p>Max players: {maxPlayers}</p>
                <p>Player count: {playerCount}</p>
                <p>House fee is: {gameFee}%</p>
              </div>
            </div>
          </div>
          <div className="row mt-1">
            <div className="col d-flex flex-column align-items-center">
              <input
                type="text"
                className="mb-2"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your Name"
              />
              <button className="btn btn-primary" onClick={joinRaffle}>Join Raffle</button>
            </div>
          </div>
          <div className="row mt-1">
            <div className="col d-flex flex-column align-items-center">
              <div className="col-6 mb-3 lead text-center">
              {(errorMessage != null) ? <p className="text-danger">{errorMessage}</p> : <></>}
              </div>
            </div>
          </div>
          <div className="row mt-1">
            <h2>Events</h2>
            <div className="col d-flex flex-column align-items-center">
              <div className="col-6 mb-3 lead text-center">
                <div className="events">
                  {events.length ? events.map((event, key) => <p key={key} className={event["win"] ? "bg-success": ""}>{event["time"]}: {event["message"]}</p>) : <p key="0">No events yet.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Home;
