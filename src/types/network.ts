// Network type definitions for the wallet
export enum E_NetworkType {
  TESTNET = "testnet",
  MAINNET = "mainnet",
}

export const NetworkTypeList = Object.values(E_NetworkType)

export type NetworkType = E_NetworkType.TESTNET | E_NetworkType.MAINNET
