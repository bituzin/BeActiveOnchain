import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useAccount, useDisconnect } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import './App.css'

// ABI kontraktu GM
const GM_ABI = [
  "event GMEvent(address indexed sender, string message, uint256 timestamp)",
  "function sendGM(string calldata message) external",
  "function getUserCount(address user) external view returns (uint256)",
  "function getUserGmTimestamps(address user) external view returns (uint256[])",
  "function getTotalCount() external view returns (uint256)",
  "function getDailyCount(uint256 day) external view returns (uint256)",
  "function getLastThreeGMs() external view returns (tuple(address sender, uint256 timestamp)[3])"
];

// ABI kontraktu SendMessage
const SENDMESSAGE_ABI = [
  "event MessageSent(address indexed sender, string text, uint256 timestamp, uint256 messageId)",
  "event UserMessageCount(address indexed user, uint256 count)",
  "event TotalMessages(uint256 total)",
  "event LastMessage(address indexed sender, string text, uint256 timestamp)",
  "function sendMessage(string calldata text) external",
  "function userMessageCount(address) external view returns (uint256)"
];

// Bytecode kontraktu GM
const GM_BYTECODE = "0x608060405234801561000f575f80fd5b506105e88061001d5f395ff3fe608060405234801561000f575f80fd5b506004361061004a575f3560e01c80632b68b9c61461004e57806349da433e146100685780638da5cb5b14610086578063ce49e8a7146100a4575b5f80fd5b6100566100c2565b60405161005f91906103b6565b60405180910390f35b61007061014d565b60405161007d91906103b6565b60405180910390f35b61008e6101d9565b60405161009b9190610423565b60405180910390f35b6100ac6101fc565b6040516100b9929190610469565b60405180910390f35b600180546100cf90610497565b80601f01602080910402602001604051908101604052809291908181526020018280546100fb90610497565b80156101465780601f1061011d57610100808354040283529160200191610146565b820191905f5260205f20905b81548152906001019060200180831161012957829003601f168201915b5050505050905090565b6001805461015a90610497565b80601f016020809104026020016040519081016040528092919081815260200182805461018690610497565b80156101d15780601f106101a8576101008083540402835291602001916101d1565b820191905f5260205f20905b8154815290600101906020018083116101b457829003601f168201915b505050505081565b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f6060805f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660018054610238919061022e90610497565b91509150915091565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f61028282610242565b61028c818561024c565b935061029c81856020860161025c565b6102a58161026a565b840191505092915050565b5f6020820190508181035f8301526102c88184610278565b905092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6102f9826102d0565b9050919050565b610309816102ef565b82525050565b5f6020820190506103225f830184610300565b92915050565b5f80fd5b610335816102ef565b811461033f575f80fd5b50565b5f813590506103508161032c565b92915050565b5f6020828403121561036b5761036a610328565b5b5f61037884828501610342565b91505092915050565b5f819050919050565b61039381610381565b82525050565b5f6040820190506103ac5f830185610300565b6103b9602083018461038a565b9392505050565b5f6020820190508181035f8301526103d88184610278565b905092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061042557607f821691505b602082108103610438576104376103e0565b5b50919050565b5f610448826102d0565b9050919050565b6104588161043e565b82525050565b5f6040820190506104715f83018561044f565b818103602083015261048381846102b0565b90509392505050565b5f819050815f5260205f209050919050565b5f6002820490506001821680156104b457607f821691505b6020821081036104c7576104c66103e0565b5b5091905056fea264697066735822122033e1e8c2f0b9b8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e864736f6c63430008140033"

function App() {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useAppKit()
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  // Adres kontraktu GM (Say GM)
  const [gmContractAddress] = useState('0x202780E3661949D630D82AdD04De82edaa682635');
  // Adres kontraktu SendMessage (Send)
  const [sendMessageContractAddress] = useState('0xe890bbac24F59ab662aD9Be549A5174819617a3F');
  const [message, setMessage] = useState('')
  const [inputActive, setInputActive] = useState(false)
  const [lastMessage, setLastMessage] = useState('')
  const [lastSender, setLastSender] = useState('')
  const [status, setStatus] = useState('')
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [txHash, setTxHash] = useState(null)
  const [popupText, setPopupText] = useState('')
  const [todayCount, setTodayCount] = useState(0)
  const [totalGMCount, setTotalGMCount] = useState(0)
  const [lastThreeGMs, setLastThreeGMs] = useState([])
  const [userTodayGMCount, setUserTodayGMCount] = useState(0)
  const [userTotalGMCount, setUserTotalGMCount] = useState(0)
  const [userLastGMTimestamp, setUserLastGMTimestamp] = useState(null)
  const [userTodayMessageCount, setUserTodayMessageCount] = useState(0)
  const [userTotalMessageCount, setUserTotalMessageCount] = useState(0)
  const [userLastMessageTimestamp, setUserLastMessageTimestamp] = useState(null)
  const [userLastMessageText, setUserLastMessageText] = useState('')

  const resetUserStats = () => {
    setUserTodayGMCount(0)
    setUserTotalGMCount(0)
    setUserLastGMTimestamp(null)
    setUserTodayMessageCount(0)
    setUserTotalMessageCount(0)
    setUserLastMessageTimestamp(null)
    setUserLastMessageText('')
  }

  // Connect wallet through Reown AppKit
  const connectWallet = () => {
    open()
    setStatus('')
  }

  const handleDisconnect = () => {
    disconnect()
    setProvider(null)
    setSigner(null)
    resetUserStats()
    setStatus('')
  }

  // Automatically initialize provider and signer when wallet is connected
  useEffect(() => {
    const initProvider = async () => {
      if (isConnected && window.ethereum) {
        try {
          const ethProvider = new ethers.BrowserProvider(window.ethereum)
          const ethSigner = await ethProvider.getSigner()
          setProvider(ethProvider)
          setSigner(ethSigner)
          
          // Check network
          const network = await ethProvider.getNetwork()
          if (network.chainId !== 42220n && network.chainId !== 44787n) {
            setStatus('Please switch to Celo network!')
          } else {
            setStatus('Wallet connected!')
          }
        } catch (error) {
          console.error('Provider initialization error:', error)
        }
      }
    }
    
    initProvider()
  }, [isConnected])

  // Fetch stats when provider or address changes
  useEffect(() => {
    if (provider || signer) {
      fetchStats()
    } else if (!address) {
      resetUserStats()
    }
  }, [provider, signer, address, isConnected])

  // Send GM message
  // Wyślij GM przez kontrakt GM
  const sendGM = async () => {
    if (!gmContractAddress) {
      setStatus('GM contract address not set!');
      return;
    }
    if (!isConnected) {
      open();
      setStatus('Please connect your wallet first!');
      return;
    }
    try {
      setStatus('Sending GM...');
      let tx;
      const ethProvider = provider || new ethers.BrowserProvider(window.ethereum);
      const ethSigner = signer || await ethProvider.getSigner();
      const contract = new ethers.Contract(gmContractAddress, GM_ABI, ethSigner);
      tx = await contract.sendGM('gm');
      setTxHash(tx.hash);
      setPopupText('You did it!');
      setShowPopup(true);
      await tx.wait();
      setStatus('GM sent on-chain!');
      setTimeout(() => fetchStats(), 2000);
    } catch (error) {
      if (error && (error.code === 4001 || error.message?.toLowerCase().includes('user rejected'))) {
        setPopupText('Transaction aborted by user');
        setTxHash(null);
        setShowPopup(true);
      } else {
        setStatus('Send error: ' + error.message);
      }
    }
  };

  // Wyślij dowolną wiadomość przez kontrakt SendMessage
  const sendMessage = async () => {
    if (!sendMessageContractAddress) {
      setStatus('SendMessage contract address not set!');
      return;
    }
    if (!isConnected) {
      open();
      setStatus('Please connect your wallet first!');
      return;
    }
    try {
      setStatus('Sending message...');
      let tx;
      const ethProvider = provider || new ethers.BrowserProvider(window.ethereum);
      const ethSigner = signer || await ethProvider.getSigner();
      const contract = new ethers.Contract(sendMessageContractAddress, SENDMESSAGE_ABI, ethSigner);
      tx = await contract.sendMessage(message);
      setTxHash(tx.hash);
      setPopupText('Message sent!');
      setShowPopup(true);
      await tx.wait();
      setStatus('Message sent on-chain!');
      setTimeout(() => fetchStats(), 2000);
    } catch (error) {
      if (error && (error.code === 4001 || error.message?.toLowerCase().includes('user rejected'))) {
        setPopupText('Transaction aborted by user');
        setTxHash(null);
        setShowPopup(true);
      } else {
        setStatus('Send error: ' + error.message);
      }
    }
  };

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

  // Format time ago
  const timeAgo = (timestamp) => {
    const seconds = Math.floor(Date.now() / 1000 - Number(timestamp))
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '-'
    return new Date(Number(timestamp) * 1000).toLocaleString()
  }

  // Fetch GM and Message statistics separately
  const fetchStats = async () => {
    try {
      const readProvider = signer ?? provider;
      if (!readProvider) return;

      // Globalne statystyki GM (kontrakt GM)
      const gmContract = new ethers.Contract(gmContractAddress, GM_ABI, readProvider);
      const total = await gmContract.getTotalCount();
      setTotalGMCount(Number(total));
      
      const todayDayIndex = Math.floor(Date.now() / 1000 / 86400);
      const dailyCount = await gmContract.getDailyCount(todayDayIndex);
      setTodayCount(Number(dailyCount));
      
      const lastThree = await gmContract.getLastThreeGMs();
      const filtered = lastThree.filter(gm => gm.sender !== '0x0000000000000000000000000000000000000000');
      setLastThreeGMs(filtered);

      // Statystyki użytkownika GM
      if (isConnected && address) {
        const gmTotal = await gmContract.getUserCount(address);
        setUserTotalGMCount(Number(gmTotal));
        const gmTimestamps = await gmContract.getUserGmTimestamps(address);
        const gmLast = gmTimestamps.length > 0 ? Math.max(...gmTimestamps.map(Number)) : null;
        setUserLastGMTimestamp(gmLast);
        const startOfDay = Math.floor(Date.now() / 1000 / 86400) * 86400;
        const gmToday = gmTimestamps.filter(ts => Number(ts) >= startOfDay).length;
        setUserTodayGMCount(gmToday);

        // Statystyki użytkownika Message (kontrakt SendMessage)
        const msgContract = new ethers.Contract(sendMessageContractAddress, SENDMESSAGE_ABI, readProvider);
        const msgTotal = await msgContract.userMessageCount(address);
        setUserTotalMessageCount(Number(msgTotal));
        
        // Pobierz eventy MessageSent dla użytkownika, by znaleźć ostatnią wiadomość
        try {
          const filter = msgContract.filters.MessageSent(address);
          const events = await msgContract.queryFilter(filter, 0, 'latest');
          
          if (events.length > 0) {
            const lastEvent = events[events.length - 1];
            const lastMsgText = lastEvent.args.text;
            const lastMsgTimestamp = Number(lastEvent.args.timestamp);
            
            setUserLastMessageText(lastMsgText);
            setUserLastMessageTimestamp(lastMsgTimestamp);
            
            // Zlicz wiadomości dzisiaj
            const startOfDay = Math.floor(Date.now() / 1000 / 86400) * 86400;
            const todayMessages = events.filter(e => Number(e.args.timestamp) >= startOfDay);
            setUserTodayMessageCount(todayMessages.length);
          } else {
            setUserTodayMessageCount(0);
            setUserLastMessageTimestamp(null);
            setUserLastMessageText('');
          }
        } catch (eventError) {
          console.error('Message events fetch error:', eventError);
          setUserTodayMessageCount(0);
          setUserLastMessageTimestamp(null);
          setUserLastMessageText('');
        }
      } else {
        resetUserStats();
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
      if (isConnected && address) {
        resetUserStats();
      }
    }
  };

  return (
    <div className="app">
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          background: '#FFF9E3',
          padding: 16,
          borderRadius: 0,
          border: '3px solid #FFC107',
          boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #e6a800, 2px 2px 4px rgba(0,0,0,0.15)',
          minWidth: 180,
          maxWidth: 260,
          textAlign: 'center',
          zIndex: 1000,
          color: '#2E3338',
          fontFamily: 'Comic Neue, Comic Sans MS, cursive, sans-serif'
        }}>
          <div>
              <h3 style={{ marginBottom: 10, fontSize: '0.9rem', fontWeight: 700 }}>{popupText}</h3>
            {txHash && popupText === 'You did it!' && (
                <a href={`https://celoscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginBottom: 14, color: '#2d7cff', wordBreak: 'break-all', fontSize: '0.95rem' }}>
                View transaction on Celo
              </a>
            )}
              <button className="btn btn-primary" style={{ padding: '4px 18px', fontSize: '0.95rem' }} onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
      <div className="container">
        <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <h1 className="comic-font">Be Active Onchain</h1>
          {isConnected && address ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="window-title-bar" style={{ padding: '2px 8px', minWidth: '160px', display: 'inline-block', margin: 0 }}>
                <span
                  className="window-title comic-font"
                  style={{
                    cursor: 'pointer',
                    textDecoration: hovered || copied ? 'underline' : 'none',
                    transition: 'text-decoration 0.2s',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#2E3338',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    userSelect: 'text',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => { setHovered(false); setCopied(false); }}
                  onClick={() => { navigator.clipboard.writeText(address); setCopied(true); }}
                >
                  <span style={{ color: '#2E7D32' }}>Connected</span>
                  {address.slice(0, 6)}...{address.slice(-4)}
                  {copied && <span style={{ fontSize: '0.9rem', color: '#4a4a4a' }}>copied</span>}
                </span>
              </div>
              <button className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }} onClick={handleDisconnect}>
                Disconnect
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>
              Connect
            </button>
          )}
        </header>

        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '1.5rem' }}>
          <div className="card" style={{ flex: 1, maxWidth: 'none' }}>
            <div className="window-title-bar">
              <span className="window-title">Say GM to Celo Community</span>
            </div>
            <div className="section" style={{ padding: '1.25rem', textAlign: 'left' }}>
              <button className="btn btn-secondary" style={{ display: 'inline-block', margin: 0 }} onClick={sendGM}>
                Say GM
              </button>
              <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#2E3338', fontWeight: 600 }}>
                <div style={{ marginBottom: '0.5rem' }}>Today: {todayCount}</div>
                <div style={{ marginBottom: '0.5rem' }}>Total: {totalGMCount}</div>
                <div style={{ marginBottom: '0.3rem' }}>Last:</div>
                {lastThreeGMs.length > 0 ? (
                  lastThreeGMs.map((gm, idx) => (
                    <div key={idx} style={{ fontSize: '0.85rem', marginLeft: '1rem', marginBottom: '0.2rem', fontWeight: 400 }}>
                      {gm.sender.slice(0, 6)}...{gm.sender.slice(-4)} - {timeAgo(gm.timestamp)}
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '0.85rem', marginLeft: '1rem', fontWeight: 400 }}>-</div>
                )}
              </div>
            </div>
          </div>
          <div className="card" style={{ flex: 1, maxWidth: 'none' }}>
            <div className="window-title-bar">
              <span className="window-title">Your stats</span>
            </div>
            <div className="section" style={{ padding: '1.25rem', textAlign: 'left' }}>
              {isConnected ? (
                <div style={{ fontSize: '0.9rem', color: '#2E3338', fontWeight: 600, paddingLeft: '1rem' }}>
                  <div style={{ marginBottom: '0.4rem' }}>Today's GM: {userTodayGMCount}</div>
                  <div style={{ marginBottom: '0.4rem' }}>All GM: {userTotalGMCount}</div>
                  <div style={{ marginBottom: '0.8rem' }}>Last GM date: {userLastGMTimestamp ? formatDateTime(userLastGMTimestamp) : '-'}</div>
                  <div style={{ marginBottom: '0.4rem' }}>Today's messages: {userTodayMessageCount}</div>
                  <div style={{ marginBottom: '0.4rem' }}>All messages: {userTotalMessageCount}</div>
                  <div style={{ marginBottom: '0.4rem' }}>Last message date: {userLastMessageTimestamp ? formatDateTime(userLastMessageTimestamp) : '-'}</div>
                  <div style={{ marginBottom: '0.2rem' }}>Last message text:</div>
                  <div style={{ fontSize: '0.85rem', marginLeft: '0.5rem', fontWeight: 400, color: '#444' }}>
                    {userLastMessageText ? `"${userLastMessageText.substring(0, 80)}${userLastMessageText.length > 80 ? '...' : ''}"` : 'No messages yet'}
                  </div>
                </div>
              ) : (
                <div style={{ color: '#888', textAlign: 'center', fontStyle: 'italic' }}>Connect wallet to see your stats</div>
              )}
            </div>
          </div>
          <div className="card" style={{ flex: 1, maxWidth: 'none' }}>
            <div className="window-title-bar">
              <span className="window-title">Send Your Own Message to Celo Blockchain</span>
            </div>
            <div className="section send-message-box">
              <input
                type="text"
                placeholder={inputActive ? '' : 'Your message to Celo'}
                value={message}
                onFocus={() => setInputActive(true)}
                onBlur={() => { if (!message) setInputActive(false) }}
                onChange={(e) => setMessage(e.target.value)}
                className="input"
                style={{ color: '#000' }}
              />
              <button onClick={sendMessage} className="btn btn-primary">
                Send
              </button>
              <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#2E3338', fontWeight: 600, paddingLeft: '1rem' }}>
                <div style={{ marginBottom: '0.5rem' }}>Today: {todayCount}</div>
                <div style={{ marginBottom: '0.5rem' }}>Total: {totalGMCount}</div>
                <div style={{ marginBottom: '0.3rem' }}>Last:</div>
                {lastThreeGMs.length > 0 ? (
                  lastThreeGMs.map((gm, idx) => (
                    <div key={idx} style={{ fontSize: '0.85rem', marginLeft: '1rem', marginBottom: '0.2rem', fontWeight: 400 }}>
                      {gm.sender.slice(0, 6)}...{gm.sender.slice(-4)} - {timeAgo(gm.timestamp)}
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '0.85rem', marginLeft: '1rem', fontWeight: 400 }}>-</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Removed Read Last Message card */}

      </div>
    </div>
  )
}

export default App
