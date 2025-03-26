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

// handling trader paddy advance data

const traderAdvanceBtn = document.getElementById("trader_advance");
traderAdvanceBtn.addEventListener("click", async (e) => {
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

    localStorage.setItem("side_menu_tab_trader", "trader_advance");

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

    //---------------------------------------------------- for showing add trader paddy advanace data form----------------------------------------------------

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", async (e) => {
      try {
        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const traderResponse = await axios.get(
          `/home/manage-account/company-trader`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
          traderResponse.data,
          factoryResponse.data,
          seasonResponse.data,
          godownResponse.data
        );

        const companyTrader = traderResponse.data.companyTraders;

        if (companyTrader.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No tarder have been added. Please add trader information to proceed further.  </h1>
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
        id="saveTraderPaddyAdvance"
        class="submitBtn"
        type="submit"
        form="addTraderPaddyAdvanceForm"
      >
        Save
      </button>
      <button id="cancelAddButton" class="cancelBtn">Cancel</button>
    </div>
  </div>
  
  <br />
  <br />
  
    <form id="addTraderPaddyAdvanceForm">
  <div class="form_content">
    <div class="error" id="formError"></div>

    <div class="form_control">
      <label for="traderName"
        >Trader Name<span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="traderSelectionArea">
        <div class="select_box" data-id="selectTraderBox">
          <div class="option_container" data-id="traderOptionContainer">
            ${companyTrader
              .map((ele) => {
                return `
            <div class="option" data-id="traderOption">
              <input type="radio" class="radio" name="" id="${ele.traderId}" />
              <label for="${ele.traderId}">${ele.traderName}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="traderSelected">Select Trader</div>
          <div class="search_box" data-id="traderSearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="trader_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companyTraderId"
        name="companyTraderId"
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
      <label for="inBags">In Bags<span style="color: red">*</span></label>
      <input
        type="number"
        id="inBags"
        name="inBags"
        placeholder="Enter IN Bags"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="gross">Gross<span style="color: red">*</span></label>
      <input
        type="number"
        id="gross"
        name="gross"
        placeholder="Enter gross"
        required
        step="any"
        min="0"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="bagWeightInKg"
        >Bag Weight In Kg<span style="color: red">*</span></label
      >
      <input
        type="number"
        id="bagWeightInKg"
        name="bagWeightInKg"
        placeholder="Enter bag weight in Kg"
        required
        step="any"
        min="0"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="faqPercentage"
        >Faq Percentage<span style="color: red">*</span></label
      >
      <input
        type="number"
        id="faqPercentage"
        name="faqPercentage"
        placeholder="Enter faq percentage"
        required
        step="any"
        min="0"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="specialCuttingInKg"
        >Special Cutting In Kg<span style="color: red">*</span></label
      >
      <input
        type="number"
        id="specialCuttingInKg"
        name="specialCuttingInKg"
        placeholder="Enter special cutting in Kg"
        required
        step="any"
        min="0"
      />
      <br />
    </div>

    
  </div>
</form>

  </div>  
      `;

        // Company trader Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="traderSelected"]',
          optionContainerSelector: '[data-id="traderOptionContainer"]',
          optionSelector: '[data-id="traderOption"]',
          searchBoxSelector: "#trader_search_box_input",
          valueInputId: "companyTraderId",
          initialText: "Select Trader",
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
            traderAdvanceBtn.click();
          });

        //---------------------------------------------------- for adding paddy unloading form data----------------------------------------------------

        document
          .getElementById("addTraderPaddyAdvanceForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();

              const traderId = document.getElementById("companyTraderId").value;

              if (traderId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a Trader.";
                return;
              }

              console.log(traderId);

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
                `/home/trader-management/add-trader-paddy-advance`,
                data,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              spinner.style.visibility = "hidden";
              //   console.log(masterTarget);
              traderAdvanceBtn.click();
            } catch (error) {
              errorHandler(error);
              spinner.style.visibility = "hidden";
            }
          });
      } catch (error) {
        errorHandler(error);
        spinner.style.visibility = "hidden";
        traderAdvanceBtn.click();
      }
    });

    //---------------------------------------------------- for showing trader paddy advance details----------------------------------------------------

    const res = await axios.get(
      `/home/trader-management/trader-paddy-advance`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const traderPaddyAdvanceResponse = res.data.traderPaddyAdvance;

    spinner.style.visibility = "hidden";

    if (traderPaddyAdvanceResponse.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
          <div style="margin: auto">
                <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No trader paddy advance data have been added.  </h1>
            </div>`;
      return;
    }

    const traderPaddyAdvanceIndex = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
        <li>Date</li>
        <li>Trader Name</li>
        <li>Season Name</li>
        <li>Factory Name</li>
        <li>Nett In</li>
        `);

    const traderPaddyAdvanceData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = traderPaddyAdvanceResponse
      .map((data) => {
        return `

      <ul class="main_section_data_part" id=${data.id}>
      <li>${data.date}</li>
      <li>${data.traderName}</li>
      <li>${data.seasonName}</li>
      <li>${data.factoryName}</li>
      <li>${data.nettIn}</li>
      </ul>
      `;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a tarder paddy advance----------------------------------------------------

    const traderPaddyAdvanceList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    traderPaddyAdvanceList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=traderManagement&menu=trader_advance&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
  }
});

// handling trader paddy release data

const traderReleaseBtn = document.getElementById("trader_release");
traderReleaseBtn.addEventListener("click", async (e) => {
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

    localStorage.setItem("side_menu_tab_trader", "trader_release");

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

    //---------------------------------------------------- for showing add trader paddy release data form----------------------------------------------------

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", async (e) => {
      try {
        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const traderResponse = await axios.get(
          `/home/manage-account/company-trader`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const mandiResponse = await axios.get(`/home/company-mandi/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // const factoryResponse = await axios.get(`/home/company-factory/`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });

        const seasonResponse = await axios.get(
          `/home/manage-account/company-season`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // const godownResponse = await axios.get(
        //   `/home/manage-account/company-godown`,
        //   {
        //     headers: { Authorization: `Bearer ${token}` },
        //   }
        // );

        spinner.style.visibility = "hidden";

        console.log(
          traderResponse.data,
          mandiResponse.data,
          seasonResponse.data
          // godownResponse.data
        );

        const companyTrader = traderResponse.data.companyTraders;

        if (companyTrader.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No trader have been added. Please add trader information to proceed further.  </h1>
              </div>`;
          return;
        }

        // const companyFactory = factoryResponse.data.companyFactory;

        // if (companyFactory.length < 1) {
        //   document.getElementsByClassName(
        //     "main_section_content"
        //   )[0].innerHTML = `
        //     <div style="margin: auto">
        //           <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company factory  has been added. Please add company factory to proceed further.  </h1>
        //       </div>`;
        //   return;
        // }

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

        // const companyGodowns = godownResponse.data.companyGodowns;

        // if (companyGodowns.length < 1) {
        //   document.getElementsByClassName(
        //     "main_section_content"
        //   )[0].innerHTML = `
        //     <div style="margin: auto">
        //           <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company godown has been added. Please add company godown to proceed further.  </h1>
        //       </div>`;
        //   return;
        // }

        main_section_container.innerHTML = `
  <div class="content_area">
  <div class="create_btn_div">
    <p></p>
    <div>
      <button
        id="saveTraderPaddyRelease"
        class="submitBtn"
        type="submit"
        form="addTraderPaddyReleaseForm"
      >
        Save
      </button>
      <button id="cancelAddButton" class="cancelBtn">Cancel</button>
    </div>
  </div>
  
  <br />
  <br />
  
    <form id="addTraderPaddyReleaseForm">
  <div class="form_content">
    <div class="error" id="formError"></div>

    <div class="form_control">
      <label for="traderName"
        >Trader Name<span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="traderSelectionArea">
        <div class="select_box" data-id="selectTraderBox">
          <div class="option_container" data-id="traderOptionContainer">
            ${companyTrader
              .map((ele) => {
                return `
            <div class="option" data-id="traderOption">
              <input type="radio" class="radio" name="" id="${ele.traderId}" />
              <label for="${ele.traderId}">${ele.traderName}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="traderSelected">Select Trader</div>
          <div class="search_box" data-id="traderSearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="trader_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companyTraderId"
        name="companyTraderId"
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
      <label for="releaseQtls"
        >Release Qtls<span style="color: red">*</span></label
      >
      <input
        type="number"
        id="releaseQtls"
        name="releaseQtls"
        placeholder="Enter bags released"
        required
        step="any"
        min="0"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="releaseBags"
        >Release Bags<span style="color: red">*</span></label
      >
      <input
        type="number"
        id="releaseBags"
        name="releaseBags"
        placeholder="Enter bags released"
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

        // Company trader Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="traderSelected"]',
          optionContainerSelector: '[data-id="traderOptionContainer"]',
          optionSelector: '[data-id="traderOption"]',
          searchBoxSelector: "#trader_search_box_input",
          valueInputId: "companyTraderId",
          initialText: "Select Trader",
        });

        // // Company factory Dropdown
        // setupDropdownControl({
        //   selectedSelector: '[data-id="factorySelected"]',
        //   optionContainerSelector: '[data-id="factoryOptionContainer"]',
        //   optionSelector: '[data-id="factoryOption"]',
        //   searchBoxSelector: "#factory_search_box_input",
        //   valueInputId: "companyFactoryId",
        //   initialText: "Select Factory",
        // });

        // Company season Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="seasonSelected"]',
          optionContainerSelector: '[data-id="seasonOptionContainer"]',
          optionSelector: '[data-id="seasonOption"]',
          searchBoxSelector: "#season_search_box_input",
          valueInputId: "companySeasonId",
          initialText: "Select season",
        });

        // // Company Godown Dropdown
        // setupDropdownControl({
        //   selectedSelector: '[data-id="godownSelected"]',
        //   optionContainerSelector: '[data-id="godownOptionContainer"]',
        //   optionSelector: '[data-id="godownOption"]',
        //   searchBoxSelector: "#godown_search_box_input",
        //   valueInputId: "companyGodownId",
        //   initialText: "Select Godown",
        // });

        document
          .getElementById("cancelAddButton")
          .addEventListener("click", () => {
            // console.log(masterTarget);
            traderReleaseBtn.click();
          });

        //---------------------------------------------------- for adding trader paddy release form data----------------------------------------------------

        document
          .getElementById("addTraderPaddyReleaseForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();

              const traderId = document.getElementById("companyTraderId").value;

              if (traderId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a Trader.";
                return;
              }

              console.log(traderId);

              const seasonId = document.getElementById("companySeasonId").value;

              if (seasonId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a Season.";
                return;
              }

              const mandiId = document.getElementById("companyMandiId").value;

              if (mandiId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a mandi.";
                return;
              }

              // const companyGodownId =
              //   document.getElementById("companyGodownId").value;

              // if (companyGodownId.trim() === "") {
              //   // console.log();
              //   document.getElementById("formError").innerHTML =
              //     "Please select a Godown";
              //   return;
              // }

              const formdata = new FormData(e.target);
              const data = {};
              formdata.forEach((value, key) => {
                data[key] = value;
              });

              console.log(data);

              spinner.style.visibility = "visible";
              const res = await axios.post(
                `/home/trader-management/add-trader-paddy-release`,
                data,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              spinner.style.visibility = "hidden";
              //   console.log(masterTarget);
              traderReleaseBtn.click();
            } catch (error) {
              errorHandler(error);
              spinner.style.visibility = "hidden";
            }
          });
      } catch (error) {
        errorHandler(error);
        spinner.style.visibility = "hidden";
        traderReleaseBtn.click();
      }
    });

    //---------------------------------------------------- for showing trader paddy release details----------------------------------------------------

    const res = await axios.get(
      `/home/trader-management/trader-paddy-release`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const traderPaddyReleaseResponse = res.data.traderPaddyRelease;

    spinner.style.visibility = "hidden";

    if (traderPaddyReleaseResponse.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
          <div style="margin: auto">
                <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No trader paddy release data have been added.  </h1>
            </div>`;
      return;
    }

    const traderPaddyReleaseIndex = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
        <li>Date</li>
        <li>Trader Name</li>
        <li>Season Name</li>        
        <li>Release Qtls</li>
        `);

    const traderPaddyReleaseData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = traderPaddyReleaseResponse
      .map((data) => {
        return `

      <ul class="main_section_data_part" id=${data.id}>
      <li>${data.date}</li>
      <li>${data.traderName}</li>
      <li>${data.seasonName}</li>
      <li>${data.releaseQtls}</li>
      </ul>
      `;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a tarder paddy release----------------------------------------------------

    const traderPaddyReleaseList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    traderPaddyReleaseList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=traderManagement&menu=trader_release&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  const storedTab = localStorage.getItem("side_menu_tab_trader");
  localStorage.removeItem("side_menu_tab_u");
  localStorage.removeItem("side_menu_tab");

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
    traderAdvanceBtn.click();
    // Default behavior if no tab is stored
  }
});
