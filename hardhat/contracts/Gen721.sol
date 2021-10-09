pragma solidity ^0.5.0;

import "./lib/Ownable.sol";
import "./lib/CustomERC721Metadata.sol";
import "./lib/SafeMath.sol";
import "./lib/Strings.sol";

contract Gen721 is CustomERC721Metadata, Ownable {
    using SafeMath for uint256;

    uint public mintPrice;
    uint public maxSupply;
    uint public maxPerUser;
    string public baseIpfsUri;
    uint public nextTokenId = 0;
    mapping(uint => bytes32) public tokenIdToHash;
    mapping(bytes32 => uint) public hashToTokenId;

    constructor(
        string memory _tokenName, 
        string memory _tokenSymbol, 
        string memory _baseIpfsUri, 
        uint _mintPrice,
        uint _maxSupply,
        uint _maxPerUser
    ) CustomERC721Metadata(_tokenName, _tokenSymbol) public {
        baseIpfsUri = _baseIpfsUri;
        mintPrice = _mintPrice;
        maxSupply = _maxSupply;
        maxPerUser = _maxPerUser;
    }

    function mint(uint amount) external payable {
        require(totalSupply().add(amount) <= maxSupply, "exceeds max supply");
        require(msg.value >= mintPrice.mul(amount), "insufficient value");
        require(balanceOf(msg.sender).add(amount) <= maxPerUser, "exceeds max per user");

        for (uint i = 0; i < amount; i++) {
            _mintToken();
        }
    }

    function _mintToken() internal {
        uint tokenIdToBe = nextTokenId;
        nextTokenId++;

        bytes32 hash = keccak256(abi.encodePacked(tokenIdToBe, block.number, blockhash(block.number - 1), msg.sender));

        tokenIdToHash[tokenIdToBe] = hash;
        hashToTokenId[hash] = tokenIdToBe;

        _mint(msg.sender, tokenIdToBe);
    }

    function updateBaseIpfsUri(string memory _newBaseIpfsUri) public onlyOwner {
        baseIpfsUri = _newBaseIpfsUri;
    }

    function tokenURI(uint _tokenId) external view returns (string memory) {
        return Strings.strConcat(baseIpfsUri, Strings.uint2str(_tokenId));
    }

    function withdraw() public onlyOwner {
        address payable sender = address(msg.sender);
        require(sender.send(address(this).balance));
    }
}   