pragma solidity ^0.5.0;

import "./lib/Ownable.sol";
import "./lib/CustomERC721Metadata.sol";
import "./lib/SafeMath.sol";
import "./lib/Strings.sol";

contract Gen721 is CustomERC721Metadata, Ownable {
    using SafeMath for uint256;

    uint public mintPrice;
    uint public maxSupply;
    string baseIpfsUri;
    uint public nextTokenId = 0;
    mapping(uint => bytes32) tokenIdToHash;

    constructor(
        string memory _tokenName, 
        string memory _tokenSymbol, 
        string memory _baseIpfsUri, 
        uint _mintPrice,
        uint _maxSupply
    ) CustomERC721Metadata(_tokenName, _tokenSymbol) public {
        baseIpfsUri = _baseIpfsUri;
        mintPrice = _mintPrice;
        maxSupply = _maxSupply;
    }

    function mint(uint amount) external payable {
        require(totalSupply().add(amount) <= maxSupply, "exceeds max supply");
        require(msg.value >= mintPrice.mul(amount), "insufficient value");

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

    function withdraw() public onlyOwner {
        address payable sender = address(msg.sender);
        require(sender.send(address(this).balance));
    }
}   