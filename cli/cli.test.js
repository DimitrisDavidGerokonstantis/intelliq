const chaiExec = require("@jsdevtools/chai-exec");
const chai = require("chai");
let chaiHttp = require('chai-http');

chai.use(chaiExec);

describe("CLI_Testing", () => {

  it("Upload a json file with a new questionnaire with id=100 : \n\t COMMAND : questionnaire_upd --source example4.json", () => {
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


  it("Get all given answers in a specific question of a specific questionnaire. \n\tCOMMAND : getquestionanswers --questionnaire_id 60 --question_id 300 --format json", () => {
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

});