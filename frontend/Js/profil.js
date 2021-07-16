let userId = '';
let profile;

function getUrlId() {
  let id = localStorage.getItem('userId');
  console.log(id)
  return id;
}
userId = getUrlId();
console.log(userId)

// function profileSelected(userId) {
//   return fetch(api("getOneUser") + userId), {
//     method: "GET",
//     headers: {
//       Authorization: 'Bearer ' + localStorage.getItem('token'),
//       Accept: 'application/json'
//     }
//   }
// }

// console.log(userId)

// async function userProfile() {
//   profile = await profileSelected(userId);
//   displayProfile(profile);
// }

// userProfile();

// function displayProfile(profile) {
//   let dataProfile = document.getElementById('profil__data');

//   const profileUsername = document.createElement('p');
//   profileUsername.classList.add('profil__username');
//   profileUsername.innerHTML = profile.username
//   // dataProfile.append(dataProfileParagraphe);

//   document.getElementById("profil__data").append(profileUsername)
// }





// let dataLogin = JSON.parse(localStorage.getItem(data_login));




// const dataProfileImg = document.createElement('div');
// dataProfileImg.classList.add('profil__img');
// dataProfile.append(dataProfileImg);

// const pic = document.createElement('img');
// // pix.src =
// pic.classList.add("profil__Pic");
// pic.setAttribute('alt', "photo de profile de" /*+ dataProfile.username*/);
// dataProfileImg.append(pic);

// // const addPic = document.createElement("button");
// // const picText = document.createTextNode("ajouter une photo");
// // addPic.append(picText);
// // dataProfileImg.append(addPic)



// const dataProfileUsername = document.createElement('p');
// dataProfileUsername.classList.add('profil__username');
// dataProfileUsername.innerHTML = "<span>Toto</span>" /*+ data_login.username*/
// dataProfile.append(dataProfileParagraphe);

// // const dataProfileParagraphe = document.createElement('p');
// // dataProfileParagraphe.classList.add('profilUsername');

// // dataProfileParagraphe.append(dataProfileDiv);
