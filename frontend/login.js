const loginBtn = document.querySelector('#login-btn');
//console.log("kara");
loginBtn.onclick = function () {
    const emailInput = document.querySelector('#email');
    const email = emailInput.value;
    emailInput.value = "";

    const passwordInput = document.querySelector('#password');
    const password = passwordInput.value;
    passwordInput.value = "";

    fetch('http://localhost:5000/login'+'/'+email+'/'+password, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET'
        
    })
    .then(response => response.json()).then(data => Navigate(data['data']));
    
    function Navigate(data){
        const wrong = document.querySelector('#wrong_credentials');
        console.log(JSON.stringify(data));
        if(JSON.stringify(data) === '[]'){
            
            wrong.hidden = false;  
    }
        else {
            let role = data[0].roles;
            if(role == 'user'){
                location.replace('showQuestionnaires.html');
            }
            else if(role == 'admin'){
                location.replace('index.html');
            }
        }
    }
   // .then(data => insertRowIntoTable(data['data']));
}
