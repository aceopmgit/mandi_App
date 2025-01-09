//signup logic
const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", signup);

async function signup(e) {
  try {
    e.preventDefault();
    document.getElementById("signupError").innerHTML = ""; // Clear previous errors

    let name = document.getElementById("sname").value;
    let email = document.getElementById("semail").value;
    let phone = document.getElementById("sphone").value;
    let password = document.getElementById("spassword").value;
    let cpassword = document.getElementById("cpassword").value;

    // Check if passwords match
    if (password !== cpassword) {
      document.getElementById("signupError").innerHTML =
        "Passwords do not match. Please try again!";
      return;
    }

    const details = {
      Name: name,
      Email: email,
      Phone: phone,
      Password: password,
    };

    // Send request to backend
    const res = await axios.post(`/user/create-user`, details);

    if (res.data.status) {
      alert("Signup successful!");
      window.location.href = `/login`;
    }
  } catch (err) {
    if (err.response && err.response.data.errors) {
      console.log(err);
      // Display validation errors from backend
      const errors = err.response.data.errors;
      document.getElementById("signupError").innerHTML = errors.join("<br>");
    } else {
      console.error(err);
      document.getElementById("signupError").innerHTML =
        "Something went wrong. Please try again later.";
    }
  }
}
