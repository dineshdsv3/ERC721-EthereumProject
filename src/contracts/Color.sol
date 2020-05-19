pragma solidity ^0.5.0;

import './ERC721.sol';

contract Color is ERC721Full {
    string[] public colors;
    mapping(string => bool) _colorExists;

constructor() ERC721Full("Color", "CARD") public {
}

    function mint(string memory _color) public {
       require(!_colorExists[_color],"color already added");
       uint _id = colors.push(_color);
       _mint(msg.sender, _id);
       _colorExists[_color] = true;
   }

}