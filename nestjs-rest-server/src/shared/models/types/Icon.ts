export type IconNetworkConfig = {
  rpc: string;
  rpcDebug: string;
  nid: number;
  contracts: {
    chain: string;
    registrationBook: string | undefined;
    balanced: {
      savings: string | undefined;
      loans: string | undefined;
    };
  };
};
