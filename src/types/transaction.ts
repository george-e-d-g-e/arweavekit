import BundlrTransaction from '@bundlr-network/client/build/common/transaction';
import { UploadResponse } from '@bundlr-network/client/build/common/types';
import Transaction from 'arweave/node/lib/transaction';
import { JWKInterface } from 'arweave/node/lib/wallet';

export interface CreateTransactionProps {
  type: 'data' | 'wallet';
  key?: JWKInterface;
  environment: 'local' | 'mainnet';
  target?: string;
  quantity?: string;
  data?: string | Uint8Array | ArrayBuffer;
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    useBundlr?: boolean;
    signAndPost?: boolean;
    signAndPostWOthen?: boolean;
  };
}

export interface CreateWalletTransactionProps extends CreateTransactionProps {
  type: 'wallet';
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    useBundlr?: false;
    signAndPost?: false;
    signAndPostWOthen?: false;
  };
}

export interface CreateAndPostWalletTransactionProps extends CreateTransactionProps {
  type: 'wallet';
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    useBundlr?: false;
    signAndPost?: true;
    signAndPostWOthen?: false;
  };
}

export interface CreateDataTransactionProps extends CreateTransactionProps {
  type: 'data';
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    useBundlr?: false;
    signAndPost?: false;
    signAndPostWOthen?: false;
  };
}

export interface CreateAndPostDataTransactionProps extends CreateTransactionProps {
  type: 'data';
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    useBundlr?: false;
    signAndPost?: true;
    signAndPostWOthen?: false;
  };
}

export interface CreateAndPostDataTransactionWOthentProps extends CreateTransactionProps {
  type: 'data';
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    useBundlr?: false;
    signAndPost?: false;
    signAndPostWOthen?: true;
  };
}

export interface CreateBundledDataTransactionProps extends CreateTransactionProps {
  type: 'data';
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    useBundlr?: true;
    signAndPost?: false;
    signAndPostWOthen?: false;
  };
}

export interface CreateAndPostBundledDataTransactionProps extends CreateTransactionProps {
  type: 'data';
  options?: {
    tags?: {
      name: string;
      value: string;
    }[];
    useBundlr?: true;
    signAndPost?: true;
    signAndPostWOthen?: false;
  };
}

export type CreateTransactionReturnProps<T extends CreateWalletTransactionProps | CreateAndPostWalletTransactionProps | CreateDataTransactionProps | CreateAndPostDataTransactionProps | CreateAndPostDataTransactionWOthentProps | CreateBundledDataTransactionProps | CreateAndPostBundledDataTransactionProps> =
  T extends CreateWalletTransactionProps ? Transaction :
  T extends CreateAndPostWalletTransactionProps ? {
    transaction: Transaction,
    postedTransaction: {
      status: number;
      statusText: string;
      data: any;
    }
  } :
  T extends CreateDataTransactionProps ? Transaction :
  T extends CreateAndPostDataTransactionProps ? {
    transaction: Transaction,
    postedTransaction: {
      status: number;
      statusText: string;
      data: any;
    }
  } :
  T extends CreateAndPostDataTransactionWOthentProps ? {
    success: boolean,
    transactionId: string
  } :
  T extends CreateBundledDataTransactionProps ? BundlrTransaction :
  T extends CreateAndPostBundledDataTransactionProps ? {
    transaction: BundlrTransaction,
    postedTransaction: UploadResponse
  } :
  never;

export interface SignTransactionProps {
  key: JWKInterface;
  environment: 'local' | 'mainnet';
  createdTransaction: Transaction | BundlrTransaction;
  useBundlr?: boolean;
  postTransaction?: boolean;
}

export interface PostTransactionProps {
  key: JWKInterface;
  environment: 'local' | 'mainnet';
  transaction: Transaction | BundlrTransaction;
  useBundlr?: boolean;
}

export interface GetTransactionProps {
  transactionId: string;
  environment: 'local' | 'mainnet';
  options?: {
    data?: boolean;
    tags?: boolean;
  };
}
