"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  useConnection,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useState } from "react";

const RequestAirdrop = () => {
  const [loading, setLoading] = useState(false);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const requestAirdrop = async () => {
    if (publicKey) {
      setLoading(true);
      try {
        let signature = await connection.requestAirdrop(
          publicKey,
          0.5 * LAMPORTS_PER_SOL
        );
        let { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight,
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <button
      disabled={loading}
      onClick={requestAirdrop}
      className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
    >
      {loading ? "İşlem başlatıldı" : "Request Airdrop"}
    </button>
  );
};

export default function Home() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const wallets = [new UnsafeBurnerWalletAdapter()];
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <WalletMultiButton style={{ marginBottom: 30 }} />
            <WalletDisconnectButton style={{ marginBottom: 30 }} />
            <RequestAirdrop />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </main>
  );
}
