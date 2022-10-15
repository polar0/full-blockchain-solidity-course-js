require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('hardhat-deploy');
require('solidity-coverage');
require('hardhat-gas-reporter');
require('hardhat-contract-sizer');
require('dotenv').config();

const ARBITRUM_RPC_URL = process.env.ARBITRUM_RPC_URL;
const ARBITRUM_GOERLI_RPC_URL = process.env.ARBITRUM_GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ARBISCAN_API_KEY = process.env.ARBISCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: '0.8.7' }],
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
      chainId: 31337,
    },
    arbitrumGoerli: {
      url: ARBITRUM_GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 421613,
      blockConfirmations: 5,
    },
    arbitrumOne: {
      url: ARBITRUM_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 42161,
      blockConfirmations: 5,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    participant: {
      default: 1,
    },
  },
  etherscan: {
    apiKey: {
      arbitrumGoerli: ARBISCAN_API_KEY,
      arbitrumOne: ARBISCAN_API_KEY,
    },
    customChains: [
      {
        network: 'goerli',
        chainId: 5,
        urls: {
          apiURL: 'https://api-goerli.etherscan.io/api',
          browserURL: 'https://goerli.etherscan.io',
        },
      },
    ],
  },
  gasReporter: {
    enabled: false,
    outputFile: 'gas-report.txt',
    noColors: true,
    currency: 'USD',
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  mocha: {
    timeout: 300000,
  },
};
