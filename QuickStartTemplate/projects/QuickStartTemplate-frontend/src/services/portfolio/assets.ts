import type algosdk from "algosdk";

export async function fetchAssetParams(algod: algosdk.Algodv2, assetId: number) {
  const res = await algod.getAssetByID(assetId).do(); // decimals vs.
  const p = res.params || {};
  return { 
    name: p.name, 
    unitName: p.unitName, 
    decimals: p.decimals ?? 0 
  };
}
