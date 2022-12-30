import { ArWallet, Contract } from 'warp-contracts';

export interface CreateContractProps {
  environment: 'local' | 'testnet' | 'mainnet';
  wallet?: ArWallet;
  initialState: string;
  contractSource: string;
}

export interface CreateContractReturnProps {
  contract: Contract;
  contractTxId: string;
  wallet?: ArWallet;
}
