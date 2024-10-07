import { API_KEY } from './consants.js'; //importerer fra consatns.js


/**
 * henter post id via url param
 * 
 * @returns {string|null} post-id fra url eller null hvis ikke funnet
 */

function postIdFromUrl() {//for å hente id fra url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id'); //id´en
}

/**
 * henter specific post via id fra api
 * 
 * @async
 * @function getPostViaId
 * @param {string} postId id'en til posten som skal hentes
 * @returns {Promise<Object|null>} Postdata hvis ok, eller null ved feil
 * @throws {Error} viser feil hvis hentingen ikke er ok
 */

async function getPostViaId(postId) {// henter specific post via id
    const apiUrl = `https://v2.api.noroff.dev/social/posts/${postId}?_author=true`; //api med param for spesifc post
    const token = localStorage.getItem('auth_token'); //token fra local

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // bearer token i header
                'X-Noroff-API-Key': API_KEY, //api-key fra constants.js
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const post = await response.json(); //returnerer spesifikt innlegg fra API-et
        // console.log("respons test:", post); 
        return post; // returnerer innlegg data
    } catch (error) {
        console.error('Error', error);
        return null; //returnerer null ved feil
    }
}

/**
 * viser single post ved å hente posten basert på id fra url.
 * 
 * @async
 * @function showSingle
 * @returns {Promise<void>} populate html med content fra post hvis ok
 */

async function showSingle() {//funskjon for å vise single post
    const postId = postIdFromUrl();//henter id fra url
    const post = await getPostViaId(postId); //specific via api

    if (post && post.data) {
        const postContent = document.getElementById('post-content'); //html id

        postContent.classList.add('post-card'); //adder class til div for styling

        const author = post.data.author?.name || 'Anonym'; 

        //sjekker om bilde eksiserter før eventuelle feil kommer. hvis bilde, vises bilde, hvis ikke vises tomt.
        const postImage = post.data.media?.url ? `<img src="${post.data.media.url}" alt="${post.data.media.alt || 'Post image'}">` : '';

        const made = new Date(post.data.created).toLocaleString(); //viser når inlegget ble laget

        //legger inn diverse info i html hentet over
        postContent.innerHTML = `
            <h3>${post.data.title}</h3>
            ${postImage}
            <p><strong>Author:</strong> ${author}</p>
            <p><strong>Date:</strong> ${made}</p>
            <p>${post.data.body}</p>
        `;
    } else {
        document.getElementById('post-content').innerHTML = '<p>content was not found or was deleted.</p>'; //hvis feil ved innlastning
    }
}

showSingle();//kjører koden
