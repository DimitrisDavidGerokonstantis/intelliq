let db = require("../api-backend/dbService");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../api-backend/app');
let should = chai.should();

let selected_Survey_ID = 61;

chai.use(chaiHttp);
//Our parent block
describe('User', () => {

/*
  * Test the /GET route
  */
  describe('/login/:email/:pass', () => {
      it('it should login a user with correct username and password', (done) => {
        const user = {
          username: "dimitris@mail.gr",
          password: "hello1"
        }
        chai.request(server)
            .get('/login/'+user.username+'/'+user.password)
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
  });
  var created_session;

  describe('/create_session/:value', () => {
    it('it should create a new session for a specific questionnaire', (done) => {
      const survey = {
        ID: selected_Survey_ID
      }
      chai.request(server)
          .post('/create_session/'+survey.ID)
          .end((err, res) => {
            created_session=res.res.text[23]+res.res.text[24]+res.res.text[25]+res.res.text[26];
                res.should.have.status(200);
            done();
          });
    });
});
describe('/answer_survey/:sesID/:surID', () => {
  it('it should select a specific questionnaire and bring the first question', (done) => {
    const session = {
      ID: created_session,
      surID:selected_Survey_ID
    }
    chai.request(server)
        .get('/answer_survey/'+session.ID+'/'+session.surID)
        .end((err, res) => {
              res.should.have.status(200);
          done();
        });
  });
});
let selected_option = -1 ;
describe('/doanswer/:questionnaireID/:questionID/:session/:optionID', () => {
  it('it should save a specific answer of a specific question of a specific questionnaire in a specific session', (done) => {
    const doAnswer = {
      surID: selected_Survey_ID,
      queID : 300,
      sesID :created_session,
      optID: 301

    }
    chai.request(server)
        .post('/doanswer/'+doAnswer.surID+'/'+doAnswer.queID+'/'+doAnswer.sesID+'/'+doAnswer.optID)
        .end((err, res) => {
          if(res.status==200){
            let j = JSON.parse(res.res.text);
            selected_option = j.data.optionID;
          }
              res.should.have.status(200);
          done();
        });
  });
});
let next_question = -1;

describe('/next_question/:option/:sessionID', () => {
  it('it should bring the next question according to the previous selected option', (done) => {
    const option = {
      ID: selected_option,
      sesID:created_session
    }
    chai.request(server)
        .get('/next_question/'+option.ID+'/'+option.sesID)
        .end((err, res) => {
          if(res.status==200){
              let j = JSON.parse(res.res.text);
              next_question=j.data[0].quesid;
          }
              res.should.have.status(200);
          done();
        });
  });
});

describe('/doanswer/:questionnaireID/:questionID/:session/:optionID', () => {
  it('it should save a specific answer of a specific question of a specific questionnaire in a specific session', (done) => {
    const doAnswer = {
      surID: selected_Survey_ID,
      queID : next_question,
      sesID :created_session,
      optID: 303
    }
    chai.request(server)
        .post('/doanswer/'+doAnswer.surID+'/'+doAnswer.queID+'/'+doAnswer.sesID+'/'+doAnswer.optID)
        .end((err, res) => {
          if(res.status==200){
            let j = JSON.parse(res.res.text);
            selected_option = j.data.optionID;
          }
              res.should.have.status(200);
          done();
        });
  });
});


})