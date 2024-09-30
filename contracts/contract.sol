// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DocumentNFT is ERC721URIStorage, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant EDITOR_ROLE = keccak256("EDITOR_ROLE");
    uint256 private _tokenIdCounter = 1;  // Start token IDs from 1 for better user experience

    struct Document {
        uint256 tokenId;
        string contentHash;
        uint256 timestamp;
        string encryptedKit;
        string metadataURI;
        bool isMinted;
    }

    mapping(uint256 => Document) public documents;

    event DocumentRegistered(uint256 indexed tokenId, string contentHash, uint256 timestamp);
    event DocumentEdited(uint256 indexed tokenId, string newContentHash);
    event NFTMinted(uint256 indexed tokenId, string metadataURI);

    constructor() ERC721("DocumentNFT", "DNFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function registerDocument(string memory contentHash, string memory encryptedKit) public onlyRole(EDITOR_ROLE) {
        uint256 newItemId = _tokenIdCounter++;
        documents[newItemId] = Document(newItemId, contentHash, block.timestamp, encryptedKit, "", false);
        emit DocumentRegistered(newItemId, contentHash, block.timestamp);
    }

    function editDocument(uint256 tokenId, string memory newContentHash) public onlyRole(EDITOR_ROLE) {
        require(documents[tokenId].tokenId != 0, "Document does not exist");
        documents[tokenId].contentHash = newContentHash;
        emit DocumentEdited(tokenId, newContentHash);
    }

    function mintNFT(uint256 tokenId, string memory tokenURI) public onlyRole(ADMIN_ROLE) {
        require(documents[tokenId].tokenId != 0, "Document does not exist");
        require(!documents[tokenId].isMinted, "NFT already minted for this document");
        documents[tokenId].metadataURI = tokenURI;
        documents[tokenId].isMinted = true;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        emit NFTMinted(tokenId, tokenURI);
    }

    function getDocument(uint256 tokenId) public view returns (Document memory) {
        require(documents[tokenId].tokenId != 0, "Document does not exist");
        return documents[tokenId];
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage, AccessControl) returns (bool) {
        return ERC721URIStorage.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
    }
}
