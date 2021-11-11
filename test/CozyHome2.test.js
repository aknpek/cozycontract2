/*
Some Basic Functionalities tested here
*/

const CozyHome = artifacts.require('CozyHome');

/* Parameters and Cases */
const new_pre_sale_state_test = true;
const new_price = "200000000000000000"; // 0.2 ether (* 10^18)
const decimals = 18;
const sendAmount = 69 * 10 ** decimals;
const converter = 10 ** decimals
const recipient_address = "0xc1cE8F9e4F70A10C30c7827F014c735eb25477ad"
const number_of_collected = 0;
const max_mintable_pre_sale = 5;


contract('CozyHome', async() => {
    let cozyHome = null;
    before(async() => {
        cozyHome = await CozyHome.deployed();
    })

    it("Test Changing PreSale State", async() => {
        await cozyHome.changePreSaleState(new_pre_sale_state_test);
        const new_pre_sale_state = await cozyHome.preSale();
        assert.equal(new_pre_sale_state_test, new_pre_sale_state);
    })

    it("Minter Add cannot be accessed", async() => {
        try{
            await cozyHome.minterAdd(1);
        }catch(e){
            assert(true);
        }
    })

    it("Change Flor Price By Owner", async() => {
        await cozyHome.changeFlorPrice(BigInt(0.2 * converter));

        const new_flor_price = await cozyHome.flor_price_pre_sale.call();
        assert.equal(new_flor_price, 0.2 * converter);
    });

    it("Since 0 sales get number of collected", async() => {
        const test_number_of_collected = await cozyHome.getNumberOfCollected(recipient_address)
        assert.equal(number_of_collected, test_number_of_collected);
    })

    it("Get number of mintable for 0 collector", async() => {
        const test_number_of_collectable = await cozyHome.numberOfMintable(recipient_address, 10);
        assert.equal(test_number_of_collectable, max_mintable_pre_sale);

        const test_number_of_collectable2 = await cozyHome.numberOfMintable(recipient_address, 2);
        assert.equal(test_number_of_collectable2, 2);

        const test_number_of_collectable3 = await cozyHome.numberOfMintable(recipient_address, 1);
        assert.equal(test_number_of_collectable3, 1);

        const test_number_of_collectable4 = await cozyHome.numberOfMintable(recipient_address, 0);
        assert.equal(test_number_of_collectable4, 0);

        const test_number_of_collectable5 = await cozyHome.numberOfMintable(recipient_address, 3);
        assert.equal(test_number_of_collectable5, 3);
    })

    it("Mint Collected Allowed or Not", async() =>{
        const true_or_false = await cozyHome.mintCollectedAllowed(recipient_address);
        assert(true_or_false === true);
    })

    it("Set Inheritance Should be private and onlyOwner", async() => {
        try{
            await cozyHome.setInheritance(recipient_address, 3);
        } catch{
            assert(true);
            return
        }
        assert(false);
    });

    it("Minter Add should be private", async() => {
        try{
            await cozyHome.minterAdd(000);
        }catch{
            assert(true);
            return
        }
        assert(false);
    })


})

