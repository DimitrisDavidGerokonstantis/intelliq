#! /usr/bin/env node

const yargs = require('yargs');
const axios = require('axios').default;

yargs.command(
    'question', // Command name, plus a positional argument message
    'Get all questions of a specific questionnaire', // Command description for --help  
     );

yargs.positional('questionnaire_id', { describe: 'Identifier of the questionnaire'});
yargs.positional('question_id', { describe: 'Identifier of the question'});      
yargs.positional('format', { describe: 'Define the format of the result (json or csv)'});

let argv = yargs.argv;
let questionnaire_id = argv.questionnaire_id;
let question_id = argv.question_id;
let format = argv.format;

if(((process.argv.length - 2)/2) != 3){       // to be checked
    console.log('Some arguments missing. Use --help argument to check the documentation of the command');
  }

else{
  let url = `http://localhost:5000/getquestiondetails/${question_id}`;
  axios.get(url,{
    
})
.then((response) => {
    let answers = JSON.stringify(response.data).slice(9,-2);    // to be checked
    const csvString = [
        [
          "Survey_ID",
          "Question_ID",
          "Question_Title",
          "Required(0:No, 1:Yes)",
          "Question_Type(0:Survey's, 1:Profile)",
          "Answer_ID",
          "Answer_Title",
          "Next_Question_ID"
        ],
        ...(response.data.data).map(item => [
          item.surID,
          item.queID,
          item.queTitle,
          item.required,
          item.qtype,
          item.ansID,
          item.ansTitle,
          item.nextID
        ])
      ]
       .map(e => e.join(",")) 
       .join("\n");
    if(format=='json')console.log(answers);
    if(format=='csv')console.log(csvString);
    if(format!='json' && format!='csv') console.log('Unknown Format');
})
.catch(err => {
    console.log(err);
})
}