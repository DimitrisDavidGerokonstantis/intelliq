#! /usr/bin/env node

const yargs = require('yargs');
const axios = require('axios').default;




yargs.command(
    'getsessionanswers', // Command name, plus a positional argument message
    'Get all questions΄ answers in a given session', // Command description for --help  
     );

 yargs.positional('questionnaire_id', { describe: 'Identifier of the questionnaire'});
 yargs.positional('session_id', { describe: 'Identifier of the session'});      


let argv = yargs.argv;
let source = argv.source;



const fs = require("fs");
fs.readFile(source, "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file from disk:", err);
    return;
  }
  try {
    let url = `http://localhost:5000/admin/questionnaire_upd`;
    const customer = JSON.parse(jsonString);
    axios.post(url, {
    surID : customer.questionnaireID, 
    surTitle : customer.questionnaireTitle,
    keywords :customer.keywords,
    questions :customer.questions
})
 .then((response)=> {
      console.log('Survey Added') 
  })
  .catch((error)=> {
      console.log('Error on adding the new questionnaire. This questionnaire may have already been added or the server does not work properly');
  })
   // console.log(customer.questions); // => "Customer address is: Infinity Loop Drive"
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});