/*******************************FORM***************************************/

// const { allowedNodeEnvironmentFlags } = require("node:process");

// récupération du formulaire
const form = document.querySelector('#inscription');

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
      regExp = new RegExp("^[-'a-zA-ZÀ-ÖØ-öø-ÿ ]+$");
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
  console.log('coucou');
  const fields = [
    {
      "type": "email",
      "value": form.elements["element"].value,
    },
    {
      "type": "string",
      "value": form.element["username"].value,
    },

    {
      "type": "password",
      "value": form.element["password"].value
    }
  ];
  console.log('je suis la')
  let isValid = false;

  fields.forEach((item) => {
    console.log('et la aussi');
    //on parcours notre tableaux de champs, et on execute notre fonction de vérification
    isValid = verifInput(item["value"], item["type"]);
    if (!isValid) { //si isValid est false on sort de la boucle
      console.log('puis ici')
      return false
    }
  })

  if (isValid) {
    console.log('et meme la')
    sendData(form);
    alert("inscription ok");
  }


  const sendData = () => {
    const data = [];

    //récupère les valeurs entrées dans le formulaire et les formates
    const formData = new FormData(document.getElementById('inscription'));

    formData.forEach(function (value, key) {
      data[key] = value;
    })

    const datasList = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const datasInStorage = JSON.parse(localStorage.getItem(key));
      datasList.push(datasInStorage.id);
    }

    const userData = {
      "user": {
        "userName": data.userName,
        "email": data.email,
        "password": data.password
      },
      "users": datasList
    }

    fetch(api("postUserSignUp"), {
      method: "POST" ?
        headers : {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
      body: JSON.stringify(userData)
    })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem("userData", JSON.stringify(data));
        window.location.href = "./frontend/login.html";
      })
      .catch(error => {
        alert(error)
      });
  };
};

