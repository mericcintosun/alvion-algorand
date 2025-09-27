// Basit kural tabanlı planlayıcı (Step 1 için zincire gitmez)
export function planFromCommand(cmd) {
  const steps = [];
  
  // risk limiti (PolicyGuard'a ileride pushlanacak)
  if (cmd.riskLimitPct != null) {
    steps.push({ 
      op: "SET_POLICY", 
      params: { maxSlippageBps: Math.round(cmd.riskLimitPct * 100) } 
    });
  }

  switch (cmd.intent) {
    case "STAKE_ALGO":
      steps.push({ 
        op: "QUOTE", 
        params: { 
          proto: "FOLKS", 
          action: "MINT_XALGO", 
          amount: cmd.amount ?? "auto" 
        } 
      });
      steps.push({ op: "PREVIEW", params: {} });
      // Step 3'te EXECUTE eklenecek
      break;

    case "UNSTAKE_ALGO":
      steps.push({ 
        op: "QUOTE", 
        params: { 
          proto: "FOLKS", 
          action: "REDEEM_XALGO", 
          amount: cmd.amount ?? "auto" 
        } 
      });
      steps.push({ op: "PREVIEW", params: {} });
      break;

    case "SWAP":
      steps.push({ 
        op: "QUOTE", 
        params: { 
          proto: "TINYMAN", 
          from: cmd.fromAsset, 
          to: cmd.toAsset, 
          amount: cmd.amount ?? "auto" 
        } 
      });
      steps.push({ op: "PREVIEW", params: {} });
      break;

    case "REBALANCE":
      steps.push({ 
        op: "QUOTE", 
        params: { 
          proto: "TINYMAN", 
          action: "REBALANCE", 
          target: cmd.targetAllocation ?? null 
        } 
      });
      steps.push({ op: "PREVIEW", params: {} });
      break;

    case "SET_RISK":
      steps.push({ op: "PREVIEW", params: {} });
      break;
  }
  
  return { steps };
}
