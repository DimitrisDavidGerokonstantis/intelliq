document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAllQuestionnaires')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    
});

var help_counter = 0;
function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='3'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";

    data.forEach(function ({id, title, keywords}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${title}</td>`;
        tableHtml += `<td>${keywords}</td>`;
        tableHtml += `<td><button id="${help_counter}" onclick="createSession(${id})" value="${id}">Answer</button>`;
        tableHtml += `<button id="${help_counter}" onclick="ShowQuestions(${id})" value="${id}">Statistics</button></td>`;
        tableHtml += "</tr>";
        help_counter +=1;
        console.log(help_counter);
    });

    table.innerHTML = tableHtml;
}


function loadHTMLTable2(data) {
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
            if(nextque!=0)last=false;
            sessionID = sessID;

    });
    if(last!=true){
        tableHtml +=`<div class='button'>`;
        tableHtml += `<button id="next-question-btn" onclick="next_question('${sessionID}')">Next</button>`;
        tableHtml +=`</div>`;}
    else {
        tableHtml +=`<div class='button'>`;
        tableHtml += `<button id="end-answer-btn" onclick="end('${sessionID}')">End</button>`;
        tableHtml +=`</div>`;}

    main.innerHTML = tableHtml;
}


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
                    .then(response => response.json())
                    MyFunction3(sessionID, ele[i].name);
                    
                }
                    
            }
  //  location.replace('index.html');
}
function next_question(sessionID) {
    var ele = document.getElementsByClassName('form-control');
    console.log('ele',ele);
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
                    console.log('frontentd sessionID',sessionID);
                    myFunction2(option,sessionID);
                }
            }
}

function createSession(surveyID) {
    fetch('http://localhost:5000/create_session/'+surveyID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST'
    })
    .then(response => response.json()).then(data => GetFirstQuestion(data['data']));
}
function GetFirstQuestion(Data) {
    console.log('Data');console.log(Data);
    let sesID = Data.session_id;
    let survID = Data.survID;

    fetch('http://localhost:5000/answer_survey/'+sesID+'/'+survID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(data => loadHTMLTable2(data['data']));
}

function myFunction2(option,sessionID) {
    fetch('http://localhost:5000/next_question/'+option+'/'+sessionID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'  
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(data => loadHTMLTable2(data['data']));

}

function MyFunction3(sessionID, survey_id) {
    //console.log(survey_id);
    fetch('http://localhost:5000/getsessionanswers/'+survey_id+'/'+sessionID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'  
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(document.getElementById('title_h1').innerHTML = "")
    .then(data => loadHTMLTable3(data['data']));

function ShowQuestions(questionnaireID) {
    fetch('http://localhost:5000/getquestionanswers/' + questionnaireID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(data => loadHTMLTable3(data['data']));
}

function loadHTMLTable3(data) {
    const table = document.querySelector('#showSurveys_main');
    let tableHtml = "";
    let counter = 0 ;
    data.forEach(function ({surTitle, queTitle, queID, surID}) {  
         if(counter==0)tableHtml += `<h1>Survey : ${surTitle}</h1>`;     
         tableHtml += `<h3>${queTitle}  `;
         tableHtml += " "
         tableHtml += ` <button class="statistic-button" id="${queID}" name="${surTitle}" onclick="Statistics(${queID},${surID})", value="5">See Statistics</button></h3>`;
         counter++
 });

    table.innerHTML = tableHtml;
}



function Statistics(questionID,questionnaireID) {
    fetch('http://localhost:5000/getquestionanswers/' + questionnaireID +'/' + questionID, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
    })
    .then(response => response.json()).then(document.getElementById('showSurveys_main').innerHTML = "")
    .then(data => loadHTMLTable4(data['data']));
}

function loadHTMLTable4(data) {
    const table = document.querySelector('#showSurveys_main');
    let tableHtml = "";
    let counter = 0;
    data.forEach(function ({Survey, Session, Question,AnswerTitle, Time}) {  
        if(counter==0) {tableHtml += `<h1>${Survey} : `;tableHtml += `${Question}</h1>`;}
         tableHtml += `<h3>Session : ${Session}   |   Answer : ${AnswerTitle} (Time :${Time})</h3><br> `;
         counter++;
 });

    if(counter!=0)tableHtml += `<button onclick="Back()">Back</button>`;
    else {tableHtml += `<br><br><br><h1>No Data</h1>`;tableHtml += `<br><br><br><br><button onclick="Back()">Back</button>`;}
    table.innerHTML = tableHtml;
}

function Back(){
    location.replace('showQuestionnaires.html');
}

let helper;
function loadHTMLTable3(data) {
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

function finish(helper){
    console.log("helper: ", helper);
    if(confirm('Your Questionnaire has been submitted! If you wish to answer another one click OK. If you wish to reanswer this one click "Cancel"')){
    location.replace('showQuestionnaires.html');
    }
    else{ 
        createSession(helper);
    }
}