//values_storage 
const mysql = require('mysql');
const dotenv = require('dotenv');
const { json, response } = require('express');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'IntelliQ',
   port: 3306
   /*host: process.env.HOST,
   user: process.env.USER,
   password: process.env.PASSWORD,
   database: process.env.DATABASE,
   port: process.env.DB_PORT*/
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    // console.log('db ' + connection.state);
    // console.log('connected' == connection.state);
    //console.log('{"status":"OK", "dbconnection":[Server=' + (connection.config.host)+':5000' + ',3306;' + ' Database=' + connection.config.database+';'+' User Id='+ connection.config.user + ';'+' Password='+connection.config.password+';]}');
     console.log('db ' + connection.state);
    // console.log('connected' == connection.state);
    // console.log('{"status":"OK", "dbconnection":[Server=' + (connection.config.host)+':5000' + ',3306;' + ' Database=' + connection.config.database+';'+' User Id='+ connection.config.user + ';'+' Password='+connection.config.password+';]}');
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getAllSurveys() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "select distinct(sur.id), sur.title, sur.keywords from survey as sur inner join questions as que on sur.id=que.survey_id ;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewQuestionnaire(title, keyword) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO survey (title, keywords) VALUES (?, ?);";

                connection.query(query, [title, keyword] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
             //       console.log(result.affectedRows + " record inserted");
                })
            });
            return {
                id : insertId,
                title : title,
                keyword : keyword
            };
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewQuestion(title, answers_array, times, checkbox, qtype, category) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id FROM survey ORDER BY id DESC LIMIT 0, 1;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                  //  console.log(result.affectedRows + " record inserted");
                })
            });

            const resp = await new Promise((resolve, reject) => {
                const query = "SELECT id FROM category where title = ?;";

                connection.query(query, [category], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                  //  console.log(result.affectedRows + " record inserted");
                })
            });
         //  console.log('mplampla'); console.log(response[0].id);
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO questions(title, required, category_id, qtype, survey_id) VALUES (?,?, ?, ?, ?);";

                connection.query(query, [title,checkbox, resp[0].id, qtype, response[0].id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                 //   console.log(result.affectedRows + " record inserted");
                })
            }); //console.log('insertId');console.log(insertId);//console.log(insertId);
             /*const insertId2 = await new Promise((resolve, reject) => {
                const query2 = "INSERT INTO answers(title, whose_question_id) VALUES (?, ?);";

                connection.query(query2, [answer1,insertId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId2);
                    console.log(result.affectedRows + " record inserted");
                })
            });
            const insertId3 = await new Promise((resolve, reject) => {
                const query3 = "INSERT INTO answers(title, whose_question_id) VALUES (?, ?);";

                connection.query(query3, [answer2,insertId] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId3);
                    console.log(result.affectedRows + " record inserted");
                })
            });*/
            var insertId2_array = [];
            var insertId2;
            for(var i = 0; i < times; i++) {
                    insertId2 = await new Promise((resolve, reject) => {
                    var query2 = "INSERT INTO answers(title, whose_question_id) VALUES (?, ?);";
    
                    connection.query(query2, [answers_array[i],insertId] , (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.insertId2);
                    //    console.log(result.affectedRows + " record inserted");
                    }) 
                });
                insertId2_array.push(insertId2);
                
            }
            return {
                question_id : insertId,
                insertId2_array : insertId2_array,
                title : title,
                answers_array : answers_array
            };
        } catch (error) {
            console.log(error);
        }
    }

    async getSurveysSummary() {
        try {
            const response2 = await new Promise((resolve, reject) => {
                const query42 = "SELECT id FROM survey ORDER BY id DESC LIMIT 0, 1;";

                connection.query(query42, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                  //  console.log(result.affectedRows + " record inserted");
                })
            });
            const response = await new Promise((resolve, reject) => {
                const query77 = "select que.id as qid, ans.id as ansid, que.title as qtitle, ans.title as anstitle, que.required as required, que.qtype as qtype from survey as sur inner join questions as que on que.survey_id=sur.id inner join answers as ans on ans.whose_question_id=que.id where sur.id=?;";
                connection.query(query77, [response2[0].id] ,(err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    
    async updateFlow(flow_array, help_array, flow_counter) {
        try {
            var response3;
            for(var j = 0; j < flow_counter; j++){
                response3 = await new Promise((resolve, reject) => {
                var query17 = "UPDATE answers SET next_question_id = ? WHERE id = ?";
    
                connection.query(query17, [flow_array[j], help_array[j]] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
            }
            return response3 === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    async getRequestedSurvey(survID,sessID) {
        try {
            let error = false;
            const response45 = await new Promise((resolve, reject) => {
                const query100 = "SELECT que.id as queid FROM questions as que inner join survey as sur on sur.id=que.survey_id where sur.id=? ORDER BY que.id ASC LIMIT 0, 1;";

                connection.query(query100,[survID] ,(err,results) => {
                    if (err) {error = true};
                    resolve(results); 
                  //  console.log(result.affectedRows + " record inserted");
                })
            });
            
            const response69 = await new Promise((resolve, reject) => {
                const query88 = "select ? as sessID ,que.id as quesid, que.title as questitle, ans.title as atitle, ans.next_question_id as nextque, ans.id as answerid, sur.id as surid, cat.title as cattitle from questions as que inner join answers as ans on que.id=ans.whose_question_id inner join survey as sur on sur.id=que.survey_id inner join category as cat on cat.id=que.category_id where que.id=?;";

                connection.query(query88, [sessID,response45.length!=0?response45[0].queid:-1], (err,results) => {
                    if (err) {error = true};
                    if(!err) resolve(results); else resolve();
                  //  console.log(result.affectedRows + " record inserted");
                })
            });
            
            
          //  console.log(response69);
            return (!error) ? response69 : [];
        
        } catch (error) {
            console.log(error);
        }
    
    }
    
    async checkCredentials(email,password) {
        try {
            let error = false;
            const insertId23 = await new Promise((resolve, reject) => {
                const query888 = "select roles from registered_users where email=? and pass_word=?;"
                connection.query(query888,[email,password] ,(err, results) => {
                    if (err) error=true;
                    if(!err)resolve(results); else resolve();
                })
            });
            //console.log(insertId23);
            return (!error)? insertId23 : [];
        } catch (error) {
            console.log(error);
        }
    }
    
    async Save_new_value(button_value) {
        try {
            const insertId20 = await new Promise((resolve, reject) => {
                const query37 = "INSERT INTO values_storage(saved_value) VALUES (?);";

                connection.query(query37, [button_value] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId20);
                    console.log(result.affectedRows + " record inserted");
                })
            });
            return {
                id : insertId20,
                button_value : button_value,
            };
        } catch (error) {
            console.log(error);
        }
    }

 

    async getNextQuestion(option,sessionID) {
        try {
            let error = false;
            const response12 = await new Promise((resolve, reject) => {
                const query101 = "select next_question_id as nextq from answers where id=?;"

                connection.query(query101,[option] ,(err,results) => {
                    if (err) error=true;
                    if(!err)resolve(results);else resolve();
                  //  console.log(result.affectedRows + " record inserted");
                })
            });

            const response70 = await new Promise((resolve, reject) => {
                const query89 = "select ? as sessID, que.id as quesid, que.title as questitle, ans.title as atitle, ans.next_question_id as nextque, ans.id as answerid, sur.id as surid, cat.title as cattitle from questions as que inner join answers as ans on que.id=ans.whose_question_id inner join survey as sur on sur.id=que.survey_id inner join category as cat on cat.id=que.category_id where que.id=?;";

                connection.query(query89, [sessionID,response12.length!=0?response12[0].nextq:-1], (err,results) => {
                    if (err) error=true;
                    if(!err)resolve(results);else resolve();
                  //  console.log(result.affectedRows + " record inserted");
                })
            });

          //  console.log(response70);
            return !error?response70:[];
        } catch (error) {
            console.log(error);
        }
    }


    async createNewSession(survID) {
        try {
            let error = false;
            let sesID = Buffer.from(Math.random().toString()).toString("base64").substring(10,14);
            const insertId32 = await new Promise((resolve, reject) => {
                const query38 = "INSERT INTO session (session_id,survey_id, registered_users_id) VALUES (?,?, 1);";

                connection.query(query38, [sesID,survID] , (err, result) => {
                    if (err) {error=true};
                    if(!err) resolve(result.insertId32); else resolve();
                //    console.log(result.affectedRows + " record inserted");
                })
            });
            //console.log('insertId32',insertId32);
            return (!error)?{
                session_id:sesID,
                survID:survID
            }:[];
        } catch (error) {
            console.log(error);
        }
    }



    async SaveGivenAnswer(sessionID,optionID) {
        try {
            let error = false;
            const insertId53 = await new Promise((resolve, reject) => {
                const query53 = "INSERT INTO answers_registered_users VALUES (?,?, ?);";

                connection.query(query53, [optionID, 1, sessionID] , (err, result) => {
                    if (err) error=true;
                    if(!err)resolve(result.insertId53); else resolve();
               //     console.log(result.affectedRows + " record inserted");
                })
            });
            return !error?{
                insertId53 : insertId53,
                sessionID : sessionID,
                optionID : optionID
            }:[];
        } catch (error) {
            console.log(error);
        }
    }
        
    async getSurveysQuestions(questionnaireID) {
        try {
            let error = false;
            const insertId23 = await new Promise((resolve, reject) => {
                const query888 = "select sur.title as surTitle, que.title as queTitle, que.id as queID, sur.id as surID from survey as sur inner join questions as que on que.survey_id=sur.id where sur.id=?;"
                connection.query(query888,[questionnaireID] ,(err, results) => {
                    if (err) error=true;
                    if(!err)resolve(results); else resolve();  
                })
            });
            console.log(insertId23);
            return (!error)? insertId23 : [];
        } catch (error) {
            console.log(error);
        }
    }

    async getStatistics(questionID) {
        try {
            
            const insertId23 = await new Promise((resolve, reject) => {
                const query888 = "select first.Survey, first.Session, first.Question, first.AnswerTitle, concat(left(first.Time_Stamp,10),' ,  ',right(first.Time_Stamp,8)) as Time from (select sur.title as Survey, ses.session_id as Session, que.title as Question, ans.id as Answer, ans.title as AnswerTitle, ses.Time_Stamp as Time_Stamp from survey as sur inner join session as ses on ses.survey_id=sur.id inner join questions as que on que.survey_id=sur.id inner join answers as ans on ans.whose_question_id=que.id where que.id=?) as first inner join answers_registered_users as second on first.Answer=second.answers_id and first.Session=second.session_id order by Time_Stamp;"
                connection.query(query888,[questionID] ,(err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);   
                })
            });
            console.log(insertId23);
            return insertId23;
        } catch (error) {
            console.log(error);
        }
    }
            
    async getSummary(sessionID, questionnaireID) {
        try {
            let error = false;
            const response87 = await new Promise((resolve, reject) => {
                const query101 = "select que.title as quetitle,que.survey_id as quesid, ans.title as anstitle from answers_registered_users as an inner join answers as ans on an.answers_id = ans.id inner join questions as que on que.id = ans.whose_question_id where session_id = ? and que.survey_id = ?;"

                connection.query(query101,[sessionID, questionnaireID] ,(err,results) => {
                    if (err) error=true;
                    if(!err)resolve(results); else resolve();
                  //  console.log(result.affectedRows + " record inserted");
                })
            });
            return !error?response87:[];
        } catch (error) {
            console.log(error);
        }
    }
    async getHealthcheck() {
        let status;
        console.log(connection.state);
        if(connection.state == 'authenticated'){
            status = 'OK';
        }
        else {
            status = 'failed';
        }
        try {

            const response88 = await new Promise((resolve, reject) => {
                const query101 = "select ? as status, ? as Server, ? as sqlport, ? as Database1, ? as User_Id, ? as password;";

                connection.query(query101,[status, connection.config.host, connection.config.port, connection.config.database, connection.config.user, connection.config.password] ,(err,results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                  //  console.log(result.affectedRows + " record inserted");
                })
            });
            console.log('response:', response88);
            return response88;
        } catch (error) {
            console.log(error);
        }
    }



    async newSurveyJson(surID, surTitle,keywords,questions) {
        try {
            const insertId57 = await new Promise((resolve, reject) => {
                const query53 = "INSERT INTO survey VALUES (?,?,?);";

                connection.query(query53, [surID, surTitle, keywords] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId57);
                    console.log(result.affectedRows + " record inserted");
                })
            });
            
            let N = questions.length;
            for(var i = 0  ; i < N ; i++){
                var insertId54 = await new Promise((resolve, reject) => {
                    var query54 = "INSERT INTO questions VALUES (?,?, ?, ?, 1, ?);";
    
                    connection.query(query54, [questions[i].qID, questions[i].qtext, questions[i].required,questions[i].type,surID] , (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.insertId54);
                        console.log(result.affectedRows + " record inserted");
                    })
                });
                let ansN = questions[i].options.length;
                console.log(ansN);
                for(var j = 0 ; j < ansN ; j++){
                    console.log(questions[i].options[j].optID, questions[i].options[j].opttxt,questions[i].qID,questions[i].options[j].nextqID);
                    var insertId55 = await new Promise((resolve, reject) => {
                        var query55 = "INSERT INTO answers VALUES (?,?,?,?);";
        
                        connection.query(query55, [questions[i].options[j].optID, questions[i].options[j].opttxt,questions[i].qID,questions[i].options[j].nextqID] , (err, result) => {
                            if (err) reject(new Error(err.message));
                            resolve(result.insertId55);
                            console.log(result.affectedRows + " record inserted");
                        })
                    });
                }
            }
            
            return {
                insertId57:insertId57,
                surID : surID,
                surTitle : surTitle,
                keywords : keywords,
                questions : questions
                
            };
        } catch (error) {
            console.log(error);
        }
    }
    async resetAll() {
        try {
            const insertId53 = await new Promise((resolve, reject) => {
                const query4 = "DELETE from answers_registered_users;";

                connection.query(query4, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId53);
                    //console.log(result.affectedRows + " record inserted");
                })
            });
            const insertId5 = await new Promise((resolve, reject) => {
                const query4 = "DELETE from session;";
                connection.query(query4, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId53);
                    //console.log(result.affectedRows + " record inserted");
                })
            });
            const insertId6 = await new Promise((resolve, reject) => {
                const query5 = "DELETE from values_storage;";
                connection.query(query5, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId6);
                    //console.log(result.affectedRows + " record inserted");
                })
            });
            const insertId7 = await new Promise((resolve, reject) => {
                const query6 = "DELETE from registered_users where roles = 'user';";
                connection.query(query6, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId7);
                    //console.log(result.affectedRows + " record inserted");
                })
            });
            const insertId8 = await new Promise((resolve, reject) => {
                const query7 = "DELETE from answers;";
                connection.query(query7, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId8);
                    //console.log(result.affectedRows + " record inserted");
                })
            });
            const insertId11 = await new Promise((resolve, reject) => {
                const query10 = "DELETE from questions_category;";
                connection.query(query10, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId11);
                    //console.log(result.affectedRows + " record inserted");
                })
            });
            const insertId9 = await new Promise((resolve, reject) => {
                const query8 = "DELETE from questions;";
                connection.query(query8, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId9);
                    //console.log(result.affectedRows + " record inserted");
                })
            });
            const insertId10 = await new Promise((resolve, reject) => {
                const query9 = "DELETE from survey;";
                connection.query(query9, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId10);
                    //console.log(result.affectedRows + " record inserted");
                })
            });

            return {
                status : 'OK',
                reason : 42
            };
        } catch (error) {
            return {
                status : 'failed',
                reason : error
            }
        }
    }
   
    async getSurveyDetails(questionnaireID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "select sur.id as surID, sur.title as surTitle, sur.keywords as surKey, que.id as queID, que.title as queTitle, required, qtype from survey as sur inner join questions as que on sur.id=que.survey_id where sur.id = ? ;";

                connection.query(query, [questionnaireID], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getQuestionDetails(questionID) {
        try {
            let error = false;
            const response = await new Promise((resolve, reject) => {
                const query = "select survey_id as surID, que.id as queID, que.title as queTitle, required, qtype, ans.id as ansID, ans.title as ansTitle, next_question_id as nextID from questions as que inner join answers as ans on que.id = whose_question_id where que.id = ? ;";

                connection.query(query, [questionID], (err, results) => {
                    if (err) error=true;
                    if(!err)resolve(results); else resolve();
                })
            });
            // console.log(response);
            return (!error)? response : [];
        } catch (error) {
            console.log(error);
        }
    }

    async createUser(username, password) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO registered_users (email, pass_word, roles) VALUES (?, ?, 'user');";

                connection.query(query, [username, password] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                    console.log(result.affectedRows + " record inserted");
                })
            });
            return {
                id : insertId,
                username : username,
                password : password
            };
        } catch (error) {
            console.log(error);
        }
    }

    async resetQuestionnaire(surveyID) {
        try {
            const insertId53 = await new Promise((resolve, reject) => {
                const query4 = "delete from answers_registered_users where answers_id in(select ans.answers_id from answers_registered_users as ans inner join session as ses on ses.session_id = ans.session_id where ses.survey_id = ?);";

                connection.query(query4, [surveyID], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId53);
                    //console.log(result.affectedRows + " record inserted");
                })
            });
            const insertId5 = await new Promise((resolve, reject) => {
                const query4 = "DELETE from session where survey_id = ?;";
                connection.query(query4, [surveyID], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId53);
                    //console.log(result.affectedRows + " record inserted");
                })
            });

            return {
                status : 'OK',
                reason : 42
            };
        } catch (error) {
            return {
                status : 'failed',
                reason : error
            }
        }
    }

    async CliSaveGivenAnswer(surveyID,sessionID,optionID) {
        /// later: function to check if the given sessionID already exists OR trigger in database
        try {
            const insertId99 = await new Promise((resolve, reject) => {
                const query99 = "INSERT INTO session (session_id,survey_id, registered_users_id) VALUES (?,?, 1);";
                connection.query(query99, [sessionID,surveyID] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId99);
                    console.log(result.affectedRows + " record inserted");
                })
            });
            const insertId115 = await new Promise((resolve, reject) => {
                const query115 = "INSERT INTO answers_registered_users (answers_id,registered_users_id,session_id) VALUES (?,?, ?);";

                connection.query(query115, [optionID, 1, sessionID] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId115);
                    console.log(result.affectedRows + " record inserted");
                })
            });

            return {
                status : 'OK',
                reason : 42
            };
        } catch (error) {
            return {
                status : 'failed',
                reason : error
            }
        }
    }

}
module.exports = DbService;
