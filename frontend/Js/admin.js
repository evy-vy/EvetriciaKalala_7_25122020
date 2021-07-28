// getAllUsers();

const addUser = document.getElementById('usersList');

//Fonction pour recuperer tous les messages
function getUsers() {
  return fetch(api("url"), {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(response => {
      console.log(response)

      return response.json();
    })
    .catch(error => {
      alert(error)
    });
}
// async function getAllUsers() {
//   //   const result = await getUsers();
//   //   for (user of result.userss) {
//   //     displayPosts(user);
//   console.log(result.users)
// }