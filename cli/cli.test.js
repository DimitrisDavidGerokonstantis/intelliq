const chaiExec = require("@jsdevtools/chai-exec");
const chai = require("chai");
let chaiHttp = require('chai-http');

chai.use(chaiExec);

describe("CLI_Testing", () => {
  it("This command returns the current status of the server (whether it is running or not plus database info). \n\tCOMMAND : healthcheck --format json", () => {
    // Run your CLI
    let myCLI = chaiExec('healthcheck --format json');

    // Should syntax
 // Should syntax

   chai.expect(myCLI.exitCode).to.equal(200); 


  });

  it("Reset answer data of a specific questionnaire \n\tCOMMAND : resetq --questionnaire_id 60 --format json", () => {
    // Run your CLI
    let myCLI = chaiExec('resetq --questionnaire_id 60 --format json');

    // Should syntax
 // Should syntax

   chai.expect(myCLI.exitCode).to.equal(200); 


  });

  it("Show all questions of a specific questionnaire \n\tCOMMAND: questionnaire --questionnaire_id 60 --format json", () => {
    // Run your CLI
    let myCLI = chaiExec('questionnaire --questionnaire_id 60 --format json');

   chai.expect(myCLI.exitCode).to.equal(200); 

  });



    it("Show all answers of a specific question of a questionnaire \n\tCOMMAND: question --questionnaire_id 60 --question_id 300 --format json", () => {
      // Run your CLI
      let myCLI = chaiExec('question --questionnaire_id 60 --question_id 300 --format json');
  
     chai.expect(myCLI.exitCode).to.equal(200); 
  
    });

  it("Reset all data of our database \n\tCOMMAND: resetall --format json", () => {
    // Run your CLI
    let myCLI = chaiExec('resetall --format json');

    // Should syntax
 // Should syntax

   chai.expect(myCLI.exitCode).to.equal(200); 


  });
}); 