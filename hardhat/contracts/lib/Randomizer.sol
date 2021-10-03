pragma solidity ^0.5.0;

interface Randomizer {
   function returnValue() external view returns(bytes32);
}