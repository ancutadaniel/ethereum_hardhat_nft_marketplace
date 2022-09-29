async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  // Get the ContractFactories and Signers here.
  const NFT = await ethers.getContractFactory('NFT');
  const Marketplace = await ethers.getContractFactory('Marketplace');

  // deploy contracts
  const nft = await NFT.deploy();
  const marketplace = await Marketplace.deploy(1); // 1 here is fee percent needed in constructor

  await nft.deployed();
  await marketplace.deployed();

  console.log('NFT contract address', nft.address);
  console.log('MARKETPLACE contract address', marketplace.address);

  // Save copies of each contracts abi and address to the frontend.
  saveFrontendFiles(marketplace, 'Marketplace', 'MARK');
  saveFrontendFiles(nft, 'NFT', await nft.symbol());
}

const saveFrontendFiles = (contract, name, symbol) => {
  const fs = require('fs');
  const contractsDir = __dirname + '/../../frontend/contractsData';

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address, symbols: symbol }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}_${symbol}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
