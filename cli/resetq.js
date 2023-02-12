#! /usr/bin/env node

const yargs = require('yargs');
const axios = require('axios').default;


yargs.command(
  'resetq', // Command name, plus a positional argument message
  'Attention! This command deletes all info regarding the answers of one particular questionnaire', // Command description for --help  
   );

yargs.positional('questionnaire_id', { describe: 'The ID of the questionnaire'});     
yargs.positional('format', { describe: 'Define the format of the result (json or csv)'}); 

let argv = yargs.argv;
let survID = argv.questionnaire_id;
let format = argv.format;
yargs.command(
    'resetq', // Command name, plus a positional argument message
    'Attention! This command deletes all info regarding the answers of one particular questionnaire', // Command description for --help  
     );

yargs.positional('questionnaire_id', { describe: 'The ID of the questionnaire'});     
yargs.positional('format', { describe: 'Define the format of the result (json or csv)'});   

if(((process.argv.length - 2)/2) != 2){
  console.log('Some arguments missing. Use --help argument to check the documentation of the command');

}
else{
    
let url = `http://localhost:5000/admin/resetq/${survID}`;

axios.post(url,{

})
.then((response) => {
    let answers = JSON.stringify(response.data.data);
    let help_list= [];
    help_list[0] = response.data.data;
    let csvString = [];
if(response.data.data.status == 'OK'){
    csvString = [
        [
          "status"
        ],
        ...(help_list).map(item => [
          item.status
        ])
      ] 
       .map(e => e.join(",")) 
       .join("\n");  
    }
    else {
        csvString = [
            [
              "status",
              "reason"
            ],
            ...(help_list).map(item => [
              item.status,
              item.reason
            ])
          ] 
           .map(e => e.join(",")) 
           .join("\n");
    }
    if(format=='json'){
        if(response.data.data.status === 'OK')
          console.log(answers.slice(0, -13)+'}');
        else console.log(answers);
    }
    if(format=='csv')console.log(csvString);
    if(format!='json' && format!='csv') console.log('Unknown Format');
    process.exitCode = response.status;
})
.catch(err => {
  process.exitCode = 400;
    console.log(err);
})
}