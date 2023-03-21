import MetaMaskCard from '../components/connectorCards/MetaMaskCard'
import ProviderExample from '../components/ProviderExample'
import SpritzSDK from '../../dist/sdk'

export default function Home() {

  const startSpritz = () => {
    let spritzWidget = new SpritzSDK({
      apiKey: '1dfeff2e-7de7-4ab3-8256-efbea11f24f2', // Your API Key
      environment: 'LOCAL_DEVELOPMENT', // STAGING/PRODUCTION
      walletAddress: '', // Your customer wallet address
      themeColor: '000000', // App theme color in hex
      fiatCurrency: 'USD',
      mode: 'widget',
      redirectURL: '',
      hostURL: window.location.origin,
      widgetHeight: '800px',
      widgetWidth: '100%'
    });
    spritzWidget.init();
  }

  return (
    <>
      <header>
        First Bank of DeFi
      </header>


      <ProviderExample />
      <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
        <MetaMaskCard />
      </div>

      <h1>Welcome to First Bank of DeFi</h1>

      <div className="card">
        <h2>Spritz Offramp</h2>
        <button id="spritz" onClick={startSpritz}>Pay your Bills</button>

      </div>

      <div className="card">
        <h2>Staking</h2>
        <p>Earn interest on your tokens by staking them in our DeFi platform.</p>
      </div>
      <div className="card">
        <h2>Lending & Borrowing</h2>
        <p>Lend your tokens to earn interest or borrow tokens for your projects.</p>
      </div>
      <div className="card">
        <h2>Decentralized Exchange</h2>
        <p>Trade your tokens with other users in a secure and decentralized manner.</p>
      </div>

      <footer>
        &copy; 2023 First Bank of DeFi. All rights reserved.
      </footer>

    </>
  )
}
