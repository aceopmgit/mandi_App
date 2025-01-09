const resetPassword = document.getElementById("resetForm");
resetPassword.addEventListener("submit", reset);

async function reset(e) {
  e.preventDefault();
  let remail = document.getElementById("remail").value;

  const details = {
    email: remail,
  };
  try {
    const res = await axios.post(`/user/password/reset-email`, details);
    console.log(res);
    alert(res.data.message);
    document.getElementById("remail").value = "";
  } catch (err) {
    alert(err.response.data.message);
    console.log(err);
  }
}
