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
    const db = dbService.getDbServiceInstance();
   // console.log(title);
    const result = db.insertNewQuestionnaire(title, keyword);
   // const message = result.id;
   // request.locals.message = message;
  //  console.log(result);
   // console.log(result.keyword);
    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
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
    const { title, answers_array, times, checkbox} = request.body;
    const db = dbService.getDbServiceInstance();
    //console.log('times');console.log(times);
    console.log('request.body');console.log(request.body);
   // console.log(request.message);
  //  const message = request.locals;
    const result = db.insertNewQuestion(title, answers_array, times, checkbox);
    
    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
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
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

//answer survey
app.post('/create_session/:value', (request, response) => {
    const surveyID  = request.params.value;
    const db = dbService.getDbServiceInstance();
    const result = db.createNewSession(surveyID);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});


app.get('/next_question/:option/:sessionID', (request, response) => {
    const opt  = request.params.option;
    const sessionID  = request.params.sessionID
    const db = dbService.getDbServiceInstance();
    const result = db.getNextQuestion(opt,sessionID);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
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
    console.log('session',sessionID);
    
    const optionID  = request.params.optionID;
    console.log('option',optionID);
    const db = dbService.getDbServiceInstance();
    const result = db.SaveGivenAnswer(sessionID,optionID);
    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});

app.get('/login/:email/:pass', (request, response) => {
    const email  = request.params.email;
    const password  = request.params.pass;
    const db = dbService.getDbServiceInstance();
    const result = db.checkCredentials(email,password);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
    
});

app.get('/getsessionanswers/:questionnaireID/:session', (request, response) => {
    const sessionID  = request.params.session;
    const questionnaireID  = request.params.questionnaireID;
    const db = dbService.getDbServiceInstance();
    const result = db.getSummary(sessionID, questionnaireID);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
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
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
    
});

app.get('/admin/healthcheck', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getHealthcheck();
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
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
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});



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

app.listen(5000, () => console.log('app is running'));
