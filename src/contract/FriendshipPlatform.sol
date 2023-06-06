// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract FriendshipPlatform{
    struct User{
        uint id;
        address my_address;
        string name;
        address[] friends_list;
        address[] friend_requests_list;

    }

    mapping(address => User) public users;
    mapping(uint => address) public id_addresses_link;
    uint user_count = 0;

    string[] dummyNames = ["Dummy User 1", "Dummy User 2", "Dummy User 3"];
    address[] dummyAddresses = [0x1111111111111111111111111111111111111111, 0x2222222222222222222222222222222222222222, 0x3333333333333333333333333333333333333333];

    


    event user_registered(address _adress);
    event request_sent(address _adress);
    event request_accepted(address _adress);
    event request_declined(address _adress);
    
    function removeValue(address[] storage array, address value) internal {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == value) {
                array[i] = array[array.length - 1]; // Swap with the last element
                array.pop(); // Reduce the array size by one
                break;
            }
        }
    }
    function checkValueNotInArray(address[] memory array, address value) internal pure returns (bool) {
    for (uint256 i = 0; i < array.length; i++) {
        if (array[i] == value) {
            return false;  // Value found in the array
        }
    }
    return true;  // Value not found in the array
}
    function get_all_users() public view returns (User[] memory) {
        User[] memory allUsers = new User[](user_count);

        for (uint i = 0; i < user_count; i++) {
            allUsers[i] = users[id_addresses_link[i]];
        }

        return allUsers;
    }

    function addDummyUsers(string[] memory names, address[] memory addresses) public {
        require(names.length == addresses.length, "Number of names and addresses should be the same");

        for (uint256 i = 0; i < names.length; i++) {
            uint id = user_count;
            user_count++;
            address[] memory emptyFriendsList;
            address[] memory emptyFriendRequestsList;
            users[addresses[i]] = User(id,addresses[i],names[i], emptyFriendsList, emptyFriendRequestsList);
            id_addresses_link[id] = addresses[i];
            //users[addresses[i]].my_address = addresses[i];
        }
    }

    function removeFriendRequest(address friend) public {
        User storage user = users[msg.sender];
        removeValue(user.friend_requests_list, friend);
    }

    function isUserExist(address userAddress) public view returns (bool) {
        User storage user = users[userAddress];
        return (user.my_address == userAddress);
}

    function register_new_user(string memory _name) public{
        if (isUserExist(msg.sender)==false) {
            uint id = user_count;
            user_count++;

            address[] memory emptyFriendsList;
            address[] memory emptyFriendRequestsList;

            users[msg.sender] = User(id,msg.sender,_name, emptyFriendsList, emptyFriendRequestsList);
            id_addresses_link[id] = msg.sender;
            emit user_registered(msg.sender);
        }
        
    }

    function send_request(address _otherUserAddr) public {
        users[_otherUserAddr].friend_requests_list.push(msg.sender);
        emit request_sent(msg.sender);
    }

    function accept_request(address _otherUserAddr) public {
        require(checkValueNotInArray(users[msg.sender].friends_list, _otherUserAddr), "You are already friends");
        removeFriendRequest(_otherUserAddr);
        users[msg.sender].friends_list.push(_otherUserAddr);
        users[_otherUserAddr].friends_list.push(msg.sender);
        emit request_accepted(_otherUserAddr);
    }

    function decline_request(address _otherUserAddr) public {
        removeFriendRequest(_otherUserAddr);
        emit request_declined(_otherUserAddr);
    }

}