const CozyHome = artifacts.require('CozyHome');

/* Parameters and Cases */
const new_pre_sale_state_test = true;


contract('CozyHome', async() => {
    let cozyHome = null;
    before(async() => {
        cozyHome = await CozyHome.deployed();
    })

    it("Test Changing PreSale State", async() => {
        const new_pre_sale_state = cozyHome.changePreSaleState(new_pre_sale_state_test);
        assert(new_pre_sale_state_test === new_pre_sale_state);
    })
})

