import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './Navbar';
import Home from './Home.js';
import Create from './Create.js';
import MyListedItems from './MyListedItems.js';
import MyPurchases from './MyPurchases.js';
import MarketplaceAbi from '../contractsData/Marketplace_MARK.json';
import MarketplaceAddress from '../contractsData/Marketplace-address.json';
import NFTAbi from '../contractsData/NFT_DCT.json';
import NFTAddress from '../contractsData/NFT-address.json';
import { useState } from 'react';
import { ethers } from 'ethers';
import { Spinner } from 'react-bootstrap';
import { fromWei } from '../../utils/utils';

import './App.css';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});

  // MetaMask Login/Connect
  const web3Handler = async () => {
    // Get Metamask accounts
    const [firstAccount] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    setAccount(firstAccount);

    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Set signer (account object)
    const signer = provider.getSigner();

    //display balance

    const readBalance = (await signer.getBalance()).toString();
    setBalance(fromWei(readBalance));

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0]);
      await web3Handler();
    });
    loadContracts(signer);
  };

  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(
      MarketplaceAddress.address,
      MarketplaceAbi.abi,
      signer
    );
    setMarketplace(marketplace);

    const nftCtr = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNFT(nftCtr);
    setLoading(false);
  };

  return (
    <BrowserRouter>
      <div className='App'>
        <Navigation
          web3Handler={web3Handler}
          account={account}
          balance={balance}
        />
        <div>
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
              }}
            >
              <Spinner animation='border' style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route
                path='/'
                element={<Home marketplace={marketplace} nft={nft} />}
              />
              <Route
                path='/create'
                element={<Create marketplace={marketplace} nft={nft} />}
              />
              <Route
                path='/my-listed-items'
                element={
                  <MyListedItems
                    marketplace={marketplace}
                    nft={nft}
                    account={account}
                  />
                }
              />
              <Route
                path='/my-purchases'
                element={
                  <MyPurchases
                    marketplace={marketplace}
                    nft={nft}
                    account={account}
                  />
                }
              />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
