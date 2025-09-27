import type algosdk from "algosdk";

export async function fetchAssetParams(algod: algosdk.Algodv2, assetId: number) {
  const res = await algod.getAssetByID(assetId).do(); // decimals vs.
  const p = res.params || res.asset?.params || {};
  return { 
    name: p.name, 
    unitName: p["unit-name"], 
    decimals: p.decimals ?? 0 
  };
}
