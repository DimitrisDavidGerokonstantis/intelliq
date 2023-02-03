const chaiExec = require("@jsdevtools/chai-exec");
const chai = require("chai");
let chaiHttp = require('chai-http');

chai.use(chaiExec);

describe("My CLI", () => {
  it("should exit with a 200 exit code", () => {
    // Run your CLI
    let myCLI = chaiExec('healthcheck');

    // Should syntax
    myCLI.should.exit.with.code(200);
  });
});