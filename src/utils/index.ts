export const shortenAddress = (addr: string) => {
  if (!addr) { return null; }
  return `${addr?.substring(0, 6)}...${addr?.substring(addr.length - 4)}`;
};

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
