


getOnePost();

const postId = getId();
function getId() {
  const url = window.location.search;
  const params = new URLSearchParams(url);
  const id = params.get("id");
  return id;
}

function getSinglePost() {
  const postId = getId();
  const user = JSON.parse(sessionStorage.user);
  const token = user.token;
  return fetch(api('post') + postId, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      Accept: 'application/json'
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      alert(error);
    });
};

function getUserPost(id) {
  return getUser(id);
};

async function getOnePost() {
  const thisPost = await getSinglePost();

  console.log('post: ', thisPost)
  const post = thisPost.message;

  if (post === null) {
    window.location.href = '404.html';
  }

  const userPost = await getUserPost(post.userId);

  displayThisPost(post, userPost);
}

const comList = commentsLiList();
function displayThisPost(post, userPost) {

  const article = document.getElementById('article');
  article.dataset.key = post.id;

  const divIcon = document.getElementById("divIcon");

  getUser(getCurrentUserId()).then(response => {
    let user = response;


    if (getCurrentUserId() === post.userId) {
      const editIcon = document.createElement("i");
      editIcon.setAttribute("class", "fas fa-edit");
      editIcon.setAttribute("id", "edit");
      editIcon.dataset.key = article.dataset.key;

      const deleteIcon = document.createElement("i");
      deleteIcon.setAttribute("class", "fas fa-times-circle");
      deleteIcon.dataset.key = article.dataset.key;

      divIcon.append(editIcon, deleteIcon,)

      deleteIcon.addEventListener('click', (e) => {
        deletePost(postId);
      })

      editIcon.addEventListener('click', (e) => {
        const form = document.getElementById('post');

        const contentElt = document.getElementById('content');
        contentElt.value = post.content;

        const titleElt = document.getElementById('title');
        titleElt.value = post.title;

        if (getComputedStyle(form).display == "none") {
          form.style.display = "block";
        } else {
          form.style.display = "none";
        }
      })

    }

    if (user.isAdmin && getCurrentUserId() !== post.userId) {

      const deleteIcon = document.createElement("i");
      deleteIcon.setAttribute("class", "fas fa-times-circle");
      deleteIcon.dataset.key = article.dataset.key;

      divIcon.append(deleteIcon);

      deleteIcon.addEventListener('click', (e) => {
        deletePost(postId);
      })
    }


    const divPseudo = document.getElementById('card__pseudo');
    divPseudo.innerText = userPost.username;

    const divTime = document.getElementById('card__time');
    divTime.innerText = post.createdAt;

    const title = document.getElementById('card__title');
    title.innerText = post.title;


    paragrapheImg = document.getElementById('para__Img');

    let imageBody = null;
    if (post.imageURL != null) {

      imageBody = document.createElement('img');
      imageBody.setAttribute('src', post.imageURL);
      imageBody.setAttribute('alt', 'image publiée par l\'utilisateur');
      imageBody.classList.add('card__fullWidth');
    }

    const text = document.getElementById('card__text');
    text.innerText = post.content

    const footerDivComment = document.getElementById('card__comments');

    const commentLink = document.getElementById('showComments');

    commentLink.addEventListener('click', (e) => {
      const comments = document.getElementById('commentsList');
      if (getComputedStyle(comments).display == "none") {
        comments.style.display = "block";
      } else {
        comments.style.display = "none";
      }
    })

    const commentsDiv = document.getElementById('commentsList');

    const commentsForm = document.getElementById('commentsForm');

    commentsForm.dataset.key = post.id;

    const textForm = document.getElementById('textComment');


    const commentBtn = document.getElementById('comId');



    commentBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('click btn');

      let contentElt = document.getElementById('textComment');
      let content = contentElt.value;
      if (content.trim() == "") {

        const formErrorCtn = document.getElementById('form-comment-error');
        formErrorCtn.innerText = 'Le commentaire ne doit pas étre vide !'

        return false;
      }

      sendCom(post);
    })


    if (imageBody !== null) {
      console.log('ici')
      paragrapheImg.append(imageBody);
    }

  });

}


//suppression d'un post
function deletePost(postId) {

  const token = getCurrentToken();

  fetch(api('post') + postId, {
    method: "DELETE",
    headers:
    {
      Authorization: "Bearer " + token,
      Accept: 'application/json',
    },
  })
    .then(response => {
      response.json();
      window.location.href = "forum.html";
    })
    .catch(error => {
      alert(error)
    });
}


// Maj d'un com sur un post
const sendPostUpdateBtn = document.getElementById('send-post-btn');
sendPostUpdateBtn.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();

  const commentElt = document.getElementById('content');
  const comment = commentElt.value;


  if (comment.trim() == "") {

    const formErrorCtn = document.getElementById('form-error');
    formErrorCtn.innerText = 'Les champs ne doivent pas étre vide !';

    return false;
  }

  sendPost("PUT");
})

//recup des com ayant un postId similaire au post
function comments() {
  console.log(getCurrentToken())
  return fetch(api('comment') + postId, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + getCurrentToken(),
      Accept: "application/json"
    }
  })
    .then(response => {
      console.log('return return:', response)
      return response.json()
    })
    .catch(error => {
      alert(error)
    });
}

// recup des commentaires;
async function allComments() {
  const allComments = await comments();
  console.log(allComments);
  for (oneComment of allComments.comments) {
    console.log(oneComment);

    displayComments(oneComment);
  }
}

allComments();

//affichage des com
function displayComments(oneComment) {
  //on vérifie si l'user est admin ou si son id est = au com pour donner acces a la suppression ou non 
  let userId = getCurrentUserId();
  getUser(userId)
    .then(user => {
      console.log('user id admin? ')
      let comList2 = commentsLiList();
      const comsUsername = document.createElement('span');
      let deleteComsIcon = null;
      console.log('userid: ', user.id)
      console.log('oneComment: ', oneComment.userId)
      if (user.isAdmin || user.id == oneComment.userId) {
        deleteComsIcon = document.createElement('i');
        deleteComsIcon.classList.add('fas', 'fa-times-circle');
        deleteComsIcon.dataset.key = postId;
        deleteComsIcon.id = "deleteCom";

        deleteComsIcon.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          deleteComs(commentId);
        })
      }

      const commentId = oneComment.id;
      function deleteComs(commentId) {

        const userId = getCurrentUserId();
        const token = getCurrentToken();
        console.log('token: ', token)
        getUser(getCurrentUserId()).then(response => {
          let user = response;
          console.log('user: ', user)

          const info = {
            isAdmin: user.isAdmin,
            currentUserId: userId
          }

          return fetch(api('comment') + commentId, {
            method: "DELETE",
            headers:
            {
              Authorization: "Bearer " + getCurrentToken(),
              Accept: 'application/json',
              "Content-Type": "application/json",
            },
            body: JSON.stringify(info)
          })
            .then(response => {
              console.log(info);
              window.location.reload();
              response.json();
            })
            .catch(error => {
              alert(error)
            });

        })

      }

      getUser(oneComment.userId).then(response => {
        let postUser = response;

        comList2.classList.add('commentsLi');
        comList2.innerText = oneComment.comment;

        comsUsername.classList.add('comUsername');
        comsUsername.innerText = postUser.username;

        if (user.isAdmin || user.id == oneComment.userId) {
          comList2.append(deleteComsIcon);
        }

        document.getElementById('ulComments').append(comList2);
        comList2.append(comsUsername);

      })

    });
}

async function sendCom(post) {

  const postId = post.id;
  console.log('id: ', postId)
  const userId = getCurrentUserId();
  const commentElt = document.getElementById('textComment');
  const comment = commentElt.value;

  console.log("comment: ", comment);

  let headers = {
    "authorization": "Bearer " + getCurrentToken(),
    "Accept": "application/json",
    "Content-Type": "application/json"
  };

  let body = JSON.stringify({
    userId: userId,
    postId: postId,
    comment: comment
  })

  console.log('body: ', body)
  //envoyer les données
  fetch(api("comment"), {
    method: "POST",
    headers: headers,
    body: body

  })
    .then(response => {
      console.log('ici2');
      window.location.reload();
    })
    .catch(error => {
      alert(error)
    })
}

/*********************logout*****************/
const logoutBtn = document.getElementById('logout');
logoutBtn.addEventListener('click', logout)

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html"
}


