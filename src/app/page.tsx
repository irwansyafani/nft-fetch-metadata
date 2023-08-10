"use client";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal, Web3Button, useWeb3Modal } from "@web3modal/react";
import { useEffect, useState } from "react";
import {
  configureChains,
  createConfig,
  WagmiConfig,
  useAccount,
  useDisconnect,
} from "wagmi";
import { arbitrum, mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { getBalance, getNFTs } from "@/components/utils/contract";

const chains = [arbitrum, mainnet, polygon, polygonMumbai];
const projectId = `${process.env.WALLET_CONNNECT_PROJECT_ID}`;

const { publicClient, webSocketPublicClient } = configureChains(chains, [
  w3mProvider({ projectId }),
]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
  webSocketPublicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <HomePage />
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}

const HomePage = () => {
  const { open, close, isOpen } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { address, status } = useAccount({});
  // const [tokens, setTokens] = useState([]);
  const [hasToken, setHasToken] = useState(false);
  const [fetchClicked, setFetchClicked] = useState(false);

  const fetchNFTs = async () => {
    // const nfts: any = await getNFTs(address);
    const nfts: number = await getBalance(address);
    console.log(nfts);
    setHasToken(!!nfts);
    setFetchClicked(true);
  };

  useEffect(() => {
    if (status !== "connected" && !isOpen) {
      setTimeout(() => {
        open();
      }, 250);
    }
  }, [status, isOpen]);

  useEffect(() => {
    if (fetchClicked || status === "connected") {
      setTimeout(async () => {
        await disconnect();
        // await setTokens([]);
        await setHasToken(false);
      }, 5000);
    }
  }, [fetchClicked]);

  return (
    <>
      {/* {status !== "connected" && (
        <>
          <Web3Button />
          <button onClick={open}>Connect with WalletConnect</button>
        </>
      )} */}
      <p>{address || "Signed Out"}</p>
      <br />
      {status === "connected" && !hasToken && (
        <>
          {/* <button onClick={fetchNFTs}>Fetch NFTs</button> */}
          <button onClick={fetchNFTs}>Check Balance</button>
        </>
      )}
      {/* {tokens.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", columnGap: 10 }}>
          {tokens.map((item: any, i: number) => {
            return (
              <div key={i}>
                <img
                  src={item.image}
                  width={400}
                  height={400}
                  alt={item.name}
                />
                <p>{item.name}</p>
              </div>
            );
          })}
        </div>
      )} */}
      {address && fetchClicked && (
        <img
          src={
            hasToken
              ? "https://i.gifer.com/7efs.gif"
              : "https://cliply.co/wp-content/uploads/2021/07/372107370_CROSS_MARK_400px.gif"
          }
          width={400}
          height={400}
          alt="check"
        />
      )}
    </>
  );
};

export default App;
