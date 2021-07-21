/*******************************FORM***************************************/

// récupération du formulaire
const form = document.querySelector('#inscription');

//On écoute les modifications apportées dans l'évenement que l'on cible (input username).
form.username.addEventListener('change', (e) => {

  const element = document.getElementById('usernameWarning');
  verifInput(e.target.value, 'string', element);
});

form.password.addEventListener('change', (e) => {

  const element = document.getElementById('passwordWarning');
  verifInput(e.target.value, 'password', element);
});

form.email.addEventListener('change', (e) => {

  const element = document.getElementById('emailWarning');
  verifInput(e.target.value, 'email', element);
});


/************************** Validation FORM******************************/
/*fonction qui me permet de vérifier le type de la valeur saisie dans les champs selon que ce soit un email, un string ou une adresse par rapport à la regExp qui lui est attribué. 
* un message est ensuite affichée si la valeur est bonne ou fausse
*/

const verifInput = (value, type, element) => {
  let regExp;

  //on vérifie que les champs soient bien remplis et qu'aucun espace ou tab etc seul ne soit accepté comme valeur valide.
  if (value.trim() === '') {
    element.innerHTML = 'Données non valides';
    element.classList.remove('text-success');
    element.classList.add('text-danger');
    return false;
  }

  switch (type) {
    case 'email':
      regExp = new RegExp('^[0-9a-zA-Z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}');
      break;
    case 'string':
      regExp = new RegExp("^[0-9a-zA-Z-@_]{4,10}");
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
  // console.log('coucou');
  const fields = [
    {
      "type": "email",
      "value": form.elements["email"].value,
    },
    {
      "type": "string",
      "value": form.elements["username"].value,
    },

    {
      "type": "password",
      "value": form.elements["password"].value
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
    sendData(form);
    alert("inscription ok");
  }

  function sendData() {
    const data = [];

    //récupère les valeurs entrées dans le formulaire et les formates
    const formData = new FormData(document.getElementById("inscription"));

    //me permet de creer une nouvelle ligne pour chaque clé et valeur du tableau
    formData.forEach(function (value, key) {
      data[key] = value;
    })

    const post = {
      "username": data.username,
      "email": data.email,
      "password": data.password
    }
    fetch(api("postUserSignUp"), {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post)
    })
      .then(response => response.json())
      .then(() => {
        window.location.href = "./login.html";
      })
      .catch(error => {
        alert(error)
      });
  }
};


