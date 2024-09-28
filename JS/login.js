import { API_KEY } from './consants.js';//importerer fra consatns.js

const loginRegex = /^[a-zA-Z0-9._%+-]+@(noroff\.no|stud\.noroff\.no)$/;// enkel regex for login


async function login(email, password) {
    const loginApi = 'https://v2.api.noroff.dev/auth/login';// api for login

    const request = { //lager request
        email: email,
        password: password
    };

    try {
        const response = await fetch(loginApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}` //henter fra consants.js
            },
            body: JSON.stringify(request) //konverterer requesten til JSON
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        
        const token = data.data.accessToken;//henter access token fra respons

     
        localStorage.setItem('auth_token', token);//lagrer token i local storage

       window.location.href = "/home"; //redirect til home hvis riktig

    } catch (error) {//ved error vil den kunne vise error, pluss en generell error class blir brukt
        document.getElementById('message').textContent = 'Login failed: ' + error.message;
        document.getElementById('message').className = 'error';
    }
}


document.getElementById('loginForm').addEventListener('submit', function(event) {//legger til event listener til formet
    event.preventDefault(); // slik at det kan valideres

  
    const email = document.getElementById('email').value;// henter email og passord fra form på html
    const password = document.getElementById('password').value;


    if (!loginRegex.test(email)) { //regex validering
        document.getElementById('message').textContent = 'only @noroff.no or @stud.noroff.no allowed';
        document.getElementById('message').className = 'error';
        return;
    }

    //kaller login funskjonen når alt er validert
    login(email, password);
});
