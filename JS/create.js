import { API_KEY } from './consants.js'; //importerer fra constants.js

const apiCreate = 'https://v2.api.noroff.dev/social/posts'; //api for create

async function createPost(newPost) {
    newPost.preventDefault(); // preventer standard skjema sending

    //henter innholdet fra html
    const title = document.getElementById('title').value; //tittelen
    const body = document.getElementById('body').value; //hovedinnhold
    const imageUrl = document.getElementById('imageUrl').value; //bilde url
    const imageAlt = document.getElementById('imageAlt').value; //alt text

    const token = localStorage.getItem('auth_token'); //token fra local

    
    const postData = { //json data for inlegg
        title: title,
        body: body, 
        media: {
            url: imageUrl,
            alt: imageAlt
        }
    };

    //hvis felt er tomme slettes dem, da bare tittel er påkrevd
    if (!body) delete postData.body;
    if (!imageUrl) delete postData.media;

    try {
        const response = await fetch(apiCreate, { //koden for å sende forespørsel til api
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'X-Noroff-API-Key': API_KEY, 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData) //konverterer postData til json
        });

        if (!response.ok) { 
            throw new Error(`Error: ${response.status} ${response.statusText}`); //hvis ikke ok, så
        }

        document.getElementById('message').textContent = 'Post created successfully!'; // Suksessmelding
        document.getElementById('message').className = 'success'; // Setter klassen til success for styling

        window.location.href = "/post/"; //redirecter til post ved suksess

    } catch (error) { // feilhåndtering
        document.getElementById('message').textContent = 'Error: ' + error.message; //viser feilmelding ved feil
        document.getElementById('message').className = 'error'; //setter klassen til error for styling
    }
}

document.getElementById('createPostForm').addEventListener('submit', createPost); //eventlisnter for skjema
