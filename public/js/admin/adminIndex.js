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
  console.log(details);

  try {
    const res = await axios.post(`/admin/loginCheck`, details);
    const { token } = res.data;

    localStorage.setItem("adminToken", token); // Store access token
    alert(res.data.message);
    window.location.href = "/admin/Home";
  } catch (err) {
    console.log(err);
    document.body.innerHTML =
      document.body.innerHTML + `<h4 style="color: red;">${err}</h4>`;
  }
}
