# GM dApp


## Project Description

GM dApp is a decentralized application that allows users to send "gm" (good morning) greetings on the blockchain. Anyone can send any number of "gm" messages per day, and all interactions are publicly recorded in the smart contract.

- Send a "gm" greeting with an optional message.
- View the total number of "gm" sent.
- Daily statistics: how many "gm" were sent on a given day.
- User statistics: how many "gm" a given address has sent and their history with timestamps.
- View the last greeting (address, message, date).




## Contract address on Celo

`0x202780E3661949D630D82AdD04De82edaa682635`


## Smart Contract (Solidity)

The `GM` contract records all greetings and provides functions to retrieve statistics:

- `sendGM(string message)` — sends a "gm" with an optional message
- `getLastGM()` — returns the last sender, message, and timestamp
- `getTotalCount()` — returns the total number of "gm"
- `getDailyCount(uint256 day)` — returns the number of "gm" sent on a given day (day = timestamp / 1 days)
- `getUserCount(address user)` — returns the number of "gm" sent by a user
- `getUserGmTimestamps(address user)` — returns an array of timestamps for all "gm" sent by a user
- `getLastThreeGMs()` — returns an array of the last 3 senders and their timestamps

Each call to `sendGM` emits a `GMEvent` with the sender's address, message, and timestamp.



## License

MIT
