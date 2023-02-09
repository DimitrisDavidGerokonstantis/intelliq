//const express = require('express');
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

//create new questionnaire
app.post('/insert', (request, response) => {
    const { title, keyword } = request.body;
  //  console.log('title', title);
    var len;
    if(title == ' ') {len = true; response.status(400).send('Bad request');}
    else{
        len = false;
   // console.log(len);
    const db = dbService.getDbServiceInstance();
   // console.log(title);
    const result = db.insertNewQuestionnaire(title, keyword);
   // const message = result.id;
   // request.locals.message = message;
  //  console.log(result);
   // console.log(result.keyword);
    result
    .then(data => status(data, len))
    .catch(err => console.log(err));
   }
    function status(data, len){
        // console.log(data.length);
         if(len==true)response.status(400).send('Bad request');
         else response.status(200).json({data : data});
     }
});

//show all questionnaires
app.get('/getAllQuestionnaires', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllSurveys();
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

//create new question
app.post('/addQuestion', (request, response) => {
    const { title, answers_array, times, checkbox, qtype, category} = request.body;
    var len;
    if(title == ' ') len = true;
    else len = false;
    const db = dbService.getDbServiceInstance();
    //console.log('times');console.log(times);
  //  console.log('request.body');console.log(request.body);
   // console.log(request.message);
  //  const message = request.locals;
    const result = db.insertNewQuestion(title, answers_array, times, checkbox, qtype, category);
    
    result
    .then(data => status(data, len))
    .catch(err => console.log(err));

    function status(data, len){
        // console.log(data.length);
         if(len==true)response.status(400).send('Bad request');
         else response.status(200).json({data : data});
     }
});


//show survey's summary
app.get('/getSurveysSummary', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getSurveysSummary();
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

app.patch('/updateFlow', (request, response) => {
    const { flow_array, help_array, flow_counter } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateFlow(flow_array, help_array, flow_counter);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});


//answer survey
app.get('/answer_survey/:sesID/:surID', (request, response) => {
    const survID  = request.params.surID;
    const sessID  = request.params.sesID;
    const db = dbService.getDbServiceInstance();
    const result = db.getRequestedSurvey(survID,sessID);
    
    result
    .then(data => status(data))
    .catch(err => console.log(err));
    

    function status(data){
        //console.log(data);
        if(data.length==0)response.status(404).send('Not Found');
        else response.status(200).json({data : data});
    }
    
});

//answer survey
app.post('/create_session/:value', (request, response) => {
    const surveyID  = request.params.value;
    const db = dbService.getDbServiceInstance();
    const result = db.createNewSession(surveyID);
    
    result
    .then(data => status(data))
    .catch(err => console.log(err));
    

    function status(data){
        //console.log(data.length);
        if(data.length==0)response.status(400).send('Bad Request');
        else response.status(200).json({data : data});
    }
});


app.get('/next_question/:option/:sessionID', (request, response) => {
    const opt  = request.params.option;
    const sessionID  = request.params.sessionID
    const db = dbService.getDbServiceInstance();
    const result = db.getNextQuestion(opt,sessionID);
    
    result
    .then(data => status(data))
    .catch(err => console.log(err));
    

    function status(data){
        //console.log(data.length);
        if(data.length==0)response.status(404).send('Not Found');
        else response.status(200).json({data : data});
    }
});


//save new value
app.post('/save_value', (request, response) => {
    const { button_value} = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.Save_new_value(button_value);
    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});

//save new value
app.post('/doanswer/:questionnaireID/:questionID/:session/:optionID', (request, response) => {
   // const surveyID  = request.params.questionnaireID;
   // const questionID  = request.params.questionID;
    const sessionID  = request.params.session;
    //console.log('session',sessionID);
    
    const optionID  = request.params.optionID;
    //console.log('option',optionID);
    const db = dbService.getDbServiceInstance();
    const result = db.SaveGivenAnswer(sessionID,optionID);
    result
    .then(data => status(data))
    .catch(err => console.log(err));
    

    function status(data){
        //console.log(data);
        if(data.length==0)response.status(400).send('Bad Request');
        else response.status(200).json({data : data});
    }

});

app.get('/login/:email/:pass', (request, response) => {
    const email  = request.params.email;
    const password  = request.params.pass;
    const db = dbService.getDbServiceInstance();
    const result = db.checkCredentials(email,password);

    result
    .then(data => status(data))
    .catch(err => console.log(err));
    

    function status(data){
       // console.log(data.length);
        if(data.length==0)response.status(404).send('Not Found');
        else response.status(200).json({data : data});
    }
    
});

app.get('/getsessionanswers/:questionnaireID/:session', (request, response) => {
    const sessionID  = request.params.session;
    const questionnaireID  = request.params.questionnaireID;
    const db = dbService.getDbServiceInstance();
    const result = db.getSummary(sessionID, questionnaireID);
    
    result
    .then(data => status(data))
    .catch(err => console.log(err));
    

    function status(data){
       // console.log(data.length);
        if(data.length==0)response.status(404).send('Not Found');
        else response.status(200).json({data : data});
    }
});


app.get('/getquestionanswers/:questionnaireID', (request, response) => {
    const questionnaireID  = request.params.questionnaireID;
    const db = dbService.getDbServiceInstance();
    const result = db.getSurveysQuestions(questionnaireID);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
    
});

app.get('/getquestionanswers/:questionnaireID/:questionID', (request, response) => {
    const questionID  = request.params.questionID;
    const db = dbService.getDbServiceInstance();
    const result = db.getStatistics(questionID);
    
    result
    .then(data => status(data))
    .catch(err => console.log(err));
    

    function status(data){
       // console.log(data.length);
        if(data.length==0)response.status(404).send('Not Found');
        else response.status(200).json({data : data});
    }
});

app.get('/admin/healthcheck', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getHealthcheck();
    
    result
    .then(data => response.status(200).json({data : data}))
    .catch(err => {
        response.status(400);
    });
    //console.log(result);
});

const Fs = require('fs/promises')
app.post('/admin/questionnaire_upd', (request, response) => {
    // const surveyID  = request.params.questionnaireID;
    // const questionID  = request.params.questionID;
     const {surID, surTitle,keywords,questions}  = request.body;
    console.log('app js',surID,surTitle,keywords,questions[0].options.length);
    //const json = Fs.readFile(file_content)  

     const db = dbService.getDbServiceInstance();
     const result = db.newSurveyJson(surID, surTitle,keywords,questions);
     result
     .then(data => response.json({ data: data}))
     .catch(err => console.log(err));
 });
//reset all parameters of the system
app.post('/admin/resetall', (request, response) => {
    const { button_value} = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.resetAll();
    result
    .then(data => response.status(200).json({ data: data}))
    .catch(err => {
        response.status(400);
    });
});



app.post('/admin/questionnaire_upd', (request, response) => {
    // const surveyID  = request.params.questionnaireID;
    // const questionID  = request.params.questionID;
 


     const {surID, surTitle,keywords,questions}  = request.body;
    console.log('input',surID,surTitle,keywords,questions[0].options);
    //const json = Fs.readFile(file_content)  

     const db = dbService.getDbServiceInstance();
     const result = db.newSurveyJson(surID, surTitle,keywords,questions);

     result
     .then(data => status(data))
     .catch(err => console.log(err));
     
 
     function status(data){
        // console.log(data.length);
         if(data.length==0)response.status(400).send('Bad Request');
         else response.status(200).json({data : data});
     }

 });


app.get('/getsurveydetails/:questionnaireID', (request, response) => {
    const questionnaireID  = request.params.questionnaireID;
    const db = dbService.getDbServiceInstance();
    const result = db.getSurveyDetails(questionnaireID);
    
    result
    .then(data => status(data))
    .catch(err => console.log(err));

    function status(data){
         if(data.length==0)response.status(404).send('Not Found');
         else response.status(200).json({data : data});
     }
});


app.get('/getquestiondetails/:questionID', (request, response) => {
    const questionID  = request.params.questionID;
    const db = dbService.getDbServiceInstance();
    const result = db.getQuestionDetails(questionID);
    
    result
    .then(data => status(data))
    .catch(err => console.log(err));

    function status(data){
        if(data.length==0)response.status(404).send('Not Found');
        else response.status(200).json({data : data});
    }
}); 

app.post('/admin/createUser', (request, response) => {
    // const surveyID  = request.params.questionnaireID;
    // const questionID  = request.params.questionID;
    //const json = Fs.readFile(file_content)  
  //  const username = request.params.username;
  //  const password = request.params.password;
  const {username,password} = request.body;
     const db = dbService.getDbServiceInstance();
     const result = db.createUser(username, password);
     result
     .then(data => response.json({ data: data}))
     .catch(err => console.log(err));
 });

 //reset all parameters of a questionnaire
app.post('/admin/resetq/:questionnaireID', (request, response) => {
    const surveyID = request.params.questionnaireID;
    const db = dbService.getDbServiceInstance();
    const result = db.resetQuestionnaire(surveyID);
    result
    .then(data => response.status(200).json({ data: data}))
    .catch(err => {
        response.status(400);
    });
});


//doanswer from cli
app.post('/cli/doanswer/:questionnaireID/:questionID/:session/:optionID', (request, response) => {
    // const questionID  = request.params.questionID;
     const sessionID  = request.params.session;
     console.log('session',sessionID);
     
     const optionID  = request.params.optionID;
     console.log('option',optionID);

     const surveyID  = request.params.questionnaireID;
     console.log('questionnaire',surveyID);

     const db = dbService.getDbServiceInstance();
     const result = db.CliSaveGivenAnswer(surveyID,sessionID,optionID);
     result
     .then(data => status(data))
     .catch(err => console.log(err));
     
 
     function status(data){
         //console.log(data.length);
         if(data.length==0)response.status(400).send('Bad Request');
         else response.status(200).json({data : data});
     }

 });



//doanswer from cli
app.post('/cli/doanswer/:questionnaireID/:questionID/:session/:optionID', (request, response) => {
    // const questionID  = request.params.questionID;
     const sessionID  = request.params.session;
     console.log('session',sessionID);
     
     const optionID  = request.params.optionID;
     console.log('option',optionID);

     const surveyID  = request.params.questionnaireID;
     console.log('questionnaire',surveyID);

     const db = dbService.getDbServiceInstance();
     const result = db.CliSaveGivenAnswer(surveyID,sessionID,optionID);
     result
     .then(data => response.json({ data: data}))
     .catch(err => console.log(err));
 });


let server = app.listen(5000, () => console.log('app is running'));
module.exports = server;