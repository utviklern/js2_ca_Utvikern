document.addEventListener('DOMContentLoaded', () => {
    const loginDynamic = document.getElementById('logindynamic');
    const authToken = localStorage.getItem('auth_token');

    if (authToken) { 
        
        loginDynamic.innerHTML = `<a href="#" id="logout">Log out</a>`;// Hvis auth token er i local, så viser den log out
        
        
        document.getElementById('logout').addEventListener('click', function() {//eventlistener for å logge ut og tømme local
            localStorage.removeItem('auth_token'); //fjerner token
            localStorage.removeItem('current_author'); //brikernavn
            window.location.href = '/login/index.html'; //redirect etter sletting
        });
    } else {
        
        loginDynamic.innerHTML = `<a href="/login/index.html">Login</a>`;//hvis auth token ikke er i local, så viser den log in
    }
});
