// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GM {
    event GMEvent(address indexed sender, string message, uint256 timestamp);

    string public lastMessage;
    address public lastSender;
    uint256 public lastTimestamp;

    // Liczba GM wysłanych przez dany adres
    mapping(address => uint256) public gmCount;

    // Liczba GM wysłanych danego dnia (day = timestamp / 1 days)
    mapping(uint256 => uint256) public dailyCount;

    function sendGM(string calldata message) external {
        lastMessage = message;
        lastSender = msg.sender;
        lastTimestamp = block.timestamp;

        gmCount[msg.sender] += 1;

        uint256 day = block.timestamp / 1 days;
        dailyCount[day] += 1;

        emit GMEvent(msg.sender, message, block.timestamp);
    }

    function getLastGM() external view returns (address, string memory, uint256) {
        return (lastSender, lastMessage, lastTimestamp);
    }

    function getDailyCount(uint256 day) external view returns (uint256) {
        return dailyCount[day];
    }

    function getUserCount(address user) external view returns (uint256) {
        return gmCount[user];
    }
}
