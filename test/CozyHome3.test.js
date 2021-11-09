/* 
Owner Related Wallet Interactions
*/

const CozyHome = artifacts.require('CozyHome');
const recipient_address = "0xc1cE8F9e4F70A10C30c7827F014c735eb25477ad"

contract('CozyHome', async() => {
    let cozyHome = null;
    before(async() => {
        cozyHome = await CozyHome.deployed();
    })

    it("Get the wallet balance as an owner", async() => {
        const wallet_balance = await cozyHome.getWalletBalance();
        assert.equal(wallet_balance, 0);
    });

    it("Send amount from wallet to owner", async() => {
        try{
            const sendable_amount = await cozyHome.transferContractBalance(recipient_address, 30);

        } catch(e){
            assert(e.message.includes("Not enough balance to send!"));
        }
    })  
})