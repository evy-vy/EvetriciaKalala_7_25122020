const api = (url) => {
  let apiUrl =
  {
    postUserSignUp: "http://localhost:3000/api/auth/signup",
    postUserLogIn: "http://localhost:3000/api/auth/login",
    url: "http://localhost:3000/api/auth/",
    post: "http://localhost:3000/api/post/"

  }

  return apiUrl[url];
}