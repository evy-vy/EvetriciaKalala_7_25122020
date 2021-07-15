const api = (url) => {
  let apiUrl =
  {
    postUserSignUp: "http://localhost:3000/api/auth/signUp",
    postUserLogIn: "http://localhost:3000/api/auth/login"

  }

  return apiUrl[url];
}