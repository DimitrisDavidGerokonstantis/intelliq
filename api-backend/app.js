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
app.get('/answer_survey', (request, response) => {
    //const {  } = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.getRequestedSurvey();
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});


//create new session
app.post('/save_session', (request, response) => {
    const { button_value} = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.insertNewSession(button_value);
    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});

app.listen(5000, () => console.log('app is running'));