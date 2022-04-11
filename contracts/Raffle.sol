// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Raffle is Ownable {
    using SafeMath for uint256;
    using Strings for uint256;
    Player[] entries;
    uint256 private prize;
    uint256 public maxPlayers;
    uint256 public joiningFee;
    uint256 public gameFee;

    event RaffleEnded(uint256 timestamp, string winner, uint256 amount);
    event PlayerEntered(uint256 timestamp, string playerName);

    struct Player {
        address payable playerAddress;
        string playerName;
    }

    constructor() {
        maxPlayers = 5;
        joiningFee = 1000000000000000000 wei;
        gameFee = 5;
    }

    function changeMaxPlayers(uint256 newMaxPlayers) public onlyOwner {
        maxPlayers = newMaxPlayers;
    }

    function changeJoiningFee(uint256 newJoiningFee) public onlyOwner {
        joiningFee = newJoiningFee;
    }

    function changeGameFee(uint256 newGameFee) public onlyOwner {
        gameFee = newGameFee;
    }

    function pickWinner() private view returns(uint256) {
        uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender)));
        uint256 index = random % participants();
        return index;
    }

    function getCurrentPrize() public view returns(uint256) {
        return prize.sub(prize.div(100).mul(gameFee));
    }

    function enter(string memory _playerName) public payable {
        require(msg.value == joiningFee, string(bytes.concat("Joining fee is ", bytes(Strings.toString(joiningFee)), " wei")));

        Player memory newPlayer = Player(payable(msg.sender), _playerName);
        entries.push(newPlayer);
        prize += msg.value;
        emit PlayerEntered(block.timestamp, string(bytes.concat(bytes(_playerName), " has entered the raffle.")));

        if (participants() >= maxPlayers) {
            uint256 winnerIndex = pickWinner();
            address winner = entries[winnerIndex].playerAddress;
            uint256 finalPrize = getCurrentPrize();

            (bool success, ) = (winner).call{value: finalPrize}(""); 
            require(success, "Failed to withdraw money from the contact");

            emit RaffleEnded(block.timestamp, entries[winnerIndex].playerName, finalPrize);
            prize = 0;
            delete entries;
        }
    }

    function participants() public view returns(uint256) {
        return entries.length;
    }

    function withdraw(address to) external payable onlyOwner {
        uint256 balance = address(this).balance;
        payable(to).transfer(balance);
    }

    fallback() external payable {}

    receive() external payable {}
}
