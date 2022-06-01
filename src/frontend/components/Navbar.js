import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import market from './nft.png';

const Navigation = ({ web3Handler, account, balance }) => {
  return (
    <Navbar expand='lg' bg='primary' variant='dark'>
      <Container>
        <Navbar.Brand as={Link} to='/'>
          <img
            src={market}
            width='30'
            height='30'
            className=''
            alt=''
            style={{ borderRadius: '50%' }}
          />
          &nbsp; NFT Marketplace
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link as={Link} to='/'>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to='/create'>
              Create NFT
            </Nav.Link>
            <Nav.Link as={Link} to='/my-listed-items'>
              NFT's
            </Nav.Link>
            <Nav.Link as={Link} to='/my-purchases'>
              Owned NFT's
            </Nav.Link>
          </Nav>
          <Nav>
            {account ? (
              <Nav.Link
                href={`https://etherscan.io/address/${account}`}
                target='_blank'
                rel='noopener noreferrer'
                className='button nav-button btn-sm mx-4'
              >
                <Button variant='outline-light'>
                  {account.slice(0, 5) + '...' + account.slice(38, 42)}
                </Button>
              </Nav.Link>
            ) : (
              <Button onClick={web3Handler} variant='outline-light'>
                Connect Wallet
              </Button>
            )}
          </Nav>
          <Nav>
            {balance ? (
              <Nav.Link
                href={`https://etherscan.io/address/${account}`}
                target='_blank'
                rel='noopener noreferrer'
                className='button nav-button btn-sm mx-4'
              >
                <div variant='outline-light'>{balance.slice(0, 8)} ETH</div>
              </Nav.Link>
            ) : (
              <Nav.Link
                href={`https://etherscan.io/address/${account}`}
                target='_blank'
                rel='noopener noreferrer'
                className='button nav-button btn-sm mx-4'
              >
                <div variant='outline-light'>0 ETH</div>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
