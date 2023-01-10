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
        tableHtml += `<td><button id="${help_counter}" onclick="myFunction(${id})" value="${id}">Answer</button></td>`;
        tableHtml += "</tr>";
        help_counter +=1;
        console.log(help_counter);
    });

    table.innerHTML = tableHtml;
}


function myFunction(button_value) {
    console.log('hello');
    fetch('http://localhost:5000/save_session', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ button_value:button_value})
    })
    .then(response => response.json())
    location.replace('answerSurvey.html');
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


