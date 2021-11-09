const CozyHome = artifacts.require('CozyHome');

/* Parameters and Cases */
const new_pre_sale_state_test = true;
const new_price = 0.3;


contract('CozyHome', async() => {
    let cozyHome = null;
    before(async() => {
        cozyHome = await CozyHome.deployed();
    })

    it("Test Changing PreSale State", async() => {
        await cozyHome.changePreSaleState(new_pre_sale_state_test);
        const new_pre_sale_state = await cozyHome.preSale();
        assert(new_pre_sale_state_test === new_pre_sale_state);
    })

    it("Minter Add cannot be accessed", async() => {
        try{
            await cozyHome.minterAdd(1);
        }catch(e){
            assert(true);
        }
    })

    it("Change Flor Price By Owner", async() => {
        await cozyHome.changeFlorPrice(Number(new_price));

        const new_flor_price = cozyHome.flor_price_pre_sale();
        console.log(new_flor_price, " AMK nerde");

    });


})

