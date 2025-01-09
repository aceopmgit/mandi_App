import { handleApiError } from "../util/apiErrorHandler.js";
//login logic
const login = document.getElementById("loginForm");
login.addEventListener("submit", loginUser);

async function loginUser(e) {
  e.preventDefault();

  let email = document.getElementById("lEmail").value;
  let password = document.getElementById("lPassword").value;

  const details = {
    Email: email,
    Password: password,
  };

  try {
    const res = await axios.post(`/user/auth/login`, details);
    const { token } = res.data;
    console.log("res.data", res.data);

    localStorage.setItem("userToken", token); // Store access token
    alert(res.data.message);
    window.location.href = "/home";
  } catch (error) {
    // console.log(err);
    // document.body.innerHTML =
    //   document.body.innerHTML + `<h4 style="color: red;">${err}</h4>`;
    const errorMessage = handleApiError(error);
    // console.log(errorMessage);
    document.getElementById("loginError").innerHTML = errorMessage;
  }
}
