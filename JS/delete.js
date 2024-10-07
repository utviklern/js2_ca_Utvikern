import { idFromUrl } from './edit.js'; //importerer fra edit.js
import { API_KEY } from './consants.js'; //importerer fra constants.js

/**
 * delete post via id
 * 
 * @async
 * @function deletePost
 * @returns {Promise<void>} redirect ved suksess
 * @throws {Error} viser feil hvis sletting mislykkes
 */

async function deletePost() {
    const postId = idFromUrl(); // henter post id fra url
    const apiUrl = `https://v2.api.noroff.dev/social/posts/${postId}`; // api for post
    const token = localStorage.getItem('auth_token'); // henter token fra local storage

    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE', // delete metode for å slette
            headers: {
                'Authorization': `Bearer ${token}`, // bearer i header for autentisering
                'X-Noroff-API-Key': API_KEY, // henter key fra constants.js
                'Content-Type': 'application/json' // content satt til json
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`); //hvis respons ikke er grei
        }

        window.location.href = "/post/";//redirect til post hvis ok
    
    } catch (error) {
        document.getElementById('message').textContent = 'Error: ' + error.message; //feilmelding ved feil
        document.getElementById('message').className = 'error';//setter klassen til error for styling
    }
}
document.getElementById('delete').addEventListener('click', deletePost); //eventlistener for delete knappen


