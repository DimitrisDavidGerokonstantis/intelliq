document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/admin/healthcheck')
    .then(response => response.json())
    .then(data => loadHTML(data['data']));
    
});

function loadHTML(data) {
    const table = document.querySelector('#healthcheck_page');
   // let data1 = JSON.parse(data);
    let tableHtml = "";
    data.forEach(function ({status, Server, sqlport, Database1, User_Id, password}) {
        tableHtml += `<h2>{"status":${status}, "dbconnection":[Server=' ${Server}:5000' ,${sqlport}'; 'Database=' + ${Database1}+';' 'User Id='+ ${User_Id} + ';' 'Password=${password};]}</h2>`;
    });

    table.innerHTML = tableHtml;
}