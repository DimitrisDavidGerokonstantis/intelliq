#! /usr/bin/env node

const yargs = require('yargs');
const axios = require('axios').default;


let argv = yargs.argv;
let format = argv.format;
yargs.command(
    'healthcheck', // Command name, plus a positional argument message
    'This command returns the current status of the server (whether it is running or not plus database info)', // Command description for --help  
     );

yargs.positional('format', { describe: 'Define the format of the result (json or csv)'});  

if(((process.argv.length - 2)/2) != 1){
  console.log('Some arguments missing. Use --help argument to check the documentation of the command');

}
else{
    
let url = `http://localhost:5000/admin/healthcheck`;

axios.get(url,{

})
.then((response) => {
    //console.log(response.data.data)
    let answers = JSON.stringify(response.data.data).slice(1,-1);
    const csvString = [
        [
          "status",
          "Server",
          "sqlport",
          "Database",
          "User_Id",
          "password"
        ],
        ...(response.data.data).map(item => [
          item.status,
          item.Server,
          item.sqlport,
          item.Database1,
          item.User_Id,
          item.password
        ])
      ] 
       .map(e => e.join(",")) 
       .join("\n"); 
    if(format=='json')console.log(answers);
    if(format=='csv')console.log(csvString);
    if(format!='json' && format!='csv') console.log('Unknown Format');
    process.exitCode = response.status;
})
/*.then(
  process.exitCode = 200
  ) */
.catch(err => {
  process.exitCode = 400;
    console.log(err);
})

}