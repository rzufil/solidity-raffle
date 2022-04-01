const Raffle = artifacts.require("./Raffle.sol");

contract("Raffle", accounts => {
  it("...should change the max players to 3.", async () => {
    const newData = 3;
    const raffleInstance = await Raffle.deployed();
    await raffleInstance.changeMaxPlayers(newData, { from: accounts[0] });
    const maxPlayers = await raffleInstance.maxPlayers.call();
    assert.equal(maxPlayers, newData);
  });
  
  it("...should change the joining fee to 5.", async () => {
    const newData = 5;
    const raffleInstance = await Raffle.deployed();
    await raffleInstance.changeJoiningFee(newData, { from: accounts[0] });
    const joiningFee = await raffleInstance.joiningFee.call();
    assert.equal(joiningFee, newData);
  });
});
