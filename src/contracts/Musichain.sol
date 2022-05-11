// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
pragma experimental ABIEncoderV2;

contract Musichain{
    uint public songCount = 0;

    struct SongObj{
      uint id;
      string songHash;
      string songName;
      string songType;
    }

    mapping(uint => SongObj) public songs;

    function createSong(string memory _songHash, string memory _songName, string memory _songType) public{
        songs[songCount] = SongObj(songCount, _songHash, _songName,_songType);
        songCount ++;

    }

    function getSongCount() view public returns (uint) {
      return songCount;
    }

    function getTrip() public view returns (SongObj[] memory){
      SongObj[] memory trrips = new SongObj[](songCount);
      for (uint i = 0; i < songCount; i++) {
          SongObj storage trrip = songs[i];
          trrips[i] = trrip;
      }
      return trrips;
  }
}
