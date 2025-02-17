import { JWKInterface } from 'warp-contracts';
import {
  createContract,
  createWallet,
  readContractState,
  writeContract,
} from '../../src/index';
import { readFileSync } from 'fs';

const contractSrc = readFileSync(
  '__tests__/contract/data/contract.js',
  'utf-8'
);
const initState = readFileSync('__tests__/contract/data/state.json', 'utf-8');

jest.setTimeout(120000);

describe('Read Contract State', () => {
  let key: JWKInterface;

  beforeAll(async () => {
    ({ key } = await createWallet({
      environment: 'local',
    }));
  });

  it('should read initial state', async () => {
    const { contractTxId } = await createContract({
      wallet: key,
      environment: 'testnet',
      initialState: initState,
      contractSource: contractSrc,
    });

    const { readContract } = await readContractState({
      environment: 'testnet',
      contractTxId,
    });

    expect(readContract.sortKey).toBeDefined();
    expect(readContract.cachedValue.state).toBeDefined();
    expect(readContract.cachedValue.validity).toBeDefined();
    expect(typeof readContract.cachedValue.state).toBe('object');
    expect(typeof readContract.cachedValue.validity).toBe('object');
    expect(readContract.cachedValue.state).toEqual({ counter: 0 });

    console.log('Res', readContract);
  });

  it('should read state from mainnet', async () => {
    const { readContract } = await readContractState({
      environment: 'mainnet',
      contractTxId: 'rK2BjT9OOFTut82rNZxu_D5RjwoMJCNgnnq1X0Z4ly0',
      evaluationOptions: {
        remoteStateSyncEnabled: true,
        remoteStateSyncSource: 'https://dre-u.warp.cc/contract',
        unsafeClient: 'skip',
        internalWrites: true,
        allowBigInt: true,
      },
    });

    expect(readContract.sortKey).toBeDefined();
    expect(readContract.cachedValue.state).toBeDefined();
    expect(readContract.cachedValue.validity).toBeDefined();
    expect(typeof readContract.cachedValue.state).toBe('object');
    expect(typeof readContract.cachedValue.validity).toBe('object');
    expect((readContract.cachedValue.state as { name: string }).name).toEqual(
      'Atomic Cookies'
    );
  });

  it('should not read initial state if contract created on local & contract read on testnet', async () => {
    const { contractTxId } = await createContract({
      wallet: key,
      environment: 'local',
      initialState: initState,
      contractSource: contractSrc,
    });

    try {
      await readContractState({
        environment: 'testnet',
        contractTxId,
      });

      // If the function doesn't throw an error, fail the test
      fail('Expected readContractState to throw an error');
    } catch (error: any) {
      expect(
        error.message.includes(`Unable to retrieve tx ${contractTxId}`)
      ).toBeTruthy();
    }
  });

  it('should read updated state', async () => {
    const { contractTxId } = await createContract({
      environment: 'testnet',
      wallet: key,
      initialState: initState,
      contractSource: contractSrc,
    });

    await writeContract({
      environment: 'testnet',
      contractTxId: contractTxId,
      wallet: key,
      options: {
        function: 'fifty',
      },
    });

    const { readContract } = await readContractState({
      environment: 'testnet',
      contractTxId: contractTxId,
    });

    expect(readContract.sortKey).toBeDefined();
    expect(readContract.cachedValue.state).toBeDefined();
    expect(readContract.cachedValue.validity).toBeDefined();
    expect(typeof readContract.cachedValue.state).toBe('object');
    expect(typeof readContract.cachedValue.validity).toBe('object');
    expect(readContract.cachedValue.state).toEqual({ counter: 50 });
  });
});
