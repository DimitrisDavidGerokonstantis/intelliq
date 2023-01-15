document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getSurveysSummary')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    
});

var flow_counter;
var flow_array = [];
var help_array = [];
function loadHTMLTable(data) {
    const div = document.querySelector('#div_summary');
    flow_counter = 0;
    let tableHtml = "";
    let help_title="";
    var counter ;
    data.forEach(function ({qtitle, anstitle,required, ansid, qid, qtype}) {       
        if(help_title!=qtitle){
            tableHtml += `<h2>(#${qid}) ${qtitle}`;
            if(qtype === 1)tableHtml += ` (Profile)`;
            if(required === 1)tableHtml += ` *`;
            
            counter = 0;
            tableHtml +=`</h2>`;
 
        }
        counter +=1;
        tableHtml += `<h3>${counter}. ${anstitle} `;
        tableHtml += `<input type="text" placeholder="Flow" id="flow_id${flow_counter + 1}">`;
        help_array.push(ansid);
        flow_counter += 1;
        tableHtml += `</h3>`;
        help_title = qtitle;
    });

    div.innerHTML = tableHtml;
}

const finishBtn = document.querySelector('#finish-btn');
finishBtn.onclick = function () {
    var help2;
    for(var i = 0; i < flow_counter; i++){
        help2 = i+1;
        flowInput = document.querySelector('#'+'flow_id'+ help2);
        //console.log('answerInput');console.log(answerInput);
        flow_array.push(flowInput.value);
        flowInput.value = "";
    }
    
    fetch('http://localhost:5000/updateFlow', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({ flow_array : flow_array, help_array : help_array, flow_counter : flow_counter })
    })
    .then(response => response.json());
    location.replace('index.html');
   // .then(data => insertRowIntoTable(data['data']));
}