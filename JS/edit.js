import { API_KEY } from './consants.js'; //importerer fra constants.js


export function idFromUrl() {// henter id fra url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id'); //returnerer post ID
}


async function fetchPostById(postId) {//funksjonen for å hente specific post basert på id 
    const apiUrl = `https://v2.api.noroff.dev/social/posts/${postId}`; //henter specific post via id
    const token = localStorage.getItem('auth_token'); //henter token fra local

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // bearer i header for autentisering
                'X-Noroff-API-Key': API_KEY, // henter API_KEY fra constants.js
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`); // feilmelding hvis respons ikke er ok
        }

        return await response.json(); //returnerer json-data for spesifikk post
    } catch (error) {
        console.error('Error fetching post:', error);
        return null; //returnerer null hvis det oppstår feil
    }
}

// Funksjon for å fylle ut formet med eksisterende postdata
async function addFormWithContent() {
    const postId = idFromUrl(); //henter post id fra urlen
    const post = await fetchPostById(postId); //henter spesifikk post

    if (post) {
        console.log(post); // For å sjekke dataen

        // adder data i form med data fra post
        document.getElementById('title').value = post.data.title || ''; //legger til overskrift
        document.getElementById('body').value = post.data.body || ''; //legger til innholdet
        document.getElementById('imageUrl').value = post.data.media?.url || ''; //legger til bilde eller tomt
        document.getElementById('imageAlt').value = post.data.media?.alt || ''; //legger til alt tekst eller tomt
    } else {
        document.getElementById('message').textContent = 'Error.'; // feilmelding hvis data ikke kan lastes
        document.getElementById('message').className = 'error'; // setter klassen til error for styling
    }
}

// Funksjon for å oppdatere post
async function updatePost(event) {
    event.preventDefault(); //forhinderer standard form sending

    const postId = idFromUrl(); //henter post id fra url
    const apiUrl = `https://v2.api.noroff.dev/social/posts/${postId}`; //api endepunkt for oppdatering
    const token = localStorage.getItem('auth_token'); //henter token fra local

    // Henter verdier fra form
    const title = document.getElementById('title').value; // henter tittel
    const body = document.getElementById('body').value; // henter innhold
    const imageUrl = document.getElementById('imageUrl').value; // henter bilde
    const imageAlt = document.getElementById('imageAlt').value; // henter alt tekst

    // json dataet for oppdateringen
    const updatedPost = {
        title: title, // setter tittel
        body: body, // setter innhold
        media: {
            url: imageUrl, // setter bilde
            alt: imageAlt // setter alt tekst
        }
    };

    // Fjerner body og media om feltene er tomme, siden bare tittel er påkrevd
    if (!body) delete updatedPost.body; // hvis innhold er tomt, slett body
    if (!imageUrl) delete updatedPost.media; // hvis bilde er tomt, slett media

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT', //PUT forespørsel for å oppdatere
            headers: {
                'Authorization': `Bearer ${token}`, // bearer token for autentisering
                'X-Noroff-API-Key': API_KEY, // henter API_KEY fra constants.js
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPost) //konverterer updatedPost til JSON
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`); // feilmelding ved feil
        }

        window.location.href = "/post/index.html"; //redirect til alle innlegg ved suksess
    } catch (error) {
        document.getElementById('message').textContent = 'Error updating post: ' + error.message; //feilmelding ved feil
        document.getElementById('message').className = 'error'; //setter klassen til error for styling
    }
}

// eventlistnener for form innsending
document.getElementById('editPostForm').addEventListener('submit', updatePost); // eventlistener for form


addFormWithContent(); // kjører funksjonen for å fylle ut formet
