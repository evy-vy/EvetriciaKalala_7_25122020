
if (!sessionStorage.user) {
  window.location.href = "login.html";
}


//get one user
function getValue() {
  let result = JSON.parse(sessionStorage.getItem('user'));
  let userId = result.userId;
  console.log(result)
  console.log(userId)
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
  console.log('ici')
  let userValues = await getValue();
  console.log(userValues)
  displayUserById(userValues);
}

// getValue()
userById();

function displayUserById(userValues) {
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
  createdAt.innerHTML = "<span class='paragraphColor'>Date de creation : </span>" + userValues.user.createdAt.slice(2, 10);

  const updatedAt = document.createElement('p')
  updatedAt.classList.add('profil__update');
  updatedAt.innerHTML = "<span class='paragraphColor'>Mis à jour : </span>" + userValues.user.updatedAt.slice(2, 10);

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

  console.log('click')

  checkForSubmit(e.target); // On envoi le form pour recupérer les champs 
})

const checkForSubmit = (form) => {
  // console.log('coucou');
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
  // console.log('je suis la')
  let isValid = false;

  fields.forEach((data) => {
    // console.log('et la aussi');
    //on parcours notre tableaux de champs, et on execute notre fonction de vérification
    isValid = verifInput(data["value"], data["type"]);
    if (!isValid) { //si isValid est false on sort de la boucle
      return false
    }
  })

  //si tous les champs sont bons isValid sera égal a true
  if (isValid) {

    console.log('isValid')
    let result = JSON.parse(sessionStorage.getItem('user'));
    let userId = result.userId;
    console.log(result)
    console.log(userId)

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
          console.log('donnee modifié');
          modify.style.display = "none";
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

  let password = deletePassword.value;

  deleteUser(password);

});

async function deleteUser(password) {
  // console.log('ici')
  let userValues = await getValue();
  // console.log('val:', userValues)

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
      console.log('result: ', result)
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