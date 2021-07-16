const api = (url) => {
  let apiUrl =
  {
    postUserSignUp: "http://localhost:3000/api/auth/signup",
    postUserLogIn: "http://localhost:3000/api/auth/login",
    getOneUser: "http://localhost:3000/api/auth/:id"

  }

  return apiUrl[url];
}