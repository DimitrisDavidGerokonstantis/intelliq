var times;

const submitBtn = document.querySelector('#show-noAnswers-btn');
submitBtn.onclick = function () {
    

    var input = document.getElementById('noA');
    times = parseInt(input.value);
    const div = document.querySelector('#number_of_answers');
    let divHtml = "";
    for(var i = 0; i < times; i++) {
        divHtml += `<label>Answer ${i+1}: </label><br>`;    
        divHtml += `<input type="text" id="answer${i+1}"><br><br>`;
    }
    div.innerHTML = divHtml;

    const noAnswers = document.querySelector('#noAnswers');
    noAnswers.hidden = false;
}


const nextBtn = document.querySelector('#next-question-btn');
console.log("frontend");
nextBtn.onclick = function () {
    location.replace('createQuestionnaire.html');
    const titleInput = document.querySelector('#title');
    const title = titleInput.value;
    titleInput.value = "";

    const checkInput = document.querySelector('#checkbox-rect2');
    const checkbox = checkInput.checked;
    checkInput.checked = false;

    const qtypeInput = document.querySelector('#checkbox-rect3');
    const qtype = qtypeInput.checked;
    qtypeInput.checked = false;

    const e = document.getElementById("ddlViewBy");
    const category = e.value;
    e.value = "";

    var answers_array = [];
    var answerInput;
    var help;
    //console.log('times');console.log(times);
    for(var i = 0; i < times; i++) {
        help = i+1; 
        answerInput = document.querySelector('#'+'answer'+help);
        //console.log('answerInput');console.log(answerInput);
        answers_array.push(answerInput.value);
        answerInput.value = "";
    }


    /*const answer1Input = document.querySelector('#answer1');
    const answer1 = answer1Input.value;
    answer1Input.value = "";
    const answer2Input = document.querySelector('#answer2');
    const answer2 = answer2Input.value;
    answer2Input.value = "";
    console.log("frontend");*/
    fetch('http://localhost:5000/addQuestion', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ title : title, answers_array : answers_array, times:times, checkbox:checkbox, qtype:qtype, category : category})
    })
    .then(response => response.json())
   // .then(data => insertRowIntoTable(data['data']));
}

const endBtn = document.querySelector('#end-btn');
endBtn.onclick = function () {
    location.replace('surveySummary.html');
    const titleInput = document.querySelector('#title');
    const title = titleInput.value;
    titleInput.value = "";

    const checkInput = document.querySelector('#checkbox-rect2');
    const checkbox = checkInput.checked;
    checkInput.checked = false;
    
    const qtypeInput = document.querySelector('#checkbox-rect3');
    const qtype = qtypeInput.checked;
    qtypeInput.checked = false;

    const e = document.getElementById("ddlViewBy");
    const category = e.value;
    e.value = "";

    var answers_array = [];
    var answerInput;
    var help;
    //console.log('times');console.log(times);
    for(var i = 0; i < times; i++) {
        help = i+1; 
        answerInput = document.querySelector('#'+'answer'+help);
        //console.log('answerInput');console.log(answerInput);
        answers_array.push(answerInput.value);
        answerInput.value = "";
    }


    /*const answer1Input = document.querySelector('#answer1');
    const answer1 = answer1Input.value;
    answer1Input.value = "";
    const answer2Input = document.querySelector('#answer2');
    const answer2 = answer2Input.value;
    answer2Input.value = "";
    console.log("frontend");*/
    fetch('http://localhost:5000/addQuestion', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ title : title, answers_array : answers_array, times:times, checkbox:checkbox, qtype:qtype, category : category})
    })
    .then(response => response.json())
   // .then(data => insertRowIntoTable(data['data']));
}


