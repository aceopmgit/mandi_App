const token = localStorage.getItem("userToken");
import { handleApiError } from "../util/apiErrorHandler.js";

function errorHandler(error) {
  const errorMessage = handleApiError(error);
  console.log(error);
  alert(errorMessage);
}

function userRoleDropdownControl() {
  const selected = document.querySelector('[data-id="stateSelected"]');

  const option_container = document.querySelector(
    '[data-id="stateOptionContainer"]'
  );
  const optionsList = Array.from(
    document.querySelectorAll('[data-id="stateOption"]')
  );
  const searchBox = document.getElementById("state_search_box_input");
  // console.log("selected", selected);
  // console.log("option_container", option_container);
  // console.log("optionsList", optionsList);
  // console.log("searchBox", searchBox);

  selected.addEventListener("click", () => {
    option_container.classList.toggle("active");
    searchBox.value = "";
    filterList("");
    if (option_container.classList.contains("active")) {
      searchBox.focus();
    }
  });

  optionsList.forEach((ele) => {
    ele.addEventListener("click", async (e) => {
      selected.innerHTML = ele.querySelector("label").innerHTML;
      option_container.classList.remove("active");
      const id = ele.querySelector("input").id;

      document.getElementById("userRoleId").value = id;
      console.log(document.getElementById("userRoleId").value);
      console.log(id);
    });
  });

  searchBox.addEventListener("keyup", (e) => {
    filterList(e.target.value);
  });

  const filterList = (searchTerm) => {
    searchTerm = searchTerm.toLowerCase();
    optionsList.forEach((option) => {
      let label =
        option.firstElementChild.nextElementSibling.innerText.toLowerCase();
      if (label.indexOf(searchTerm) != -1) {
        option.style.display = "block";
      } else {
        option.style.display = "none";
      }
    });
  };

  document.addEventListener("click", (event) => {
    if (
      !option_container.contains(event.target) &&
      !selected.contains(event.target) &&
      !searchBox.contains(event.target)
    ) {
      option_container.classList.remove("active");
    }
  });
}

async function showUserInfo() {
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
              <button id="add" class="submitBtn">Add</button>
            </div>
            <div class="main_section_content">
              <ul class="main_section_title">              
              </ul>
              <div class="main_section_data">
                
              </div>
            </div>
      `;

    //---------------------------------------------------- for adding company trader----------------------------------------------------

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", async (e) => {
      try {
        // console.log("hio");
        // window.location.href = `/home/details?tab=manageAccount&menu=companyLocation&method=update&id=null`;

        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const res = await axios.get(`/home/manage-user/user-roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        spinner.style.visibility = "hidden";

        const roles = res.data.roleDetails;
        console.log(res.data);

        main_section_container.innerHTML = `
<div class="content_area">
<div class="create_btn_div">
  <p></p>
  <div>
    <button
      id="saveUser"
      class="submitBtn"
      type="submit"
      form="addUserForm"
    >
      Save
    </button>
    <button id="cancelUpdateButton" class="cancelBtn">Cancel</button>
  </div>
</div>

<form id="addUserForm">
  <div class="form_content">
  <div class="error" id="error"></div>
    <div class="form_control">
      <label for="Name">Username</label>
      <input
        type="text"
        id="Name"
        name="Name"
        placeholder="Enter Username"
        required
      />
      <br />
    </div>
    <div class="form_control">
      <label for="Email">Email</label>
      <input
        type="text"
        id="Email"
        name="Email"
        placeholder="Enter Email"
        required
      />
      <br />
    </div>
    <div class="form_control">
      <label for="Phone">Phone</label>
      <input
        type="tel"
        id="Phone"
        name="Phone"
        placeholder="Enter Phone"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="Password">Password</label>
      <input
        type="password"
        id="Password"
        name="Password"
        placeholder="Enter Password"
        required
      />
    </div>
    <br />

    <div class="form_control">
      <label for="roles">Role</label>

      
      <div class="selection_area" data-id="stateSelectionArea">
        <div class="select_box" data-id="selectStateBox">
          <div class="option_container" data-id="stateOptionContainer">
            ${roles
              .map((ele) => {
                if (ele.name !== "Admin") {
                  return `
            <div class="option" data-id="stateOption">
              <input type="radio" class="radio" name="" id="${ele.id}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
                }
              })
              .join("")}
          </div>

          <div class="selected" data-id="stateSelected">Select Role</div>
          <div class="search_box" data-id="stateSearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="state_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
        <input
          type="text"
          id="userRoleId"
          name="userRoleId"          
          style="display: none"
        />
        <br />
      </div>
  </div>
</form>


</div>  
    `;

        userRoleDropdownControl();

        document
          .getElementById("cancelUpdateButton")
          .addEventListener("click", () => {
            window.location.href = `/home/manage-user`;
          });

        document
          .getElementById("addUserForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();
              const userRoleId = document.getElementById("userRoleId").value;

              if (userRoleId.trim() === "") {
                console.log();
                document.getElementById("error").innerHTML =
                  "Please select a role.";
                return;
              }

              const formdata = new FormData(e.target);
              const data = {};
              formdata.forEach((value, key) => {
                data[key] = value;
              });

              console.log(data);

              // spinner.style.visibility = "visible";
              const res = await axios.post(`/home/manage-user/add-user`, data, {
                headers: { Authorization: `Bearer ${token}` },
              });

              //   console.log(res.data)

              window.location.href = `/home/manage-user`;
            } catch (error) {
              const errorMessage = handleApiError(error);
              document.getElementById("error").innerHTML = errorMessage;
              console.log(error);
            }
          });
      } catch (error) {
        errorHandler(error);
      }
    });

    //---------------------------------------------------- for showing company user list----------------------------------------------------

    // getting users details
    // console.log(token);
    const res = await axios.get(`/home/manage-user/company-user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const companyUserDetails = res.data.companyUsers;

    spinner.style.visibility = "hidden";

    const traderDetailsIndex = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
  <li>Username</li>
  <li>Email</li>
  <li>Role</li>
  <li>Active</li>  
  `);

    const userData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = companyUserDetails
      .map((data) => {
        return `

<ul class="main_section_data_part" id=${data.userId}>
<li>${data.userName}</li>
<li>${data.email}</li>
<li>${data.role}</li>
<li>${data.isActive}</li>

</ul>
`;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a company user----------------------------------------------------

    const companyUserList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    companyUserList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        console.log(e.currentTarget.id, e.currentTarget);
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=manageUser&menu=companyUser&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  showUserInfo();
});
