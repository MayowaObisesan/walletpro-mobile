import type { TokenBalance } from '@src/types/account';

/**
 * Formats token balance for display
 * @param balance Raw token balance as string
 * @param decimals Token decimals
 * @returns Formatted balance string
 */
export const formatTokenBalance = (balance: string, decimals: number): string => {
  const num = parseFloat(balance) / Math.pow(10, decimals);
  
  if (num === 0) return '0';
  if (num < 0.000001) return '< 0.000001';
  if (num < 0.001) return num.toFixed(6);
  if (num < 1) return num.toFixed(4);
  if (num < 1000) return num.toFixed(2);
  
  return num.toLocaleString('en-US', { 
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
};

/**
 * Formats USD value for display
 * @param value USD value as number
 * @returns Formatted USD string
 */
export const formatUsdValue = (value: number): string => {
  if (value === 0) return '$0.00';
  if (value < 0.01) return '< $0.01';
  if (value < 1) return `$${value.toFixed(4)}`;
  if (value < 100) return `$${value.toFixed(2)}`;
  
  return `$${value.toLocaleString('en-US', { 
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  })}`;
};

/**
 * Calculates total portfolio value from tokens
 * @param tokens Array of token balances
 * @returns Total USD value
 */
export const getTotalPortfolioValue = (tokens: TokenBalance[]): number => {
  return tokens.reduce((total, token) => total + (token.usdValue || 0), 0);
};

/**
 * Gets a shortened symbol for display
 * @param symbol Token symbol
 * @param maxLength Maximum length
 * @returns Shortened symbol
 */
export const getShortenedSymbol = (symbol: string, maxLength: number = 8): string => {
  if (!symbol) return '???';
  return symbol.length > maxLength ? `${symbol.slice(0, maxLength - 3)}...` : symbol;
};

/**
 * Filters tokens by search query
 * @param tokens Array of tokens
 * @param query Search query
 * @returns Filtered tokens
 */
export const filterTokensByQuery = (tokens: TokenBalance[], query: string): TokenBalance[] => {
  if (!query.trim()) return tokens;
  
  const lowercaseQuery = query.toLowerCase();
  return tokens.filter(token =>
    token.name?.toLowerCase().includes(lowercaseQuery) ||
    token.symbol?.toLowerCase().includes(lowercaseQuery) ||
    token.address?.toLowerCase().includes(lowercaseQuery)
  );
};

/**
 * Sorts tokens by balance (descending)
 * @param tokens Array of tokens
 * @returns Sorted tokens
 */
export const sortTokensByBalance = (tokens: TokenBalance[]): TokenBalance[] => {
  return [...tokens].sort((a, b) => {
    const aValue = a.usdValue || 0;
    const bValue = b.usdValue || 0;
    return bValue - aValue;
  });
};

/**
 * Sorts tokens by name (ascending)
 * @param tokens Array of tokens
 * @returns Sorted tokens
 */
export const sortTokensByName = (tokens: TokenBalance[]): TokenBalance[] => {
  return [...tokens].sort((a, b) => {
    const aName = a.name || '';
    const bName = b.name || '';
    return aName.localeCompare(bName);
  });
};

/**
 * Determines if a token should be displayed (has balance > 0)
 * @param token Token balance
 * @returns Whether to display the token
 */
export const shouldDisplayToken = (token: TokenBalance): boolean => {
  const balance = parseFloat(token.balance) / Math.pow(10, token.decimals);
  return balance > 0;
};

/**
 * Gets token color based on symbol (for fallback when no logo)
 * @param symbol Token symbol
 * @returns Color string
 */
export const getTokenColor = (symbol: string): string => {
  if (!symbol) return '#94a3b8';
  
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
    '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4',
    '#0ea5e9', '#3b82f6', '#6b7280'
  ];
  
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Formats token address for display
 * @param address Token contract address
 * @returns Shortened address
 */
export const formatTokenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Validates if a string is a valid token address
 * @param address Address to validate
 * @returns Whether address is valid
 */
export const isValidTokenAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
