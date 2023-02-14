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
        tableHtml += `<td>`;
        tableHtml += `<button id="${help_counter}" onclick="resetQuestionnaire(${id})" value="${id}">Reset</button></td>`;
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
    tableHtml += `<h1>Answer that Question<h1>`;
    data.forEach(function ({quesid, questitle,atitle, nextque, answerid, surid, sessID}) {       
           if(help_title!=questitle) tableHtml += `<h2>Question : ${questitle}</h2>`;
            tableHtml += "<h3>";
            tableHtml += `<input type="radio" class="form-control" id="${answerid}" name="${surid}" value="${quesid}">`;
            tableHtml +=`<label for="html"> ${atitle}</label><br></br></h3>`
            help_title = questitle;
            if(nextque==0)last=false;
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
    var ele = document.getElementsByClassName('form-control');
            for(i = 0; i < ele.length; i++) {
                if(ele[i].checked){
                    
                    fetch('http://localhost:5000/doanswer/'+ele[i].name+'/'+ele[i].value+'/'+ sessionID +'/'+ele[i].id, {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'POST'
                    })
                    .then(response => response.json());
                    
                }
                    
            }
    location.replace('index.html');   //we have finished answering the questionnaire
}

//On click of the next button after answering a specific question this function is called to submit the answer
function next_question(sessionID) {
    var ele = document.getElementsByClassName('form-control');
            for(i = 0; i < ele.length; i++) {
                if(ele[i].checked){
                    
                    let option = ele[i].id;
                    fetch('http://localhost:5000/doanswer/'+(ele[i].name)+'/'+(ele[i].value)+'/'+ sessionID +'/'+(ele[i].id), {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'POST'
                    })
                    .then(response => response.json());
                    FindNextQuestion(option,sessionID);           //function called to find the next question that needs to appear
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

//On click of the reset button for a specific questionnaire. It resets all answer data from this specific questionnaire
function resetQuestionnaire(surveyID) {
    fetch('http://localhost:5000/admin/resetq/'+surveyID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST'
    })
    .then(response => response.json()).then(data => ShowMessage(data['data']));
}

function ShowMessage(Data) {
   let boole = false;
   if(Data.reason == 42) {boole = true};   //checking if the deletion went good
   if(boole == true){
    Data = JSON.stringify(Data);           //show JSON object to the admin
    Data = Data.substring(Data, 14, -2);
    }
    else {
        Data = JSON.stringify(Data);
    }
    //confirm message that the data have been reset
    if(confirm(`${Data}} :  All answers for this questionnaire have been reset!`)){
        location.replace('showQuestionnaires_admin.html');
        }
        else{ 
            location.replace('showQuestionnaires_admin.html');
        }
}

