import './App.css';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { SUPPORTED_NETWORKS } from "./helpers/networks";

const Wrapper = styled.div`
  font-family: "Varela Round", sans-serif;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10em;
`;

const Header = styled.h1`
  font-size: 2em;
  margin-bottom: 1em;
`;

const LoadedData = styled.div`
  margin: 1em;
  align-self: center;
`;

const Data = styled.p`
  font-size: 1.2em;
`;

const Button = styled.button`
  padding: 1em;
  background: #53cbc9;
  font-size: 1em;
  border: none;
  border-radius: 0.3em;
  font-family: "Varela Round", sans-serif;
  :hover {
    transform: scale(1.1);
    cursor: pointer;
  }
`;

const OutlinedButton = styled(Button)`
  background: #ffffff;
  border: 1px solid #53cbc9;
  display: flex;
  margin: auto;
  margin-top: 3em;
`;

function App() {
  // add state variables & hooks here
  const [connector, setConnector] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [supported, setSupported] = useState(false);
  const [network, setNetwork] = useState(null);
  const [balance, setBalance] = useState(null);
  const [symbol, setSymbol] = useState(null);


  useEffect(() => {

    const onConnect = async (chainId, address) => {
      setAccount(address);

      const networkData = SUPPORTED_NETWORKS.filter((network) => network.chain_id === chainId)[0];

      if (!networkData) {
        setSupported(false);
      } else {
        setSupported(true);
        setNetwork(networkData.name);
        setSymbol(networkData.native_currency.symbol);
        setChainId(chainId);

        // 1. Create an Ethers provider
        const provider = new ethers.providers.StaticJsonRpcProvider(networkData.rpc_url, {
          chainId,
          name: networkData.name
        });

        // 2. Get the account balance
        const balance = await provider.getBalance(address);
        // 3. Format the balance
        const formattedBalance = ethers.utils.formatEther(balance);
        // 4. Save the balance to state
        setBalance(formattedBalance);
      }
    };


    // add logic with side effects
    const refreshData = async () => {
      const { chainId, accounts } = connector;
      await onConnect(chainId, accounts[0]);
      setFetching(false);
    }
    console.log("UseEffect")
    console.log("connector", connector)
    if (connector) {
      connector.on("connect", async (error, payload) => {
        if (error) {
          console.error(error);
          return;
        }

        const { chainId, accounts } = payload.params[0];
        console.log(chainId)
        console.log(accounts)
        await onConnect(chainId, accounts[0]);
        setFetching(false);
      });

      connector.on("disconnect", async (error, payload) => {
        if (error) {
          console.error(error);
        }

        // handle disconnect event
      });

      // check state variables here & if needed refresh the app
      // If any of these variables do not exist and the connector is connected, refresh the data
      console.log("ChainId : ", chainId)
      console.log("Account : ", account)
      // If any of these variables do not exist and the connector is connected, refresh the data
      if ((!chainId || !account || !balance) && connector.connected) {
        console.log("Data should be refreshed")
        refreshData();
      }

    }


  }, [connector, chainId, account, balance]);

  const connect = async () => {
    setFetching(true);
    // 1. Create connector
    const connector = new WalletConnect({ bridge: "https://bridge.walletconnect.org", qrcodeModal: QRCodeModal });

    // 2. Update the connector state
    setConnector(connector);

    // 3. If not connected, create a new session
    if (!connector.connected) {
      await connector.createSession();
    }
  };

  const killSession = () => {
    // Make sure the connector exists before trying to kill the session
    if (connector) {
      connector.killSession();
    }
    resetApp();
  };


  const sendTransaction = () => {
    try {
      const gazPrice = "0xf4240"
      const priceValue = "0x38D7EA4C68000"
      const smartContractAddress = "0x2b857c8944fbba4d0a63f32bcb6daeb510289adb"
      console.log("send transaction with this account : ", account)
      connector.sendTransaction(
        {
          from: account,
          to: smartContractAddress,
          data: '0xe6985b3c0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b6578616d706c652e636f6d000000000000000000000000000000000000000000',
          value: priceValue,
          // gas: gazPrice
        });
    } catch (e) {
      // Handle the error as you see fit
      console.error(e);
    }
  };


  const resetApp = () => {
    setConnector(null);
    setFetching(false);
    setAccount(null);
    setChainId(null);
    setSupported(false);
    setNetwork(null);
    setSymbol(null);
    setBalance(null)
  };

  return (
    <Wrapper>
      <Content>
        <Header>
          FISH FISH FISH
        </Header>

        {connector && !fetching ? (
          <LoadedData>
            <Data>
              <strong>Connected Account: </strong>
              {account}
            </Data>
            <Data>
              <strong>Chain ID: </strong>
              {chainId}
            </Data>
            {supported ? (
              <>
                <Data>
                  <strong>Network: </strong>
                  {network}
                </Data>
                <Data>
                  <strong>Balance: </strong>
                  {balance} {symbol}
                </Data>
                <OutlinedButton onClick={sendTransaction}>Fish</OutlinedButton>
              </>
            ) : (
              <strong>
                Network not supported. Please disconnect, switch networks, and connect again.
              </strong>
            )}
            <OutlinedButton onClick={killSession}>Disconnect</OutlinedButton>
          </LoadedData>
        ) : (
          <Button onClick={connect}>Connect Wallet</Button>
        )}
      </Content>
    </Wrapper>
  );
}
export default App;
