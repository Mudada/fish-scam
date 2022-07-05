// contracts/FishyScam.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Phishers are using bait to attract fishers
interface PhisherAPI {
    // add a fiosh on a defined url
    function addBigFish(string calldata _url) external payable;

    // add a big big fish on an url
    function addPaSquale(string calldata _url) external payable;
}

// Fishers are actually the bottom of the foodchain
// They feed their ETH to everyone above
interface FishedFisherAPI {
    // go phishing
    // maybe earn a token, most likely wont
    function fish(string calldata _url) external payable;

    // sacrifice phish to OpenPoseidong for bigger fishes maybe
    function burn(
        address _from,
        uint256 _id,
        uint256 _amount
    ) external;
}

// The top of the top
interface ScammerAPI {
    function getFishCount(string calldata _url) external view returns (uint256);

    function getBigFishCount(string calldata _url)
        external
        view
        returns (uint256);

    function getPaSqualeCount(string calldata _url)
        external
        view
        returns (uint256);

    function setFishMintingChance(uint256 thousandth) external;

    function setBigFishMintingChance(uint256 thousandth) external;

    function setPaSqualeMintingChance(uint256 thousandt) external;

    function simulateFishingChances(address _address, string calldata _url) external view returns (uint256);
}

contract FishyScam is ERC1155, PhisherAPI, FishedFisherAPI, ScammerAPI {
    // nfts
    uint256 public constant NFTRUITE = 0;
    uint256 public constant NFT_BIG_TRUITE = 1;
    uint256 public constant NFT_PA_SQUALE = 2;

    // probability of phishing
    uint256 internal NFTRUITE_CHANCE = 1000;
    uint256 internal NFT_BIG_TRUITE_CHANCE = 1000;
    uint256 internal NFT_PA_SQUALE_CHANCE = 1000;

    // $$$
    uint256 internal constant UNIT = 1000000000000;
    uint256 internal constant ETH_UNIT = 1000000000000000000;
    uint256 internal constant MIN_PAYMENT_TRUITE = 1;
    uint256 internal constant MIN_PAYMENT_ADD_BIG_TRUITE = 10;
    uint256 internal constant MIN_PAYMENT_ADD_PA_SQUALE = 100;

    // sacrifice system
    uint256 internal constant BURN_BONUS = 5;

    // state
    uint256 randNonce = 0;
    // fish count by url
    mapping(string => uint256) internal urlToBigTruiteNb;
    mapping(string => uint256) internal urlToTruiteNb;
    mapping(string => uint256) internal urlToPaSqualeNb;
    mapping(address => uint256) internal adressToSacrifices;

    // getters for API consumption
    function getFishCount(string calldata _url)
        public
        view
        override
        returns (uint256)
    {
        return urlToTruiteNb[_url];
    }

    function getBigFishCount(string calldata _url)
        public
        view
        override
        returns (uint256)
    {
        return urlToBigTruiteNb[_url];
    }

    function getPaSqualeCount(string calldata _url)
        public
        view
        override
        returns (uint256)
    {
        return urlToPaSqualeNb[_url];
    }

    function simulateFishingChances(address _address, string calldata _url) public view returns (uint256) {
        return applyBurnBonus(_address, randNoChange(_url));
    }

    function contractURI() public pure returns (string memory) {
        return "https://les-mega.cool/metadata";
    }

    function uri(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return
            string.concat("https://les-mega.cool/", Strings.toString(_tokenId));
    }

    // setters

    function setFishMintingChance(uint256 thousandth) public override {
        NFTRUITE_CHANCE = thousandth;
    }

    function setBigFishMintingChance(uint256 thousandth) public override {
        NFT_BIG_TRUITE_CHANCE = thousandth;
    }

    function setPaSqualeMintingChance(uint256 thousandt) public override {
        NFT_PA_SQUALE_CHANCE = thousandt;
    }

    function rand(string calldata _url) internal returns (uint256) {
        randNonce++;
        return randNoChange(_url);
    }

    function randNoChange(string calldata _url) internal view returns (uint256) {
        return
            uint256(keccak256(abi.encodePacked(_url, msg.sender, randNonce))) %
            1000;
    }

    function fish(string calldata _url) public payable override {
        require(
            msg.value >= MIN_PAYMENT_TRUITE * UNIT,
            ("Insufficient payment : min fyshing fee is a thousandth of ETH")
        );
        uint256 r = applyBurnBonus(msg.sender, rand(_url));
        bool fishedSomething = false;
        if (!fishedSomething && r > (1000 - NFT_PA_SQUALE_CHANCE) && urlToPaSqualeNb[_url] > 0) {
            _mint(msg.sender, NFT_PA_SQUALE, 1, "");
            fishedSomething = true;
            urlToPaSqualeNb[_url] -= 1;
        }
        if (!fishedSomething && r > (1000 - NFT_BIG_TRUITE_CHANCE) && urlToBigTruiteNb[_url] > 0) {
            _mint(msg.sender, NFT_BIG_TRUITE, 1, "");
            fishedSomething = true;
            urlToBigTruiteNb[_url] -= 1;
        } 
        if (!fishedSomething && r > (1000 - NFTRUITE_CHANCE)) {
            _mint(msg.sender, NFTRUITE, 1, "");
            fishedSomething = true;
        }
    }

    function applyBurnBonus(address _address, uint256 _chances) internal view returns(uint256) {
        uint256 sacrifices = adressToSacrifices[_address];
        uint256 chancesWithBonus = _chances + ( sacrifices * BURN_BONUS );
        return chancesWithBonus;
    }

    function addBigFish(string calldata _url) public payable override {
        require(
            msg.value >= MIN_PAYMENT_ADD_BIG_TRUITE * UNIT,
            string.concat(
                "Insufficient payment for adding big fish : pay at least a hundredth of an ETH"
            )
        );
        urlToBigTruiteNb[_url] = urlToBigTruiteNb[_url] + 1;
    }

    function addPaSquale(string calldata _url) public payable override {
        require(
            msg.value >= MIN_PAYMENT_ADD_PA_SQUALE * UNIT,
            string.concat(
                "A PaSquale is not some peon fish : please pay at least an ETH"
            )
        );
        urlToPaSqualeNb[_url] = urlToPaSqualeNb[_url] + 1;
    }

    function burn(
        address _from,
        uint256 _id,
        uint256 _amount
    ) public override {
        uint256 balanceBefore = balanceOf(_from, 0);
        _burn(_from, _id, _amount);
        uint256 balanceAfter = balanceOf(_from, 0);
        if (balanceAfter < balanceBefore) {
            adressToSacrifices[_from] = adressToSacrifices[_from] + _amount ;
        }
        
    }

    constructor() ERC1155("https://les-mega.cool/{id}") {}
}
