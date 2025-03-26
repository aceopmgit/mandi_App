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

function errorHandler(error) {
  const errorMessage = handleApiError(error);
  console.log(error);
  alert(errorMessage);
}

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
    const res = await axios.get(`/home/manage-account/account-info`, {
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
    errorHandler(error);
  }
}

// company location data handle
function stateDropdownControl() {
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
      try {
        selected.innerHTML = ele.querySelector("label").innerHTML;
        option_container.classList.remove("active");
        const id = ele.querySelector("input").id;
        console.log(id);

        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        // //---------------------------------------------------- for showing district list----------------------------------------------------
        const res = await axios.get(`/home/get-districts?stateId=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        spinner.style.visibility = "hidden";

        const districts = res.data.districtDetails;

        // console.log(districts);

        const content_section = document.getElementById("content_section");
        content_section.innerHTML = `

        <br>
        <br>

        <div class="create_btn_div">
  <p></p>
  <div>
    <button
      id="saveCompanyLocation"
      class="submitBtn"
      type="submit"
      form="updateCompanyLocationForm"
    >
      Save
    </button>
    <button id="cancelUpdateButton" class="cancelBtn">Cancel</button>
  </div>
</div>
             
<div class="main_section_content">
  <div class="main_section_data">
    <form id="updateCompanyLocationForm">
      <div class="form_content">
        <div class="permissions">
          <label>Select Company's District For the state:</label>
          <br />
          <br />
          <div class="error" id="error"></div>
          <br />
          ${districts
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
      </div>
    </form>
  </div>
</div>

    `;

        document
          .getElementById("cancelUpdateButton")
          .addEventListener("click", () => [
            document.getElementById("companyLocation").click(),
          ]);

        document
          .getElementById("updateCompanyLocationForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();
              const errorDiv = document.getElementById("error");

              const checkboxes = document.querySelectorAll(
                'input[type="checkbox"]'
              );

              errorDiv.textContent = "";

              const isChecked = Array.from(checkboxes).some((cb) => cb.checked);

              if (!isChecked) {
                errorDiv.textContent = "Please select at least one district.";
                return;
              }

              const districtList = Array.from(checkboxes).filter(
                (cb) => cb.checked
              );

              spinner.style.visibility = "visible";

              const details = {
                stateId: id,
                districts: districtList.map((ele) => ele.id),
              };

              console.log(details);
              const res = await axios.post(
                `/home/manage-account/update-company-location`,
                details,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              document.getElementById("companyLocation").click();
            } catch (error) {
              errorHandler(error);
            }
          });
      } catch (error) {
        errorHandler(error);
      }
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

const companyLocation = document.getElementById("companyLocation");
companyLocation.addEventListener("click", showCompanyUserDetails);
async function showCompanyUserDetails(e) {
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

    localStorage.setItem("side_menu_tab_u", "companyLocation");

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

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", async (e) => {
      try {
        // console.log("hio");
        // window.location.href = `/home/details?tab=manageAccount&menu=companyLocation&method=update&id=null`;
        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const res = await axios.get(`/home/get-states/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        spinner.style.visibility = "hidden";

        const states = res.data.stateDetails;

        main_section_container.innerHTML = `
<div class="content_area">
      <div class="selection_area" data-id="stateSelectionArea">
        <div class="select_box" data-id="selectStateBox">
          <div class="option_container" data-id="stateOptionContainer">
            ${states
              .map((ele) => {
                return `
            <div class="option" data-id="stateOption">
              <input type="radio" class="radio" name="" id="${ele.id}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="stateSelected">Select State</div>
          <div class="search_box" data-id="stateSearchBox">
            <input type="text" placeholder="Start Typing....." /
            id="state_search_box_input">
          </div>
        </div>
        <br />
      </div>

      <div class="content_section" id="content_section"></div>
    </div>

        
    `;

        stateDropdownControl();
      } catch (error) {
        errorHandler(error);
      }
    });

    //---------------------------------------------------- for showing company location list----------------------------------------------------

    // getting state details
    const res = await axios.get(`/home/manage-account/company-location`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // console.log(res.data);
    const companyLocationsDetails = res.data.companyLocations;

    console.log(companyLocationsDetails);

    spinner.style.visibility = "hidden";

    if (companyLocationsDetails.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
      <div style="margin: auto">
            <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No location details have been added by the company. Please provide the company location details to access all features. </h1>
        </div>`;
      return;
    }

    const stateIndexTitle = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
    <li>State Name</li>
    <li>Updated At</li>
    `);
    const stateData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = companyLocationsDetails
      .map((data) => {
        return `
        
      <ul class="main_section_data_part" id=${data.id}>
<li>${data.stateName}</li>
<li>${data.updatedAt}</li>
      </ul>
      `;
      })
      .join(""));

    // const accountDetails = res.data.accountDetails;

    //----------------------------------------------------for showing details page of a company Location----------------------------------------------------

    const companyLocationList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    companyLocationList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        console.log(e.currentTarget.id, e.currentTarget);
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=manageAccount&menu=companyLocation&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
  }
}

// company seasons data handle

const companySeason = document.getElementById("companySeason");
companySeason.addEventListener("click", showCompanySeasonDetails);
async function showCompanySeasonDetails(e) {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    //   menu item color change
    const menu_items = document.getElementsByClassName("menu_item");

    for (let i = 0; i < menu_items.length; i++) {
      menu_items[i].classList.remove("active");
    }

    e.target.classList.add("active");

    localStorage.setItem("side_menu_tab_u", "companySeason");

    //content handle
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

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", async (e) => {
      try {
        // console.log("hio");
        // window.location.href = `/home/details?tab=manageAccount&menu=companyLocation&method=add&id=null`;
        const spinner = document.getElementById("loading_spinner");
        // spinner.style.visibility = "visible";

        // const res = await axios.get(`/home/get-states/`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // spinner.style.visibility = "hidden";

        // const states = res.data.stateDetails;

        main_section_container.innerHTML = `
<div class="content_area">
  <div class="create_btn_div">
    <p></p>
    <div>
      <button
        id="saveSeason"
        class="submitBtn"
        type="submit"
        form="addSeasonForm"
      >
        Save
      </button>
      <button id="cancelAddButton" class="cancelBtn">Cancel</button>
    </div>
  </div>

  <form id="addSeasonForm">
    <div class="form_content">
      <div class="error" id="error"></div>
      <div class="form_control">
        <label for="season">Season</label>
        <select id="season" name="season" style=" height: 44px; font-size: 16px; padding: 5px;" required>
          <option value="" disabled selected>Select a season</option>
          <option value="Kharif">Kharif</option>
          <option value="Rabi">Rabi</option>
        </select>

        <br />
      </div>

      <div class="form_control">
        <label for="startDate">Start Date</label>
        <input type="month" id="startDate" name="startDate" required />

        <br />
      </div>

      <div class="form_control">
        <label for="endDate">End Date</label>
        <input type="month" id="endDate" name="endDate" required />

        <br />
      </div>
    </div>
  </form>
</div>  
    `;

        // Get the current year
        const currentYear = new Date().getFullYear();

        const minYear = currentYear - 2; // Two years before the current year
        const maxYear = currentYear + 2; // Two years after the current year

        document
          .getElementById("startDate")
          .setAttribute("min", `${minYear}-01`);
        document
          .getElementById("startDate")
          .setAttribute("max", `${maxYear}-12`);
        document.getElementById("endDate").setAttribute("min", `${minYear}-01`);
        document.getElementById("endDate").setAttribute("max", `${maxYear}-12`);

        document
          .getElementById("cancelAddButton")
          .addEventListener("click", () => {
            document.getElementById("companySeason").click();
          });

        document
          .getElementById("addSeasonForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();

              const formdata = new FormData(e.target);
              const data = {};
              formdata.forEach((value, key) => {
                data[key] = value;
              });

              // console.log(data);

              const season = document.getElementById("season").value;
              const startDate = document.getElementById("startDate").value;
              const endDate = document.getElementById("endDate").value;

              if (!season || !startDate || !endDate) {
                document.getElementById("error").innerHTML =
                  "Please fill all fields!";
                return;
              }

              const startYear = startDate.split("-")[0].slice(2); // Get last two digits of start year
              const endYear = endDate.split("-")[0].slice(2); // Get last two digits of end year

              const abbreviation = `${
                season.charAt(0).toUpperCase() + season.slice(1)
              } ${startYear}-${endYear}`;

              data["name"] = abbreviation;

              console.log(data);

              // spinner.style.visibility = "visible";
              const res = await axios.post(
                `/home/manage-account/add-season`,
                data,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              document.getElementById("companySeason").click();
            } catch (error) {
              errorHandler(error);
            }
          });
      } catch (error) {
        errorHandler(error);
      }
    });

    //---------------------------------------------------- for showing company season list----------------------------------------------------

    // getting season details
    const res = await axios.get(`/home/manage-account/company-season`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const companySeasons = res.data.companySeasons;

    console.log(companySeasons);

    spinner.style.visibility = "hidden";

    if (companySeasons.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
      <div style="margin: auto">
            <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No season details have been added by the company. Please provide the company season details to access all features. </h1>
        </div>`;
      return;
    }

    const seasonDetailsIndex = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
    <li>Season Name</li>    
    <li>Updated At</li>
    `);
    const seasonDetailsData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = companySeasons
      .map((data) => {
        return `

      <ul class="main_section_data_part" id=${data.seasonId}>
    <li>${data.name}</li>
    
    <li>${data.updatedAt}</li>
      </ul>
      `;
      })
      .join(""));

    //     //----------------------------------------------------for showing details page of a company season----------------------------------------------------

    const companySeasonsList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    companySeasonsList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        console.log(e.currentTarget.id, e.currentTarget);
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=manageAccount&menu=companySeason&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
  }
}

// factory info data handle

function factoryStateDropdownControl() {
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
      try {
        selected.innerHTML = ele.querySelector("label").innerHTML;
        option_container.classList.remove("active");
        const id = ele.querySelector("input").id;

        document.getElementById("factoryStateId").value = id;
        console.log(document.getElementById("factoryStateId").value);
        console.log(id);
      } catch (error) {
        errorHandler(error);
      }
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

const companyFactory = document.getElementById("companyFactory");
companyFactory.addEventListener("click", showcompanyFactoryDetails);
async function showcompanyFactoryDetails(e) {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    //   menu item color change
    const menu_items = document.getElementsByClassName("menu_item");

    for (let i = 0; i < menu_items.length; i++) {
      menu_items[i].classList.remove("active");
    }

    e.target.classList.add("active");

    localStorage.setItem("side_menu_tab_u", "companyFactory");

    //content handle
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

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", async (e) => {
      try {
        // console.log("hio");
        // window.location.href = `/home/details?tab=manageAccount&menu=companyLocation&method=add&id=null`;
        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const res = await axios.get(`/home/manage-account/company-location`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        spinner.style.visibility = "hidden";

        const states = res.data.companyLocations;

        if (states.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
      <div style="margin: auto">
            <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company locations have been added. Please enter the company location details to proceed further. </h1>
        </div>`;
          return;
        }

        main_section_container.innerHTML = `
<div class="content_area">
<div class="create_btn_div">
  <p></p>
  <div>
    <button
      id="saveFactory"
      class="submitBtn"
      type="submit"
      form="addFactoryForm"
    >
      Save
    </button>
    <button id="cancelUpdateButton" class="cancelBtn">Cancel</button>
  </div>
</div>

  <form id="addFactoryForm">
    <div class="form_content">
      <div class="form_control">
        <label for="factoryName">Enter Factory Name</label>
        <input
          type="text"
          id="factoryName"
          name="factoryName"
          placeholder="Enter Factory Name"
          required
        />
        <br />
      </div>

      <div class="error" id="error"></div>
      <div class="selection_area" data-id="stateSelectionArea">
        <div class="select_box" data-id="selectStateBox">
          <div class="option_container" data-id="stateOptionContainer">
            ${states
              .map((ele) => {
                return `
            <div class="option" data-id="stateOption">
              <input type="radio" class="radio" name="" id="${ele.stateId}" />
              <label for="${ele.stateId}">${ele.stateName}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="stateSelected">Select State</div>
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

      <div class="form_control">
        <input
          type="text"
          id="factoryStateId"
          name="factoryStateId"          
          style="display: none"
        />
        <br />
      </div>
  </form>
</div>  
    `;

        factoryStateDropdownControl();

        document
          .getElementById("cancelUpdateButton")
          .addEventListener("click", () => {
            document.getElementById("companyFactory").click();
          });

        document
          .getElementById("addFactoryForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();

              const stateId = document.getElementById("factoryStateId").value;

              if (stateId.trim() === "") {
                // console.log();
                document.getElementById("error").innerHTML =
                  "Please select a state.";
                return;
              }

              const formdata = new FormData(e.target);
              const data = {};
              formdata.forEach((value, key) => {
                data[key] = value;
              });

              console.log(data);

              // spinner.style.visibility = "visible";
              const res = await axios.post(
                `/home/manage-account/add-factory`,
                data,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              document.getElementById("companyFactory").click();
            } catch (error) {
              errorHandler(error);
            }
          });
      } catch (error) {
        errorHandler(error);
      }
    });

    //---------------------------------------------------- for showing company factory list----------------------------------------------------

    // getting factory details
    const res = await axios.get(`/home/manage-account/company-factory`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const companyFactoryDetails = res.data.companyFactories;

    console.log(companyFactoryDetails);

    spinner.style.visibility = "hidden";

    if (companyFactoryDetails.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
  <div style="margin: auto">
        <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No factory details have been added by the company. Please provide the company factory details to access all features. </h1>
    </div>`;
      return;
    }

    const factoryDetailsIndex = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
<li>Factory Name</li>
<li>State</li>
<li>Updated At</li>
`);
    const factoryDetailsData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = companyFactoryDetails
      .map((data) => {
        return `
    
  <ul class="main_section_data_part" id=${data.factoryId}>
<li>${data.factoryName}</li>
<li>${data.stateName}</li>
<li>${data.updatedAt}</li>
  </ul>
  `;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a company Location----------------------------------------------------

    const companyFactoryList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    companyFactoryList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        console.log(e.currentTarget.id, e.currentTarget);
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=manageAccount&menu=companyFactory&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
  }
}

// Godown info data handle
const companyGodown = document.getElementById("companyGodown");
companyGodown.addEventListener("click", showcompanyGodownDetails);
async function showcompanyGodownDetails(e) {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    //   menu item color change
    const menu_items = document.getElementsByClassName("menu_item");

    for (let i = 0; i < menu_items.length; i++) {
      menu_items[i].classList.remove("active");
    }

    e.target.classList.add("active");

    localStorage.setItem("side_menu_tab_u", "companyGodown");

    //content handle
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

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", async (e) => {
      try {
        // console.log("hio");
        // window.location.href = `/home/details?tab=manageAccount&menu=companyLocation&method=add&id=null`;
        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const res = await axios.get(`/home/manage-account/company-location/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        spinner.style.visibility = "hidden";

        const states = res.data.companyLocations;

        main_section_container.innerHTML = `
<div class="content_area">
<div class="create_btn_div">
  <p></p>
  <div>
    <button
      id="saveGodown"
      class="submitBtn"
      type="submit"
      form="addGodownForm"
    >
      Save
    </button>
    <button id="cancelUpdateButton" class="cancelBtn">Cancel</button>
  </div>
</div>

  <form id="addGodownForm">
    <div class="form_content">
      <div class="form_control">
        <label for="GodownName">Enter Godown Name</label>
        <input
          type="text"
          id="godownName"
          name="godownName"
          placeholder="Enter Godown Name"
          required
        />
        <br />
      </div>

      <div class="error" id="error"></div>
      <div class="selection_area" data-id="stateSelectionArea">
        <div class="select_box" data-id="selectStateBox">
          <div class="option_container" data-id="stateOptionContainer">
            ${states
              .map((ele) => {
                return `
            <div class="option" data-id="stateOption">
              <input type="radio" class="radio" name="" id="${ele.stateId}" />
              <label for="${ele.stateId}">${ele.stateName}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="stateSelected">Select State</div>
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

      <div class="form_control">
        <input
          type="text"
          id="factoryStateId"
          name="factoryStateId"          
          style="display: none"
        />
        <br />
      </div>
  </form>
</div>  
    `;

        factoryStateDropdownControl();

        document
          .getElementById("cancelUpdateButton")
          .addEventListener("click", () => {
            document.getElementById("companyGodown").click();
          });

        document
          .getElementById("addGodownForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();

              const stateId = document.getElementById("factoryStateId").value;

              if (stateId.trim() === "") {
                // console.log();
                document.getElementById("error").innerHTML =
                  "Please select a state.";
                return;
              }

              const formdata = new FormData(e.target);
              const data = {};
              formdata.forEach((value, key) => {
                data[key] = value;
              });

              console.log(data);

              // spinner.style.visibility = "visible";
              const res = await axios.post(
                `/home/manage-account/add-godown`,
                data,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              document.getElementById("companyGodown").click();
            } catch (error) {
              errorHandler(error);
            }
          });
      } catch (error) {
        errorHandler(error);
      }
    });

    //---------------------------------------------------- for showing company Godown list----------------------------------------------------

    // getting Godown details
    const res = await axios.get(`/home/manage-account/company-godown`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const companyGodownDetails = res.data.companyGodowns;

    console.log(companyGodownDetails);

    spinner.style.visibility = "hidden";

    if (companyGodownDetails.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
  <div style="margin: auto">
        <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No Godown details have been added by the company. Please provide the company godown details to access all features. </h1>
    </div>`;
      return;
    }

    const GodownDetailsIndex = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
<li>Godown Name</li>
<li>State</li>
<li>Updated At</li>
`);
    const godownDetailsData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = companyGodownDetails
      .map((data) => {
        return `
    
  <ul class="main_section_data_part" id=${data.godownId}>
<li>${data.godownName}</li>
<li>${data.stateName}</li>
<li>${data.updatedAt}</li>
  </ul>
  `;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a company Godown----------------------------------------------------

    const companyGodownList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    companyGodownList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        console.log(e.currentTarget.id, e.currentTarget);
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=manageAccount&menu=companyGodown&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
  }
}

// company trader data Handle
const companyTrader = document.getElementById("companyTrader");
companyTrader.addEventListener("click", showCompanyTraderDetails);
async function showCompanyTraderDetails(e) {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    //   menu item color change
    const menu_items = document.getElementsByClassName("menu_item");

    for (let i = 0; i < menu_items.length; i++) {
      menu_items[i].classList.remove("active");
    }

    e.target.classList.add("active");

    localStorage.setItem("side_menu_tab_u", "companyTrader");

    //content handle
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

        // const spinner = document.getElementById("loading_spinner");
        // spinner.style.visibility = "visible";

        // const res = await axios.get(`/home/get-states/`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // spinner.style.visibility = "hidden";

        // const states = res.data.stateDetails;

        main_section_container.innerHTML = `
<div class="content_area">
<div class="create_btn_div">
  <p></p>
  <div>
    <button
      id="saveTrader"
      class="submitBtn"
      type="submit"
      form="addTraderForm"
    >
      Save
    </button>
    <button id="cancelUpdateButton" class="cancelBtn">Cancel</button>
  </div>
</div>

<form id="addTraderForm">
  <div class="form_content">
    <div class="form_control">
      <label for="traderName">Enter Trader Name</label>
      <input
        type="text"
        id="traderName"
        name="traderName"
        placeholder="Enter Trader Name"
        required
      />
      <br />
    </div>
  </div>
</form>
</div>  
    `;

        document
          .getElementById("cancelUpdateButton")
          .addEventListener("click", () => {
            document.getElementById("companyTrader").click();
          });

        document
          .getElementById("addTraderForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();

              const formdata = new FormData(e.target);
              const data = {};
              formdata.forEach((value, key) => {
                data[key] = value;
              });

              console.log(data);

              // spinner.style.visibility = "visible";
              const res = await axios.post(
                `/home/manage-account/add-trader`,
                data,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              document.getElementById("companyTrader").click();
            } catch (error) {
              errorHandler(error);
            }
          });
      } catch (error) {
        errorHandler(error);
      }
    });

    //---------------------------------------------------- for showing company trader list----------------------------------------------------

    // getting trader details
    const res = await axios.get(`/home/manage-account/company-trader`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // console.log(res.data);

    const companyTradersDetails = res.data.companyTraders;

    // console.log(companyTradersDetails);

    spinner.style.visibility = "hidden";

    if (companyTradersDetails.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
  <div style="margin: auto">
        <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No Trader details have been added by the company. Please provide the company Tarder details to access all features. </h1>
    </div>`;
      return;
    }

    const traderDetailsIndex = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
<li>Trader Name</li>
<li>Updated At</li>
`);

    const traderData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = companyTradersDetails
      .map((data) => {
        return `

<ul class="main_section_data_part" id=${data.traderId}>
<li>${data.traderName}</li>
<li>${data.updatedAt}</li>
</ul>
`;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a company Location----------------------------------------------------

    const companyTradersList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    companyTradersList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        console.log(e.currentTarget.id, e.currentTarget);
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=manageAccount&menu=companyTrader&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const storedTab = localStorage.getItem("side_menu_tab_u");
  localStorage.removeItem("side_menu_tab");
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
    console.log(tab);
    if (tab) {
      tab.click();
      // tab.classList.add("active");
      // console.log(tab, tab.classList);
    }
  } else {
    account_info.click();
    console.log("98989");
    // Default behavior if no tab is stored
    // account_info.classList.add("active");
    // console.log(account_info, account_info.classList);
  }
});
