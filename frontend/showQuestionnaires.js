/*When the page is loaded, all questionnaires are brought and displayed as a table */
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAllQuestionnaires')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    
});

var help_counter = 0;
/* Load data and display them in a table format */
function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    //in case of no questionnaires:
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='3'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";

    //create one row for each stored questionnaire and the necessary buttons for each one
    data.forEach(function ({id, title, keywords}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${title}</td>`;
        tableHtml += `<td>${keywords}</td>`;
        tableHtml += `<td><button id="${help_counter}" onclick="createSession(${id})" value="${id}">Answer</button>`;
        tableHtml += `<button id="${help_counter}" onclick="ShowQuestions(${id})" value="${id}">Statistics</button>`;
        tableHtml += `<button id="${id}" onclick="ShowDetails(${id})" value="${id}">Survey Details</button></h3></td>`;
        tableHtml += "</tr>";
        help_counter +=1;
    });

    table.innerHTML = tableHtml;
}

/* Load the question and display it to the user for the data that it has been called for */
function loadQuestion(data) {
    const main = document.querySelector('#showSurveys_main');
    let tableHtml = "";
    let help_title="";
    let last = true;
    var sessionID ;
    tableHtml += `<div class="answ"><h1>Answer that Question<h1>`;
    data.forEach(function ({quesid, questitle,atitle, nextque, answerid, surid, sessID, cattitle}) {       
           if(help_title!=questitle) {tableHtml += `<h2>Question : ${questitle}</h2>`; tableHtml += `<h2>Category : ${cattitle}</h2>`;}
            tableHtml += "<h3>";
            tableHtml += `<input type="radio" class="${nextque}" id="${answerid}" name="${surid}" value="${quesid}">`;
            tableHtml +=`<label for="html"> ${atitle}</label><br></br></h3></div>`
            help_title = questitle;
            if(nextque!=0)last=false;
            sessionID = sessID;

    });
    //display a next button if we are not talking about the last question
    if(last!=true){
        tableHtml +=`<div class='button'>`;
        tableHtml += `<button id="next-question-btn" onclick="next_question('${sessionID}')">Next</button>`;
        tableHtml +=`</div>`;
    }
    //display an end button if we are talking about the last question
    else {
        tableHtml +=`<div class='button'>`;
        tableHtml += `<button id="end-answer-btn" onclick="end('${sessionID}')">End</button>`;
        tableHtml +=`</div>`;
    }

    main.innerHTML = tableHtml;
}

//On click of the end button after answering the last question this function is called to submit the answer
function end(sessionID) {
    var ele = document.querySelectorAll('input[type=radio]');
            for(i = 0; i < ele.length; i++) {
                if(ele[i].checked){
                    
                    fetch('http://localhost:5000/doanswer/'+ele[i].name+'/'+ele[i].value+'/'+ sessionID +'/'+ele[i].id, {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'POST'
                    })
                    .then(response => response.json())
                    Summary(sessionID, ele[i].name);   //going on to show summary of selected answers
                    
                }
                    
            }
}

//On click of the next button after answering a specific question this function is called to submit the answer
function next_question(sessionID) {
    var ele = document.querySelectorAll('input[type=radio]');
            for(i = 0; i < ele.length; i++) {
                if(ele[i].checked){
                    console.log('class',ele[i].class);
                    if(ele[i].className==0)end(sessionID);
                    else{
                    let option = ele[i].id;
                    fetch('http://localhost:5000/doanswer/'+(ele[i].name)+'/'+(ele[i].value)+'/'+ sessionID +'/'+(ele[i].id), {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'POST'
                    })
                    .then(response => response.json());
                    FindNextQuestion(option,sessionID);                //function called to find the next question that needs to appear
                }
                }
            }
}

//On click of the answer button. It creates a new session for the user to answer the questionnaire
function createSession(surveyID) {
    fetch('http://localhost:5000/create_session/'+surveyID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST'
    })
    .then(response => response.json()).then(data => GetFirstQuestion(data['data']));
}

/* It brings the first question of the selected questionnaire for the user to answer */
function GetFirstQuestion(Data) {
    let sesID = Data.session_id;
    let survID = Data.survID;

    fetch('http://localhost:5000/answer_survey/'+sesID+'/'+survID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(data => loadQuestion(data['data']));
}

//find the next question to be answered according to the selected answer and the determined flow
function FindNextQuestion(option,sessionID) {
    fetch('http://localhost:5000/next_question/'+option+'/'+sessionID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'  
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(data => loadQuestion(data['data']));   //display the question to the user

}

/* Collect all answers given in this given session to show a summary of them to the user */
function Summary(sessionID, survey_id) {
    //console.log(survey_id);
    fetch('http://localhost:5000/getsessionanswers/'+survey_id+'/'+sessionID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'  
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(data => DisplaySummary(data['data']));   //display the summary to the user
}

//On press of the Statistics button. Shows a list of the questions of this questionnaire to pick one.
//The responsible endpoint gets the data asked for. 
function ShowQuestions(questionnaireID) {
    fetch('http://localhost:5000/getquestionanswers/' + questionnaireID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(data => QuestionStat(data['data']));  //display the questions of this questionnaire to the user
}

// display the questions to the user. The user then chooses a question to check its statistics. 
function QuestionStat(data) {
    const table = document.querySelector('#showSurveys_main');
    let tableHtml = "";
    let counter = 0 ;
    //Iteratively display each question with its button
    data.forEach(function ({surTitle, queTitle, queID, surID}) {  
         if(counter==0)tableHtml += `<h1>Survey : ${surTitle}</h1>`;     
         tableHtml += `<h3>${queTitle}  `;
         tableHtml += " "
         tableHtml += ` <button class="statistic-button" id="${queID}" name="${surTitle}" onclick="Statistics(${queID},${surID})", value="5">See Statistics</button></h3>`;
         counter++
 });

    table.innerHTML = tableHtml;
}


//Fetch statistics for the selected question (on click of the See Statistics button)
function Statistics(questionID,questionnaireID) {
    fetch('http://localhost:5000/getquestionanswers/' + questionnaireID +'/' + questionID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(data => DisplayQuestionStatistics(data['data']));   //display the results to the user with this function
}

//Display the question statistics to the user
function DisplayQuestionStatistics(data) {
    const table = document.querySelector('#showSurveys_main');
    let tableHtml = "";
    let counter = 0;
    let data2=[];
    data.forEach(function ({Survey, Session, Question,AnswerTitle, Time}) {  
        if(counter==0) {
            data2.push({x:AnswerTitle, value:0});
            tableHtml += `<h1>${Survey} : `;
            tableHtml += `${Question}</h1>`;
            tableHtml += `<div id="container" style="position: relative; left: 0px; top: 0px; overflow: hidden; width: 100%; height: 330px;"></div>`
            tableHtml += `<h1>Detailed Results : </h1>`;
        }
        if(data2.findIndex(element=>element.x==AnswerTitle)==-1)data2.push({x:AnswerTitle, value:1});
        else data2[data2.findIndex(element=>element.x==AnswerTitle)].value+=1
         tableHtml += `<h3>Session : ${Session}   |   Answer : ${AnswerTitle} (Time :${Time})</h3><br> `;
         counter++;
 });

    if(counter!=0)tableHtml += `<button onclick="Back()">Back</button>`;
    else {
        tableHtml += `<br><br><br><h1>No Data</h1>`;
        tableHtml += `<br><br><br><br><button onclick="Back()">Back</button>`;
    }
    
    table.innerHTML = tableHtml;
    draw_chart(data2);
}

// draw the pie chart
function draw_chart(data){
anychart.onDocumentReady(function() {
    // create the chart
    var chart = anychart.pie();
  
    // set the chart title
    chart.title("Pie Chart");
    chart.fill("aquastyle");
    chart.labels().position("outside");
    // add the data
    chart.data(data);
  
    // display the chart in the container
    chart.container('container');
    chart.draw();
  
  });
}




//Back button after checking statistics of a question
function Back(){
    location.replace('showQuestionnaires.html');
}

let helper;
//Show the summary of selected answers to the user
function DisplaySummary(data) {
    const main = document.querySelector('#showSurveys_main');
    let counter = 1;
    let tableHtml = "";
    tableHtml += "<h2><b>Summary of your selected answers</b></h2>"
    data.forEach(function ({ anstitle, quetitle, quesid }) { 
            helper = quesid;
            tableHtml += `<h3>Question ${counter} : ${quetitle}</h3>`   
            tableHtml += "<h3>";
            tableHtml += `Selected Answer: ${anstitle}</h3><br><br>`;
            counter += 1;
    });
    tableHtml +=`<div class='button'>`;
    tableHtml += `<button id="end-summary" onclick="finish(helper)">Finish</button>`;
    tableHtml +=`</div>`;
    main.innerHTML = tableHtml;
}

//On click of the finish button, display a confirm message
function finish(helper){
    console.log("helper: ", helper);
    if(confirm('Your Questionnaire has been submitted! If you wish to answer another one click OK. If you wish to reanswer this one click "Cancel"')){
    location.replace('showQuestionnaires.html');
    }
    else{ 
        createSession(helper);
    }
}

//Fetch details (questions) of the chosen questionnaire
function ShowDetails(surveyID) {
    fetch('http://localhost:5000/getsurveydetails/' + surveyID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(data => loadSurveyDetails(data['data']));   //display the data to the user
}

//Display all questions of a questionnaire with their details and button to choose a specific question
function loadSurveyDetails(data) {
    const table = document.querySelector('#showSurveys_main');
    let tableHtml = "";
    let counter = 0;
    data.forEach(function ({surID, surTitle, surKey, queID, queTitle, required, qtype}) {  
         if(counter==0) tableHtml += `<h1>Survey : (#${surID}) ${surTitle} | Keyword : ${surKey}</h1>`;
         tableHtml += `<h3>(${queID}) ${queTitle} `;
         if(required==1) tableHtml += `*`;
         if(qtype==1) tableHtml += `(profile)`;
         else tableHtml += `(question)`;
         tableHtml += `<button id="${queID}" onclick="ShowQuestionDet(${queID})" value="${queID}">Question Details</button></h3>`;
         counter++;
 })
    tableHtml += `<button onclick="Back()">Back</button>`;

    table.innerHTML = tableHtml;
}

//Fetch selected questions' answers and their details
function ShowQuestionDet(questionID) {
    fetch('http://localhost:5000/getquestiondetails/' + questionID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(data => loadQueDet(data['data']));   //display data to the user
}

//Display answers' details of a chosen question to the user
function loadQueDet(data) {
    const table = document.querySelector('#showSurveys_main');
    let tableHtml = "";
    let counter = 0;
    data.forEach(function ({surID, queID, queTitle, required, qtype, ansID, ansTitle, nextID}) {  
         if(counter==0) {
            tableHtml += `<h1>Question : (#${queID}) ${queTitle} `;
            if(required==1) tableHtml += `*`;
            if(qtype==1) tableHtml += `(profile)`;
            else tableHtml += `(question)`;
            tableHtml += `, of Survey #${surID}</h1>`;
         }
         tableHtml += `<h3>(${ansID}) ${ansTitle} | Next: ${nextID}</h3>`;
         
         counter++;
 })
    tableHtml += `<button onclick="Back()">Back</button>`;

    table.innerHTML = tableHtml;
}



// Search Bar Implementation
(function() {
	'use strict';

var TableFilter = (function() {
 var Arr = Array.prototype;
		var input;
  
		function onInputEvent(e) {
			input = e.target;
			var table1 = document.getElementsByClassName(input.getAttribute('data-table'));
			Arr.forEach.call(table1, function(table) {
				Arr.forEach.call(table.tBodies, function(tbody) {
					Arr.forEach.call(tbody.rows, filter);
				});
			});
		}

		function filter(row) {
			var text = row.textContent.toLowerCase();
      var val = input.value.toLowerCase();
			row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
		}

		return {
			init: function() {
				var inputs = document.getElementsByClassName('table-filter');
				Arr.forEach.call(inputs, function(input) {
					input.oninput = onInputEvent;
				});
			}
		};
 
	})(); 
 TableFilter.init(); 
})();