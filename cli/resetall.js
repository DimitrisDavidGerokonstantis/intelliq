#! /usr/bin/env node

const yargs = require('yargs');
const axios = require('axios').default;


let argv = yargs.argv;
let format = argv.format;
yargs.command(
    'resetall', // Command name, plus a positional argument message
    'Attention! This command deletes all info currently stored in the database. Everything (including questionnaires) will be lost. The only thing that remains are admin accounts. ', // Command description for --help  
     );

yargs.positional('format', { describe: 'Define the format of the result (json or csv)'});  

if(((process.argv.length - 2)/2) != 1){
  console.log('Some arguments missing. Use --help argument to check the documentation of the command');

}
else{
    
let url = `http://localhost:5000/admin/resetall`;

axios.post(url,{

})
.then((response) => {
    let answers = JSON.stringify(response.data.data);
 //   console.log(response.data.data.status);
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
})
.catch(err => {
    console.log(err);
})
}