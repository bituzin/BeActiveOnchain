// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GM {
    event GMEvent(address indexed sender, string message);
    string public lastMessage;
    address public lastSender;

    function sendGM(string calldata message) external {
        lastMessage = message;
        lastSender = msg.sender;
        emit GMEvent(msg.sender, message);
    }

    function getLastGM() external view returns (address sender, string memory message) {
        return (lastSender, lastMessage);
    }
}
