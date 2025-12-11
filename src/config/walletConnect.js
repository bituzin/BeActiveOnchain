import { createAppKit } from '@reown/appkit/react'
import { celo } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// Get projectId from https://cloud.walletconnect.com
const projectId = 'adf5dc824747880d3774621d97e778a9'

// Configure networks - GM działa na Celo
const networks = [celo]

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId
})

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'GM Dapp',
    description: 'Say GM on-chain on Celo blockchain',
    url: 'https://your-app-url.com',
    icons: ['https://your-app-url.com/icon.png']
  },
  features: {
    analytics: true
  }
})
