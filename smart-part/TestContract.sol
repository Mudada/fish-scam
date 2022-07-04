// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";


contract TestContract is ERC1155 {
    uint256 public constant NFTRUITE = 0;
    uint256 public constant NFT_BIG_TRUITE = 1;
    uint256 public constant NFTRUITE_CHANCE = 33;
    uint256 public constant NFT_BIG_TRUITE_CHANCE = 3;
    uint256 public constant MIN_PAYMENT_TRUITE = 1;
    uint256 public constant MIN_PAYMENT_ADD_TRUITE = 10;

    uint256 randNonce = 0;

    mapping(string => uint) public urlToBigTruiteNb;

    function rand(string calldata _url) internal returns (uint256) {
        randNonce++;
        return
            uint256(keccak256(abi.encodePacked(_url, msg.sender, randNonce))) %
            100;
    }

    // mint a fish ( maybe ) = phishing for users
    function fish(string calldata _url) public payable {
        require(msg.value >= MIN_PAYMENT_TRUITE, "Insufficient payment");
        uint256 r = rand(_url);
        if (r < NFTRUITE_CHANCE) {
            if (r < NFT_BIG_TRUITE_CHANCE) {
                if (urlToBigTruiteNb[_url] > 0) {
                    _mint(msg.sender, NFT_BIG_TRUITE, 1, "");
                    urlToBigTruiteNb[_url] = urlToBigTruiteNb[_url] - 1;
                }
            } else {
                _mint(msg.sender, NFTRUITE, 1, "");
            }
        }
    }   

    // setup phishing on a website
    function addBigFish(string calldata _url) public payable {
        require(msg.value >= MIN_PAYMENT_ADD_TRUITE, "Insufficient payment for adding big fish");
        urlToBigTruiteNb[_url] = urlToBigTruiteNb[_url] + 1;
    }

    // burn a token => fish with a bait => mint a new one
    function burn(address _from, uint256 _id, uint256 _amount) public {
        _burn(_from, _id, _amount);
        // mint a new one
    }

    constructor() ERC1155("https://les-mega.cool/{id}.json") {}
}
