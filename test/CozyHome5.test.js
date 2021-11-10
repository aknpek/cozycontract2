/* 
Send Amounts To ETH
*/
const CozyHome = artifacts.require('CozyHome');

const other_address = "0x7bDD9D75Ef2e6572EC1cBd663fA6AC56a4347CA5"
const send_amount = 10;

contract('CozyHome', async() => {
    let cozyHome = null;
    before(async() => {
        cozyHome =  await CozyHome.deployed();
    })

    it('Sender owner money to owner contract', async() => {
        await cozyHome.send(send_amount);
        const contract_balance = await cozyHome.getWalletBalance();
        assert.equal(send_amount, contract_balance.toNumber());
    })

    it('Sender other person to contract, get balance', async() => {
        await cozyHome.send(send_amount, {from: other_address});
        const contract_balance = await cozyHome.getWalletBalance();
        assert.equal(send_amount * 2, contract_balance.toNumber());
    })
})
