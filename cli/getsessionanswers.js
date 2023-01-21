#! /usr/bin/env node

const yargs = require('yargs');
const axios = require('axios').default;



yargs.command(
    'getsessionanswers', // Command name, plus a positional argument message
    'Get all questions΄ answers in a given session', // Command description for --help  
     );

 yargs.positional('questionnaire_id', { describe: 'Identifier of the questionnaire'});
 yargs.positional('session_id', { describe: 'Identifier of the session'});      
 yargs.positional('format', { describe: 'Define the format of the result (json or csv)'});   

let argv = yargs.argv;
let questionnaire_id = argv.questionnaire_id;
let session_id = argv.session_id;
let format = argv.format;


if(((process.argv.length - 2)/2) != 3){
  console.log('Some arguments missing. Use --help argument to check the documentation of the command');

}
else{
    
let url = `http://localhost:5000/getsessionanswers/${questionnaire_id}/${session_id}`;

axios.get(url,{

})
.then((response) => {
    let answers = JSON.stringify(response.data).slice(9,-2);
    const csvString = [
        [
          "Question_Title",
          "Questionnaire_ID",
          "Answer_Title"
        ],
        ...(response.data.data).map(item => [
          item.quetitle,
          item.quesid,
          item.anstitle
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