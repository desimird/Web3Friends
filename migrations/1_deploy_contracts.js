const FriendshipPlatform = artifacts.require("FriendshipPlatform");

module.exports = function(deployer) {
  deployer.deploy(FriendshipPlatform);
};
