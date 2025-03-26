const token = localStorage.getItem("userToken");
import { handleApiError } from "../util/apiErrorHandler.js";

function errorHandler(error) {
  const errorMessage = handleApiError(error);
  console.log(error);
  alert(errorMessage);
}

async function showUserProfileInfo() {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    // content handle
    const main_section_container = document.getElementById(
      "main_section_container"
    );

    main_section_container.innerHTML = `
      <div class="create_btn_div">
      <p></p>
              <button id="resetPassword" class="submitBtn">Reset Password</button>
            </div>

            <br />
        <br />
            <h1 id="menu_title">Profile</h1>
        <br />
        <br />

            <div class="main_section_content" id="details_section_content">
              
            </div>
      `;
    const res = await axios.get(`/home/profile-info`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userInfo = res.data.userInfo;
    spinner.style.visibility = "hidden";

    const details_section_content = document.getElementById(
      "details_section_content"
    );

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>User Name</h2>
               <p>${userInfo.userName}</p>
    </div>

    <div class="details_section_row">
          <h2>Email </h2>
          <p>${userInfo.email}</p>
    </div>

    <div class="details_section_row">
          <h2>Phone </h2>
          <p>${userInfo.phone}</p>
    </div>

    <div class="details_section_row">
          <h2>Role </h2>
          <p>${userInfo.role}</p>
    </div>    

    <div class="details_section_row">
          <h2>Company Name</h2>
          <p>${userInfo.company}</p>
    </div>

    

    `;

    // for reseting user password;
    document.getElementById("resetPassword").addEventListener("click", () => {
      main_section_container.innerHTML = `<div class="create_btn_div">
  <p></p>
  <div>
    <button
      id="saveUserPassword"
      class="submitBtn"
      type="submit"
      form="resetUserPasswordForm"
    >
      Save
    </button>

    <button id="cancelButton" class="cancelBtn">Cancel</button>
  </div>
</div>

<br />
<br />
<h1 id="menu_title">Reset Password</h1>
<br />
<br />

<div class="main_section_content" id="details_section_content"></div>`;

      const details_section_content = document.getElementById(
        "details_section_content"
      );
      details_section_content.innerHTML = `
        <form id="resetUserPasswordForm">
  <div class="form_content">
    <div class="error" id="error"></div>
    <div class="form_control">
      <label for="oldPassword">Enter Current Password</label>
      <input
        type="password"
        id="oldPassword"
        name="oldPassword"
        placeholder="Enter current password"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="newPassword">Enter New Password</label>
      <input
        type="password"
        id="newPassword"
        name="newPassword"
        placeholder="Enter new password"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="cPassword">Confirm New Password</label>
      <input
        type="password"
        id="cPassword"
        name="cPassword"
        placeholder="Confirm new password"
        required
      />
      <br />
    </div>
  </div>
</form>`;

      // ---------------------------------------------------- for updating user password----------------------------------------------------

      document
        .getElementById("resetUserPasswordForm")
        .addEventListener("submit", async (e) => {
          try {
            e.preventDefault();

            const formdata = new FormData(e.target);
            const data = {};
            formdata.forEach((value, key) => {
              data[key] = value;
            });

            console.log(data);

            if (data.newPassword !== data.cPassword) {
              document.getElementById(
                "error"
              ).innerHTML = `New Password and Confirm Password do not match. Please try again.`;
              return;
            }

            // spinner.style.visibility = "visible";
            const res = await axios.post(`/home/profile/reset-password`, data, {
              headers: { Authorization: `Bearer ${token}` },
            });

            showUserProfileInfo();

            //   showCompanyUserDetails();
          } catch (error) {
            const errorMessage = handleApiError(error);
            document.getElementById("error").innerHTML = errorMessage;
            console.log(error);
          }
        });
    });
  } catch (error) {
    errorHandler(error);
  }
}

window.addEventListener("DOMContentLoaded", showUserProfileInfo);
