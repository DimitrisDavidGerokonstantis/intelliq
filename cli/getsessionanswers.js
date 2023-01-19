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
let questionnaire_id = argv.questionnaire_id;
let session_id = argv.session_id;


if(((process.argv.length - 2)/2) != 2){
  console.log('Some arguments missing. Use --help argument to check the documentation of the command');

}
else{
    
let url = `http://localhost:5000/getsessionanswers/${questionnaire_id}/${session_id}`;

axios.get(url,{

})
.then((response) => {
    let answers = JSON.stringify(response.data).slice(9,-2);
    console.log(answers);
})
.catch(err => {
    console.log(err);
})
}