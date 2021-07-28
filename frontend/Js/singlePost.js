
// getOnePost();

// const postId = getId();
// function getId() {
//   const url = window.location.search;
//   const params = new URLSearchParams(url);
//   const id = params.get("id");
//   return id;
// }
// // let postId = getId();

// function getSinglePost() {
//   const postId = getId();
//   const user = JSON.parse(sessionStorage.user);
//   // const userId = user.userId
//   const token = user.token;
//   return fetch(api('post') + postId, {
//     method: "GET",
//     headers: {
//       Authorization: "Bearer " + token,
//       Accept: 'application/json'
//     }
//   })
//     .then(response => {
//       return response.json();
//     })
//     .catch(error => {
//       alert(error);
//     });
// };

// function getUserPost(id) {
//   // const userId = user.userId
//   return getUser(id);
// };

// async function getOnePost() {
//   const thisPost = await getSinglePost();
//   const post = thisPost.message;
//   const userPost = await getUserPost(post.userId);

//   // console.log('userPost: ', userPost)
//   displayThisPost(post, userPost);
// }

// const comList = commentsLiList();
// function displayThisPost(post, userPost) {

//   const titleElt = document.getElementById('title');
//   titleElt.value = post.title;

//   const contentElt = document.getElementById('content');
//   contentElt.value = post.content;

//   // const name = thisPost.message;
//   const article = document.createElement('article');
//   article.dataset.key = post.id;
//   article.classList.add('card');
//   article.id = "article";

//   const divIcon = document.createElement("div");
//   divIcon.classList.add('divIcon');

//   // console.log(thisPost);
//   // console.log('userId:', getCurrentUserId())
//   getUser(getCurrentUserId()).then(response => {
//     let user = response;
//     // return response.json();

//     // console.log('user recup: ', user)
//     // console.log('user admin: ', user.isAdmin)

//     // if (getCurrentUserId() === post.userId || user.isAdmin) {
//     //   const editIcon = document.createElement("i");
//     //   editIcon.setAttribute("class", "fas fa-edit");
//     //   editIcon.setAttribute("id", "edit");
//     //   editIcon.dataset.key = article.dataset.key;

//     //   const deleteIcon = document.createElement("i");
//     //   deleteIcon.setAttribute("class", "fas fa-times-circle");
//     //   deleteIcon.dataset.key = article.dataset.key;

//     //   divIcon.append(editIcon, deleteIcon,)

//     //   deleteIcon.addEventListener('click', (e) => {
//     //     deletePost(postId);
//     //   })

//     //   editIcon.addEventListener('click', (e) => {
//     //     const form = document.getElementById('post');
//     //     if (getComputedStyle(form).display == "none") {
//     //       form.style.display = "block";
//     //     } else {
//     //       form.style.display = "none";
//     //     }
//     //   })

//     // }

//     if (getCurrentUserId() === post.userId) {
//       const editIcon = document.createElement("i");
//       editIcon.setAttribute("class", "fas fa-edit");
//       editIcon.setAttribute("id", "edit");
//       editIcon.dataset.key = article.dataset.key;

//       const deleteIcon = document.createElement("i");
//       deleteIcon.setAttribute("class", "fas fa-times-circle");
//       deleteIcon.dataset.key = article.dataset.key;

//       divIcon.append(editIcon, deleteIcon,)

//       deleteIcon.addEventListener('click', (e) => {
//         deletePost(postId);
//       })

//       editIcon.addEventListener('click', (e) => {
//         const form = document.getElementById('post');
//         if (getComputedStyle(form).display == "none") {
//           form.style.display = "block";
//         } else {
//           form.style.display = "none";
//         }
//       })

//     }

//     if (user.isAdmin && getCurrentUserId() !== post.userId) {

//       const deleteIcon = document.createElement("i");
//       deleteIcon.setAttribute("class", "fas fa-times-circle");
//       deleteIcon.dataset.key = article.dataset.key;

//       divIcon.append(deleteIcon);

//       deleteIcon.addEventListener('click', (e) => {
//         deletePost(postId);
//       })


//     }

//     const header = document.createElement('header');
//     header.classList.add('card__header', 'card__header--avatar');

//     const imageProfil = document.createElement('img');
//     imageProfil.setAttribute('src', './images/20456790.jpg');
//     imageProfil.setAttribute('alt', 'photo profil de l\'utilisateur');
//     imageProfil.classList.add('card__avatar');

//     const divPseudo = document.createElement('div');
//     divPseudo.classList.add("card__pseudo");
//     divPseudo.innerText = userPost.username;

//     const divTime = document.createElement('div');
//     divTime.classList.add('card__time');
//     divTime.innerText = post.createdAt;

//     const title = document.createElement('h2');
//     title.classList.add('card__title');
//     title.innerText = post.title;

//     const divBody = document.createElement('div');
//     divBody.classList.add('card__body');

//     let paragrapheImg = null;
//     let imageBody = null;
//     if (post.imageURL != null) {
//       paragrapheImg = document.createElement('p');
//       paragrapheImg.classList.add('para__Img');

//       imageBody = document.createElement('img');
//       imageBody.setAttribute('src', post.imageURL);
//       imageBody.setAttribute('alt', 'image publiée par l\'utilisateur');
//       imageBody.classList.add('card__fullWidth');
//     }

//     const text = document.createElement('p');
//     text.classList.add('card__text');
//     text.innerText = post.content

//     const postFooter = document.createElement('footer');
//     postFooter.classList.add("card__footer");

//     const footerDivLike = document.createElement('div');
//     footerDivLike.classList.add('card__like');

//     const likeLink = document.createElement('a');
//     likeLink.setAttribute('href', '#');
//     likeLink.innerText = 120;
//     const likeIcon = document.createElement('i');
//     likeIcon.setAttribute("class", 'far fa-thumbs-up');

//     const footerDivDislike = document.createElement('div');
//     footerDivDislike.classList.add('card__dislike');

//     const dislikeLink = document.createElement('a');
//     dislikeLink.setAttribute('href', '#');
//     dislikeLink.innerText = 12;
//     const dislikeIcon = document.createElement('i');
//     dislikeIcon.setAttribute('class', 'far fa-thumbs-down');

//     const footerDivComment = document.createElement('div');
//     footerDivComment.id = 'card__comments';


//     const commentLink = document.createElement('a');
//     commentLink.setAttribute('href', '#');
//     commentLink.id = 'showComments'
//     commentLink.innerText = 65;

//     commentLink.addEventListener('click', (e) => {
//       const comments = document.getElementById('commentsList');
//       if (getComputedStyle(comments).display == "none") {
//         comments.style.display = "block";
//       } else {
//         comments.style.display = "none";
//       }
//     })

//     const commentIcon = document.createElement('i');
//     commentIcon.setAttribute('class', 'far fa-comment-alt');

//     const commentsDiv = document.createElement('div');
//     commentsDiv.id = 'commentsList';

//     const commentsForm = document.createElement('form');
//     commentsForm.setAttribute('method', 'post');
//     commentsForm.id = "commentsForm";
//     commentsForm.dataset.key = post.id

//     const textForm = document.createElement('textarea');
//     textForm.setAttribute('class', 'form-control');
//     textForm.setAttribute('class', 'input__form');
//     textForm.setAttribute('type', 'text');
//     textForm.setAttribute('id', 'textComment');
//     textForm.setAttribute('name', 'textComment');
//     textForm.setAttribute('placeholder', 'Votre commentaire ...');
//     textForm.setAttribute('row', 10);
//     textForm.setAttribute('cols', 30);
//     textForm.setAttribute('require', 'require');

//     const commentBtn = document.createElement('button');
//     commentBtn.classList.add('comBtn');
//     commentBtn.id = 'comId';
//     commentBtn.setAttribute('type', 'submit');
//     commentBtn.setAttribute('value', 'envoyer');
//     commentBtn.innerHTML = '<i class="fa fa-paper-plane" aria-hidden="true"></i>'


//     commentBtn.addEventListener('click', function (e) {
//       e.preventDefault();
//       e.stopPropagation();
//       console.log('click btn');
//       sendCom(post);
//     })


//     document.getElementById('main').append(article);
//     article.append(header, divBody, postFooter, commentsDiv);
//     header.append(divIcon, imageProfil, divPseudo, divTime, title);

//     if (paragrapheImg !== null) {
//       divBody.append(paragrapheImg);
//       paragrapheImg.append(imageBody);
//     }

//     divBody.append(text);
//     postFooter.append(footerDivLike, footerDivDislike, footerDivComment);
//     footerDivLike.append(likeLink);
//     footerDivDislike.append(dislikeLink);
//     footerDivComment.append(commentLink);
//     likeLink.append(likeIcon);
//     dislikeLink.append(dislikeIcon);
//     commentLink.append(commentIcon);
//     commentsDiv.append(commentsForm,);
//     commentsForm.append(textForm, commentBtn);
//     // commentsDiv.append(ulComments);
//     // ulComments.append(comList);

//   });

// }


// //suppression d'un post
// function deletePost(postId) {
//   const user = JSON.parse(sessionStorage.user);
//   const token = user.token;
//   fetch(api('post') + postId, {
//     method: "DELETE",
//     headers:
//     {
//       Authorization: "Bearer " + token,
//       Accept: 'application/json'
//     },
//   })
//     .then(response => {
//       response.json();
//       alert('votre message a été supprimé');
//     })
//     .catch(error => {
//       alert(error)
//     });
// }


// // Maj d'un com sur un post
// const sendPostUpdateBtn = document.getElementById('send-post-btn');
// sendPostUpdateBtn.addEventListener('click', function (e) {
//   e.preventDefault();
//   e.stopPropagation();

//   const commentElt = document.getElementById('textComment');
//   const comment = commentElt.value;


//   if (comment.trim() == "") {

//     const formErrorCtn = document.getElementById('form-error');
//     formErrorCtn.innerText = 'Le commentaire ne doit pas étre vide !'

//     return false;
//   }

//   sendPost("PUT");
// })

// //recup des com ayant un postId similaire au post
// function comments() {
//   console.log(getCurrentToken())
//   return fetch(api('comment') + postId, {
//     method: "GET",
//     headers: {
//       Authorization: "Bearer " + getCurrentToken(),
//       Accept: "application/json"
//     }
//   })
//     .then(response => {
//       console.log('return return:', response)
//       return response.json()
//     })
//     .catch(error => {
//       alert(error)
//     });
// }

// // recup des commentaires;
// async function allComments() {
//   const allComments = await comments();
//   console.log(allComments);
//   //Les affichés
//   for (oneComment of allComments.comments) {
//     console.log(oneComment);

//     displayComments(oneComment);
//   }
// }

// allComments();

// //affichage des com
// function displayComments(oneComment) {
//   //on vérifie si l'user est admin ou si son id est = au com pour donner acces a la suppression ou non 
//   let userId = getCurrentUserId();
//   getUser(userId)
//     .then(user => {
//       console.log('user id admin? ')
//       let comList2 = commentsLiList();
//       const comsUsername = document.createElement('span');
//       let deleteComsIcon = null;
//       if (user.isAdmin) {

//         deleteComsIcon = document.createElement('i');
//         deleteComsIcon.classList.add('fas', 'fa-times-circle');
//         deleteComsIcon.dataset.key = postId;
//         deleteComsIcon.id = "deleteCom";

//         deleteComsIcon.addEventListener('click', function (e) {
//           e.preventDefault();
//           e.stopPropagation();
//           deleteComs(commentId);
//         })
//       }

//       const commentId = oneComment.id;
//       function deleteComs(commentId) {

//         getCurrentUserId()
//         return fetch(api('comment') + commentId, {
//           method: "DELETE",
//           headers:
//           {
//             Authorization: "Bearer " + getCurrentToken(),
//             Accept: 'application/json'
//           },
//         })
//           .then(response => {
//             response.json();
//           })
//           .catch(error => {
//             alert(error)
//           });
//       }


//       comList2.classList.add('commentsLi');
//       comList2.innerText = oneComment.comment;

//       comsUsername.classList.add('comUsername');
//       comsUsername.innerText = user.username;

//       if (user.isAdmin) {
//         comList2.append(deleteComsIcon);
//       }

//       document.getElementById('ulComments').append(comList2);
//       comList2.append(comsUsername);

//     });
// }

// async function sendCom(post) {

//   const postId = post.id;
//   console.log('id: ', postId)
//   const userId = getCurrentUserId();
//   const commentElt = document.getElementById('textComment');
//   const comment = commentElt.value;

//   console.log("comment: ", comment);

//   let headers = {
//     "authorization": "Bearer " + getCurrentToken(),
//     "Accept": "application/json",
//     "Content-Type": "application/json"
//   };

//   let body = JSON.stringify({
//     userId: userId,
//     postId: postId,
//     comment: comment
//   })

//   console.log('body: ', body)
//   //envoyer les données
//   fetch(api("comment"), {
//     method: "POST",
//     headers: headers,
//     body: body

//   })
//     .then(response => {
//       console.log('ici2');
//       window.location.reload();
//     })
//     .catch(error => {
//       alert(error)
//     })
// }

// // on verifie que le com n'est pas vide 

// // const form = document.querySelector("#commentsForm");

// // if (form === null) {
// //   return false;
// // }


// /*********************logout*****************/
// const logoutBtn = document.getElementById('logout');
// logoutBtn.addEventListener('click', logout)

// function logout() {
//   sessionStorage.clear();
//   window.location.href = "login.html"
// }


