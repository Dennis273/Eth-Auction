import Contract from 'node_modules/_@types_web3@1.0.14@@types/web3/eth/contract';
import { createContext } from 'react';
import { Web3 } from 'web3';

export interface IWeb3Context {
  web3: Web3;
  currentUser: string;
  dispatcher: Contract;
}

export const Web3Context = createContext<IWeb3Context | null>(null)