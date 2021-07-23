
const addCommentaire = document.getElementById('add__commentaire');
addCommentaire.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();

  console.log('addComment');


})

const sendPostBtn = document.getElementById("send-post-btn");
sendPostBtn.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();

  //recuperer userId
  const user = JSON.parse(sessionStorage.user);
  const userId = user.userId;
  const token = user.token;
  const titleElt = document.getElementById("title");
  const contentElt = document.getElementById("content");
  const title = titleElt.value;
  const content = contentElt.value;

  fetch(api("post"), {
    method: "POST",
    headers: {
      "authorization": "Bearer " + token,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      title: title,
      content: content
    })
  })

  //recuperer le token
  //recuperer les info du form
  //envoyer les données

})


const logoutBtn = document.getElementById('logout');
logoutBtn.addEventListener('click', logout)

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html"
}