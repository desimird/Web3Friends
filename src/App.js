
import {useState, useEffect} from 'react';
import Web3 from 'web3';
import LibraryContract from "../src/Library.json"

import './App.css';

function App() {
  //const [web3, setWeb3] = useState(null);
  const [result, setResult] = useState(null);
  const [accounts, setAccounts] = useState([])
  const [network, setNetwork] = useState()
  const [balance, setBalance] = useState()
  const [libraryContract, setLibraryContract] = useState(null);
  const web3 = new Web3(Web3.givenProvider);
  // let balanceS= {
  //   account: '',
  //   network: '',
  //   balance: ''
  // }
  // const [balance, setBalance] = useState(balanceS)
  //0x83061E66A44295f7faA07D78A9D0098d6825b988
  useEffect(()=>{
    //console.log(web3);
    //loadAccounts();
    loadBlockchainData();
    //console.log(libraryContract);
    //console.log(accounts)
    
  }, [])

  useEffect(()=>{
    loadBalance()
  }, [accounts])


  async function loadBlockchainData() {
    if (web3) {
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
      console.log(accounts)

      //const networkId = await web3.eth.net.getId();
      //const deployedNetwork = LibraryContract.networks[networkId];
      //console.log(deployedNetwork);
      const contract = new web3.eth.Contract(
        LibraryContract,
        '0x83061E66A44295f7faA07D78A9D0098d6825b988'
      );
      setLibraryContract(contract);
    }
  }
  
  async function callLibraryMethod() {
    //console.log(libraryContract)
    if (libraryContract) {
      try {
        const result = await libraryContract.methods.add_book('desko11','de1s1ko').send({ from: accounts[0] });
        setResult(result);
        console.log(result)
       // console.log(libraryContract);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function readBooks() {
   // console.log(libraryContract)
    if (libraryContract) {
      try {
        const result = await libraryContract.methods.read_all_books().call({ from: accounts[0] });
        setResult(result);
        console.log(result)
        //console.log(libraryContract);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function loadBalance(){
    //console.log(account)
    try {
      if(accounts){
        const network = await web3.eth.net.getNetworkType()
        const balance = await web3.eth.getBalance(accounts[0])
        //console.log(web3.eth.getBalance(accounts))
    
        setNetwork(network)
        setBalance(balance)
      }
    } catch (error) {
      
    }
    
    
  }

  async function loadAccounts(){
    //console.log(web3);
    const accounts = await web3.eth.requestAccounts();

    setAccounts(accounts[0]);
    //console.log(web3.utils.toChecksumAddress(accounts[0]));
  }

  const userData = {
    name: 'Your Name',
    profilePicture: 'your-profile-picture-url',
  };
  
  // Sample pending friend requests
  const pendingRequestsData = [
    {
      id: 1,
      senderName: 'Friend Request Sender 1',
      senderProfilePicture: 'sender-1-profile-picture-url',
    },
    {
      id: 2,
      senderName: 'Friend Request Sender 2',
      senderProfilePicture: 'sender-2-profile-picture-url',
    },
  ];
  
  // Sample other users
  const otherUsersData = [
    {
      id: 3,
      name: 'Other User 1',
      profilePicture: 'other-user-1-profile-picture-url',
    },
    {
      id: 4,
      name: 'Other User 2',
      profilePicture: 'other-user-2-profile-picture-url',
    },
    // ... more users
  ];
  
  function UserInfo() {
    return (
      <div>
        <h2 style = {{marginTop: '5px'}}>{userData.name}</h2>
        <img src={userData.profilePicture} alt="Profile" />
        {/* Additional user info */}
      </div>
    );
  }
  
  function PendingFriendRequest({ request }) {
    return (
      <div>
        <h3 style = {{marginTop: '5px'}}>{request.senderName}</h3>
        <img src={request.senderProfilePicture} alt="Sender Profile" />
        {/* Additional request details */}
      </div>
    );
  }
  
  function FriendRequests() {
    return (
      <div>
        <h2 style = {{marginTop: '5px'}}>Pending Friend Requests</h2>
        {pendingRequestsData.map((request) => (
          <PendingFriendRequest key={request.id} request={request} />
        ))}
      </div>
    );
  }
  
  function UserItem({ user }) {
    return (
      <div>
        <h3>{user.name}</h3>
        <img src={user.profilePicture} alt="User Profile" />
        {/* Additional user details */}
        <button className='button'>Add Friend</button>
      </div>
    );
  }
  
  function OtherUsers() {
    return (
      <div>
        <h2 style = {{marginTop: '5px'}}>Other Users</h2>
        {otherUsersData.map((user) => (
          <UserItem key={user.id} user={user} />
        ))}
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        Desimire ajd mozes ti to!
        <p>
          Your accounts: {accounts}
        </p>
        <p>
          Your Balance: {balance}
          
        </p>
        <button onClick={callLibraryMethod}>Call Library Method</button>
        {result && <p>Result: {}</p>}

        <button onClick={readBooks}>read</button>
        {result && <p>Result: {}</p>}
      </header>
      <body>
        <div className='wrap-container'>
          <div className="container">
            <div className="section">
              <UserInfo />
            </div>
            <div className="section">
              <FriendRequests />
            </div>
            <div className="section">
              <OtherUsers />
            </div>
          </div>
          </div>
          </body>
    </div>
    
  );
}

export default App;
