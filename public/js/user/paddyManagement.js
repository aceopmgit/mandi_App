const token = localStorage.getItem("userToken");
import { handleApiError } from "../util/apiErrorHandler.js";

function errorHandler(error) {
  const errorMessage = handleApiError(error);
  console.log(error);
  alert(errorMessage);
}

/**
 * A central function to set up dropdown controls.
 *
 * @param {Object} config - Configuration for the dropdown.
 * @param {string} config.selectedSelector - Selector for the element that shows the current selection.
 * @param {string} config.optionContainerSelector - Selector for the container that holds the options.
 * @param {string} config.optionSelector - Selector for each individual option element.
 * @param {string} config.searchBoxSelector - Selector for the search input within the dropdown.
 * @param {string} config.valueInputId - ID of the hidden input element to update with the selected option's ID.
 * @param {string} config.initialText - (Optional) Default text to display in the selected element.
 */

function setupDropdownControl({
  selectedSelector,
  optionContainerSelector,
  optionSelector,
  searchBoxSelector,
  valueInputId,
  initialText = "",
}) {
  const selectedEl = document.querySelector(selectedSelector);
  const optionContainer = document.querySelector(optionContainerSelector);
  const optionElements = Array.from(document.querySelectorAll(optionSelector));
  const searchBox = document.querySelector(searchBoxSelector);

  // Set default text if provided
  if (initialText) {
    selectedEl.innerHTML = initialText;
  }

  // Filter options based on the search term
  function filterList(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    optionElements.forEach((option) => {
      const labelText = option.querySelector("label").innerText.toLowerCase();
      option.style.display =
        labelText.indexOf(searchTerm) !== -1 ? "block" : "none";
    });
  }

  // Toggle dropdown on click of the selected element
  selectedEl.addEventListener("click", () => {
    optionContainer.classList.toggle("active");
    searchBox.value = "";
    filterList("");
    if (optionContainer.classList.contains("active")) {
      searchBox.focus();
    }
  });

  // Set selected value on option click
  optionElements.forEach((option) => {
    option.addEventListener("click", () => {
      try {
        const label = option.querySelector("label").innerHTML;
        selectedEl.innerHTML = label;
        optionContainer.classList.remove("active");
        const selectedId = option.querySelector("input").id;
        document.getElementById(valueInputId).value = selectedId;
      } catch (error) {
        errorHandler(error);
      }
    });
  });

  // Filter options on typing in the search box
  searchBox.addEventListener("keyup", (e) => {
    filterList(e.target.value);
  });

  // Close the dropdown if clicking outside
  document.addEventListener("click", (event) => {
    if (
      !optionContainer.contains(event.target) &&
      !selectedEl.contains(event.target) &&
      !searchBox.contains(event.target)
    ) {
      optionContainer.classList.remove("active");
    }
  });
}

// for handling dropdown
// function comapanyMandiDropdownControl() {
//   const selected = document.querySelector('[data-id="mandiSelected"]');

//   const option_container = document.querySelector(
//     '[data-id="mandiOptionContainer"]'
//   );
//   const optionsList = Array.from(
//     document.querySelectorAll('[data-id="mandiOption"]')
//   );
//   const searchBox = document.getElementById("mandi_search_box_input");
//   // console.log("selected", selected);
//   // console.log("option_container", option_container);
//   // console.log("optionsList", optionsList);
//   // console.log("searchBox", searchBox);

//   selected.addEventListener("click", () => {
//     option_container.classList.toggle("active");
//     searchBox.value = "";
//     filterList("");
//     if (option_container.classList.contains("active")) {
//       searchBox.focus();
//     }
//   });

//   optionsList.forEach((ele) => {
//     ele.addEventListener("click", async (e) => {
//       try {
//         selected.innerHTML = ele.querySelector("label").innerHTML;
//         option_container.classList.remove("active");
//         const id = ele.querySelector("input").id;

//         document.getElementById("comapanyMandiId").value = id;
//       } catch (error) {
//         errorHandler(error);
//       }
//     });
//   });

//   searchBox.addEventListener("keyup", (e) => {
//     filterList(e.target.value);
//   });

//   const filterList = (searchTerm) => {
//     searchTerm = searchTerm.toLowerCase();
//     optionsList.forEach((option) => {
//       let label =
//         option.firstElementChild.nextElementSibling.innerText.toLowerCase();
//       if (label.indexOf(searchTerm) != -1) {
//         option.style.display = "block";
//       } else {
//         option.style.display = "none";
//       }
//     });
//   };

//   document.addEventListener("click", (event) => {
//     if (
//       !option_container.contains(event.target) &&
//       !selected.contains(event.target) &&
//       !searchBox.contains(event.target)
//     ) {
//       option_container.classList.remove("active");
//     }
//   });
// }

function comapanyMandiDropdownControl() {
  const selected = document.querySelector('[data-id="mandiSelected"]');

  const option_container = document.querySelector(
    '[data-id="mandiOptionContainer"]'
  );
  const optionsList = Array.from(
    document.querySelectorAll('[data-id="mandiOption"]')
  );
  const searchBox = document.getElementById("mandi_search_box_input");
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

        document.getElementById("comapanyMandiId").value = id;
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

function comapanyFactoryDropdownControl() {
  const selected = document.querySelector('[data-id="factorySelected"]');

  const option_container = document.querySelector(
    '[data-id="factoryOptionContainer"]'
  );
  const optionsList = Array.from(
    document.querySelectorAll('[data-id="factoryOption"]')
  );
  const searchBox = document.getElementById("factory_search_box_input");
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
    ele.addEventListener("click", (e) => {
      try {
        selected.innerHTML = ele.querySelector("label").innerHTML;
        option_container.classList.remove("active");
        const id = ele.querySelector("input").id;

        document.getElementById("comapanyFactoryId").value = id;
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

function comapanyGodownDropdownControl() {
  const selected = document.querySelector('[data-id="godownSelected"]');

  const option_container = document.querySelector(
    '[data-id="godownOptionContainer"]'
  );
  const optionsList = Array.from(
    document.querySelectorAll('[data-id="godownOption"]')
  );
  const searchBox = document.getElementById("godown_search_box_input");
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
    ele.addEventListener("click", (e) => {
      try {
        selected.innerHTML = ele.querySelector("label").innerHTML;
        option_container.classList.remove("active");
        const id = ele.querySelector("input").id;

        document.getElementById("comapanyGodownId").value = id;
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

function comapanyPaddyPurchaseDropdownControl() {
  const selected = document.querySelector('[data-id="paddyPurchaseSelected"]');

  const option_container = document.querySelector(
    '[data-id="paddyPurchaseOptionContainer"]'
  );
  const optionsList = Array.from(
    document.querySelectorAll('[data-id="paddyPurchaseOption"]')
  );
  const searchBox = document.getElementById("paddyPurchase_search_box_input");
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
    ele.addEventListener("click", (e) => {
      try {
        selected.innerHTML = ele.querySelector("label").innerHTML;
        option_container.classList.remove("active");
        const id = ele.querySelector("input").id;

        document.getElementById("paddyPurchaseId").value = id;
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

function comapanyPaddyLoadingDropdownControl() {
  const selected = document.querySelector('[data-id="paddyLoadingSelected"]');

  const option_container = document.querySelector(
    '[data-id="paddyLoadingOptionContainer"]'
  );
  const optionsList = Array.from(
    document.querySelectorAll('[data-id="paddyLoadingOption"]')
  );
  const searchBox = document.getElementById("paddyLoading_search_box_input");
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
    ele.addEventListener("click", (e) => {
      try {
        selected.innerHTML = ele.querySelector("label").innerHTML;
        option_container.classList.remove("active");
        const id = ele.querySelector("input").id;

        document.getElementById("paddyLoadingId").value = id;
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

// handling master target data
const masterTargetBtn = document.getElementById("master_target");
masterTargetBtn.addEventListener("click", async (e) => {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";
    console.log("Working");

    //   menu item color change
    const menu_items = document.getElementsByClassName("menu_item");

    for (let i = 0; i < menu_items.length; i++) {
      menu_items[i].classList.remove("active");
    }
    // console.log(e.target.classList);
    e.target.classList.add("active");

    localStorage.setItem("side_menu_tab", "master_target");

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

    //---------------------------------------------------- for showing add master Target form----------------------------------------------------

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", async (e) => {
      try {
        // console.log("hio");
        // window.location.href = `/home/details?tab=manageAccount&menu=companyLocation&method=update&id=null`;
        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const companyMandiResponse = await axios.get(`/home/company-mandi/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const companySeasonResponse = await axios.get(
          `/home/manage-account/company-season`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        spinner.style.visibility = "hidden";

        // console.log(res.data);

        const companyMandi = companyMandiResponse.data.companyMandi;

        const companySeasonRaw = companySeasonResponse.data.companySeasons;

        console.log("raw", companySeasonRaw);

        const companySeasons = companySeasonRaw.filter(
          (ele) => ele.status === true
        );

        console.log("raw", companySeasons);

        if (companyMandi.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
              <div style="margin: auto">
                    <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company location  has been added. Please add company location to proceed further.  </h1>
                </div>`;
          return;
        }

        if (companySeasons.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
              <div style="margin: auto">
                    <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company season  has been added. Please add company season to proceed further.  </h1>
                </div>`;
          return;
        }

        main_section_container.innerHTML = `
<div class="content_area">
<div class="create_btn_div">
  <p></p>
  <div>
    <button
      id="saveMasterTarget"
      class="submitBtn"
      type="submit"
      form="addMasterTargetForm"
    >
      Save
    </button>
    <button id="cancelAddButton" class="cancelBtn">Cancel</button>
  </div>
</div>

<br />
<br />

  <form id="addMasterTargetForm">
  <div class="form_content">
    <div class="error" id="inputError"></div>
    <div class="form_control">
      <label for="targetQtls">Enter Target Qtls</label>
      <input
        type="text"
        id="targetQtls"
        name="targetQtls"
        placeholder="Enter Target Qtls"
        required
        step="any"
        min="0"
      />
      <br />
    </div>

    <div class="error" id="modalError"></div>
    <br />

    <div class="selection_area" data-id="mandiSelectionArea">
      <div class="select_box" data-id="selectMandiBox">
        <div class="option_container" data-id="mandiOptionContainer">
          ${companyMandi
            .map((ele) => {
              return `
          <div class="option" data-id="mandiOption">
            <input type="radio" class="radio" name="" id="${ele.id}" />
            <label for="${ele.id}">${ele.name}</label>
          </div>

          `;
            })
            .join("")}
        </div>

        <div class="selected" data-id="mandiSelected">Select Mandi</div>
        <div class="search_box" data-id="mandiSearchBox">
          <input
            type="text"
            placeholder="Start Typing....."
            id="mandi_search_box_input"
          />
        </div>
      </div>
      <br />
    </div>

    <div class="form_control">
      <input
        type="text"
        id="comapanyMandiId"
        name="comapanyMandiId"
        style="display: none"
      />
      <br />
    </div>

    <div class="selection_area" data-id="seasonSelectionArea">
      <div class="select_box" data-id="selectSeasonBox">
        <div class="option_container" data-id="seasonOptionContainer">
          ${companySeasons
            .map((ele) => {
              return `
          <div class="option" data-id="seasonOption">
            <input type="radio" class="radio" name="" id="${ele.seasonId}" />
            <label for="${ele.seasonId}">${ele.name}</label>
          </div>

          `;
            })
            .join("")}
        </div>

        <div class="selected" data-id="seasonSelected">Select Season</div>
        <div class="search_box" data-id="seasonSearchBox">
          <input
            type="text"
            placeholder="Start Typing....."
            id="season_search_box_input"
          />
        </div>
      </div>
      <br />
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companySeasonId"
        name="companySeasonId"
        style="display: none"
      />
      <br />
    </div>
  </div>
</form>
</div>  
    `;

        // Company Mandi Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="mandiSelected"]',
          optionContainerSelector: '[data-id="mandiOptionContainer"]',
          optionSelector: '[data-id="mandiOption"]',
          searchBoxSelector: "#mandi_search_box_input",
          valueInputId: "comapanyMandiId",
          initialText: "Select Mandi",
        });

        // Company Season Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="seasonSelected"]',
          optionContainerSelector: '[data-id="seasonOptionContainer"]',
          optionSelector: '[data-id="seasonOption"]',
          searchBoxSelector: "#season_search_box_input",
          valueInputId: "companySeasonId",
          initialText: "Select Season",
        });

        // comapanyMandiDropdownControl();

        document
          .getElementById("cancelAddButton")
          .addEventListener("click", () => {
            // console.log(masterTarget);
            masterTargetBtn.click();
          });

        //---------------------------------------------------- for adding master Target form data----------------------------------------------------

        document
          .getElementById("addMasterTargetForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();

              const mandiId = document.getElementById("comapanyMandiId").value;

              if (mandiId.trim() === "") {
                // console.log();
                document.getElementById("modalError").innerHTML =
                  "Please select a Mandi.";
                return;
              }

              const formdata = new FormData(e.target);
              const data = {};
              formdata.forEach((value, key) => {
                data[key] = value;
              });

              if (isNaN(data.targetQtls) || data.targetQtls === "") {
                document.getElementById("inputError").innerHTML =
                  "Please enter a valid qunatity";
                return;
              }

              console.log(data);

              spinner.style.visibility = "visible";
              const res = await axios.post(
                `/home/paddy-management/add-master-target`,
                data,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              spinner.style.visibility = "hidden";
              //   console.log(masterTarget);
              masterTargetBtn.click();
            } catch (error) {
              errorHandler(error);
            }
          });
      } catch (error) {
        errorHandler(error);
        spinner.style.visibility = "hidden";
        masterTargetBtn.click();
      }
    });

    //---------------------------------------------------- for showing master target details----------------------------------------------------

    const res = await axios.get(`/home/paddy-management/master-target`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const masterTarget = res.data.masterTarget;

    spinner.style.visibility = "hidden";

    if (masterTarget.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
    <div style="margin: auto">
          <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No master target have been added by the company.  </h1>
      </div>`;
      return;
    }

    const masterTargetIndex = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
  <li>Date</li>
  <li>Mandi Name</li>
  <li>Target Qtls</li>
  <li>Target Balance</li>
  `);

    const MasterTargetData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = masterTarget
      .map((data) => {
        return `
  
<ul class="main_section_data_part" id=${data.id}>
<li>${data.createdAt}</li>
<li>${data.mandiName}</li>
<li>${data.targetQtls}</li>
<li>${data.targetBalance}</li>
</ul>
`;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a Master  Target----------------------------------------------------

    const masterTargetList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    masterTargetList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=paddyManagement&menu=masterTarget&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
  }
});

// handling paddy purchase data
const paddyPurchaseBtn = document.getElementById("paddy_purchase");
paddyPurchaseBtn.addEventListener("click", async (e) => {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";
    console.log("Working");

    //   menu item color change
    const menu_items = document.getElementsByClassName("menu_item");

    for (let i = 0; i < menu_items.length; i++) {
      menu_items[i].classList.remove("active");
    }
    // console.log(e.target.classList);
    e.target.classList.add("active");

    localStorage.setItem("side_menu_tab", "paddy_purchase");

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

    //---------------------------------------------------- for showing add master Target form----------------------------------------------------

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", async (e) => {
      try {
        // console.log("hio");
        // window.location.href = `/home/details?tab=manageAccount&menu=companyLocation&method=update&id=null`;
        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const mandiResponse = await axios.get(`/home/company-mandi/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const factoryResponse = await axios.get(`/home/company-factory/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const seasonResponse = await axios.get(
          `/home/manage-account/company-season`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        spinner.style.visibility = "hidden";

        console.log(
          mandiResponse.data,
          factoryResponse.data,
          seasonResponse.data
        );

        const companyMandi = mandiResponse.data.companyMandi;

        if (companyMandi.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company location data have been added. Please add company location to proceed further.  </h1>
              </div>`;
          return;
        }

        const companyFactory = factoryResponse.data.companyFactory;

        if (companyFactory.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company factory  has been added. Please add company factory to proceed further.  </h1>
              </div>`;
          return;
        }

        const companySeasons = seasonResponse.data.companySeasons;

        if (companySeasons.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company season has been added. Please add company season to proceed further.  </h1>
              </div>`;
          return;
        }

        main_section_container.innerHTML = `
  <div class="content_area">
  <div class="create_btn_div">
    <p></p>
    <div>
      <button
        id="savePaddyPurchase"
        class="submitBtn"
        type="submit"
        form="addPaddyPurchaseForm"
      >
        Save
      </button>
      <button id="cancelAddButton" class="cancelBtn">Cancel</button>
    </div>
  </div>
  
  <br />
  <br />
  
    <form id="addPaddyPurchaseForm">
  <div class="form_content">
    <div class="error" id="formError"></div>

    <div class="form_control">
      <label for="mandiName"
        >Mandi Name (ମଣ୍ଡି ନାମ)<span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="mandiSelectionArea">
        <div class="select_box" data-id="selectMandiBox">
          <div class="option_container" data-id="mandiOptionContainer">
            ${companyMandi
              .map((ele) => {
                return `
            <div class="option" data-id="mandiOption">
              <input type="radio" class="radio" name="" id="${ele.id}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="mandiSelected">Select Mandi</div>
          <div class="search_box" data-id="mandiSearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="mandi_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companyMandiId"
        name="companyMandiId"
        style="display: none"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="seasonName"
        >Season Name<span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="seasonSelectionArea">
        <div class="select_box" data-id="selectSeasonBox">
          <div class="option_container" data-id="seasonOptionContainer">
            ${companySeasons
              .map((ele) => {
                return `
            <div class="option" data-id="seasonOption">
              <input type="radio" class="radio" name="" id="${ele.seasonId}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="seasonSelected">Select Season</div>
          <div class="search_box" data-id="seasonSearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="season_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companySeasonId"
        name="companySeasonId"
        style="display: none"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="factoryName"
        >Factory Name <span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="factorySelectionArea">
        <div class="select_box" data-id="selectFactoryBox">
          <div class="option_container" data-id="factoryOptionContainer">
            ${companyFactory
              .map((ele) => {
                return `
            <div class="option" data-id="factoryOption">
              <input type="radio" class="radio" name="" id="${ele.id}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="factorySelected">Select Factory</div>
          <div class="search_box" data-id="factorySearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="factory_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companyFactoryId"
        name="companyFactoryId"
        style="display: none"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="purchaseQtlsGross"
        >Purchase Qtls (Gross) (କେତେ ମୋଟ ବ୍ୟାଗ କିଣାଯାଇଛି?)<span
          style="color: red"
          >*</span
        ></label
      >
      <input
        type="number"
        id="purchaseQtlsGross"
        name="purchaseQtlsGross"
        placeholder="Enter Purchase Qtls"
        required
        step="any"
        min="0"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="gunnyBags"
        >Gunny Bags (ସେଠାରେ କେତେ "ଗନି" ବ୍ୟାଗ ଅଛି?)<span style="color: red"
          >*</span
        ></label
      >
      <input
        type="number"
        id="gunnyBags"
        name="gunnyBags"
        placeholder="Enter Gunny Bags"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="ppBags"
        >PP Bags (କେତେ ପିପି ବ୍ୟାଗ୍ |)<span style="color: red">*</span></label
      >
      <input
        type="number"
        id="ppBags"
        name="ppBags"
        placeholder="Enter PP Bags"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="bagWeight"
        >Bag Weight (Quintal) (ବ୍ୟାଗ କ୍ୱିଣ୍ଟାଲରେ ଓଜନ)<span style="color: red"
          >*</span
        ></label
      >
      <input
        type="number"
        id="bagWeight"
        name="bagWeight"
        placeholder="Enter Bag Weight"
        required
        step="any"
        min="0"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="faqQtls"
        >Faq Quintal ( ଫ୍ୟାକ୍ ଓଜନ କେତେ )<span style="color: red">*</span></label
      >
      <input
        type="number"
        id="faqQtls"
        name="faqQtls"
        placeholder="Enter Faq"
        required
        step="any"
        min="0"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="uploadHisab"
        >Upload Hisab (ହିସାବ ଅପଲୋଡ୍ କରନ୍ତୁ |)<span style="color: red"
          >*</span
        ></label
      >
      <input
        type="file"
        id="uploadHisab"
        name="uploadHisab"
        accept=".jpg,.jpeg,.png,.pdf"
        required
      />
      <br />
    </div>
  </div>
</form>
  </div>  
      `;

        // Company Mandi Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="mandiSelected"]',
          optionContainerSelector: '[data-id="mandiOptionContainer"]',
          optionSelector: '[data-id="mandiOption"]',
          searchBoxSelector: "#mandi_search_box_input",
          valueInputId: "companyMandiId",
          initialText: "Select Mandi",
        });

        // Company factory Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="factorySelected"]',
          optionContainerSelector: '[data-id="factoryOptionContainer"]',
          optionSelector: '[data-id="factoryOption"]',
          searchBoxSelector: "#factory_search_box_input",
          valueInputId: "companyFactoryId",
          initialText: "Select Factory",
        });

        // Company season Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="seasonSelected"]',
          optionContainerSelector: '[data-id="seasonOptionContainer"]',
          optionSelector: '[data-id="seasonOption"]',
          searchBoxSelector: "#season_search_box_input",
          valueInputId: "companySeasonId",
          initialText: "Select season",
        });
        // comapanyMandiDropdownControl();
        // comapanyFactoryDropdownControl();

        document
          .getElementById("cancelAddButton")
          .addEventListener("click", () => {
            // console.log(masterTarget);
            paddyPurchaseBtn.click();
          });

        //---------------------------------------------------- for adding paddy purchase form data----------------------------------------------------

        document
          .getElementById("addPaddyPurchaseForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();

              const mandiId = document.getElementById("companyMandiId").value;

              if (mandiId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a Mandi.";
                return;
              }

              const seasonId = document.getElementById("companySeasonId").value;

              if (seasonId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a Season.";
                return;
              }

              const factoryId =
                document.getElementById("companyFactoryId").value;

              if (factoryId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a factory.";
                return;
              }

              const formdata = new FormData(e.target);
              //   const data = {};
              //   formdata.forEach((value, key) => {
              //     data[key] = value;
              //   });

              spinner.style.visibility = "visible";
              const res = await axios.post(
                `/home/paddy-management/add-paddy-purchase`,
                formdata,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              spinner.style.visibility = "hidden";
              //   console.log(masterTarget);
              paddyPurchaseBtn.click();
            } catch (error) {
              errorHandler(error);
              spinner.style.visibility = "hidden";
            }
          });
      } catch (error) {
        errorHandler(error);
        spinner.style.visibility = "hidden";
        paddyPurchaseBtn.click();
      }
    });

    //---------------------------------------------------- for showing paddy purchase details----------------------------------------------------

    const res = await axios.get(`/home/paddy-management/paddy-purchase`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const paddyPurchase = res.data.paddyPurchase;

    spinner.style.visibility = "hidden";

    if (paddyPurchase.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
      <div style="margin: auto">
            <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No paddy purchase data have been added.  </h1>
        </div>`;
      return;
    }

    const paddyPurchaseIndex = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
    <li>Date</li>
    <li>Mandi Name</li>
    <li>Factory Name</li>
    <li>Season Name</li>
    <li>Nett Purchase Qty Qtls</li>
    `);

    const paddyPurchaseData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = paddyPurchase
      .map((data) => {
        return `
    
  <ul class="main_section_data_part" id=${data.id}>
  <li>${data.date}</li>
  <li>${data.mandiName}</li>
  <li>${data.factoryName}</li>
  <li>${data.seasonName}</li>  
  <li>${data.nettPurchaseQtyQtls}</li>
  </ul>
  `;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a Master  Target----------------------------------------------------

    const paddyPurchaseList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    paddyPurchaseList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=paddyManagement&menu=paddyPurchase&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
  }
});

// handling paddy loading data
const paddyLoadingBtn = document.getElementById("paddy_loading");
paddyLoadingBtn.addEventListener("click", async (e) => {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";
    // console.log("Working");

    //   menu item color change
    const menu_items = document.getElementsByClassName("menu_item");

    for (let i = 0; i < menu_items.length; i++) {
      menu_items[i].classList.remove("active");
    }
    // console.log(e.target.classList);
    e.target.classList.add("active");

    localStorage.setItem("side_menu_tab", "paddy_loading");

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

    //---------------------------------------------------- for showing add paddy loading data form----------------------------------------------------

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", async (e) => {
      try {
        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const mandiResponse = await axios.get(`/home/company-mandi/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const factoryResponse = await axios.get(`/home/company-factory/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const seasonResponse = await axios.get(
          `/home/manage-account/company-season`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        spinner.style.visibility = "hidden";

        console.log(
          mandiResponse.data,
          factoryResponse.data,
          seasonResponse.data
        );

        const companyMandi = mandiResponse.data.companyMandi;

        if (companyMandi.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company location data have been added. Please add company location to proceed further.  </h1>
              </div>`;
          return;
        }

        const companyFactory = factoryResponse.data.companyFactory;

        if (companyFactory.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company factory  has been added. Please add company factory to proceed further.  </h1>
              </div>`;
          return;
        }

        const companySeasons = seasonResponse.data.companySeasons;

        if (companySeasons.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company season has been added. Please add company season to proceed further.  </h1>
              </div>`;
          return;
        }

        main_section_container.innerHTML = `
  <div class="content_area">
  <div class="create_btn_div">
    <p></p>
    <div>
      <button
        id="savePaddyLoading"
        class="submitBtn"
        type="submit"
        form="addPaddyLoadingForm"
      >
        Save
      </button>
      <button id="cancelAddButton" class="cancelBtn">Cancel</button>
    </div>
  </div>
  
  <br />
  <br />
  
    <form id="addPaddyLoadingForm">
  <div class="form_content">
    <div class="error" id="formError"></div>

    <div class="form_control">
      <label for="bagsLoaded"
        >Bags Loaded (କେତେ ବ୍ୟାଗ୍ ଲୋଡ୍ ହୋଇଛି?)<span style="color: red"
          >*</span
        ></label
      >
      <input
        type="number"
        id="bagsLoaded"
        name="bagsLoaded"
        placeholder="Enter bags loaded"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="vehicleNumber"
        >Vehicle No (ଯାନ ନଂ)<span style="color: red">*</span></label
      >
      <input
        type="text"
        id="vehicleNumber"
        name="vehicleNumber"
        placeholder="Enter vehicle number"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="mandiName"
        >Mandi Name (ମଣ୍ଡି ନାମ)<span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="mandiSelectionArea">
        <div class="select_box" data-id="selectMandiBox">
          <div class="option_container" data-id="mandiOptionContainer">
            ${companyMandi
              .map((ele) => {
                return `
            <div class="option" data-id="mandiOption">
              <input type="radio" class="radio" name="" id="${ele.id}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="mandiSelected">Select Mandi</div>
          <div class="search_box" data-id="mandiSearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="mandi_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companyMandiId"
        name="companyMandiId"
        style="display: none"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="seasonName"
        >Season Name<span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="seasonSelectionArea">
        <div class="select_box" data-id="selectSeasonBox">
          <div class="option_container" data-id="seasonOptionContainer">
            ${companySeasons
              .map((ele) => {
                return `
            <div class="option" data-id="seasonOption">
              <input type="radio" class="radio" name="" id="${ele.seasonId}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="seasonSelected">Select Season</div>
          <div class="search_box" data-id="seasonSearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="season_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companySeasonId"
        name="companySeasonId"
        style="display: none"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="factoryName"
        >Factory Name <span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="factorySelectionArea">
        <div class="select_box" data-id="selectFactoryBox">
          <div class="option_container" data-id="factoryOptionContainer">
            ${companyFactory
              .map((ele) => {
                return `
            <div class="option" data-id="factoryOption">
              <input type="radio" class="radio" name="" id="${ele.id}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="factorySelected">Select Factory</div>
          <div class="search_box" data-id="factorySearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="factory_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companyFactoryId"
        name="companyFactoryId"
        style="display: none"
      />
      <br />
    </div>
  </div>
</form>
  </div>  
      `;

        // Company Mandi Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="mandiSelected"]',
          optionContainerSelector: '[data-id="mandiOptionContainer"]',
          optionSelector: '[data-id="mandiOption"]',
          searchBoxSelector: "#mandi_search_box_input",
          valueInputId: "companyMandiId",
          initialText: "Select Mandi",
        });

        // Company factory Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="factorySelected"]',
          optionContainerSelector: '[data-id="factoryOptionContainer"]',
          optionSelector: '[data-id="factoryOption"]',
          searchBoxSelector: "#factory_search_box_input",
          valueInputId: "companyFactoryId",
          initialText: "Select Factory",
        });

        // Company season Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="seasonSelected"]',
          optionContainerSelector: '[data-id="seasonOptionContainer"]',
          optionSelector: '[data-id="seasonOption"]',
          searchBoxSelector: "#season_search_box_input",
          valueInputId: "companySeasonId",
          initialText: "Select season",
        });

        // comapanyPaddyPurchaseDropdownControl();

        document
          .getElementById("cancelAddButton")
          .addEventListener("click", () => {
            // console.log(masterTarget);
            paddyLoadingBtn.click();
          });

        //---------------------------------------------------- for adding paddy loading form data----------------------------------------------------

        document
          .getElementById("addPaddyLoadingForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();

              const mandiId = document.getElementById("companyMandiId").value;

              if (mandiId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a Mandi.";
                return;
              }

              const seasonId = document.getElementById("companySeasonId").value;

              if (seasonId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a Season.";
                return;
              }

              const factoryId =
                document.getElementById("companyFactoryId").value;

              if (factoryId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a factory.";
                return;
              }

              const formdata = new FormData(e.target);
              const data = {};
              formdata.forEach((value, key) => {
                data[key] = value;
              });

              console.log(data);

              spinner.style.visibility = "visible";
              const res = await axios.post(
                `/home/paddy-management/add-paddy-loading`,
                data,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    // "Content-Type": "multipart/form-data",
                  },
                }
              );
              spinner.style.visibility = "hidden";
              //   console.log(masterTarget);
              paddyLoadingBtn.click();
            } catch (error) {
              errorHandler(error);
              spinner.style.visibility = "hidden";
            }
          });
      } catch (error) {
        errorHandler(error);
        spinner.style.visibility = "hidden";
        paddyLoadingBtn.click();
      }
    });

    //---------------------------------------------------- for showing paddy loading details----------------------------------------------------

    const res = await axios.get(`/home/paddy-management/paddy-loading`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const paddyLoadingResponse = res.data.paddyLoading;

    spinner.style.visibility = "hidden";

    if (paddyLoadingResponse.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
          <div style="margin: auto">
                <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No paddy loading data have been added.  </h1>
            </div>`;
      return;
    }

    const paddyLoadingIndex = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
        <li>Date</li>
        <li>Mandi Name</li>
        <li>Season Name</li>
        <li>Bags Loaded</li>
        `);

    const paddyLoadingData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = paddyLoadingResponse
      .map((data) => {
        return `

      <ul class="main_section_data_part" id=${data.id}>
      <li>${data.date}</li>
      <li>${data.mandiName}</li>
      <li>${data.seasonName}</li>
      <li>${data.bagsLoaded}</li>
      </ul>
      `;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a paddy Loading----------------------------------------------------

    const paddyLoadingList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    paddyLoadingList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=paddyManagement&menu=paddyLoading&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
  }
});

// handling paddy unloading data
const transitPassEntryBtn = document.getElementById("transitPassEntry");
transitPassEntryBtn.addEventListener("click", async (e) => {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";
    console.log("Working");

    //   menu item color change
    const menu_items = document.getElementsByClassName("menu_item");

    for (let i = 0; i < menu_items.length; i++) {
      menu_items[i].classList.remove("active");
    }
    // console.log(e.target.classList);
    e.target.classList.add("active");

    localStorage.setItem("side_menu_tab", "transitPassEntry");

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

    //---------------------------------------------------- for showing add transit pass  form----------------------------------------------------

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", async (e) => {
      try {
        // console.log("hio");
        // window.location.href = `/home/details?tab=manageAccount&menu=companyLocation&method=update&id=null`;
        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const mandiResponse = await axios.get(`/home/company-mandi/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const factoryResponse = await axios.get(`/home/company-factory/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const seasonResponse = await axios.get(
          `/home/manage-account/company-season`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        spinner.style.visibility = "hidden";

        console.log(
          mandiResponse.data,
          factoryResponse.data,
          seasonResponse.data
        );

        const companyMandi = mandiResponse.data.companyMandi;

        if (companyMandi.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company location data have been added. Please add company location to proceed further.  </h1>
              </div>`;
          return;
        }

        const companyFactory = factoryResponse.data.companyFactory;

        if (companyFactory.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company factory  has been added. Please add company factory to proceed further.  </h1>
              </div>`;
          return;
        }

        const companySeasons = seasonResponse.data.companySeasons;

        if (companySeasons.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company season has been added. Please add company season to proceed further.  </h1>
              </div>`;
          return;
        }

        main_section_container.innerHTML = `
  <div class="content_area">
  <div class="create_btn_div">
    <p></p>
    <div>
      <button
        id="saveTransitPassEntry"
        class="submitBtn"
        type="submit"
        form="addTransitPassEntryForm"
      >
        Save
      </button>
      <button id="cancelAddButton" class="cancelBtn">Cancel</button>
    </div>
  </div>
  
  <br />
  <br />
  
    <form id="addTransitPassEntryForm">
  <div class="form_content">
    <div class="error" id="formError"></div>

    <div class="form_control">
      <label for="seasonName"
        >Season Name<span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="seasonSelectionArea">
        <div class="select_box" data-id="selectSeasonBox">
          <div class="option_container" data-id="seasonOptionContainer">
            ${companySeasons
              .map((ele) => {
                return `
            <div class="option" data-id="seasonOption">
              <input type="radio" class="radio" name="" id="${ele.seasonId}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="seasonSelected">Select Season</div>
          <div class="search_box" data-id="seasonSearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="season_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companySeasonId"
        name="companySeasonId"
        style="display: none"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="mandiName"
        >Mandi Name (ମଣ୍ଡି ନାମ)<span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="mandiSelectionArea">
        <div class="select_box" data-id="selectMandiBox">
          <div class="option_container" data-id="mandiOptionContainer">
            ${companyMandi
              .map((ele) => {
                return `
            <div class="option" data-id="mandiOption">
              <input type="radio" class="radio" name="" id="${ele.id}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="mandiSelected">Select Mandi</div>
          <div class="search_box" data-id="mandiSearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="mandi_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companyMandiId"
        name="companyMandiId"
        style="display: none"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="factoryName"
        >Factory Name <span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="factorySelectionArea">
        <div class="select_box" data-id="selectFactoryBox">
          <div class="option_container" data-id="factoryOptionContainer">
            ${companyFactory
              .map((ele) => {
                return `
            <div class="option" data-id="factoryOption">
              <input type="radio" class="radio" name="" id="${ele.id}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="factorySelected">Select Factory</div>
          <div class="search_box" data-id="factorySearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="factory_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companyFactoryId"
        name="companyFactoryId"
        style="display: none"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="transitPassNumber"
        >Transit Pass Number<span style="color: red">*</span></label
      >
      <input
        type="number"
        id="transitPassNumber"
        name="transitPassNumber"
        placeholder="Enter Transit Pass Number"
        required

      />
      <br />
    </div>

    <div class="form_control">
      <label for="transitPassBags"
        >Transit Pass Bags<span style="color: red">*</span></label
      >
      <input
        type="number"
        id="transitPassBags"
        name="transitPassBags"
        placeholder="Enter Transit Pass Bags"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="transitPassQty_qtls"
        >Transit Pass Qty_qtls<span style="color: red">*</span></label
      >
      <input
        type="number"
        id="transitPassQty_qtls"
        name="transitPassQty_qtls"
        placeholder="Enter Transit Pass Qty_qtls"
        step="any"
        min="0"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="uploadTPCopy"
        >Upload TP Copy<span style="color: red">*</span></label
      >
      <input
        type="file"
        id="uploadTPCopy"
        name="uploadTPCopy"
        accept=".jpg,.jpeg,.png,.pdf"
        required
      />
      <br />
    </div>
  </div>
</form>
  </div>  
      `;

        // Company Mandi Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="mandiSelected"]',
          optionContainerSelector: '[data-id="mandiOptionContainer"]',
          optionSelector: '[data-id="mandiOption"]',
          searchBoxSelector: "#mandi_search_box_input",
          valueInputId: "companyMandiId",
          initialText: "Select Mandi",
        });

        // Company factory Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="factorySelected"]',
          optionContainerSelector: '[data-id="factoryOptionContainer"]',
          optionSelector: '[data-id="factoryOption"]',
          searchBoxSelector: "#factory_search_box_input",
          valueInputId: "companyFactoryId",
          initialText: "Select Factory",
        });

        // Company season Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="seasonSelected"]',
          optionContainerSelector: '[data-id="seasonOptionContainer"]',
          optionSelector: '[data-id="seasonOption"]',
          searchBoxSelector: "#season_search_box_input",
          valueInputId: "companySeasonId",
          initialText: "Select season",
        });
        // comapanyMandiDropdownControl();
        // comapanyFactoryDropdownControl();

        document
          .getElementById("cancelAddButton")
          .addEventListener("click", () => {
            // console.log(masterTarget);
            paddyPurchaseBtn.click();
          });

        //---------------------------------------------------- for adding transit pass form data----------------------------------------------------

        document
          .getElementById("addTransitPassEntryForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();

              const mandiId = document.getElementById("companyMandiId").value;

              if (mandiId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a Mandi.";
                return;
              }

              const seasonId = document.getElementById("companySeasonId").value;

              if (seasonId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a Season.";
                return;
              }

              const factoryId =
                document.getElementById("companyFactoryId").value;

              if (factoryId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a factory.";
                return;
              }

              const formdata = new FormData(e.target);
              //   const data = {};
              //   formdata.forEach((value, key) => {
              //     data[key] = value;
              //   });

              spinner.style.visibility = "visible";
              const res = await axios.post(
                `/home/paddy-management/add-transit-pass-entry`,
                formdata,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              spinner.style.visibility = "hidden";
              //   console.log(masterTarget);
              transitPassEntryBtn.click();
            } catch (error) {
              errorHandler(error);
              spinner.style.visibility = "hidden";
            }
          });
      } catch (error) {
        errorHandler(error);
        spinner.style.visibility = "hidden";
        transitPassEntryBtn.click();
      }
    });

    //---------------------------------------------------- for showing paddy purchase details----------------------------------------------------

    const res = await axios.get(`/home/paddy-management/transit-pass-entry`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const transitPassEntry = res.data.transitPassEntry;

    spinner.style.visibility = "hidden";

    if (transitPassEntry.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
      <div style="margin: auto">
            <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No transit pass data have been added.  </h1>
        </div>`;
      return;
    }

    const transitPassEntryIndex = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
    <li>Date</li>
    <li>Mandi Name</li>
    <li>Factory Name</li>
    <li>Season Name</li>
    <li>Transit Pass Qty_qtls</li>
    `);

    const transitPassEntryData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = transitPassEntry
      .map((data) => {
        return `
    
  <ul class="main_section_data_part" id=${data.id}>
  <li>${data.date}</li>
  <li>${data.mandiName}</li>
  <li>${data.factoryName}</li>
  <li>${data.seasonName}</li>  
  <li>${data.transitPassQty_qtls}</li>
  </ul>
  `;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a transit pass details----------------------------------------------------

    const transitPassEntryList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    transitPassEntryList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=paddyManagement&menu=transitPassEntry&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
  }
});

// handling paddy unloading data
const paddyUnloadingBtn = document.getElementById("paddy_unloading");
paddyUnloadingBtn.addEventListener("click", async (e) => {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";
    // console.log("Working");

    //   menu item color change
    const menu_items = document.getElementsByClassName("menu_item");

    for (let i = 0; i < menu_items.length; i++) {
      menu_items[i].classList.remove("active");
    }
    // console.log(e.target.classList);
    e.target.classList.add("active");

    localStorage.setItem("side_menu_tab", "paddy_unloading");

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

    //---------------------------------------------------- for showing add paddy unloading data form----------------------------------------------------

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", async (e) => {
      try {
        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const mandiResponse = await axios.get(`/home/company-mandi/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const factoryResponse = await axios.get(`/home/company-factory/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const seasonResponse = await axios.get(
          `/home/manage-account/company-season`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const godownResponse = await axios.get(
          `/home/manage-account/company-godown`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        spinner.style.visibility = "hidden";

        console.log(
          mandiResponse.data,
          factoryResponse.data,
          seasonResponse.data,
          godownResponse.data
        );

        const companyMandi = mandiResponse.data.companyMandi;

        if (companyMandi.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company location data have been added. Please add company location to proceed further.  </h1>
              </div>`;
          return;
        }

        const companyFactory = factoryResponse.data.companyFactory;

        if (companyFactory.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company factory  has been added. Please add company factory to proceed further.  </h1>
              </div>`;
          return;
        }

        const companySeasons = seasonResponse.data.companySeasons;

        if (companySeasons.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company season has been added. Please add company season to proceed further.  </h1>
              </div>`;
          return;
        }

        const companyGodowns = godownResponse.data.companyGodowns;

        if (companyGodowns.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company godown has been added. Please add company godown to proceed further.  </h1>
              </div>`;
          return;
        }

        main_section_container.innerHTML = `
  <div class="content_area">
  <div class="create_btn_div">
    <p></p>
    <div>
      <button
        id="savePaddyUnloading"
        class="submitBtn"
        type="submit"
        form="addPaddyUnloadingForm"
      >
        Save
      </button>
      <button id="cancelAddButton" class="cancelBtn">Cancel</button>
    </div>
  </div>
  
  <br />
  <br />
  
    <form id="addPaddyUnloadingForm">
  <div class="form_content">
    <div class="error" id="formError"></div>

    <div class="form_control">
      <label for="mandiName"
        >Mandi Name (ମଣ୍ଡି ନାମ)<span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="mandiSelectionArea">
        <div class="select_box" data-id="selectMandiBox">
          <div class="option_container" data-id="mandiOptionContainer">
            ${companyMandi
              .map((ele) => {
                return `
            <div class="option" data-id="mandiOption">
              <input type="radio" class="radio" name="" id="${ele.id}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="mandiSelected">Select Mandi</div>
          <div class="search_box" data-id="mandiSearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="mandi_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companyMandiId"
        name="companyMandiId"
        style="display: none"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="seasonName"
        >Season Name<span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="seasonSelectionArea">
        <div class="select_box" data-id="selectSeasonBox">
          <div class="option_container" data-id="seasonOptionContainer">
            ${companySeasons
              .map((ele) => {
                return `
            <div class="option" data-id="seasonOption">
              <input type="radio" class="radio" name="" id="${ele.seasonId}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="seasonSelected">Select Season</div>
          <div class="search_box" data-id="seasonSearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="season_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companySeasonId"
        name="companySeasonId"
        style="display: none"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="factoryName"
        >Factory Name <span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="factorySelectionArea">
        <div class="select_box" data-id="selectFactoryBox">
          <div class="option_container" data-id="factoryOptionContainer">
            ${companyFactory
              .map((ele) => {
                return `
            <div class="option" data-id="factoryOption">
              <input type="radio" class="radio" name="" id="${ele.id}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="factorySelected">Select Factory</div>
          <div class="search_box" data-id="factorySearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="factory_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companyFactoryId"
        name="companyFactoryId"
        style="display: none"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="godownName"
        >godown Name <span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="godownSelectionArea">
        <div class="select_box" data-id="selectGodownBox">
          <div class="option_container" data-id="godownOptionContainer">
            ${companyGodowns
              .map((ele) => {
                return `
            <div class="option" data-id="godownOption">
              <input type="radio" class="radio" name="" id="${ele.godownId}" />
              <label for="${ele.godownId}">${ele.godownName}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="godownSelected">Select Godown</div>
          <div class="search_box" data-id="godownSearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="godown_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companyGodownId"
        name="companyGodownId"
        style="display: none"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="vehicleNumber"
        >Vehicle Number<span style="color: red">*</span></label
      >
      <input
        type="text"
        id="vehicleNumber"
        name="vehicleNumber"
        placeholder="Enter vehicle number"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="rstNumber">RST Number<span style="color: red">*</span></label>
      <input
        type="number"
        id="rstNumber"
        name="rstNumber"
        placeholder="Enter RST number"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="gunnyBags">Bags<span style="color: red">*</span></label>
      <input
        type="number"
        id="gunnyBags"
        name="gunnyBags"
        placeholder="Enter bags number"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="ppBags"> PP Bags<span style="color: red">*</span></label>
      <input
        type="number"
        id="ppBags"
        name="ppBags"
        placeholder="Enter PP bags number"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="qtlsGross">
        Gross(Qtls)<span style="color: red">*</span></label
      >
      <input
        type="number"
        id="qtlsGross"
        name="qtlsGross"
        placeholder="Enter gross (in Qtls)"
        step="any"
        min="0"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="tare">Tare<span style="color: red">*</span></label>
      <input
        type="number"
        id="tare"
        name="tare"
        placeholder="Enter Tare"
        step="any"
        min="0"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="notes"
        >Notes</label
      >
      <input type="text" id="notes" name="notes" placeholder="Enter notes" />
      <br />
    </div>
  </div>
</form>

  </div>  
      `;

        // Company Mandi Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="mandiSelected"]',
          optionContainerSelector: '[data-id="mandiOptionContainer"]',
          optionSelector: '[data-id="mandiOption"]',
          searchBoxSelector: "#mandi_search_box_input",
          valueInputId: "companyMandiId",
          initialText: "Select Mandi",
        });

        // Company factory Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="factorySelected"]',
          optionContainerSelector: '[data-id="factoryOptionContainer"]',
          optionSelector: '[data-id="factoryOption"]',
          searchBoxSelector: "#factory_search_box_input",
          valueInputId: "companyFactoryId",
          initialText: "Select Factory",
        });

        // Company season Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="seasonSelected"]',
          optionContainerSelector: '[data-id="seasonOptionContainer"]',
          optionSelector: '[data-id="seasonOption"]',
          searchBoxSelector: "#season_search_box_input",
          valueInputId: "companySeasonId",
          initialText: "Select season",
        });

        // Company Godown Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="godownSelected"]',
          optionContainerSelector: '[data-id="godownOptionContainer"]',
          optionSelector: '[data-id="godownOption"]',
          searchBoxSelector: "#godown_search_box_input",
          valueInputId: "companyGodownId",
          initialText: "Select Godown",
        });

        document
          .getElementById("cancelAddButton")
          .addEventListener("click", () => {
            // console.log(masterTarget);
            paddyUnloadingBtn.click();
          });

        //---------------------------------------------------- for adding paddy unloading form data----------------------------------------------------

        document
          .getElementById("addPaddyUnloadingForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();

              const mandiId = document.getElementById("companyMandiId").value;

              if (mandiId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a Mandi.";
                return;
              }

              const seasonId = document.getElementById("companySeasonId").value;

              if (seasonId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a Season.";
                return;
              }

              const factoryId =
                document.getElementById("companyFactoryId").value;

              if (factoryId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a factory.";
                return;
              }

              const companyGodownId =
                document.getElementById("companyGodownId").value;

              if (companyGodownId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a Godown";
                return;
              }

              const formdata = new FormData(e.target);
              const data = {};
              formdata.forEach((value, key) => {
                data[key] = value;
              });

              console.log(data);

              spinner.style.visibility = "visible";
              const res = await axios.post(
                `/home/paddy-management/add-paddy-unloading`,
                data,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              spinner.style.visibility = "hidden";
              //   console.log(masterTarget);
              paddyUnloadingBtn.click();
            } catch (error) {
              errorHandler(error);
              spinner.style.visibility = "hidden";
            }
          });
      } catch (error) {
        errorHandler(error);
        spinner.style.visibility = "hidden";
        paddyUnloadingBtn.click();
      }
    });

    //---------------------------------------------------- for showing paddy unloading details----------------------------------------------------

    const res = await axios.get(`/home/paddy-management/paddy-unloading`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const paddyUnloadingResponse = res.data.paddyUnloading;

    spinner.style.visibility = "hidden";

    if (paddyUnloadingResponse.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
          <div style="margin: auto">
                <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No paddy unloading data have been added.  </h1>
            </div>`;
      return;
    }

    const paddyUnloadingIndex = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
        <li>Date</li>
        <li>Mandi Name</li>
        <li>Factory Name</li>
        <li>Season Name</li>
        <li>Vehicle No.</li>
        <li>Unloaded Qty_qtls</li>
        `);

    const paddyUnloadingData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = paddyUnloadingResponse
      .map((data) => {
        return `

      <ul class="main_section_data_part" id=${data.id}>
      <li>${data.date}</li>
      <li>${data.mandiName}</li>
      <li>${data.factoryName}</li>
      <li>${data.seasonName}</li>
      <li>${data.vehicleNumber}</li>
      <li>${data.unloadedQty_qtls}</li>
      </ul>
      `;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a paddy Unloading----------------------------------------------------

    const paddyUnloadingList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    paddyUnloadingList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=paddyManagement&menu=paddyUnloading&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  const storedTab = localStorage.getItem("side_menu_tab");
  localStorage.removeItem("side_menu_tab_u");
  localStorage.removeItem("side_menu_tab_trader");

  //   console.log(storedTab);

  // Remove 'active' class from all menu items before applying
  const menu_items = document.getElementsByClassName("menu_item");
  for (let i = 0; i < menu_items.length; i++) {
    menu_items[i].classList.remove("active");
  }

  if (storedTab) {
    // console.log("hello");
    // Get the tab element from localStorage and add the 'active' class
    const tab = document.getElementById(storedTab);
    if (tab) {
      tab.click();
      // tab.classList.add("active");
      // console.log(tab, tab.classList);
    }
  } else {
    masterTargetBtn.click();
    // Default behavior if no tab is stored
  }
});
