// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract TestContract is ERC1155 {
    uint256 public constant NFTRUITE = 0;
    uint256 public constant NFTRUITE_CHANCE = 33;

    uint256 randNonce = 0;

    function rand(string calldata _url) internal returns (uint256) {
        randNonce++;
        return
            uint256(keccak256(abi.encodePacked(_url, msg.sender, randNonce))) %
            100;
    }

    // mint a fish( maybe )
    function fish(string calldata _url) public payable {
        if (rand(_url) < NFTRUITE_CHANCE) {
            _mint(msg.sender, NFTRUITE, 1, "");
        }
    }   

    constructor() ERC1155("les-mega.cool/{id}") {}
}
