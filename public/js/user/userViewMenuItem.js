const token = localStorage.getItem("userToken");
import { handleApiError } from "../util/apiErrorHandler.js";

const queryString = window.location.search;
const params = new URLSearchParams(queryString);

// Access specific parameters
const tab = params.get("tab");
const menu = params.get("menu");
const method = params.get("method");
const id = params.get("id");

console.log(tab, menu, method, id);

const goBack = document.getElementById("goBack");
goBack.addEventListener("click", () => {
  window.location.href = "/home/manage-account";
});

function modalControl() {
  const modalClose = document.getElementById("modal_close");
  modalClose.addEventListener("click", () => {
    document.getElementById("modal_container").classList.remove("show");
  });
}

async function updateUserState() {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(`/home/get-states/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    spinner.style.visibility = "hidden";

    const states = res.data.stateDetails;
    console.log(states);

    const details_section_content = document.getElementById(
      "details_section_content"
    );

    document.getElementById("menu_title").innerHTML = `Update User States`;

    document.getElementById("button_container").innerHTML = `
              <button id='saveStates' class="submitBtn" type="submit"
            form="updateUserStateForm">Save</button>
          <button id='cancelUpdateButton' class="cancelBtn">Cancel</button>
    `;

    details_section_content.innerHTML = `
      <form id="updateUserStateForm">
      <div class="form_content">
        
        <div class="permissions">
      <label>Select States</label>
      <br>
      <br>
      <div class="error" id="error"></div>
      <br>
      ${states
        .map((ele) => {
          return `
          <div class="input_checkbox">
          <input
            type="checkbox"
            id="${ele.id}"
            name="${ele.name} permissions"
            value="${ele.id}"
          />
          <label for="${ele.name}">${ele.name}</label>
        </div>
          `;
        })
        .join("")}
      

    
      </div>
    </form>
      `;

    //   getting user states and showing user selected states
    const response = await axios.get(`/home/user-states`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(res.data);
    const userStatesDetails = response.data.userStates;

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    const selectedChecboxId = userStatesDetails.map((ele) => ele.id);

    Array.from(checkboxes).map((ele) => {
      console.log(
        selectedChecboxId.includes(ele.id),
        ele.id
        // selectedChecboxId
      );
      if (selectedChecboxId.includes(ele.id)) {
        ele.checked = true;
      }
    });

    // for updating user states
    document
      .getElementById("editRoleForm")
      .addEventListener("submit", async (e) => {
        try {
          e.preventDefault();
          // console.log("hello");

          const errorDiv = document.getElementById("error");
          const checkboxes = document.querySelectorAll(
            'input[type="checkbox"]'
          );

          errorDiv.textContent = "";

          const isChecked = Array.from(checkboxes).some((cb) => cb.checked);

          if (!isChecked) {
            errorDiv.textContent = "Please select at least one permission.";
            return;
          }

          const roleName = document.getElementById("roleName").value;
          const permissions = Array.from(checkboxes).filter((cb) => cb.checked);
          const details = {
            roleName: roleName,
            permissions: permissions.map((ele) => ele.id),
          };

          const spinner = document.getElementById("loading_spinner");
          spinner.style.visibility = "visible";

          const res = await axios.post(
            `/admin/updateRoleDetails/${id}`,
            details,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          showRoleDetails(id);
        } catch (error) {
          console.log(error);
          if (error.response.data.error === "jwt expired") {
            alert("Your Session has expired ! Please Login Again");
            window.location.href = "/admin/";
            localStorage.removeItem("adminToken");
          }
        }
      });
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.log(errorMessage);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    //------------------------------- manage account data handling-------------------------------
    if (tab === "manageAccount") {
      updateUserState();
    }
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.log(errorMessage);
  }
});
