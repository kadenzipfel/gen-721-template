pragma solidity ^0.5.0;

import "./lib/Ownable.sol";
import "./lib/CustomERC721Metadata.sol";
import "./lib/SafeMath.sol";
import "./lib/Strings.sol";

contract Gen721 is CustomERC721Metadata, Ownable {
    using SafeMath for uint256;

    // Mint price of 0.05 eth
    uint public MINT_PRICE = 5*10**16;
    // Max supply of 500 tokens
    uint public MAX_SUPPLY = 500;
    string baseIpfsUri;
    uint public nextTokenId = 0;
    mapping(uint => bytes32) tokenIdToHash;

    constructor(string memory _tokenName, string memory _tokenSymbol, string memory _baseIpfsUri) CustomERC721Metadata(_tokenName, _tokenSymbol) public {
        baseIpfsUri = _baseIpfsUri;
    }

    function mint(uint amount) external payable {
        require(totalSupply().add(amount) <= MAX_SUPPLY, "exceeds max supply");
        require(msg.value >= MINT_PRICE.mul(amount), "insufficient value");

        for (uint i = 0; i < amount; i++) {
            _mintToken();
        }
    }

    function _mintToken() internal {
        uint tokenIdToBe = nextTokenId;
        nextTokenId++;

        bytes32 hash = keccak256(abi.encodePacked(tokenIdToBe, block.number, blockhash(block.number - 1), msg.sender));

        tokenIdToHash[tokenIdToBe] = hash;

        _mint(msg.sender, tokenIdToBe);
    }

    function updateBaseIpfsUri(string memory _newBaseIpfsUri) public onlyOwner {
        baseIpfsUri = _newBaseIpfsUri;
    }

    function tokenURI(uint _tokenId) external view returns (string memory) {
        return Strings.strConcat(baseIpfsUri, bytes32ToString(tokenIdToHash[_tokenId]));
    }

    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
}   