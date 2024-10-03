const apiRegister = 'https://v2.api.noroff.dev/auth/register'; //api for register

async function register(userForm) {
    userForm.preventDefault(); // preventer standard skjemasending

    const name = document.getElementById('name').value; //henter brukernavn fra form
    const email = document.getElementById('email').value; //henter epost fra form
    const password = document.getElementById('password').value; //henter passord fra form

    const loginRegex = /^[a-zA-Z0-9._%+-]+@(noroff\.no|stud\.noroff\.no)$/;// enkel regex for login
    if (!loginRegex.test(email)) {
        document.getElementById('message').textContent = 'only @noroff.no or @stud.noroff.no allowed'; //viser feilmelding ved feil
        document.getElementById('message').className = 'error'; //setter klassen til error for styling
        return; //avslutter om ugyldig email
    }

    if (password.length < 8) { //setter at passord må være 8 i lengde
        document.getElementById('message').textContent = 'password needs to be at least 8 characters'; //viser feilmelding ved for kort passord
        document.getElementById('message').className = 'error'; //setter klassen til error for styling
        return; //avslutter hvis passord ikke er gyldig
    }
   
    const userData = {  //omgjør til json objekt
        name: name,
        email: email,
        password: password
    };

    try {
        const response = await fetch(apiRegister, {//selve foresplrelsen til api
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData) //konverterer data til json
        });

        if (!response.ok) { //sjekker om responsen er suksess
            throw new Error(`Error: ${response.status} ${response.statusText}`); //feilmelding ved feil
        }

        const data = await response.json(); //parser til json


        // console.log('register test', data); //debug

        window.location.href = '/login/index.html'; //redirecter til login hvis riktig
        
    } catch (error) { //feilhåntering 

        document.getElementById('message').textContent = 'Registration failed: ' + error.message; //viser feilmelding ved feil
        document.getElementById('message').className = 'error'; //setter klassen til error for styling
    }
}


document.getElementById('registerForm').addEventListener('submit', register); //håndterer innsending av skjema via event lisntner
