document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/answer_survey', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    
});

function loadHTMLTable(data) {
    const div = document.querySelector('#div_question');
    let tableHtml = "";
    let help_title="";
    data.forEach(function ({quesid, questitle,atitle, nextque}) {       
           if(help_title!=questitle) tableHtml += `<h2>Question : ${questitle}</h2>`;
            tableHtml += "<h3>";
            tableHtml += `<input type="radio" class="form-control" id="html" name="fav_language" value="HTML">`;
            tableHtml +=`<label for="html"> ${atitle}</label><br></br></h3>`
            help_title = questitle;
    });

    div.innerHTML = tableHtml;
}
