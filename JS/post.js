import { API_KEY } from './consants.js'; //importerer fra constants.js

/**
 * fetcher innlegg fra api som er laget av den innloggede brukeren
 * 
 * @async
 * @function fetchUserPosts
 * @returns {Promise<Array>} returner en liste med innlegg fra den innloggede brukeren
 * @throws {Error} viser feil hvis ikke ok
 */

async function fetchUserPosts() {
    const apiUrl = 'https://v2.api.noroff.dev/social/posts?_author=true'; //api med author i param
    const token = localStorage.getItem('auth_token'); //token fra local
    const currentAuthor = localStorage.getItem('current_author'); //henter brukernavnet til innlogget bruker fra local

    console.log("auth:", token);
    console.log("api key:", API_KEY);

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // bearer i header
                'X-Noroff-API-Key': API_KEY, //henter fra constants.js
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const posts = await response.json(); //alle innlegg i api
   
        return posts.data.filter(post => post.author.name === currentAuthor);//filtrerer innlegg basert på current_author i local
    } catch (error) {
        console.error('Error:', error);
        return []; //ved feil får man tom array
    }
}

/**
 * viser brukerens innlegg i dom
 * 
 * @function displayUserPosts
 * @param {Array} posts listen med innlegg som skal vises
 */

function displayUserPosts(posts) { //funskjon for å vise inlegg
    const postsList = document.getElementById('posts-list'); //henter fra html
    postsList.innerHTML = ''; //tømmer innhold

    posts.forEach(post => {
        const postItem = document.createElement('li'); //for hvert innhold lages en li som viser content
        postItem.classList.add('post-card'); //adder class til li 

        const author = post.author.name; // author navn

        //sjekker om bilde eksiserter før eventuelle feil kommer. hvis bilde, vises bilde, hvis ikke vises tomt.
        const postImage = post.media?.url ? `<img src="${post.media.url}" alt="${post.media.alt || 'Post image'}">` : '';

        const made = new Date(post.created).toLocaleString(); //viser når inlegget ble laget

        const readMoreId = `<a href="/single/index.html?id=${post.id}" class="read-more-btn">Read more</a>`; //read more specific ved hjelp av id

        const editPostBtn = `<a href="/edit/index.html?id=${post.id}" class="edit-btn">Edit</a>`; //edit knapp for å redigere/slette post

        //legger inn diverse info i html hentet over
        postItem.innerHTML = `
            <h3>${post.title}</h3>
            ${postImage}
            <p><strong>Author:</strong> ${author}</p>
            <p><strong>Date:</strong> ${made}</p>
            <p>${post.body}</p>
            ${readMoreId} 
            ${editPostBtn}
        `;
        postsList.appendChild(postItem); //legger til li i ul
    });
}
/**
 * samler funksjonene for å hente og vise brukerens innlegg
 * 
 * @async
 * @function showUserPosts
 * @returns {Promise<void>} kaller displayUserPosts for å vise innleggene i dom
 */

async function showUserPosts() { //samler funksjoene
    const posts = await fetchUserPosts(); //henter alle brukerens posts
    displayUserPosts(posts); //viser alle brukerens innlegg
}


showUserPosts();//kjører showUserPosts når siden lastes
