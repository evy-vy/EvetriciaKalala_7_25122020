if (!sessionStorage.user) {
  window.location.href = "login.html";
}

getAllPosts();

const addPost = document.getElementById('add__post');
// addPost.addEventListener('click', function (e) {
//   e.preventDefault();
//   e.stopPropagation();

//   console.log('addPost');
// })


// async function sendPost2(e) {
//   console.log('sendPost')
//   e.preventDefault();
//   e.stopPropagation();

//   const user = JSON.parse(sessionStorage.user);
//   const userId = user.userId;
//   const token = user.token;
//   let image = document.getElementById('image').files[0];
//   const titleElt = document.getElementById('title');
//   const title = titleElt.value;

//   const contentElt = document.getElementById("content");
//   const content = contentElt.value;

//   let headers = {
//     "authorization": "Bearer " + token,
//     "Accept": "application/json",
//   };

//   let body = '';
//   if (image) {
//     console.log('image ok')
//     const formData = new FormData();
//     formData.append('image', image);

//     formData.append('userId', userId);
//     formData.append('title', title);
//     formData.append('content', content);
//     body = formData;
//   } else {
//     headers["Content-Type"] = "application/json"
//     body = JSON.stringify({
//       userId: userId,
//       title: title,
//       content: content
//     });

//   }

//   //envoyer les données
//   fetch(api("post"), {
//     method: "POST",
//     headers: headers,
//     body: body
//   })
//     .then(response => {
//       console.log('ici2');
//       displayForm.style.display = "none";
//       window.location.reload();

//     })
//     .catch(error => {
//       alert(error)
//     });
//   console.log("coucou");
// }

function getPosts() {

  //Recuperer tous les messages
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

async function getAllPosts() {
  const result = await getPosts();
  //Les affichés
  for (post of result.posts) {
    displayPosts(post);
  }
}

//fonction qui permet l'ajout d'une icone delete pour chaque article ajouté au panier



function displayPosts(post) {

  const article = document.createElement('article');
  article.dataset.key = post.id;
  article.classList.add('card');

  const header = document.createElement('header');
  header.classList.add('card__header', 'card__header--avatar');

  const imageProfil = document.createElement('img');
  imageProfil.setAttribute('src', './images/20456790.jpg');
  imageProfil.setAttribute('alt', 'photo profil de l\'utilisateur');
  imageProfil.classList.add('card__avatar');

  const divPseudo = document.createElement('div');
  divPseudo.classList.add("card__pseudo");
  divPseudo.innerText = post.User.username;

  const divTime = document.createElement('div');
  divTime.classList.add('card__time');
  divTime.innerText = post.createdAt;

  const title = document.createElement('h2');
  title.classList.add('card__title');
  title.innerText = post.title;

  const divBody = document.createElement('div');
  divBody.classList.add('card__body');

  let paragrapheImg = null;
  let imageBody = null;
  if (post.imageURL != null) {
    paragrapheImg = document.createElement('p');
    paragrapheImg.classList.add('para__Img');

    imageBody = document.createElement('img');
    imageBody.setAttribute('src', post.imageURL);
    imageBody.setAttribute('alt', 'image publiée par l\'utilisateur');
    imageBody.classList.add('card__fullWidth');
  }


  const text = document.createElement('p');
  text.classList.add('card__text');
  text.innerText = post.content;

  const postFooter = document.createElement('footer');
  postFooter.classList.add("card__footer");

  const footerDivLike = document.createElement('div');
  footerDivLike.classList.add('card__like');

  const likeLink = document.createElement('a');
  likeLink.setAttribute('href', '#');
  likeLink.innerText = 120;
  const likeIcon = document.createElement('i');
  likeIcon.setAttribute("class", 'far fa-thumbs-up');

  const footerDivDislike = document.createElement('div');
  footerDivDislike.classList.add('card__dislike');

  const dislikeLink = document.createElement('a');
  dislikeLink.setAttribute('href', '#');
  dislikeLink.innerText = 12;
  const dislikeIcon = document.createElement('i');
  dislikeIcon.setAttribute('class', 'far fa-thumbs-down');

  const footerDivComment = document.createElement('div');
  footerDivComment.id = 'card__comments';

  const commentLink = document.createElement('a');
  commentLink.setAttribute('href', './singlePost.html?id=' + post.id);
  commentLink.innerText = 65;
  const commentIcon = document.createElement('i');
  commentIcon.setAttribute('class', 'far fa-comment-alt');

  document.getElementById('main').append(article);
  article.append(header, divBody, postFooter);
  header.append(imageProfil, divPseudo, divTime, title);

  if (paragrapheImg !== null) {
    divBody.append(paragrapheImg);
    paragrapheImg.append(imageBody);
  }
  divBody.append(text);
  postFooter.append(footerDivLike, footerDivDislike, footerDivComment);
  footerDivLike.append(likeLink);
  footerDivDislike.append(dislikeLink);
  footerDivComment.append(commentLink);
  likeLink.append(likeIcon);
  dislikeLink.append(dislikeIcon);
  commentLink.append(commentIcon);

}

//faire une requete pour recupere le nombre de commentaire

//creer carte en remplissant les infos

/****************************gestion btn***************************/

const sendPostBtn = document.getElementById("send-post-btn");
// sendPostBtn.addEventListener('click', sendPost);
sendPostBtn.addEventListener('click', function () {
  sendPost("POST");
}
);

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
const logoutBtn = document.getElementById('logout');
logoutBtn.addEventListener('click', logout)

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html"
}







//indiqué le post id quelque part sur la carte (ex: data-id=)


//gerer le click affichage commentaire
//recuperer l'id du post concerné (ex: data-id)
//faire une requete pour recuperer les commentaires du post concerné
//affiché les comm

//gerer l'ajout de commentaire
//recuperer l'id du post concerné (ex: data-id)
//affiché le form d'ajout
//envoyé les infos au serveur (au click)
//affiché a la suite le nouveau comm

