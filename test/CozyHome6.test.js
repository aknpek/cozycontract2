/* 
BASE URI tests
*/
const CozyHome = artifacts.require("CozyHome");

const example_base_url = "example";
const other_account = "0x7bDD9D75Ef2e6572EC1cBd663fA6AC56a4347CA5";

contract("CozyHome", async () => {
  let cozyHome = null;
  before(async () => {
    cozyHome = await CozyHome.deployed();
  });

  it("Set Base URI as Owner", async () => {
    try {
      await cozyHome.setBaseURI(example_base_url);
    } catch {
      assert(false);
      return;
    }
    assert(true);
  });

  it("Get Base URI after setting as owner", async () => {
    try {
      const new_base_uri = await cozyHome.getBaseURI();
      assert(new_base_uri === example_base_url);
    } catch {
      assert(false);
      return;
    }
  });

  it("Try to set BASE URI as foreigner", async () => {
    try {
      await cozyHome.setBaseURI(example_base_url, { from: other_account });
    } catch {
      assert(true);
      return;
    }
    assert(false);
  });

  it("Try to get BASE URI as foreigner", async () => {
    try {
      const base_uri = await cozyHome.getBaseURI({ from: other_account });
    } catch {
      assert(true);
      return;
    }
    assert(false);
  });
});
