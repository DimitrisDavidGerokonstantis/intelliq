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
  // host: process.env.HOST,
  // user: process.env.USER,
  // password: process.env.PASSWORD,
  // database: process.env.DATABASE,
  // port: process.env.DB_PORT
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
                const query = "SELECT * FROM survey;";

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
            }); //console.log(insertId);
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
    
    async getRequestedSurvey() {
        try {

            const response222 = await new Promise((resolve, reject) => {
                const query47 = "SELECT saved_value FROM session ORDER BY session_id DESC LIMIT 0, 1;";

                connection.query(query47, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                  //  console.log(result.affectedRows + " record inserted");
                })
            });

            const response45 = await new Promise((resolve, reject) => {
                const query100 = "SELECT que.id as queid FROM questions as que inner join survey as sur on sur.id=que.survey_id where sur.id=? ORDER BY que.id ASC LIMIT 0, 1;";

                connection.query(query100,[response222[0].saved_value] ,(err,results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                  //  console.log(result.affectedRows + " record inserted");
                })
            });

            const response69 = await new Promise((resolve, reject) => {
                const query88 = "select que.id as quesid, que.title as questitle, ans.title as atitle, ans.next_question_id as nextque from questions as que inner join answers as ans on que.id=ans.whose_question_id where que.id=?;";

                connection.query(query88, [response45[0].queid], (err,results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                  //  console.log(result.affectedRows + " record inserted");
                })
            });

            console.log(response69);
            return response69;
        } catch (error) {
            console.log(error);
        }
    }

    
    async insertNewSession(button_value) {
        try {
            const insertId20 = await new Promise((resolve, reject) => {
                const query37 = "INSERT INTO session(saved_value) VALUES (?);";

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
}




module.exports = DbService;