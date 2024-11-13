import { useState, useEffect } from 'react';
import Head from 'next/head';
import HomePage from '../components/HomePage';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import { CHAIN_ID, SITE_ERROR, SMARTCONTRACT_ABI, SMARTCONTRACT_ABI_ERC20, SMARTCONTRACT_ADDRESS, SMARTCONTRACT_ADDRESS_ERC20 } from '../../config';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import Header from '../components/Header';
import { ethers, providers } from 'ethers';
import { errorAlert, errorAlertCenter } from '../components/toastGroup';
import initMoralis from '../utils/moralis';  // Ensure this file initializes Moralis with API Key
import MobileFooter from '../components/MobileFooter';
import { providerOptions } from '../hook/connectWallet';
import { checkNetwork } from '../hook/ethereum';

let web3Modal;

export default function Home({ headerAlert, closeAlert }) {
  const [totalReward, setTotalReward] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stakedCnt, setStakedCnt] = useState(0);
  const [unstakedCnt, setUnstakedCnt] = useState(0);
  const [connected, setConnected] = useState(false);
  const [signerAddress, setSignerAddress] = useState("");
  const [signerBalance, setSignerBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [totalDusty, setTotalDusty] = useState(0);
  const [staked, setStaked] = useState(0);
  const [earlyRemoved, setEarlyRemoved] = useState(0);
  const [ownerDusty, setTotalOwnerDusty] = useState(0);
  const [homeLoading, setHomeloading] = useState(false);
  const [holders, setHolders] = useState(0)

  // Initialize Moralis
  useEffect(() => {
    const initializeMoralis = async () => {
      await initMoralis(); // Initialize Moralis with API Key
    };
    initializeMoralis();
  }, []);

  const connectWallet = async () => {
    if (await checkNetwork()) {
      web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: true,
        providerOptions, // required
      });

      setHomeloading(true); // Start loading

      try {
        const provider = await web3Modal.connect();
        const web3Provider = new providers.Web3Provider(provider);
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();

        setConnected(true);
        setSignerAddress(address);

        const contract = new ethers.Contract(SMARTCONTRACT_ADDRESS, SMARTCONTRACT_ABI, signer);
        const contract_20 = new ethers.Contract(SMARTCONTRACT_ADDRESS_ERC20, SMARTCONTRACT_ABI_ERC20, signer);

        // Fetch necessary data
        const bal = await contract_20.balanceOf(address);
        setSignerBalance(ethers.utils.formatEther(bal));

        const totalS = await contract_20.totalSupply();
        setTotalSupply(ethers.utils.formatEther(totalS));

        const holdersCount = await contract_20.holders();
        setHolders(holdersCount.toString());

        const early = await contract.earlyRemoved();
        setEarlyRemoved(early.toString());

        const totalN = await contract_20.balanceOf(SMARTCONTRACT_ADDRESS);
        setTotalDusty(totalN.toString());

        const bonusPool = await contract.bonusPool();
        setTotalOwnerDusty(parseFloat(bonusPool.toString()) + 1114);

        const stakedTotal = await contract.totalStaked();
        setStaked(stakedTotal.toString());

        // Subscribe to account and network changes
        provider.on("accountsChanged", (accounts) => {
          setSignerAddress(accounts[0]);
        });

        provider.on("chainChanged", (chainId) => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        errorAlert("Failed to connect wallet.");
      } finally {
        setHomeloading(false); // Stop loading
      }
    }
  };

  const setStakedNFTs = async () => {
    try {
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(SMARTCONTRACT_ADDRESS, SMARTCONTRACT_ABI, signer);

      const accounts = await new Web3(Web3.givenProvider).eth.getAccounts();
      const total = await contract.staked(accounts[0]);

      if (parseInt(total.toString()) !== 0) {
        let stakedCount = 0;
        let totalRewards = 0;

        for (let i = 0; i < total; i++) {
          const nftData = await contract.activities(accounts[0], i);
          if (nftData.action === 1) {
            stakedCount++;
            totalRewards += parseFloat(ethers.utils.formatEther(nftData.reward.toString()));
          }
        }

        setStakedCnt(stakedCount);
        setTotalReward(totalRewards);
      }
    } catch (error) {
      console.error("Error fetching staked NFTs:", error);
    }
  };

  const setPastNFTs = async () => {
    setLoading(true);
    try {
      const accounts = await new Web3(Web3.givenProvider).eth.getAccounts();
      const userNFTs = await Moralis.Web3API.account.getNFTs({ chain: 'bsc', address: accounts[0] });
      setUnstakedCnt(userNFTs.total);
    } catch (error) {
      console.error("Error fetching past NFTs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNFTLIST = () => {
    setPastNFTs();
    setStakedNFTs();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (typeof window.ethereum !== 'undefined') {
        if (await checkNetwork("no-alert")) {
          await connectWallet();
          getNFTLIST();

          window.ethereum.on('accountsChanged', () => {
            window.location.reload();
          });

          if (window.ethereum.selectedAddress !== null) {
            setSignerAddress(window.ethereum.selectedAddress);
            setConnected(true);
          }

          window.ethereum.on('chainChanged', async (chainId) => {
            if (parseInt(chainId) === CHAIN_ID) {
              await connectWallet();
            } else {
              setConnected(false);
              errorAlert(SITE_ERROR[0]);
            }
          });
        }
      } else {
        errorAlertCenter(SITE_ERROR[1]);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header
        signerAddress={signerAddress}
        connectWallet={connectWallet}
        connected={connected}
        signerBalance={signerBalance}
        loading={homeLoading}
        headerAlert={headerAlert}
        closeAlert={closeAlert}
      />
      <MainContent>
        <Sidebar
          connected={connected}
          headerAlert={headerAlert}
        />
        <div className="page-content">
          <Head>
            <title>Dusty Vaults | Home</title>
            <meta name="description" content="NFT Bank" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <HomePage
            connected={connected}
            totalSupply={totalSupply}
            staked={staked}
            earlyRemoved={earlyRemoved}
            homeLoading={homeLoading}
            address={signerAddress}
            totalDusty={totalDusty}
            ownerDusty={ownerDusty}
            holders={holders}
            stakedCnt={stakedCnt}
            totalReward={totalReward}
            loading={loading}
            unstakedCnt={unstakedCnt}
          />
        </div>
      </MainContent>
      <MobileFooter connected={connected} />
    </>
  );
}
