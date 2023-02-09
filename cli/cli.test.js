const chaiExec = require("@jsdevtools/chai-exec");
const chai = require("chai");
let chaiHttp = require('chai-http');

chai.use(chaiExec);

describe("CLI_Testing", () => {

  it("Upload a json file with a new questionnaire with id=100 :\n\t COMMAND : questionnaire_upd --source example4.json", () => {
    // Run your CLI
    let myCLI = chaiExec('questionnaire_upd --source example4.json');

    // Should syntax
 // Should syntax
   
   chai.expect(myCLI.exitCode).to.equal(200); 

  });

  it("Post the answerID of a specific question of a questionnaire in a given session. \n\t COMMAND : doanswer --questionnaire_id 100 --question_id 101 --session_id LOVE --option_id 102", () => {
    // Run your CLI
    let myCLI = chaiExec('doanswer --questionnaire_id 100 --question_id 101 --session_id LOVE --option_id 102');

    // Should syntax
 // Should syntax
   
   chai.expect(myCLI.exitCode).to.equal(200); 

  });


  it("Get all given answers in a specific question of a specific questionnaire. \n\tCOMMAND : getquestionanswers --questionnaire_id 100 --question_id 300 --format json", () => {
    // Run your CLI
    let myCLI = chaiExec('getquestionanswers --questionnaire_id 100 --question_id 101 --format json');

 // Should syntax
   
   chai.expect(myCLI.exitCode).to.equal(200); 


  });



  it("Get all questions΄ answers in a given session. \n\tCOMMAND : getsessionanswers --questionnaire_id 100 --session_id LOVE --format json", () => {
    // Run your CLI
    let myCLI = chaiExec('getsessionanswers --questionnaire_id 100 --session_id LOVE --format json');

 // Should syntax
   
   chai.expect(myCLI.exitCode).to.equal(200); 

  });

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

  it("Show all questions of a specific questionnaire \n\tCOMMAND: questionnaire --questionnaire_id 100 --format json", () => {
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
