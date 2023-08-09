"use client";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal, Web3Button, useWeb3Modal } from "@web3modal/react";
import { useEffect, useState } from "react";
import { configureChains, createConfig, WagmiConfig, useAccount } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { getNFTs } from "@/components/utils/contract";

const chains = [arbitrum, mainnet, polygon];
const projectId = `${process.env.WALLET_CONNNECT_PROJECT_ID}`;
const infuraId = `${process.env.INFURA_ID}`;

const { publicClient, webSocketPublicClient } = configureChains(chains, [
  w3mProvider({ projectId }),
]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
  webSocketPublicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains, infuraId);

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
  const { open } = useWeb3Modal();
  const { address, status } = useAccount({});
  const [tokens, setTokens] = useState([]);

  const fetchNFTs = async () => {
    const nfts: any = await getNFTs(address);
    setTokens(nfts);
  };

  useEffect(() => {
    console.log(status, address);
  }, [status]);

  return (
    <>
      {status !== "connected" && (
        <>
          <Web3Button />
          <button onClick={open}>Connect with WalletConnect</button>
        </>
      )}
      <p>{address}</p>
      <br />
      {status === "connected" && !tokens.length && (
        <>
          <button onClick={fetchNFTs}>Fetch NFTs</button>
        </>
      )}
      {tokens.length > 0 && (
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
      )}
    </>
  );
};

export default App;
