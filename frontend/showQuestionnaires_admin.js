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
        tableHtml += `<td><button id="${help_counter}" onclick="createSession(${id})" value="${id}">Edit</button></td>`;
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
            if(nextque==0)last=false;
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
                    .then(response => response.json());
                    
                }
                    
            }
    location.replace('index.html');
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

/*const chooseBtn = document.querySelector('#choose-survey-btn');
chooseBtn.onclick = function () {

    let button_value = document.getElementById("choose-survey-btn").value;
    fetch('http://localhost:5000/answer_survey', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET',
        body: JSON.stringify({ button_value:button_value})
    })
    .then(response => response.json());
    location.replace('answerSurvey.html');
   // .then(data => insertRowIntoTable(data['data']));
}*/



//const fileSelector = document.getElementById('myFile');
/*document.getElementById('myFile')
.addEventListener('change', function() {
  
var fr=new FileReader();
fr.readAsText(this.files[0]);
fr.onload=function(){
            fetch('http://localhost:5000/admin/questionnaire_upd', {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: fr.result
            })
            .then(response => response.json())
    console.log('fr.result',fr.result);
}
  
})*/


/*ileSelector.addEventListener('change', (event) => {
  const fileList = event.target.files;
  console.log(fileList);
  fetch('http://localhost:5000/admin/questionnaire_upd', {
    headers: {
        'Content-type': 'application/json'
    },
    method: 'POST',
    body: ({fileList : fileList})
})
.then(response => response.json())
});*/


    /*const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      json.src = event.target.result;cd 
    });
    let ffile = reader.readAsDataURL(fileSelector);
    
    fetch('http://localhost:5000/admin/questionnaire_upd', {
    headers: {
        'Content-type': 'application/json'
    },
    method: 'POST',
    body: ({ffile : ffile})
})
.then(response => response.json())*/
  
//let file = document.getElementById('input').files[0];
//let formData = new FormData();
//formData.append('file', file);
//fetch('/admin/questionnaire_upd', {method: "POST", body: formData});

