const addBtn = document.querySelector('#create-questionnaire-btn');
console.log("kara");
addBtn.onclick = function () {
    const titleInput = document.querySelector('#title');
    const title = titleInput.value;
    titleInput.value = "";

    const keywordInput = document.querySelector('#keyword');
    const keyword = keywordInput.value;
    keywordInput.value = "";
    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ title : title, keyword : keyword})
    })
    .then(response => response.json());
    location.replace('createQuestionnaire.html');
   // .then(data => insertRowIntoTable(data['data']));
}

const resetBtn = document.querySelector('#resetall-btn');
resetBtn.onclick = function () {
    fetch('http://localhost:5000/admin/resetall', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => showJSONmessage(data['data']));
}

function showJSONmessage(data){
    const table = document.querySelector('#resetall_result');
    let tableHtml = "";
    let boole = false;
    if(data.reason == 42) {boole = true};
   // data = JSON.stringify(data);
  //  console.log(data.substring(1, -2));
  //  data = JSON.parse(data);
  /*  data.forEach(function ({status, reason}) {
        tableHtml += `<h2>{"status":${status}, "reason":${reason}}</h2>`;
    });
*/
    if(boole == true){
    data = JSON.stringify(data);
    data = data.substring(data, 14, -2);
    tableHtml += `<h2>${data}}</h2>`;
    }
    else {
        data = JSON.stringify(data);
        tableHtml += `<h2>${data}</h2>`;
    }

    table.innerHTML = tableHtml;
        
    const noAnswers = document.querySelector('#resetall_res');
    noAnswers.hidden = false;
}