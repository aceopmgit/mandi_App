const resetPassword = document.getElementById("resetForm");
resetPassword.addEventListener("submit", reset);

async function reset(e) {
  e.preventDefault();
  let remail = document.getElementById("remail").value;

  const details = {
    email: remail,
  };
  try {
    const res = await axios.post(`/admin/password/resetEmail`, details);
    console.log(res);
    alert(res.data.message);
    resetPassword.reset();
  } catch (err) {
    alert(err.response.data.message);
    console.log(err);
  }
}
