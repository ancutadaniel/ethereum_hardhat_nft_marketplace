require('@nomiclabs/hardhat-waffle');
require('dotenv').config({ path: './.env' });

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const PRIVATE_KEY_DACETHER = process.env.PRIVATE_KEY_DACETHER;

module.exports = {
  solidity: '0.8.9',
  networks: {
    localhost: {},
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY_DACETHER],
    },
  },
  paths: {
    artifacts: './src/backend/artifacts',
    sources: './src/backend/contracts',
    cache: './src/backend/cache',
    tests: './src/backend/test',
  },
};
