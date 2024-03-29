/*******************************FORM***************************************/

// récupération du formulaire
const form = document.querySelector('#connexion');

//On écoute les modifications apportées dans l'évenement que l'on cible (input username).
form.username.addEventListener('change', (e) => {
  //je récupère la balise qui me permettra de transmettre un message au client selon que la valeur saisie dans l'evenement cible est bon ou mauvais en fonction du type que l'on attend.
  const element = document.getElementById('usernameWarning');
  verifInput(e.target.value, 'string', element);
});

form.password.addEventListener('change', (e) => {

  const element = document.getElementById('passwordWarning');
  verifInput(e.target.value, 'password', element);
});


/************************** Validation FORM******************************/
/*fonction qui vérifie le type de la valeur saisie dans les champs par rapport à la regExp attribué. 
* un message est ensuite affichée si la valeur est bonne ou fausse
*/

const verifInput = (value, type, element) => {
  let regExp;

  if (value.trim() === '') {
    element.innerHTML = 'Données non valides';
    element.classList.remove('text-success');
    element.classList.add('text-danger');
    return false;
  }

  switch (type) {

    case 'string':
      regExp = new RegExp("^[0-9a-zA-Z-@_]{2,10}");
      break;
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

//Soumission du formulaire. On met l'écouteur d'évènement directement sur le form et on écoute l'évènement.
const checkForSubmit = (form) => {
  const fields = [

    {
      "type": "string",
      "value": form.elements["username"].value,
    },

    {
      "type": "password",
      "value": form.elements["password"].value
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

  if (isValid) {
    sendData(form);
  }

  function sendData() {
    const data = [];
    //récupère les valeurs entrées dans le formulaire et les formates
    const formData = new FormData(document.getElementById("connexion"));

    //me permet de creer une nouvelle ligne pour chaque clé et valeur du tableau
    formData.forEach(function (value, key) {
      data[key] = value;
    })

    const user = {
      "token": data.token,
      "userId": data.userId,
      "username": data.username,
      "email": data.email,
      "password": data.password
    }

    fetch(api("postUserLogIn"), {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    })
      .then(response => response.json())
      .then(data => {
        if (data.userId) {
          sessionStorage.setItem("user", JSON.stringify(data));
          window.location = "./forum.html";
        } else {
          const loginError = document.getElementById("login-error");
          loginError.innerText = data.error;
          return false
        }
      })
      .catch(error => {
        alert(error);
      });
  }
};


