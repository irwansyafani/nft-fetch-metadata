import { Contract } from "@ethersproject/contracts";
import ABI from "@/components/utils/abi-karafuru.json";
import { InfuraProvider } from "@ethersproject/providers";
import axios from "axios";

async function fetchNFTMetadata(tokenId) {
  const metadataUrl = `https://api-v2.karafuru.io/api/v1/metadatas3d/${tokenId}`;

  try {
    const response = await axios(metadataUrl);
    const metadata = await response.data;
    return metadata;
  } catch (error) {
    return null;
  }
}

export const getNFTs = async (address) => {
  const provider = new InfuraProvider("mainnet", process.env.INFURA_ID);
  const contract = new Contract(process.env.CONTRACT_ADDRESS, ABI, provider);
  const balance = await contract.balanceOf(address);
  const tokens = [];

  for (let i = 0; i < balance; i++) {
    const tokenId = +(
      await contract.tokenOfOwnerByIndex(address, i)
    ).toString();
    const nftMetadata = await fetchNFTMetadata(tokenId);
    tokens.push(nftMetadata || tokenId);
  }

  return tokens;
};

export const getBalance = async (address) => {
  const provider = new InfuraProvider("mainnet", process.env.INFURA_ID);
  const contract = new Contract(process.env.CONTRACT_ADDRESS, ABI, provider);
  const balance = await contract.balanceOf(address);
  return balance;
};

export const disconnectWallet = async () => {
  const provider = new InfuraProvider("mainnet", process.env.INFURA_ID);
};
