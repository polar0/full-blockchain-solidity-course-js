import { ethers } from 'ethers';

const DECIMALS = 18;

const roundEth = (value) => {
  const rounded = ethers.utils.formatUnits(value, DECIMALS);
  return Number(parseFloat(rounded).toFixed(3));
};

const truncateAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export { roundEth, truncateAddress };
