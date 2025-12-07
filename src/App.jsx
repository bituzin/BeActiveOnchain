import { useState } from 'react'
import { ethers } from 'ethers'
import './App.css'

// ABI kontraktu GM
const GM_ABI = [
  "event GMEvent(address indexed sender, string message)",
  "function sendGM(string calldata message) external",
  "function getLastGM() external view returns (address sender, string memory message)",
  "function lastMessage() external view returns (string)",
  "function lastSender() external view returns (address)"
]

// Bytecode kontraktu GM
const GM_BYTECODE = "0x608060405234801561000f575f80fd5b506105e88061001d5f395ff3fe608060405234801561000f575f80fd5b506004361061004a575f3560e01c80632b68b9c61461004e57806349da433e146100685780638da5cb5b14610086578063ce49e8a7146100a4575b5f80fd5b6100566100c2565b60405161005f91906103b6565b60405180910390f35b61007061014d565b60405161007d91906103b6565b60405180910390f35b61008e6101d9565b60405161009b9190610423565b60405180910390f35b6100ac6101fc565b6040516100b9929190610469565b60405180910390f35b600180546100cf90610497565b80601f01602080910402602001604051908101604052809291908181526020018280546100fb90610497565b80156101465780601f1061011d57610100808354040283529160200191610146565b820191905f5260205f20905b81548152906001019060200180831161012957829003601f168201915b5050505050905090565b6001805461015a90610497565b80601f016020809104026020016040519081016040528092919081815260200182805461018690610497565b80156101d15780601f106101a8576101008083540402835291602001916101d1565b820191905f5260205f20905b8154815290600101906020018083116101b457829003601f168201915b505050505081565b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f6060805f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660018054610238919061022e90610497565b91509150915091565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f61028282610242565b61028c818561024c565b935061029c81856020860161025c565b6102a58161026a565b840191505092915050565b5f6020820190508181035f8301526102c88184610278565b905092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6102f9826102d0565b9050919050565b610309816102ef565b82525050565b5f6020820190506103225f830184610300565b92915050565b5f80fd5b610335816102ef565b811461033f575f80fd5b50565b5f813590506103508161032c565b92915050565b5f6020828403121561036b5761036a610328565b5b5f61037884828501610342565b91505092915050565b5f819050919050565b61039381610381565b82525050565b5f6040820190506103ac5f830185610300565b6103b9602083018461038a565b9392505050565b5f6020820190508181035f8301526103d88184610278565b905092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061042557607f821691505b602082108103610438576104376103e0565b5b50919050565b5f610448826102d0565b9050919050565b6104588161043e565b82525050565b5f6040820190506104715f83018561044f565b818103602083015261048381846102b0565b90509392505050565b5f819050815f5260205f209050919050565b5f6002820490506001821680156104b457607f821691505b6020821081036104c7576104c66103e0565b5b5091905056fea264697066735822122033e1e8c2f0b9b8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e864736f6c63430008140033"

function App() {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contractAddress, setContractAddress] = useState('')
  const [message, setMessage] = useState('gm!')
  const [lastMessage, setLastMessage] = useState('')
  const [lastSender, setLastSender] = useState('')
  const [status, setStatus] = useState('')

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setStatus('Please install MetaMask!')
        return
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      setAccount(accounts[0])
      setProvider(provider)
      setSigner(signer)
      setStatus('Wallet connected!')

      // Check if on Celo network
      const network = await provider.getNetwork()
      if (network.chainId !== 42220n && network.chainId !== 44787n) {
        setStatus('Please switch to Celo network!')
      }
    } catch (error) {
      setStatus('Error: ' + error.message)
    }
  }

  // ...existing code...

  // Send GM message
  const sendGM = async () => {
    if (!contractAddress) {
      setStatus('Deploy or enter contract address first!')
      return
    }

    try {
      setStatus('Sending message...')
      const contract = new ethers.Contract(contractAddress, GM_ABI, signer)
      const tx = await contract.sendGM(message)
      await tx.wait()
      setStatus('Message sent on-chain!')
      await readLastGM()
    } catch (error) {
      setStatus('Send error: ' + error.message)
    }
  }

  // Read last message
  const readLastGM = async () => {
    if (!contractAddress) {
      setStatus('Enter contract address!')
      return
    }

    try {
      const contract = new ethers.Contract(contractAddress, GM_ABI, provider || signer)
      const [sender, msg] = await contract.getLastGM()
      setLastSender(sender)
      setLastMessage(msg)
      setStatus('Message read!')
    } catch (error) {
      setStatus('Read error: ' + error.message)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="comic-font">Be Active Onchain</h1>
          {account ? (
            <span className="account">{account.slice(0, 6)}...{account.slice(-4)}</span>
          ) : (
            <button onClick={connectWallet} className="connect-btn">
              Connect
            </button>
          )}
        </header>



        <div className="card">
          <div className="section">
            <h2>Deploy GM Contract</h2>
            <button className="btn btn-secondary" disabled>
              Deploy Contract
            </button>
            {contractAddress && (
              <p className="contract-address">
                Contract Address: <br/>
                <code>{contractAddress}</code>
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="section">
            <h2>Or Use Existing Contract</h2>
            <input
              type="text"
              placeholder="Contract Address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div className="card">
          <div className="section">
            <h2>Send GM Message</h2>
            <input
              type="text"
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input"
            />
            <button onClick={sendGM} className="btn btn-primary" disabled={!contractAddress}>
              Send GM On-Chain
            </button>
          </div>
        </div>

        <div className="card">
          <div className="section">
            <h2>Read Last Message</h2>
            <button onClick={readLastGM} className="btn btn-secondary" disabled={!contractAddress}>
              Read Last GM
            </button>
            {lastMessage && (
              <div className="message-display">
                <p><strong>From:</strong> {lastSender}</p>
                <p><strong>Message:</strong> {lastMessage}</p>
              </div>
            )}
          </div>
        </div>

        {status && (
          <div className="card">
            <div className="status">
              {status}
            </div>
          </div>
        )}

        <div className="footer">
          <p>Celo Network • Alfajores Testnet (44787) • Mainnet (42220)</p>
        </div>
      </div>
    </div>
  )
}

export default App
