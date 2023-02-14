# CLI for our application  
We have developed a CLI tool for our application, where the user/admin can execute certain  
commands and receive return messages in JSON format. The folder also includes CLI functional  
and unit testing that verify our CLI's functionality.   

## Packages required for the CLI  
Our CLI has been implemented using node.js and specifically the following packages:  

- **axios**  
- **yargs**  

The testing for our CLI was performed using the following packages:  

- **chai**  
- **mocha**  
- **@jsdevtools/chai-exec**  

## Command format:  
For every CLI command that has been implemented, it has the following syntax:  
`$ se22XX scope --param1 value1 [--param2 value2 ...] --format fff`  
where scope is replaced with one of the commands shown below  

The format can either be json or csv. If you need help regarding a particular  
command you can run the following help command:  
`$ se22XX scope --help`  

## Available commands:  
 
CLI command  | Arguments          | Usage
------------- | ------------- | -------------
healthcheck  | format   | Perform healthcheck to the system
resetall  | format  | Reset all data of the questionnaire  
questionnaire_upd  | source, format  | Upload a JSON file with a new questionnaire  
resetq  | questionnaire_id, format  | Reset all answer data from a given questionnaire  
questionnaire  | questionnaire_id, format  | Display all questions of a specific questionnaire  
question  | questionnaire_id, question_id, format  | Display all answers of a specific question of a questionnaire  
doanswer  | questionnaire_id, question_id, session_id, option_id, format  | Answer a specific question  
getsessionanswers  | questionnaire_id, session_id, format  | Get all answers given in a specific session for a questionnaire  
getquestionanswers  | questionnaire_id, question_id, format  | Get all answers given for a specific question  

## How to perform testing:  
You can test our CLI by running the following command:  
`npm test`  
while being in the **cli** folder.
