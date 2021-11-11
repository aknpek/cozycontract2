const CozyHome = artifacts.require('CozyHome');

const sendAmount = 300000000000000000;
const number_of_mints = 1
const test_number_of_mintable = 2;


contract('CozyHome', async() => {
    let cozyHome = null;
    let cozyHomeContractOwner = null;
    before(async() => {
        cozyHome = await CozyHome.deployed();
        cozyHomeContractOwner = await cozyHome.owner.call();
    });

    it("As Owner Mint the First NFT", async() => {
        const minted_list = await cozyHome.preSaleMint(cozyHomeContractOwner,'', number_of_mints, {from: cozyHomeContractOwner, value: sendAmount});
        console.log(minted_list, "This is our Minted List");
        const get_number_of_collected = await cozyHome.getNumberOfCollected(cozyHomeContractOwner);
        assert.equal(get_number_of_collected.toNumber(), number_of_mints);
    })

    it("Number of Mintable Left", async() => {
        const number_of_mintable_left = await cozyHome.numberOfMintable(cozyHomeContractOwner, test_number_of_mintable);
        assert.equal(number_of_mintable_left, test_number_of_mintable);
    })

});