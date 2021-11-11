/*
Testing For Other Users
*/
const CozyHome = artifacts.require('CozyHome');
const other_address = "0x7bDD9D75Ef2e6572EC1cBd663fA6AC56a4347CA5"
const max_mintable_pre_sale = 5;


contract('CozyHome', async() => {
    let cozyHome = null;
    before(async() => {
        cozyHome = await CozyHome.deployed();
    })
    it("Get Owner of the Contract", async() => {
        const owner = await cozyHome.owner()
        console.log(owner, ' This is owner of the contract');
    })

    it("Get the wallet balance From Other Account", async() => {
        try{
            await cozyHome.getWalletBalance({from: other_address});
        } catch {
            assert(true);
            return
        }
        assert(false);
    });

    it("Transfer Contract Balance Shouldn't be able called", async() => {
        try{
            await cozyHome.transferContractBalance(
                other_address,
                30,
                {from: other_address}
            );
        } catch {
            assert(true);
            return
        }
        assert(false);
    });

    it("Change Sale State as outsider", async() => {
        try{
            await cozyHome.changeSaleState(1, {from: other_address});
        } catch{
            const sale_state = await cozyHome.saleState.call({from: other_address});
            assert(sale_state.toString() === "0");
            return
        }
        assert(false);
    });

    it("Can outsider mint it should be possible", async() => {
        const mint_collected_allowed = await cozyHome.mintCollectedAllowed(other_address, {from: other_address});
        assert(mint_collected_allowed === true);
    });

    it("How many outsider can purchase should be okay", async() => {
        const test_number_of_collectable = await cozyHome.numberOfMintable(other_address, 10, {from: other_address});
        assert.equal(test_number_of_collectable, max_mintable_pre_sale);

        const test_number_of_collectable2 = await cozyHome.numberOfMintable(other_address, 2, {from: other_address});
        assert.equal(test_number_of_collectable2, 2);

        const test_number_of_collectable3 = await cozyHome.numberOfMintable(other_address, 1, {from: other_address});
        assert.equal(test_number_of_collectable3, 1);

        const test_number_of_collectable4 = await cozyHome.numberOfMintable(other_address, 0, {from: other_address});
        assert.equal(test_number_of_collectable4, 0);

        const test_number_of_collectable5 = await cozyHome.numberOfMintable(other_address, 3, {from: other_address});
        assert.equal(test_number_of_collectable5, 3);
    } )

    it("Number of collected equals 0 since nothing collected", async() => {
        const number_of_collected = await cozyHome.getNumberOfCollected(other_address, {from: other_address});
        assert.equal(number_of_collected, 0);
    });
})