/**
 * Retour de user id
 * @returns int
 */
function getCurrentUserId() {
  const user = JSON.parse(sessionStorage.user);
  return user.userId;
}

/**
 * Retourne le token
 * @returns string
 */
function getCurrentToken() {
  const user = JSON.parse(sessionStorage.user);
  return user.token;
}

function getUserAction(id) {

  return fetch(api('url') + id, {
    method: "GET",
    headers: {
      Accept: 'application/json'
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      alert(error);
    });

}

async function getUser(id) {
  let result = await getUserAction(id);
  return result.user;
}

/**
 * 
 * @param string methode 
 */
function sendPost(methode) {
  let url = null;

  switch (methode) {
    case "PUT":
      const article = document.getElementById('article');
      let postId = article.dataset.key;
      url = api("post") + postId;
      break;
    case "POST":
      url = api("post");
      break;
  }


  const userId = getCurrentUserId();
  let image = document.getElementById('image').files[0];
  const titleElt = document.getElementById('title');
  const title = titleElt.value;

  const contentElt = document.getElementById("content");
  const content = contentElt.value;

  let headers = {
    "authorization": "Bearer " + getCurrentToken(),
    "Accept": "application/json",
  };

  let body = '';
  if (image) {
    const formData = new FormData();
    formData.append('image', image);

    formData.append('userId', userId);
    formData.append('title', title);
    formData.append('content', content);
    body = formData;
  } else {

    headers["Content-Type"] = "application/json"
    body = JSON.stringify({
      userId: userId,
      title: title,
      content: content
    });
  }

  //envoyer les données
  fetch(url, {
    method: methode,
    headers: headers,
    body: body
  })
    .then(response => {

      const form = document.getElementById('post');
      form.style.display = "none";
      window.location.reload();

    })
    .catch(error => {
      alert(error)
    });
}


function commentsLiList() {
  const commentLi = document.createElement('li');
  return commentLi
}