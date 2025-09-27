import algosdk from "algosdk";

export function getClients() {
  const indexer = new algosdk.Indexer("", import.meta.env.VITE_INDEXER_URL || "https://testnet-idx.algonode.cloud", "");
  const algod = new algosdk.Algodv2("", import.meta.env.VITE_ALGOD_URL || "https://testnet-api.algonode.cloud", "");
  return { indexer, algod };
}
