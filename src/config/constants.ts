import type {TransactionCategory} from "@src/types/account";

export const ALL_CATEGORIES: TransactionCategory[] = ['external', 'internal', 'erc20', 'erc721', 'erc1155'];

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  external: 'External',
  internal: 'Internal',
  erc20: 'ERC20',
  erc721: 'ERC721',
  erc1155: 'ERC1155',
};

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  external: 'bg-blue-100 text-blue-800',
  internal: 'bg-purple-100 text-purple-800',
  erc20: 'bg-green-100 text-green-800',
  erc721: 'bg-orange-100 text-orange-800',
  erc1155: 'bg-pink-100 text-pink-800',
};
