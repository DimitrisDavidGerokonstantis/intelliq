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

// Get the form and file field
let form = document.querySelector('#upload');
let file = document.querySelector('#file');
// Listen for submit events
form.addEventListener('submit', handleSubmit);
/**
 * Handle submit events
 * @param  {Event} event The event object
 */
function handleSubmit (event) {

	// Stop the form from reloading the page
	event.preventDefault();
}
/**
 * Handle submit events
 * @param  {Event} event The event object
 */
function handleSubmit (event) {

	// Stop the form from reloading the page
	event.preventDefault();

	// If there's no file, do nothing
	if (!file.value.length) return;

}
/**
 * Handle submit events
 * @param  {Event} event The event object
 */
function handleSubmit (event) {

	// Stop the form from reloading the page
	event.preventDefault();

	// If there's no file, do nothing
	if (!file.value.length) return;

	// Create a new FileReader() object
	let reader = new FileReader();

}
/**
 * Handle submit events
 * @param  {Event} event The event object
 */
function handleSubmit (event) {

	// Stop the form from reloading the page
	event.preventDefault();

	// If there's no file, do nothing
	if (!file.value.length) return;

	// Create a new FileReader() object
	let reader = new FileReader();

	// Read the file
	reader.readAsText(file.files[0]);

}
/**
 * Handle submit events
 * @param  {Event} event The event object
 */
function handleSubmit (event) {

	// Stop the form from reloading the page
	event.preventDefault();

	// If there's no file, do nothing
	if (!file.value.length) return;

	// Create a new FileReader() object
	let reader = new FileReader();

	// Setup the callback event to run when the file is read
	reader.onload = logFile;

	// Read the file
	reader.readAsText(file.files[0]);

}
/**
 * Log the uploaded file to the console
 * @param {event} Event The file loaded event
 */
function logFile (event) {
	let str = event.target.result;
	let json = JSON.parse(str);
	//console.log('string', str);
	console.log('json', json);
    fetch('http://localhost:5000/admin/questionnaire_upd', {
        headers: {
            'Content-type': 'application/json'
        },
    method: 'POST',
    body: JSON.stringify({surID : json.questionnaireID, surTitle : json.questionnaireTitle, keywords : json.keywords, questions : json.questions})
})
.then(response => response.json())
}

