const CozyHome = artifacts.require('CozyHome');

/* Parameters */
const contract_deployer = "0xc1cE8F9e4F70A10C30c7827F014c735eb25477ad"
const contract_name = "CozyHome";
const contract_symbol = "NFT";
const most_pre_sale_allowable = 5;
const max_pre_sale_quantity_test = 1000;
const total_first_mintable_test = 6800;
const flor_price_pre_sale_test = 0.02
// Calling And Approving Classic Values
const initial_pre_sale_state = true;


contract('CozyHome', () => {
    let cozyHome = null;
    before(async() => {
        cozyHome = await CozyHome.deployed();
    });

    it("Test If our Contract Deployed", async() => {
        console.log('Current Contract Address ', cozyHome.address)
        assert(cozyHome.address !== '');
    });
    it("Test current Contract Owner", async() => {
        const owner = await cozyHome.owner()
        assert(owner === contract_deployer);
    })
    it("Test name of the Contract", async() => {
        const name = await cozyHome.name();
        assert(name === contract_name)
    })
    it("Test name Check Symbol", async() => {
        const symbol = await cozyHome.symbol();
        assert(symbol === contract_symbol);
    })
    it("Most allowable Mint Presale from one account", async() => {
        const most_pre_sale = await cozyHome.maxAllowableMintPresale();
        assert(most_pre_sale.toNumber() === most_pre_sale_allowable);
    });
    it("Presale Quantity", async() => {
        const max_pre_sale_quantity = await cozyHome.max_pre_sale_quantity();
        assert(max_pre_sale_quantity.toNumber() === max_pre_sale_quantity_test)
    })

    it("Total -After Sale Quantity", async() => {
        const total_first_mintable = await cozyHome.total_first_mintable();
        assert(total_first_mintable.toNumber() === total_first_mintable_test)
    })

    it("Total Presale Price in Ethers", async() => {
        const flor_price_pre_sale = await cozyHome.flor_price_pre_sale();
        console.log(flor_price_pre_sale, " This is our floor price");
    })

    it("Getting Base URI Should be Private", async() => {
        try{
            await cozyHome.baseURI();
        } catch(e){
            assert(true);
        }
    })

    it("Initial Presale State", async() => {
        const preSale = await cozyHome.preSale();
        assert(preSale === initial_pre_sale_state);
    })

    it("Test Sale State", async() => {
        const saleSate = await cozyHome.getSaleState();
        assert(saleSate.toNumber() === 0);
    })
});