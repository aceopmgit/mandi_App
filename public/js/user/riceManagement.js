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

// handling rice delivery certificate data
const deliveryCertificateBtn = document.getElementById("delivery_certificate");
deliveryCertificateBtn.addEventListener("click", async (e) => {
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

    localStorage.setItem("side_menu_tab_rice", "delivery_certificate");

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

    //---------------------------------------------------- for showing add delivery certificate data form----------------------------------------------------

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", async (e) => {
      try {
        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const depotResponse = await axios.get(`/home/company-depot/`, {
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
          factoryResponse.data,
          seasonResponse.data,
          depotResponse.data
        );

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

        const companyDepot = depotResponse.data.companyDepot;

        if (companyDepot.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company location data have been added. Please add company location to proceed further.  </h1>
              </div>`;
          return;
        }

        main_section_container.innerHTML = `
  <div class="content_area">
  <div class="create_btn_div">
    <p></p>
    <div>
      <button
        id="saveDeliveryCertificate"
        class="submitBtn"
        type="submit"
        form="addDeliveryCertificateForm"
      >
        Save
      </button>
      <button id="cancelAddButton" class="cancelBtn">Cancel</button>
    </div>
  </div>
  
  <br />
  <br />
  
    <form id="addDeliveryCertificateForm">
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
      <label for="depotName"
        >Depot Name <span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="depotSelectionArea">
        <div class="select_box" data-id="selectDepotBox">
          <div class="option_container" data-id="depotOptionContainer">
            ${companyDepot
              .map((ele) => {
                return `
            <div class="option" data-id="depotOption">
              <input type="radio" class="radio" name="" id="${ele.id}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="depotSelected">Select Depot</div>
          <div class="search_box" data-id="depotSearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="depot_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companyDepotId"
        name="companyDepotId"
        style="display: none"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="dcNumber">Dc Number<span style="color: red">*</span></label>
      <input
        type="text"
        id="dcNumber"
        name="dcNumber"
        placeholder="Enter DC Number"
        required
      />
      <br />
    </div>



    <div class="form_control">
      <label for="qtyQtls">Qty Qtls<span style="color: red">*</span></label>
      <input
        type="number"
        id="qtyQtls"
        name="qtyQtls"
        placeholder="Enter Qty in Qtls"
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

        // Company season Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="seasonSelected"]',
          optionContainerSelector: '[data-id="seasonOptionContainer"]',
          optionSelector: '[data-id="seasonOption"]',
          searchBoxSelector: "#season_search_box_input",
          valueInputId: "companySeasonId",
          initialText: "Select season",
        });

        // Company depot Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="depotSelected"]',
          optionContainerSelector: '[data-id="depotOptionContainer"]',
          optionSelector: '[data-id="depotOption"]',
          searchBoxSelector: "#depot_search_box_input",
          valueInputId: "companyDepotId",
          initialText: "Select Depot",
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

        document
          .getElementById("cancelAddButton")
          .addEventListener("click", () => {
            // console.log(masterTarget);
            deliveryCertificateBtn.click();
          });

        //---------------------------------------------------- for adding delivery certificate form data----------------------------------------------------

        document
          .getElementById("addDeliveryCertificateForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();

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

              const depotId = document.getElementById("companyDepotId").value;

              if (depotId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a Depot.";
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
                `/home/rice-management/add-delivery-certificate`,
                data,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              spinner.style.visibility = "hidden";
              //   console.log(masterTarget);
              deliveryCertificateBtn.click();
            } catch (error) {
              errorHandler(error);
              spinner.style.visibility = "hidden";
            }
          });
      } catch (error) {
        errorHandler(error);
        spinner.style.visibility = "hidden";
        deliveryCertificateBtn.click();
      }
    });

    //---------------------------------------------------- for showing delivery certificate details----------------------------------------------------

    const res = await axios.get(`/home/rice-management/delivery-certificate`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const deliveryCertificateResponse = res.data.deliveryCertificate;

    spinner.style.visibility = "hidden";

    if (deliveryCertificateResponse.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
          <div style="margin: auto">
                <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No delivery certificate have been added.  </h1>
            </div>`;
      return;
    }

    const deliveryCertificateIndex = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
        <li>Date</li>
        <li>Dc Number</li>        
        <li>Season Name</li>
        <li>Depot Name</li>
        <li>Factory Name</li>
        <li>Qty Qtls</li>
        `);

    const deliveryCertificateData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = deliveryCertificateResponse
      .map((data) => {
        return `

      <ul class="main_section_data_part" id=${data.id}>
      <li>${data.date}</li>
      <li>${data.dcNumber}</li>
      <li>${data.seasonName}</li>
      <li>${data.depotName}</li>
      <li>${data.factoryName}</li>
      <li>${data.qtyQtls}</li>
      </ul>
      `;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a delivery certificate----------------------------------------------------

    const deliveryCertificateList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    deliveryCertificateList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=riceManagement&menu=delivery_certificate&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
  }
});

// handling factory rice loading data
const factoryRiceLoadingBtn = document.getElementById("factory_rice_loading");
factoryRiceLoadingBtn.addEventListener("click", async (e) => {
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

    localStorage.setItem("side_menu_tab_rice", "factory_rice_loading");

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

    //---------------------------------------------------- for showing add factory rice loading data form----------------------------------------------------

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", async (e) => {
      try {
        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const seasonResponse = await axios.get(
          `/home/manage-account/company-season`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const depotResponse = await axios.get(`/home/company-depot/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const factoryResponse = await axios.get(`/home/company-factory/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // const dcResponse = await axios.get(
        //   `/home/rice-management/delivery-certificate`,
        //   {
        //     headers: { Authorization: `Bearer ${token}` },
        //   }
        // );

        spinner.style.visibility = "hidden";

        console.log(
          factoryResponse.data,
          seasonResponse.data,
          depotResponse.data
        );

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

        const companyDepot = depotResponse.data.companyDepot;

        if (companyDepot.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company location data have been added. Please add company location to proceed further.  </h1>
              </div>`;
          return;
        }

        // if (companyDc.length < 1) {
        //   document.getElementsByClassName(
        //     "main_section_content"
        //   )[0].innerHTML = `
        //     <div style="margin: auto">
        //           <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No  delivery certificate has been added. Please add company season to proceed further.  </h1>
        //       </div>`;
        //   return;
        // }

        main_section_container.innerHTML = `
  <div class="content_area">
  <div class="create_btn_div">
    <p></p>
    <div>
      <button
        id="saveFactoryRiceLoading"
        class="submitBtn"
        type="submit"
        form="addFactoryRiceLoadingForm"
      >
        Save
      </button>
      <button id="cancelAddButton" class="cancelBtn">Cancel</button>
    </div>
  </div>
  
  <br />
  <br />
  
    <form id="addFactoryRiceLoadingForm">
  <div class="form_content">
    <div class="error" id="formError"></div>

    <div class="form_control">
      <label for="seasonName"
        >Season Name<span style="color: red">*</span></label
      >
      <select name="seasonId" id="seasonId" required>
      <option value="" disabled selected>Select a season</option>
        ${companySeasons
          .map((ele) => {
            return `
          <option value="${ele.seasonId}">${ele.name}</option>
          `;
          })
          .join("")}
      </select>
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
      <label for="depotName"
        >Depot Name <span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="depotSelectionArea">
        <div class="select_box" data-id="selectDepotBox">
          <div class="option_container" data-id="depotOptionContainer">
            ${companyDepot
              .map((ele) => {
                return `
            <div class="option" data-id="depotOption">
              <input type="radio" class="radio" name="" id="${ele.id}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="depotSelected">Select Depot</div>
          <div class="search_box" data-id="depotSearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="depot_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companyDepotId"
        name="companyDepotId"
        style="display: none"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="deliveryCertificateId"
        >Delivery Certificate<span style="color: red">*</span></label
      >
      <div id="companyDcDiv" class="form_control">
      <select name="deliveryCertificateId" id="deliveryCertificateId"  required>
        <option value="">Select Delivery Certificate</option>
      </select>
      </div>
      
    </div>

    <div class="form_control">
      <label for="vehicleNumber">Vehicle Number<span style="color: red">*</span></label>
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
      <label for="qtyBags">Qty Bags <span style="color: red">*</span></label>
      <input
        type="number"
        id="qtyBags"
        name="qtyBags"
        placeholder="Enter Qty Bags"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="qtyQtls">Qty Qtls<span style="color: red">*</span></label>
      <input
        type="number"
        id="qtyQtls"
        name="qtyQtls"
        placeholder="Enter Qty in Qtls"
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

        // Company depot Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="depotSelected"]',
          optionContainerSelector: '[data-id="depotOptionContainer"]',
          optionSelector: '[data-id="depotOption"]',
          searchBoxSelector: "#depot_search_box_input",
          valueInputId: "companyDepotId",
          initialText: "Select Depot",
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

        document
          .getElementById("seasonId")
          .addEventListener("change", async (e) => {
            try {
              const id = e.target.value;

              const deliveryCertificateResponse = await axios.get(
                `/home/rice-management/current-delivery-certificate/?id=${id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              const deliveryCertificate =
                deliveryCertificateResponse.data.deliveryCertificate;

              if (deliveryCertificate.length < 1) {
                document.getElementsByClassName(
                  "main_section_content"
                )[0].innerHTML = `
                  <div style="margin: auto">
                        <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No delivery certificate have been added for the season. Please add delivery certificate to proceed further.  </h1>
                    </div>`;
                return;
              }

              // const companyDc = dcResponse.data.deliveryCertificate;

              document.getElementById("companyDcDiv").innerHTML = `
         <select
  name="deliveryCertificateId"
  id="deliveryCertificateId"   
  required
>
  <option value="" disabled selected>Select a delivery certificate</option>
  ${deliveryCertificate
    .map((ele) => {
      return `
  <option value="${ele.id}">
    DC Number: ${ele.dcNumber} Balance: ${ele.dcBalance}
  </option>
  `;
    })
    .join("")}
</select>

            `;
            } catch (error) {
              errorHandler(error);
              spinner.style.visibility = "hidden";
            }
          });

        document
          .getElementById("cancelAddButton")
          .addEventListener("click", () => {
            // console.log(masterTarget);
            factoryRiceLoadingBtn.click();
          });

        //---------------------------------------------------- for adding factory rice loading form data----------------------------------------------------

        document
          .getElementById("addFactoryRiceLoadingForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();

              const factoryId =
                document.getElementById("companyFactoryId").value;

              if (factoryId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a factory.";
                return;
              }

              const depotId = document.getElementById("companyDepotId").value;

              if (depotId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a Depot.";
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
                `/home/rice-management/add-factory-rice-loading`,
                data,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              spinner.style.visibility = "hidden";
              //   console.log(masterTarget);
              factoryRiceLoadingBtn.click();
            } catch (error) {
              errorHandler(error);
              spinner.style.visibility = "hidden";
            }
          });
      } catch (error) {
        errorHandler(error);
        spinner.style.visibility = "hidden";
        factoryRiceLoadingBtn.click();
      }
    });

    //---------------------------------------------------- for showing factory rice loading  details----------------------------------------------------

    const res = await axios.get(`/home/rice-management/factory-rice-loading`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const factoryRiceLoadingResponse = res.data.factoryRiceLoading;

    spinner.style.visibility = "hidden";

    if (factoryRiceLoadingResponse.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
          <div style="margin: auto">
                <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No factory rice loading response data been added.  </h1>
            </div>`;
      return;
    }

    const factoryRiceLoadingIndex = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
        <li>Date</li>
        <li>Dc Number</li>        
        <li>Season Name</li>
        <li>Depot Name</li>
        <li>Factory Name</li>
        <li>Vehicle Number</li>
        <li>Qty Qtls</li>
        `);

    const factoryRiceLoadingData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = factoryRiceLoadingResponse
      .map((data) => {
        return `

      <ul class="main_section_data_part" id=${data.id}>
      <li>${data.date}</li>
      <li>${data.dcNumber}</li>
      <li>${data.seasonName}</li>
      <li>${data.depotName}</li>
      <li>${data.factoryName}</li>
      <li>${data.vehicleNumber}</li>
      <li>${data.qtyQtls}</li>
      </ul>
      `;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a factory rice loading----------------------------------------------------

    const factoryRiceLoadingList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    factoryRiceLoadingList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=riceManagement&menu=factory_rice_loading&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
  }
});

// handling rice ac note data
const riceAcNoteBtn = document.getElementById("rice_ac_note");
riceAcNoteBtn.addEventListener("click", async (e) => {
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

    localStorage.setItem("side_menu_tab_rice", "rice_ac_note");

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

    //---------------------------------------------------- for showing add rc ac note data form----------------------------------------------------

    const addButton = document.getElementById("add");
    addButton.addEventListener("click", async (e) => {
      try {
        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const depotResponse = await axios.get(`/home/company-depot/`, {
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
          factoryResponse.data,
          seasonResponse.data,
          depotResponse.data
        );

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

        const companyDepot = depotResponse.data.companyDepot;

        if (companyDepot.length < 1) {
          document.getElementsByClassName(
            "main_section_content"
          )[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No company location data have been added. Please add company location to proceed further.  </h1>
              </div>`;
          return;
        }

        main_section_container.innerHTML = `
  <div class="content_area">
  <div class="create_btn_div">
    <p></p>
    <div>
      <button
        id="saveRiceAcNote"
        class="submitBtn"
        type="submit"
        form="addRiceAcNoteForm"
      >
        Save
      </button>
      <button id="cancelAddButton" class="cancelBtn">Cancel</button>
    </div>
  </div>
  
  <br />
  <br />
  
    <form id="addRiceAcNoteForm">
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
      <label for="depotName"
        >Depot Name <span style="color: red">*</span></label
      >
      <div class="selection_area" data-id="depotSelectionArea">
        <div class="select_box" data-id="selectDepotBox">
          <div class="option_container" data-id="depotOptionContainer">
            ${companyDepot
              .map((ele) => {
                return `
            <div class="option" data-id="depotOption">
              <input type="radio" class="radio" name="" id="${ele.id}" />
              <label for="${ele.name}">${ele.name}</label>
            </div>

            `;
              })
              .join("")}
          </div>

          <div class="selected" data-id="depotSelected">Select Depot</div>
          <div class="search_box" data-id="depotSearchBox">
            <input
              type="text"
              placeholder="Start Typing....."
              id="depot_search_box_input"
            />
          </div>
        </div>
        <br />
      </div>
    </div>

    <div class="form_control">
      <input
        type="text"
        id="companyDepotId"
        name="companyDepotId"
        style="display: none"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="acNoteNumber">Ac Note Number<span style="color: red">*</span></label>
      <input
        type="text"
        id="acNoteNumber"
        name="acNoteNumber"
        placeholder="Enter Ac Note Number"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="qtyQtls">Qty Qtls<span style="color: red">*</span></label>
      <input
        type="number"
        id="qtyQtls"
        name="qtyQtls"
        placeholder="Enter Quantity in Qtls"
        required
        step="any"
        min="0"
      />
      <br />
    </div>

    <div class="form_control">
      <label for="qtyBags">Qty Bags<span style="color: red">*</span></label>
      <input
        type="number"
        id="qtyBags"
        name="qtyBags"
        placeholder="Enter Quantity Bags"
        required        
      />
      <br />
    </div>

        <div class="form_control">
      <label for="note">Note</label>
      <input
        type="text"
        id="note"
        name="note"
        placeholder="Enter notes if any"
      />
      <br />
    </div>
  </div>
</form>

  </div>  
      `;

        // Company season Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="seasonSelected"]',
          optionContainerSelector: '[data-id="seasonOptionContainer"]',
          optionSelector: '[data-id="seasonOption"]',
          searchBoxSelector: "#season_search_box_input",
          valueInputId: "companySeasonId",
          initialText: "Select season",
        });

        // Company depot Dropdown
        setupDropdownControl({
          selectedSelector: '[data-id="depotSelected"]',
          optionContainerSelector: '[data-id="depotOptionContainer"]',
          optionSelector: '[data-id="depotOption"]',
          searchBoxSelector: "#depot_search_box_input",
          valueInputId: "companyDepotId",
          initialText: "Select Depot",
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

        document
          .getElementById("cancelAddButton")
          .addEventListener("click", () => {
            // console.log(masterTarget);
            riceAcNoteBtn.click();
          });

        //---------------------------------------------------- for adding rice Ac note form data----------------------------------------------------

        document
          .getElementById("addRiceAcNoteForm")
          .addEventListener("submit", async (e) => {
            try {
              e.preventDefault();

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

              const depotId = document.getElementById("companyDepotId").value;

              if (depotId.trim() === "") {
                // console.log();
                document.getElementById("formError").innerHTML =
                  "Please select a Depot.";
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
                `/home/rice-management/add-rice-AcNote`,
                data,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              spinner.style.visibility = "hidden";
              //   console.log(masterTarget);
              riceAcNoteBtn.click();
            } catch (error) {
              errorHandler(error);
              spinner.style.visibility = "hidden";
            }
          });
      } catch (error) {
        errorHandler(error);
        spinner.style.visibility = "hidden";
        riceAcNoteBtn.click();
      }
    });

    //---------------------------------------------------- for showing rice AcNote details----------------------------------------------------

    const res = await axios.get(`/home/rice-management/rice-AcNote`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const riceAcNoteResponse = res.data.riceAcNote;

    spinner.style.visibility = "hidden";

    if (riceAcNoteResponse.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
          <div style="margin: auto">
                <h1 style="font-size: 2.5rem; font-weight: 400; text-align:center;">No Rice Ac Note have been added.  </h1>
            </div>`;
      return;
    }

    const riceAcNoteIndex = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
        <li>Date</li>               
        <li>Season Name</li>
        <li>Depot Name</li>
        <li>Factory Name</li>
        <li>Ac Note Number</li> 
        <li>Qty Qtls</li>
        <li>Qty Bags</li>
        `);

    const riceAcNoteData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = riceAcNoteResponse
      .map((data) => {
        return `

      <ul class="main_section_data_part" id=${data.id}>
      <li>${data.date}</li>      
      <li>${data.seasonName}</li>
      <li>${data.depotName}</li>
      <li>${data.factoryName}</li>
      <li>${data.acNoteNumber}</li>
      <li>${data.qtyQtls}</li>
      <li>${data.qtyBags}</li>
      </ul>
      `;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a rice AcNote----------------------------------------------------

    const riceAcNoteList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );

    riceAcNoteList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        const id = e.currentTarget.id;

        window.location.href = `/home/details?tab=riceManagement&menu=rice_ac_note&method=view&id=${id}`;
      });
    });
  } catch (error) {
    errorHandler(error);
    spinner.style.visibility = "hidden";
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  const storedTab = localStorage.getItem("side_menu_tab_rice");
  localStorage.removeItem("side_menu_tab_u");
  localStorage.removeItem("side_menu_tab");
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
    deliveryCertificateBtn.click();
    // Default behavior if no tab is stored
  }
});
