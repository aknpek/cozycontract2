pragma solidity ^0.8.2;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

struct Investors {
    address addr;
    uint256 percentage;
    string tokenId;
}

contract CozyHome is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public flor_price_pre_sale = 0.3 ether;
    uint256 public max_pre_sale_purchase = 3;
    uint256 public total_first_mintable = 6800;
    uint256 public max_pre_sale_quantity = 1000;
    uint256 public maxAllowableMintPresale = 3;
    string private baseURI =
        "https://gateway.pinata.cloud/ipfs/QmcP9hxrnC1T5ATPmq2saFeAM1ypFX9BnAswCdHB9JCjLA/";
    bool public preSale = true;

    Investors private investorsInheritance;

    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) public firstOwners;
    mapping(address => uint256[]) private mintOwners;

    enum State {
        Open,
        Closed
    }

    State public saleState = State.Open;

    /* ---------------------- Construction ---------------------- */
    constructor(uint256 _percent) payable ERC721("CozyHome", "NFT") {
        // contract owner will have the first place to set inheritence percentage
        // this number will be fixed for the contract like 0.05
        // investorsInheritance.addr = msg.sender;
        // investorsInheritance.percentage = _percent;
    }

    event Received(address, uint256);

    fallback() external payable {}

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    /*  ---------------------- Sale State Changes ----------------------  */
    function changePreSaleState(bool _status) public onlyOwner {
        preSale = _status;
    }

    function setInheritence(uint256 _buyer, uint256 _percent) private {
        investorsInheritance.addr = msg.sender;
        investorsInheritance.percentage = _percent;
    }

    function changeFlorPrice(uint256 _new_price) public onlyOwner {
        flor_price_pre_sale = _new_price;
    }

    function changeSaleState(uint256 _input) public onlyOwner {
        if (_input == 0) {
            saleState = State.Closed;
        } else {
            saleState = State.Open;
        }
    }

    function getSaleState() public view returns (State) {
        return saleState;
    }

    /* ---------------------- Mint Related Operations ---------------------- */
    function minterAdd(uint256 nftid) private {
        mintOwners[msg.sender].push(nftid);
    }

    function mintCollectedAllowed(address _recipient)
        public
        view
        returns (bool)
    {
        if (mintOwners[_recipient].length <= maxAllowableMintPresale) {
            return true;
        } else {
            return false;
        }
    }

    function getNumberOfCollected(address _recipient)
        public
        view
        returns (uint256)
    {
        return mintOwners[_recipient].length;
    }

    function numberOfMintable(address _recipient, uint256 _quantity)
        public
        view
        returns (uint256)
    {
        uint256 number_of_collected = getNumberOfCollected(_recipient);
        if ((_quantity + number_of_collected) <= maxAllowableMintPresale) {
            return (_quantity - number_of_collected);
        } else {
            if (_quantity > maxAllowableMintPresale) {
                return (maxAllowableMintPresale - number_of_collected);
            } else {
                return 0;
            }
        }
    }

    modifier saleStateCheck() {
        require(saleState == State.Open, "Sale is not started yet!");
        _;
    }

    modifier preSaleCheck() {
        require(preSale == true, "Presale is not started yet!");
        _;
    }

    /* ---------------------- NFTs Mint ---------------------- */

    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function getBaseURI() external view onlyOwner returns (string memory) {
        return baseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
        override
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        // return string(abi.encodePacked(base, tokenId.toString()));
    }

    function mintNow(address _recipient, string memory _tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(_recipient, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        firstOwners[newItemId] = payable(_recipient);
        minterAdd(newItemId);

        return newItemId;
    }

    function preSaleMint(
        address _recipient,
        string memory _tokenURI,
        uint256 _quantity
    ) public saleStateCheck preSaleCheck returns (uint256[] memory) {
        // if you have enough money?
        if (
            mintCollectedAllowed(_recipient) &&
            maxAllowableMintPresale >= _quantity
        ) {
            uint256[] memory mintedItems;
            uint256 number_of_mintable = numberOfMintable(
                _recipient,
                _quantity
            );
            for (uint256 i = 0; i < number_of_mintable; i++) {
                uint256 newItemId = mintNow(_recipient, _tokenURI);
                // mintedItems[i] = (newItemId);
                // mintedItems[i] = i;
            }
            // mintedItems[0] = 1;
            // return mintedItems;
        }
        // else {}
    }

    /* ---------------------- Wallet Finance Related ---------------------- */

    function getWalletBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    modifier sendableAmountCheck(uint256 _amount) {
        require(_amount <= getWalletBalance(), "Not enough balance to send!");
        _;
    }

    function transferContractBalance(
        address payable _recipient,
        uint256 _amount
    ) public onlyOwner sendableAmountCheck(_amount) returns (bool) {
        _recipient.transfer(_amount);
        return true;
    }
}
