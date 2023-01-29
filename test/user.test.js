let db = require("../api-backend/dbService");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../api-backend/app');
let should = chai.should();
var token;


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
                  
                //  res.body.should.have.property('accessToken');
                 // token = res.body.accessToken;

                  //res.body.should.be.a('array');
                  //res.body.length.should.be.eql(0);
              done();
            });
      });
  });
})