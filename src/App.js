
import {useState, useEffect} from 'react';
import Web3 from 'web3';
import FriendshipPlatform from "../src/contract/FriendshipPlatfrom.json";
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [accounts, setAccounts] = useState([])
  const [network, setNetwork] = useState()
  const [balance, setBalance] = useState()
  const [friendshipPlatform, setFriendshipPlatform] = useState(null);
  const [otherUsersData, setOtherUsersData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [pendingRequestsData, setPendingRequestsData] = useState();
  const [friendsList, setFriendsList] = useState();
  const [userName, setUserName] = useState(' ');
  const web3 = new Web3(Web3.givenProvider);


  useEffect(()=>{
    loadBlockchainData();
  }, [])

  useEffect(()=>{
    get_all_users();
  },[friendshipPlatform])

  useEffect(()=>{
    loadBalance()
    get_my_user()
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
        FriendshipPlatform,
        '0x3D443139d4F9698d0266B1Db692B6A8CAD61E3e7'
      );
      setFriendshipPlatform(contract);
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

  // function UserInfo() {
  //   const placeholderImage = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
  //   return (
  //     <div>
  //       <h2 style = {{marginTop: '5px'}}>Your profile</h2>
  //       <div className='userItemWrap'>
  //       <div className='userItem-left'>
  //         <img className='profileThumb' src={placeholderImage} alt="Sender Profile" />
  //       </div>
  //       {/* Additional user details */}
  //       <div className='userItem-right' style={{alignItems: 'flex-end'}}>
  //         <h3>{userData.name}</h3>
  //       </div>
  //       <br></br>
  //     </div>
  //   </div>
  //   );
  // }

  function UserInfo() {
    const placeholderImage =
      'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
  
    // Check if user exists with the specified address
    const userExists = userData.address == accounts[0];
    
    

    return (
      <div>
        {userExists ? (
          <div>
            <h2 style={{ marginTop: '5px' }}>Your Profile</h2>
            <div className="userItemWrap">
              <div className="userItem-left">
                <img className="profileThumb" src={placeholderImage} alt="Sender Profile" />
              </div>
              {/* Additional user details */}
              <div className="userItem-right" style={{ alignItems: 'flex-end' }}>
                <h3>{userData.name}</h3>
              </div>
              <br />
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ marginTop: '5px' }}>Register</h2>
            
            <input type='text' value={userName} onChange={e=>setUserName(e.target.value)} />
            <button className='button' onClick={() => register(userName)}>Register</button>
          </div>
        )}
      </div>
    );
  }
  
  function PendingFriendRequest({ request }) {
    const placeholderImage = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
    return (
      <div className='userItemWrap'>
        <div className='userItem-left'>
          <img className='profileThumb' src={placeholderImage} alt="Sender Profile" />
        </div>
        {/* Additional user details */}
        <div className='userItem-right'>
          <h3>{request.senderName}</h3>
          <button className='button' onClick={() => accept_request(request.address)}>Accept</button>
          <button className='button-decline' onClick={() => decline_request(request.address)}>Decline</button>
        </div>
        <br></br>
      </div>

    );
    // return (
    //   <div>
    //     <h3 style = {{marginTop: '5px'}}>{request.senderName}</h3>
    //     <img src={request.senderProfilePicture} alt="Sender Profile" />
    //     {/* Additional request details */}
    //   </div>
    // );
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
    const placeholderImage = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
    return (
      <div className='userItemWrap'>
        <div className='userItem-left'>
          <img className='profileThumb' src={placeholderImage} alt="User Profile" />
        </div>
        {/* Additional user details */}
        <div className='userItem-right'>
          <h3>{user.name}</h3>
          <button className='button' onClick={() => send_friend_request(user.address)}>Add Friend</button>
        </div>
      </div>
    );
  }

  function FriendItem({ user }) {
    const placeholderImage = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
    return (
      <div className='userItemWrap'>
        <div className='userItem-left'>
          <img className='profileThumb' src={placeholderImage} alt="User Profile" />
        </div>
        {/* Additional user details */}
        <div className='userItem-right'>
          <h3>{user.name}</h3>
        </div>
      </div>
    );
  }

  function Sidebar() {
    return (
      <div className="sidebar">
        <button className='button' onClick={() => setSelectedOption('otherUsers')}>Other Users</button>
        <button className='button' onClick={() => setSelectedOption('friendRequests')}>Pending Friend Requests</button>
        <button className='button' onClick={() => setSelectedOption('yourFriends')}>Your friends</button>
      </div>
    );
  }

  async function add_dummy(){
    if (friendshipPlatform) {
      try {
        const result = await friendshipPlatform.methods.addDummyUsers(["Dummy User 1", "Dummy User 2", "Dummy User 3"], ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222", "0x3333333333333333333333333333333333333333"]).send({ from: accounts[0] });
        setResult(result);
        //userData.name = "desimir";
        console.log(result)
        //console.log(libraryContract);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function register(_name){
    if (friendshipPlatform) {
      try {
        const result = await friendshipPlatform.methods.register_new_user(_name).send({ from: accounts[0] });
        setResult(result);
        const user = {
        id: result.id,
        name: result.name,
        profilePicture: 'url-for-user-profile-picture',
        address: accounts[0]
      };
        setUserData(user);
        
        //userData.name = "desimir";
        console.log("register")
        console.log(result)
        //console.log(libraryContract);
      } catch (error) {
        console.error(error);
      }
    }
  }
async function get_all_users() {
  if (friendshipPlatform) {
    try {
      const result = await friendshipPlatform.methods.get_all_users().call({ from: accounts[0] });
      setResult(result);
      console.log(result);
      const users = result
        .filter((user) => user.my_address !== accounts[0]) // Exclude user with your address
        .map((user) => ({
          id: user.id,
          name: user.name,
          profilePicture: 'url-for-user-profile-picture',
          address: user.my_address
        }));

      const my_user = result.find((user)=>user.my_address == accounts[0]);

      // Update the otherUsersData state
      setOtherUsersData(users);

      setUserData({
        id: my_user.id,
        name: my_user.name,
        profilePicture: 'url-for-user-profile-picture',
        address: my_user.my_address
      })
    } catch (error) {
      console.error(error);
    }
  }
}

async function get_my_user(){
  if (friendshipPlatform) {
    try {
      const result = await friendshipPlatform.methods.get_all_users().call({ from: accounts[0] });
      setResult(result);
      const my_user = result.find((user)=>user.my_address == accounts[0]);
      console.log(my_user);

      const pendingRequestsData = [];
      const friendsListdata = []

      if (my_user && my_user.friend_requests_list) {
        my_user.friend_requests_list.forEach(async (friendRequest) => {
          const result = await friendshipPlatform.methods.users(friendRequest).call({ from: accounts[0] });
          //here is data about friend on address friendRequest

          const pendingRequest = {
            id: result.id,
            senderName: result.name,
            senderProfilePicture: 'url-for-sender-profile-picture',
            address: result.my_address
          };

          // Push the pending request to the array
          pendingRequestsData.push(pendingRequest);
        });
      }
      if (my_user && my_user.friends_list) {
        my_user.friends_list.forEach(async (friend) => {
          const result = await friendshipPlatform.methods.users(friend).call({ from: accounts[0] });
          //here is data about friend on address friendRequest

          const friend_inst = {
            id: result.id,
            name: result.name,
            senderProfilePicture: 'url-for-sender-profile-picture',
            address: result.my_address
          };

          // Push the pending request to the array
          friendsListdata.push(friend_inst);
        });
      }

      setPendingRequestsData(pendingRequestsData);
      setFriendsList(friendsListdata);
    } catch (error) {
      console.error(error);
    }
  }
}

async function send_friend_request(address){
  if (friendshipPlatform) {
    try {
      const result = await friendshipPlatform.methods.send_request(address).send({ from: accounts[0] });
      setResult(result);
      console.log(result);
      get_my_user();
      //setFriendshipPlatform(my_user.friend_requests_list);
      //console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

async function accept_request(address){
  if (friendshipPlatform) {
    try {
      const result = await friendshipPlatform.methods.accept_request(address).send({ from: accounts[0] });
      setResult(result);
      console.log(result);
      get_my_user();
      //setFriendshipPlatform(my_user.friend_requests_list);
      //console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

async function decline_request(address){
  if (friendshipPlatform) {
    try {
      const result = await friendshipPlatform.methods.decline_request(address).send({ from: accounts[0] });
      setResult(result);
      console.log(result);
      get_my_user();
      //setFriendshipPlatform(my_user.friend_requests_list);
      //console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}
  
function OtherUsers() {
  const excludedAddresses = [
    ...friendsList.map((friend) => friend.address),
    ...pendingRequestsData.map((request) => request.address),
  ];

  // Filter the otherUsersData to exclude friends and pending request senders
  const filteredUsersData = otherUsersData.filter(
    (user) => !excludedAddresses.includes(user.address)
  );
  return (
    <div>
      <h2 style={{ marginTop: '5px' }}>Other Users</h2>
      {filteredUsersData.length > 0 ? (
        filteredUsersData.map((user) => <UserItem key={user.id} user={user} />)
      ) : (
        <p>No other users found.</p>
      )}
    </div>
  );
}

function YourFriends() {
  return (
    <div>
      <h2 style={{ marginTop: '5px' }}>Your Friends</h2>
      {friendsList.length > 0 ? (
        friendsList.map((user) => <FriendItem key={user.id} user={user} />)
      ) : (
        <p>You have no friends, yet.</p>
      )}
    </div>
  );
}

let selectedSection;
if (selectedOption === 'otherUsers') {
  selectedSection = <OtherUsers />;
} else if (selectedOption === 'friendRequests') {
  selectedSection = <FriendRequests />;
} else if (selectedOption === 'yourFriends'){
  selectedSection = <YourFriends />
}

  return (
    <div className="App">
      <header>
      </header>
      <body>
        {/* <form></form>
        <button onClick={register}>register</button>
        <button onClick={add_dummy}>add_dummy</button>
        <button onClick={get_all_users}>read_all</button>
        <button onClick={get_my_user}>read me</button> */}
        <div className='navbar'>
          <div className='section'>{UserInfo()}</div>
        </div>
        <div className='wrap-container'>
          
          <div className='container'>
              <div style={{display: 'flex'}}><Sidebar /></div>
              <div className='section'>
                {selectedSection}
              </div>
            
          </div>
          
          </div>
          </body>
    </div>
    
  );
}

export default App;
