const FriendshipPlatform = artifacts.require("FriendshipPlatform");

contract("FriendshipPlatform", function (accounts) {
  let friendshipPlatform;

  before(async () => {
    friendshipPlatform = await FriendshipPlatform.deployed();
  });

  it("should register a new user", async () => {
    const name = "Alice";
    const userCountBefore = await friendshipPlatform.get_user_count();

    await friendshipPlatform.register_new_user(name);

    const userCountAfter = await friendshipPlatform.get_user_count();
    const user = await friendshipPlatform.users(accounts[0]);

    assert.equal(userCountAfter.toNumber(), userCountBefore.toNumber() + 1, "User count not incremented");
    assert.equal(user.name, name, "User name not set correctly");
    assert.equal(user.my_address, accounts[0], "User address not set correctly");
  });

  it("should send and accept a friend request", async () => {
    const sender = accounts[0];
    const receiver = accounts[1];

    await friendshipPlatform.register_new_user("Alice", ({from: accounts[0]}));
    await friendshipPlatform.register_new_user("Bob", ({from: accounts[1]}));

    await friendshipPlatform.send_request(receiver, ({from: accounts[0]}));

    const allUsers = await friendshipPlatform.get_all_users();
    const user1Before = allUsers.find(user => user.my_address == sender);
    const user2Before = allUsers.find(user => user.my_address == receiver);

    assert.include(user2Before.friend_requests_list, sender, "Friend request not sent");

    await friendshipPlatform.accept_request(sender, ({from: accounts[1]}));

    const allUsersAfter = await friendshipPlatform.get_all_users();
    const user1After = allUsersAfter.find(user => user.my_address == sender);
    const user2After = allUsersAfter.find(user => user.my_address == receiver);

    assert.include(user1After.friends_list, receiver, "Friend request not accepted");
    assert.include(user2After.friends_list, sender, "Friend request not accepted");
    assert.notInclude(user2After.friend_requests_list, sender, "Friend request not removed");
  });

  it("should decline a friend request", async () => {
    const sender = accounts[0];
    const receiver = accounts[1];

    await friendshipPlatform.register_new_user("Alice", ({from: accounts[0]}));
    await friendshipPlatform.register_new_user("Bob", ({from: accounts[1]}));

    await friendshipPlatform.send_request(receiver, ({from: accounts[0]}));

    const allUsers = await friendshipPlatform.get_all_users();
    const user1Before = allUsers.find(user => user.my_address == sender);
    const user2Before = allUsers.find(user => user.my_address == receiver);

    assert.include(user2Before.friend_requests_list, sender, "Friend request not sent");

    await friendshipPlatform.decline_request(sender, ({from: accounts[1]}));

    const allUsersAfter = await friendshipPlatform.get_all_users();
    const user1After = allUsersAfter.find(user => user.my_address == sender);
    const user2After = allUsersAfter.find(user => user.my_address == receiver);
    
    assert.notInclude(user2After.friend_requests_list, sender, "Friend request not declined");
  });


});
