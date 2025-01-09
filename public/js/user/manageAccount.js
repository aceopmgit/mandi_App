const token = localStorage.getItem("userToken");
import { handleApiError } from "../util/apiErrorHandler.js";

// const queryString = window.location.search;
// const params = new URLSearchParams(queryString);

// const method = params.get("method");
// console.log(method);

// Access specific parameters
// const tab = params.get("tab");
// const menu = params.get("menu");
// const id = params.get("id");

// account info data handle
const account_info = document.getElementById("account_info");
account_info.addEventListener("click", showAccountInfo);

async function showAccountInfo(e) {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    //   menu item color change
    const menu_items = document.getElementsByClassName("menu_item");

    for (let i = 0; i < menu_items.length; i++) {
      menu_items[i].classList.remove("active");
    }
    // console.log(e.target.classList);
    e.target.classList.add("active");

    localStorage.setItem("side_menu_tab_u", "account_info");

    const main_section_container = document.getElementById(
      "main_section_container"
    );
    // getting state details
    const res = await axios.get(`/home/account-info`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    spinner.style.visibility = "hidden";

    // console.log(res.data.accountDetails);
    // console.log(accountDetails);
    const accountDetails = res.data.accountDetails;

    main_section_container.innerHTML = `
    <div class="details_section_content">
            <h1>Account Info</h1>

            <div class="details_row">
              <span>Company Name</span>
              <span>${accountDetails.name}</span>
            </div>
            <div class="details_row">
              <span>Company Email</span>
              <span>${accountDetails.email}</span>
            </div>
            <div class="details_row">
              <span>License Type</span>
              <span>${accountDetails.licenseName}</span>
            </div>
            <div class="details_row">
              <span>License Start Date</span>
              <span>${accountDetails.licenseStartDate}</span>
            </div>
            <div class="details_row">
              <span>License Expiry Date</span>
              <span>${accountDetails.licenseExpiryDate}</span>
            </div>
            <div class="details_row">
              <span>Maximum Sub-Admins Allowed</span>
              <span>${accountDetails.maxSubAdmin}</span>
            </div>
            <div class="details_row">
              <span>Maximum Account Type User Allowed</span>
              <span>${accountDetails.maxAccounts}</span>
            </div>
            <div class="details_row">
              <span>Maximum Normal User Allowed</span>
              <span>${accountDetails.maxNormalUsers}</span>
            </div>
            <div class="details_row">
              <span>Maximum Normal User Allowed</span>
              <span>${accountDetails.maxNormalUsers}</span>
            </div>

            <div class="details_row">
              <span>Active Sub-Admins</span>
              <span>${accountDetails.activeSubAdmin}</span>
            </div>

            <div class="details_row">
              <span>Active Accounts Type User</span>
              <span>${accountDetails.activeAccounts}</span>
            </div>

            <div class="details_row">
              <span>Active Normal Users</span>
              <span>${accountDetails.activeNormalUsers}</span>
            </div>
          </div>
    `;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.log(errorMessage);

    // console.log(error);
    // if (error && error.response.data.error === "jwt expired") {
    //   alert("Your Session has expired ! Please Login Again");
    //   window.location.href = "/admin/";
    //   localStorage.removeItem("adminToken");
    // }
  }
}

// company state data handle
const userStates = document.getElementById("userStates");
userStates.addEventListener("click", showUserStatesDetails);
async function showUserStatesDetails(e) {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    //   menu item color change
    const menu_items = document.getElementsByClassName("menu_item");

    for (let i = 0; i < menu_items.length; i++) {
      menu_items[i].classList.remove("active");
    }
    // console.log(e.target.classList);
    e.target.classList.add("active");

    localStorage.setItem("side_menu_tab_u", "userStates");

    const main_section_container = document.getElementById(
      "main_section_container"
    );

    main_section_container.innerHTML = `
    <div class="create_btn_div">
    <p></p>
            <button id="update" class="submitBtn">Update</button>
          </div>
          <div class="main_section_content">
            <ul class="main_section_title">              
            </ul>
            <div class="main_section_data">
              
            </div>
          </div>
    `;

    const updateButton = document.getElementById("update");
    updateButton.addEventListener("click", () => {
      // console.log("hio");
      window.location.href = `/home/details?tab=manageAccount&menu=userStates&method=update&id=null`;
    });

    //---------------------------------------------------- for showing state list----------------------------------------------------

    // getting state details
    const res = await axios.get(`/home/user-states`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(res.data);
    const userStatesDetails = res.data.userStates;

    spinner.style.visibility = "hidden";

    if (userStatesDetails.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
      <div style="margin: auto">
            <h1 style="font-size: 2.5rem; font-weight: 400;">No States Added By The Company.</h1>
        </div>`;
      return;
    }

    // const accountDetails = res.data.accountDetails;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.log(errorMessage);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const storedTab = localStorage.getItem("side_menu_tab_u");
  console.log(storedTab);

  // Remove 'active' class from all menu items before applying
  const menu_items = document.getElementsByClassName("menu_item");
  for (let i = 0; i < menu_items.length; i++) {
    menu_items[i].classList.remove("active");
  }

  if (storedTab) {
    console.log("hello");
    // Get the tab element from localStorage and add the 'active' class
    const tab = document.getElementById(storedTab);
    if (tab) {
      tab.click();
      // tab.classList.add("active");
      // console.log(tab, tab.classList);
    }
  } else {
    account_info.click();
    // Default behavior if no tab is stored
    // account_info.classList.add("active");
    // console.log(account_info, account_info.classList);
  }
});
