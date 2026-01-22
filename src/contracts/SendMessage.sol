// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SendMessage {
    uint256 public totalMessages;

    struct Message {
        address sender;
        string text;
        uint256 timestamp;
    }

    mapping(uint256 => Message) public messages;
    mapping(address => uint256) public userMessageCount;

    event MessageSent(address indexed sender, string text, uint256 timestamp, uint256 messageId);
    event UserMessageCount(address indexed user, uint256 count);
    event TotalMessages(uint256 total);
    event LastMessage(address indexed sender, string text, uint256 timestamp);

    function sendMessage(string calldata text) external {
        totalMessages += 1;
        userMessageCount[msg.sender] += 1;
        messages[totalMessages] = Message(msg.sender, text, block.timestamp);

        emit MessageSent(msg.sender, text, block.timestamp, totalMessages);
        emit UserMessageCount(msg.sender, userMessageCount[msg.sender]);
        emit TotalMessages(totalMessages);
        emit LastMessage(msg.sender, text, block.timestamp);
    }
}
