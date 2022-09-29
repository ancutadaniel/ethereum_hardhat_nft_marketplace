import { useState } from 'react';
import { ethers } from 'ethers';
import { Row, Form, Button } from 'react-bootstrap';
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('');
  const [price, setPrice] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const INFURA_ID = process.env.REACT_APP_INFURA_ID;
  const INFURA_SECRET_KEY = process.env.REACT_APP_INFURA_SECRET_KEY;
  const auth =
    'Basic ' +
    Buffer.from(INFURA_ID + ':' + INFURA_SECRET_KEY).toString('base64');

  const URL = `https://dropbox.infura-ipfs.io/ipfs/`;

  // connect to Infura IPFS API address
  const ipfs = create({
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (typeof file !== 'undefined') {
      try {
        const result = await ipfs.add(file);
        setImage(`${URL}${result.path}`);
      } catch (error) {
        console.log('ipfs image upload error: ', error);
      }
    }
  };

  const createNFT = async () => {
    if (!image || !price || !name || !description) return;

    try {
      // upload NFT metadata to ipfs
      const result = await ipfs.add(
        JSON.stringify({ image, price, name, description })
      );

      mintThenList(result);
    } catch (error) {
      console.log('ipfs uri upload error: ', error);
    }
  };

  const mintThenList = async (result) => {
    const uri = `${URL}${result.path}`;
    // mint nft
    await (await nft.mint(uri)).wait();
    // get tokenId of new nft
    const id = await nft.tokenCount();
    // approve marketplace to spend nft
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
  };

  return (
    <div className='container-fluid mt-5'>
      <div className='row'>
        <main
          role='main'
          className='col-lg-12 mx-auto'
          style={{ maxWidth: '1000px' }}
        >
          <div className='content mx-auto'>
            <Row className='g-4'>
              <Form.Control
                type='file'
                required
                name='file'
                accept='.jpg, .jpeg, .png, .bmp, .gif'
                onChange={uploadToIPFS}
              />
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size='lg'
                required
                type='text'
                placeholder='Name'
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size='lg'
                required
                as='textarea'
                placeholder='Description'
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size='lg'
                required
                type='number'
                placeholder='Price in ETH'
              />
              <div className='d-grid px-0'>
                <Button onClick={createNFT} variant='primary' size='lg'>
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Create;
