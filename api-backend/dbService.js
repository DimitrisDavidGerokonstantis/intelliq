//values_storage 
const mysql = require('mysql');
const dotenv = require('dotenv');
const { json } = require('express');
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
     console.log('db ' + connection.state);
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
                    console.log(result.affectedRows + " record inserted");
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

    async insertNewQuestion(title, answers_array, times, checkbox) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id FROM survey ORDER BY id DESC LIMIT 0, 1;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                  //  console.log(result.affectedRows + " record inserted");
                })
            });
         //  console.log('mplampla'); console.log(response[0].id);
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO questions(title, required, category_id, qtype, survey_id) VALUES (?,?, 1, TRUE, ?);";

                connection.query(query, [title,checkbox, response[0].id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                    console.log(result.affectedRows + " record inserted");
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
                        console.log(result.affectedRows + " record inserted");
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
                const query77 = "select que.id as qid, ans.id as ansid, que.title as qtitle, ans.title as anstitle, que.required as required from survey as sur inner join questions as que on que.survey_id=sur.id inner join answers as ans on ans.whose_question_id=que.id where sur.id=?;";
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

            const response45 = await new Promise((resolve, reject) => {
                const query100 = "SELECT que.id as queid FROM questions as que inner join survey as sur on sur.id=que.survey_id where sur.id=? ORDER BY que.id ASC LIMIT 0, 1;";

                connection.query(query100,[survID] ,(err,results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                  //  console.log(result.affectedRows + " record inserted");
                })
            });

            const response69 = await new Promise((resolve, reject) => {
                const query88 = "select ? as sessID ,que.id as quesid, que.title as questitle, ans.title as atitle, ans.next_question_id as nextque, ans.id as answerid, sur.id as surid from questions as que inner join answers as ans on que.id=ans.whose_question_id inner join survey as sur on sur.id=que.survey_id where que.id=?;";

                connection.query(query88, [sessID,response45[0].queid], (err,results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                  //  console.log(result.affectedRows + " record inserted");
                })
            });

            //console.log(response69);
            return response69;
        } catch (error) {
            console.log(error);
        }
    }
    
    async checkCredentials(email,password) {
        try {
            
            const insertId23 = await new Promise((resolve, reject) => {
                const query888 = "select roles from registered_users where email=? and pass_word=?;"
                connection.query(query888,[email,password] ,(err, results) => {
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

            const response12 = await new Promise((resolve, reject) => {
                const query101 = "select next_question_id as nextq from answers where id=?;"

                connection.query(query101,[option] ,(err,results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                  //  console.log(result.affectedRows + " record inserted");
                })
            });

            const response70 = await new Promise((resolve, reject) => {
                const query89 = "select ? as sessID, que.id as quesid, que.title as questitle, ans.title as atitle, ans.next_question_id as nextque, ans.id as answerid, sur.id as surid from questions as que inner join answers as ans on que.id=ans.whose_question_id inner join survey as sur on sur.id=que.survey_id where que.id=?;";

                connection.query(query89, [sessionID,response12[0].nextq], (err,results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                  //  console.log(result.affectedRows + " record inserted");
                })
            });

            console.log(response70);
            return response70;
        } catch (error) {
            console.log(error);
        }
    }


    async createNewSession(survID) {
        try {
            let sesID = Buffer.from(Math.random().toString()).toString("base64").substring(10,14);
            const insertId32 = await new Promise((resolve, reject) => {
                const query38 = "INSERT INTO session (session_id,survey_id, registered_users_id) VALUES (?,?, 1);";

                connection.query(query38, [sesID,survID] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId32);
                    console.log(result.affectedRows + " record inserted");
                })
            });
            console.log('insertId32',insertId32);
            return {
                session_id:sesID,
                survID:survID
            };
        } catch (error) {
            console.log(error);
        }
    }



    async SaveGivenAnswer(sessionID,optionID) {
        try {
            const insertId53 = await new Promise((resolve, reject) => {
                const query53 = "INSERT INTO answers_registered_users VALUES (?,?, ?);";

                connection.query(query53, [optionID, 1, sessionID] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId53);
                    console.log(result.affectedRows + " record inserted");
                })
            });
            return {
                insertId53 : insertId53,
                sessionID : sessionID,
                optionID : optionID
            };
        } catch (error) {
            console.log(error);
        }
    }
        
    async getSurveysQuestions(questionnaireID) {
        try {
            
            const insertId23 = await new Promise((resolve, reject) => {
                const query888 = "select sur.title as surTitle, que.title as queTitle, que.id as queID, sur.id as surID from survey as sur inner join questions as que on que.survey_id=sur.id where sur.id=?;"
                connection.query(query888,[questionnaireID] ,(err, results) => {
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

    async getStatistics(questionID) {
        try {
            
            const insertId23 = await new Promise((resolve, reject) => {
                const query888 = "select first.Survey, first.Session, first.Question, first.AnswerTitle, first.Time_Stamp as Time from (select sur.title as Survey, ses.session_id as Session, que.title as Question, ans.id as Answer, ans.title as AnswerTitle, ses.Time_Stamp as Time_Stamp from survey as sur inner join session as ses on ses.survey_id=sur.id inner join questions as que on que.survey_id=sur.id inner join answers as ans on ans.whose_question_id=que.id where que.id=? order by ses.Time_Stamp) as first inner join answers_registered_users as second on first.Answer=second.answers_id and first.Session=second.session_id ;"
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

}
module.exports = DbService;
