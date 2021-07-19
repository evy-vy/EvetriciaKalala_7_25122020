// console.log(localStorage);
// if (!localStorage.token) {
//   window.location.href = "./login.html"
// }

fetch(api('getOneUser') + userId, {
  method: "GET",
  headers: {
    Authorization: "Bearer" + localStorage.token,
    Accept: 'application/json'
  }
})
  .then((response => response.json())
    .then(response => {
      const username = response.username;
      const profileCreation = response.createdAt;
      const email = response.email;
      const isAdmin = response.isAdmin;
    })
  )
console.log(response, username)
  .catch(error => {
    console.log(error)
  })
  .catch(error => res.status(200).json(error))



// document.getElementById("profil__data").append(profileUsername)
// const profileUsername = document.createElement('p');
// profileUsername.classList.add('profil__username');
// profileUsername.innerText = "Pseudo :" + username;
// profileUsername.innerText = "Date d'inscription :" + profileCreation;
// dataProfile.append(profileUsername);

// .then(response => {
//   const username = response.data_login.username;
//   const profileCreation = response.data_login.createdAt;
//   const email = response.data_login.email;
//   const isAdmin = response.data_login.isAdmin;
// })