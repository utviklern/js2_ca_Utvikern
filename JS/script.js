import { API_KEY } from './consants.js';//importerer fra consatns.js

async function fetchAllPosts() {
    const apiUrl = 'https://v2.api.noroff.dev/social/posts?_author=true'; //api med author i param
    const token = localStorage.getItem('auth_token'); //token fra local

    console.log("auth:", token);
    console.log("api key: ", API_KEY);

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

        const posts = await response.json(); // Returnerer alle innleggene
        // console.log("api test:", posts);
        return posts.data.slice(0, 12);// slice slike at de 12 siste inlegg vises
    } catch (error) {
        console.error('Error:', error);
        return []; //ved feil får man tom array
    }
}




function displayLast12Posts(posts) {
    const postsList = document.getElementById('posts-list');//henter fra html
    postsList.innerHTML = ''; //tømmer innhold

    posts.forEach(post => {
        const postItem = document.createElement('li'); //for hvert innhold lages en li som viser content
        postItem.classList.add('post-card'); //adder class til li 

        
        const author = post.author.name;// author navn

        //sjekker om bilde eksiserter før eventuelle feil kommer. hvis bilde, vises bilde, hvis ikke vises tomt.
        const postImage = post.media?.url ? `<img src="${post.media.url}" alt="${post.media.alt || 'Post image'}">` : '';

        const made = new Date(post.created).toLocaleString(); //viser når inlegget ble laget

       
        const readMoreId = `<a href="/single/index.html?id=${post.id}" class="read-more-btn">Read more</a>`;//read more specific ved hjelp av id

        //legger inn diverse info i html hentet over
        postItem.innerHTML = `
            <h3>${post.title}</h3>
            ${postImage}
            <p><strong>Author:</strong> ${author}</p>
            <p><strong>Date:</strong> ${made}</p>
            <p>${post.body}</p>
            ${readMoreId} 
        `;
        postsList.appendChild(postItem);
    });
}


async function showPosts() {
    const posts = await fetchAllPosts(); //henter alle posts
    displayLast12Posts(posts); //viser kun de 12 siste
}

// kjører showPosts når siden lastes
showPosts();
