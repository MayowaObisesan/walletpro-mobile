
// Format address for display (shorten to first 6 and last 4 characters)
export const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format transaction hash for display
export const formatTxHash = (hash: string): string => {
  if (!hash || hash.length < 10) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

// Format value with appropriate decimal places
export const formatValue = (value: number | string, decimals: number = 4): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';

  if (num === 0) return '0';
  if (num < 0.001) return '< 0.001';
  if (num < 1) return num.toFixed(6);
  return num.toFixed(decimals);
};

// Format currency value with symbol
export const formatCurrency = (value: number | string, symbol: string = ''): string => {
  const formatted = formatValue(value);
  return symbol ? `${formatted} ${symbol}` : formatted;
};

// Get time ago string from timestamp
export const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

// Convert hex block number to decimal and format
export const formatBlockNumber = (blockHex: string): string => {
  const blockNum = parseInt(blockHex, 16);
  return blockNum.toLocaleString();
};

// Get block explorer URL for transaction
export const getBlockExplorerTxUrl = (txHash: string, chainId: number): string => {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io/tx',
    11155111: 'https://sepolia.etherscan.io/tx',
    137: 'https://polygonscan.com/tx',
    10: 'https://optimistic.etherscan.io/tx',
    42161: 'https://arbiscan.io/tx',
    8453: 'https://basescan.org/tx',
  };

  const baseUrl = explorers[chainId];
  if (!baseUrl) {
    return `https://etherscan.io/tx/${txHash}`; // Default to Ethereum
  }

  return `${baseUrl}/${txHash}`;
};

// Get block explorer URL for address
export const getBlockExplorerAddressUrl = (address: string, chainId: number): string => {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io/address',
    11155111: 'https://sepolia.etherscan.io/address',
    137: 'https://polygonscan.com/address',
    10: 'https://optimistic.etherscan.io/address',
    42161: 'https://arbiscan.io/address',
    8453: 'https://basescan.org/address',
  };

  const baseUrl = explorers[chainId];
  if (!baseUrl) {
    return `https://etherscan.io/address/${address}`; // Default to Ethereum
  }

  return `${baseUrl}/${address}`;
};
