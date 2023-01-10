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
