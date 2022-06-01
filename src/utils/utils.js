const { ethers } = require('ethers');

const toWei = (num) => {
  if (num !== undefined) return ethers.utils.parseEther(num.toString());
};
const fromWei = (num) => {
  if (num !== undefined) return ethers.utils.formatEther(num);
};

module.exports = {
  toWei,
  fromWei,
};
