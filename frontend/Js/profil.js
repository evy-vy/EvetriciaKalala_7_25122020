
if (!sessionStorage.user) {
  window.location.href = "login.html";
}


//get one user
function getValue() {
  let result = JSON.parse(sessionStorage.getItem('user'));
  let userId = result.userId;

  if (userId) {
    return fetch(api('url') + userId, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.token,
        Accept: 'application/json'
      }
    })
      .then(response => {
        return response.json();
      })
      .catch(error => {
        alert(error);
      });
  } else {
    alert("error")
  };
};

async function userById() {
  let userValues = await getValue();
  displayUserById(userValues);
}

userById();


function displayUserById(userValues) {
  let date = new Date(userValues.user.createdAt).toLocaleDateString('fr-FR', { year: "numeric", month: "long", day: "numeric" });
  let dateUpdate = new Date(userValues.user.updatedAt).toLocaleDateString('fr-FR', { year: "numeric", month: "long", day: "numeric" });
  const username = document.createElement('p')
  username.classList.add('profil__userame');
  username.innerHTML = "<span class='paragraphColor'>Pseudo : </span>" + userValues.user.username;

  const email = document.createElement('p')
  email.classList.add('profil__email');
  email.innerHTML = "<span class='paragraphColor'>Email : </span>" + userValues.user.email;

  const isAdmin = document.createElement('p')
  isAdmin.classList.add('profil__isAdmin');
  isAdmin.innerHTML = "<span class='paragraphColor'>Admin : </span>" + userValues.user.isAdmin;

  const createdAt = document.createElement('p')
  createdAt.classList.add('profil__creation');
  createdAt.innerHTML = "<span class='paragraphColor'>Date de creation :</span>" + date;

  const updatedAt = document.createElement('p')
  updatedAt.classList.add('profil__update');
  updatedAt.innerHTML = "<span class='paragraphColor'>Mis à jour : </span>" + dateUpdate;

  document.getElementById("profil__data").append(username, isAdmin, email, createdAt, updatedAt)
}

//update
/**********************gestion de la modification ou suppression de compte************************************/

const toggleModify = document.getElementById("settings--btn");
const toggleDelete = document.getElementById("delete--btn");
const modify = document.getElementById('modify');
const remove = document.getElementById('remove');

toggleModify.addEventListener('click', () => {
  if (getComputedStyle(modify).display == "none") {
    modify.style.display = "block";
    remove.style.display = "none";
  } else {
    modify.style.display = "none";
  }
})

toggleDelete.addEventListener('click', () => {
  if (getComputedStyle(remove).display == "none") {
    remove.style.display = "block";
    modify.style.display = "none";
  } else {
    remove.style.display = "none";
  }
})

//Verification des données 

const form = document.querySelector('#modifier');

//On écoute les modifications apportées dans l'évenement que l'on cible (input username).

form.newPassword.addEventListener('change', (e) => {
  const element = document.getElementById('newPasswordWarning');
  verifInput(e.target.value, 'password', element);
});

const verifInput = (value, type, element) => {
  let regExp;

  if (value.trim() === '') {
    element.innerHTML = 'Données non valides';
    element.classList.remove('text-success');
    element.classList.add('text-danger');
    return false;
  }

  switch (type) {
    case 'password':
      regExp = new RegExp('^[0-9a-zA-Z-+!*@%_]{8,15}');;
      break;
  }

  if (regExp.test(value)) {
    if (element != undefined) {
      element.innerHTML = 'Données valides';
      element.classList.remove('text-danger');
      element.classList.add('text-success');
    }
    return true;
  } else {
    if (element != undefined) {
      element.innerHTML = "Données non valides";
      element.classList.remove("text-success");
      element.classList.add("text-danger");
    }
    return false;
  };
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();

  checkForSubmit(e.target); // On envoi le form pour recupérer les champs 
})

const checkForSubmit = (form) => {

  const fields = [
    {
      "type": "password",
      "value": form.elements["password"].value
    },
    {
      "type": "password",
      "value": form.elements["newPassword"].value
    }
  ];

  let isValid = false;

  fields.forEach((data) => {
    //on parcours notre tableaux de champs, et on execute notre fonction de vérification
    isValid = verifInput(data["value"], data["type"]);
    if (!isValid) {
      return false
    }
  })

  //si tous les champs sont bons isValid sera égal a true
  if (isValid) {

    let result = JSON.parse(sessionStorage.getItem('user'));
    let userId = result.userId;

    if (userId) {
      fetch(api('url') + userId, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + result.token,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: form.elements["password"].value,
          newPassword: form.elements["newPassword"].value
        })
      })
        .then(response => {
          let infoElt = document.getElementById('info');
          if (password.value === modifyPassword.value) {
            modify.style.display = "none";
            infoElt.innerText = "Modification effectué"
          } else {
            modify.style.display = "none";
            infoElt.style.color = "red";
            infoElt.innerText = "Erreur d'authentification !"
          }
          return response.json
        })
        .catch(error => {
          alert(error)
        });
    } else {
      alert("error");
    }
  };
};


//delete

const deleteBtn = document.getElementById('deleteUser');
const deletePassword = document.getElementById('deletPassword');

deleteBtn.addEventListener('click', function (e) {
  e.preventDefault();
  e.stopPropagation();

  let password = deletePassword.value;
  deleteUser(password);
});

async function deleteUser(password) {

  let userValues = await getValue();

  fetch(api('url') + userValues.user.id, {
    method: "DELETE",
    headers: {

      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: password,
    })
  })
    .then(result => {
      remove.style.display = "none";
      let infoElt = document.getElementById('info');
      infoElt.innerText = "compte supprimé";
      window.location.href = 'index.html';
      return result.json()
    })
    .catch(error => {
      alert(error)
    });

}


const logoutBtn = document.getElementById('logout');
logoutBtn.addEventListener('click', logout)

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html"
}