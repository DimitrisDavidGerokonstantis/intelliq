let db = require("../api-backend/dbService");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../api-backend/app');
let should = chai.should();
var token;


chai.use(chaiHttp);
//Our parent block
describe('Admin', () => {

/*
  * Test the /GET route
  */
  describe('/login', () => {
      it('it should login an admin with correct username and password', (done) => {
        const user = {
          username: "dimitris@mail.gr",
          password: "hello"
        }
        chai.request(server)
            .get('/login/'+user.username+'/'+user.password)
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
  });
})