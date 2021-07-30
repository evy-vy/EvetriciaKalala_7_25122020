//on verifie si un post est 1er pour pouvoir lui passer un message "new"
let isFirst = true;

if (!sessionStorage.user) {
  window.location.href = "login.html";
}

//permet de recuperer tous les post dès l'acces a la page
getAllPosts();

const addPost = document.getElementById('add__post');

//Fonction pour recuperer tous les messages
function getPosts() {
  return fetch(api("post"), {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      alert(error)
    });
}
//on récupère chaque post dans l'array de posts
async function getAllPosts() {
  const result = await getPosts();

  for (post of result.posts) {
    displayPosts(post);
    //On verifie s'il y a un élément dans le localstorage, si oui on verifie son id. l'id sera ensuite comparé avec les autres postId ce qui permet de savoir si un post est 1er ou pas pour afficher le message "new"    
    if (sessionStorage.showFirst !== null) {
      isFirst = sessionStorage.showFirst == post.id;
    }
    sessionStorage.showFirst = post.id;
    isFirst = false;
  }
}


//on affiche les posts
function displayPosts(post) {

  //s'il s'agit du tout 1er message il reçoit le message 'new'
  let newest = '';
  if (isFirst) {
    newest = '<p class="new">New</p>';
  }

  let img = '';
  if (post.imageURL !== null) {
    img = '<p id="para__Img"><img src="' + post.imageURL + '" alt="image publiée par l\'utilisateur"></p>';
  }
  document.getElementById('main').innerHTML +=
    `<article class = "card" "data-key"=${post.id}>
    ${newest}
        <header class = "card__header card__header--avatar">
          <img src="./images/20456790.jpg" alt="photo profil de l'utilisateur" class="card__avatar">
            <div class="card__pseudo">${post.User.username}</div>
            <div class="card__time">${new Date(post.createdAt).toLocaleDateString('fr-FR', { year: "numeric", month: "long", day: "numeric" })}</div>
            <a id="title__link" href="./singlePost.html?id=${post.id}"><h2 class="card__title">${post.title}</h2>
            </a>
        </header>
        <div id ="card__body">
          ${img}
          <p class ="card__text">${post.content}</p>
        </div>
        <footer class="card__footer">
          <div class="card__like">
            <a href="#"><i class="far fa-thumbs-up" aria-hidden="true"></i></a>
          </div>
          <div class="card__dislike">
            <a href="#"><i class="far fa-thumbs-down" aria-hidden="true"></i></a>
          </div>
          <div id="card__comments"><a href="./singlePost.html?id=${post.id}"><i class="far fa-comment-alt" aria-hidden="true"></i></a></div>
        </footer>
      </article>`

  const paraImg = document.getElementById('para__Img');

}

/****************************gestion btn***************************/

//bouton du form pour envoyer un post
const sendPostBtn = document.getElementById("send-post-btn");


sendPostBtn.addEventListener('click', function () {
  const titleElt = document.getElementById('title');
  const title = titleElt.value;

  const contentElt = document.getElementById("content");
  const content = contentElt.value;
  if (content.trim() == "" || title.trim() == "") {

    const formErrorCtn = document.getElementById('form-error');
    formErrorCtn.innerText = 'Les champs ne doivent pas être vide !'

    return false;
  }
  sendPost("POST");
});

//logo bulle qui permet d'afficher ou non le formulaire permettant l'ajout d'un post
const toggleDisplayForm = document.getElementById("add__post");
const displayForm = document.getElementById('post');

toggleDisplayForm.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (getComputedStyle(displayForm).display == "none") {
    displayForm.style.display = "block";
  } else {
    displayForm.style.display = "none";
  }
})

/*********************logout*****************/
//permet la déconnection de l'user
const logoutBtn = document.getElementById('logout');
logoutBtn.addEventListener('click', logout)

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html"
}
