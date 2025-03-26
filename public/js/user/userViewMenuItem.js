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

function goback(content) {
  const goBack = document.getElementById("goBack");
  goBack.addEventListener("click", () => {
    window.location.href = `/home/${content}`;
  });
}

function errorHandler(error) {
  const errorMessage = handleApiError(error);
  console.log(error);
  alert(errorMessage);
}

function modalControl() {
  const modalClose = document.getElementById("modal_close");
  modalClose.addEventListener("click", () => {
    document.getElementById("modal_container").classList.remove("show");
  });
}

async function showCompanyLocationDetails() {
  try {
    // ------------------------------------------------for showing info page for a company location----------------------------------------------------
    goback("manage-account");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(
      `/home/manage-account/company-location/?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const companyLocation = res.data.companyLocations;
    spinner.style.visibility = "hidden";
    console.log(companyLocation);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById(
      "menu_title"
    ).innerHTML = `Company Location Details`;

    document.getElementById("button_container").innerHTML = `
              <button id='editCompanyLocation' class="submitBtn">Edit</button>
          <button id="deleteCompnayLocation" class="deleteBtn">Delete</button>
    `;

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>Name</h2>
               <p>${companyLocation.state}</p>
    </div>
    <div class="details_section_premissions">
          <h2>Districts</h2>
          <ul>
             ${companyLocation.districts
               .map((ele) => `<li>${ele.name}</li>`)
               .join("")}
          </ul>
    </div>
    <div class="details_section_row">
          <h2>Created At</h2>
          <p>${companyLocation.createdAt}</p>
    </div>
    <div class="details_section_row">
          <h2>Updated At</h2>
          <p>${companyLocation.updatedAt}</p>
    </div>

    `;

    // ------------------------------------------------for showing edit page for a company Location----------------------------------------------------

    document
      .getElementById("editCompanyLocation")
      .addEventListener("click", async () => {
        try {
          console.log(companyLocation.stateId);
          const spinner = document.getElementById("loading_spinner");
          spinner.style.visibility = "visible";

          const res = await axios.get(
            `/home/get-districts?stateId=${companyLocation.stateId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          spinner.style.visibility = "hidden";

          const districts = res.data.districtDetails;

          spinner.style.visibility = "hidden";

          document.getElementById(
            "menu_title"
          ).innerHTML = `Edit Company Locations`;

          document.getElementById("button_container").innerHTML = `
                    <button id='saveLocation' class="submitBtn" type="submit"
                  form="editLocationForm">Save</button>
                
                <button id='cancelButton' class="cancelBtn">Cancel</button>
          `;

          document
            .getElementById("cancelButton")
            .addEventListener("click", showCompanyLocationDetails);

          details_section_content.innerHTML = `
            <form id="editLocationForm">
              <div class="form_content">

                <div class="permissions">
                  <label>Select Districts for the State ${
                    companyLocation.state
                  } :</label>
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
            `;

          const checkboxes = document.querySelectorAll(
            'input[type="checkbox"]'
          );
          const selectedChecboxId = companyLocation.districts.map(
            (ele) => ele.id
          );

          Array.from(checkboxes).map((ele) => {
            // console.log(
            //   selectedChecboxId.includes(ele.id),
            //   ele.id
            //   // selectedChecboxId
            // );
            if (selectedChecboxId.includes(ele.id)) {
              ele.checked = true;
            }
          });

          // ---------------------------------------------------- for updating company Location----------------------------------------------------
          document
            .getElementById("editLocationForm")
            .addEventListener("submit", async (e) => {
              try {
                e.preventDefault();
                // console.log("hello");

                const errorDiv = document.getElementById("error");
                const checkboxes = document.querySelectorAll(
                  'input[type="checkbox"]'
                );

                errorDiv.textContent = "";

                const isChecked = Array.from(checkboxes).some(
                  (cb) => cb.checked
                );

                if (!isChecked) {
                  errorDiv.textContent = "Please select at least one district.";
                  return;
                }

                const districtList = Array.from(checkboxes).filter(
                  (cb) => cb.checked
                );

                spinner.style.visibility = "visible";

                const details = {
                  stateId: companyLocation.stateId,
                  districts: districtList.map((ele) => ele.id),
                };

                const res = await axios.post(
                  `/home/manage-account/update-company-location`,
                  details,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                showCompanyLocationDetails();
              } catch (error) {
                errorHandler(error);
              }
            });
        } catch (error) {
          errorHandler(error);
        }
      });

    // ------------------------------------------------for deleting a company Location----------------------------------------------------

    document
      .getElementById("deleteCompnayLocation")
      .addEventListener("click", (e) => {
        // console.log(";hello from modal");
        const modal_container = document.getElementById("modal_container");
        console.log(modal_container);
        document.getElementById(
          "modal_title"
        ).innerHTML = `Are you sure you want to delete this company Location ?`;

        document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="deleteBtn">Delete</button>
                  <button id="modal_close" class="cancelBtn">Cancel</button>
        `;

        // modal close code
        modalControl();

        modal_container.classList.add("show");
        document
          .getElementById("modal_action_button")
          .addEventListener("click", async (e) => {
            try {
              const spinner = document.getElementById("loading_spinner");
              spinner.style.visibility = "visible";
              const response = await axios.delete(
                `/home/manage-account/delete-company-location/${id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              spinner.style.visibility = "hidden";
              document.getElementById("modal_close").click();
              window.location.href = "/home/manage-account";
            } catch (err) {
              errorHandler(err);
            }
          });
      });
  } catch (error) {
    errorHandler(error);
  }
}

async function showCompanySeasonDetails() {
  try {
    // ------------------------------------------------for showing info page for a company location----------------------------------------------------

    goback("manage-account");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(
      `/home/manage-account/company-season/?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const companySeason = res.data.companySeasons;
    spinner.style.visibility = "hidden";
    console.log(companySeason);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Company Season Details`;

    document.getElementById("button_container").innerHTML = ``;

    // <button id='editCompanySeason' class="submitBtn">Edit</button>
    // <button id="deleteCompnaySeason" class="deleteBtn">Delete</button>

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>Name</h2>
               <p>${companySeason.name}</p>
    </div>

    <div class="details_section_row">
          <h2>Season</h2>
          <p>${companySeason.seasonName}</p>
    </div>

    <div class="details_section_row">
          <h2>Start Date </h2>
          <p>${companySeason.startDate}</p>
    </div>

    <div class="details_section_row">
          <h2>End Date </h2>
          <p>${companySeason.endDate}</p>
    </div>

        <div class="details_section_row">
          <h2>Company</h2>
          <p>${companySeason.companyName}</p>
    </div>

        <div class="details_section_row">
          <h2>Created By </h2>
          <p>${companySeason.createdBy}</p>
        </div>

    <div class="details_section_row">
          <h2>Last Modified By </h2>
          <p>${companySeason.lastModifiedBy}</p>
    </div>
    
    <div class="details_section_row">
          <h2>Created At</h2>
          <p>${companySeason.createdAt}</p>
    </div>
    <div class="details_section_row">
          <h2>Updated At</h2>
          <p>${companySeason.updatedAt}</p>
    </div>

    `;

    // ------------------------------------------------for showing edit page for a company season----------------------------------------------------

    //     document
    //       .getElementById("editCompanyFactory")
    //       .addEventListener("click", async () => {
    //         try {
    //           document.getElementById(
    //             "menu_title"
    //           ).innerHTML = `Edit Company Factory`;

    //           document.getElementById("button_container").innerHTML = `
    //                     <button id='saveFactory' class="submitBtn" type="submit"
    //                   form="editFactoryForm">Save</button>

    //                 <button id='cancelButton' class="cancelBtn">Cancel</button>
    //           `;

    //           document
    //             .getElementById("cancelButton")
    //             .addEventListener("click", showCompanyFactoryDetails);

    //           details_section_content.innerHTML = `
    //           <form id="editFactoryForm">
    //   <div class="form_content">
    //     <div class="form_control">
    //       <label for="stateName">State Name</label>
    //       <input
    //         type="text"
    //         value="${companyFactory.stateName}"
    //         id="stateName"
    //         name="stateName"
    //         disabled
    //       />
    //       <br />
    //     </div>

    //     <div class="form_control">
    //       <label for="factoryName">Enter Factory Name</label>
    //       <input
    //         type="text"
    //         value="${companyFactory.factoryName}"
    //         id="factoryName"
    //         name="factoryName"
    //         placeholder="Enter Factory Name"
    //         required
    //       />
    //       <br />
    //     </div>
    //     <div class="form_control">
    //         <input
    //           type="text"
    //           id="factoryId"
    //           name="factoryId"
    //           style="display: none"
    //           value=${companyFactory.factoryId}
    //         />
    //         <br />
    //       </div>
    //   </div>
    // </form>
    //           `;

    //           // ---------------------------------------------------- for updating company Location----------------------------------------------------

    //           document
    //             .getElementById("editFactoryForm")
    //             .addEventListener("submit", async (e) => {
    //               try {
    //                 e.preventDefault();

    //                 const formdata = new FormData(e.target);
    //                 const data = {};
    //                 formdata.forEach((value, key) => {
    //                   data[key] = value;
    //                 });

    //                 console.log(data);

    //                 // spinner.style.visibility = "visible";
    //                 const res = await axios.post(
    //                   `/home/manage-account/update-factory/?id=${id}`,
    //                   data,
    //                   {
    //                     headers: { Authorization: `Bearer ${token}` },
    //                   }
    //                 );

    //                 showCompanyFactoryDetails();
    //               } catch (error) {
    //                 errorHandler(error);
    //               }
    //             });
    //         } catch (error) {
    //           errorHandler(error);
    //         }
    //       });

    // ------------------------------------------------for deleting a company Factory----------------------------------------------------

    // document
    //   .getElementById("deleteCompnayFactory")
    //   .addEventListener("click", (e) => {
    //     // console.log(";hello from modal");
    //     const modal_container = document.getElementById("modal_container");
    //     console.log(modal_container);
    //     document.getElementById(
    //       "modal_title"
    //     ).innerHTML = `Are you sure you want to delete this company factory ?`;

    //     document.getElementById("modal_footer").innerHTML = `
    //     <button id="modal_action_button" class="deleteBtn">Delete</button>
    //               <button id="modal_close" class="cancelBtn">Cancel</button>
    //     `;

    //     // modal close code
    //     modalControl();

    //     modal_container.classList.add("show");
    //     document
    //       .getElementById("modal_action_button")
    //       .addEventListener("click", async (e) => {
    //         try {
    //           const spinner = document.getElementById("loading_spinner");
    //           spinner.style.visibility = "visible";
    //           const response = await axios.delete(
    //             `/home/manage-account/delete-factory/${id}`,
    //             {
    //               headers: { Authorization: `Bearer ${token}` },
    //             }
    //           );
    //           spinner.style.visibility = "hidden";
    //           document.getElementById("modal_close").click();
    //           window.location.href = "/home/manage-account";
    //         } catch (err) {
    //           errorHandler(err);
    //         }
    //       });
    //   });
  } catch (error) {
    errorHandler(error);
  }
}

async function showCompanyFactoryDetails() {
  try {
    // ------------------------------------------------for showing info page for a company location----------------------------------------------------

    goback("manage-account");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(
      `/home/manage-account/company-factory/?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const companyFactory = res.data.companyFactories;
    spinner.style.visibility = "hidden";
    console.log(companyFactory);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Company Factory Details`;

    document.getElementById("button_container").innerHTML = `
              <button id='editCompanyFactory' class="submitBtn">Edit</button>
          <button id="deleteCompnayFactory" class="deleteBtn">Delete</button>
    `;

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>Factory Name</h2>
               <p>${companyFactory.factoryName}</p>
    </div>

    <div class="details_section_row">
          <h2>State </h2>
          <p>${companyFactory.stateName}</p>
    </div>

    <div class="details_section_row">
          <h2>Company </h2>
          <p>${companyFactory.companyName}</p>
    </div>

        <div class="details_section_row">
          <h2>Created By </h2>
          <p>${companyFactory.createdBy}</p>
    </div>

    <div class="details_section_row">
          <h2>Last Modified By </h2>
          <p>${companyFactory.lastModifiedBy}</p>
    </div>
    
    <div class="details_section_row">
          <h2>Created At</h2>
          <p>${companyFactory.createdAt}</p>
    </div>
    <div class="details_section_row">
          <h2>Updated At</h2>
          <p>${companyFactory.updatedAt}</p>
    </div>

    `;

    // ------------------------------------------------for showing edit page for a company Location----------------------------------------------------

    document
      .getElementById("editCompanyFactory")
      .addEventListener("click", async () => {
        try {
          document.getElementById(
            "menu_title"
          ).innerHTML = `Edit Company Factory`;

          document.getElementById("button_container").innerHTML = `
                    <button id='saveFactory' class="submitBtn" type="submit"
                  form="editFactoryForm">Save</button>
                
                <button id='cancelButton' class="cancelBtn">Cancel</button>
          `;

          document
            .getElementById("cancelButton")
            .addEventListener("click", showCompanyFactoryDetails);

          details_section_content.innerHTML = `
          <form id="editFactoryForm">
  <div class="form_content">
    <div class="form_control">
      <label for="stateName">State Name</label>
      <input
        type="text"
        value="${companyFactory.stateName}"
        id="stateName"
        name="stateName"
        disabled
      />
      <br />
    </div>

    <div class="form_control">
      <label for="factoryName">Enter Factory Name</label>
      <input
        type="text"
        value="${companyFactory.factoryName}"
        id="factoryName"
        name="factoryName"
        placeholder="Enter Factory Name"
        required
      />
      <br />
    </div>
    <div class="form_control">
        <input
          type="text"
          id="factoryId"
          name="factoryId"          
          style="display: none"
          value=${companyFactory.factoryId}
        />
        <br />
      </div>
  </div>
</form>
          `;

          // ---------------------------------------------------- for updating company Location----------------------------------------------------

          document
            .getElementById("editFactoryForm")
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
                  `/home/manage-account/update-factory/?id=${id}`,
                  data,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                showCompanyFactoryDetails();
              } catch (error) {
                errorHandler(error);
              }
            });
        } catch (error) {
          errorHandler(error);
        }
      });

    // ------------------------------------------------for deleting a company Factory----------------------------------------------------

    document
      .getElementById("deleteCompnayFactory")
      .addEventListener("click", (e) => {
        // console.log(";hello from modal");
        const modal_container = document.getElementById("modal_container");
        console.log(modal_container);
        document.getElementById(
          "modal_title"
        ).innerHTML = `Are you sure you want to delete this company factory ?`;

        document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="deleteBtn">Delete</button>
                  <button id="modal_close" class="cancelBtn">Cancel</button>
        `;

        // modal close code
        modalControl();

        modal_container.classList.add("show");
        document
          .getElementById("modal_action_button")
          .addEventListener("click", async (e) => {
            try {
              const spinner = document.getElementById("loading_spinner");
              spinner.style.visibility = "visible";
              const response = await axios.delete(
                `/home/manage-account/delete-factory/${id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              spinner.style.visibility = "hidden";
              document.getElementById("modal_close").click();
              window.location.href = "/home/manage-account";
            } catch (err) {
              errorHandler(err);
            }
          });
      });
  } catch (error) {
    errorHandler(error);
  }
}

async function showCompanyGodownDetails() {
  try {
    // ------------------------------------------------for showing info page for a company location----------------------------------------------------

    goback("manage-account");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(
      `/home/manage-account/company-godown/?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const companyGodown = res.data.companyGodowns;
    spinner.style.visibility = "hidden";
    console.log(companyGodown);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Company Godown Details`;

    document.getElementById("button_container").innerHTML = `
              <button id='editCompanyGodown' class="submitBtn">Edit</button>
          <button id="deleteCompnayGodown" class="deleteBtn">Delete</button>
    `;

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>Godown Name</h2>
               <p>${companyGodown.godownName}</p>
    </div>

    <div class="details_section_row">
          <h2>State </h2>
          <p>${companyGodown.stateName}</p>
    </div>

    <div class="details_section_row">
          <h2>Company </h2>
          <p>${companyGodown.companyName}</p>
    </div>

        <div class="details_section_row">
          <h2>Created By </h2>
          <p>${companyGodown.createdBy}</p>
    </div>

    <div class="details_section_row">
          <h2>Last Modified By </h2>
          <p>${companyGodown.lastModifiedBy}</p>
    </div>
    
    <div class="details_section_row">
          <h2>Created At</h2>
          <p>${companyGodown.createdAt}</p>
    </div>
    <div class="details_section_row">
          <h2>Updated At</h2>
          <p>${companyGodown.updatedAt}</p>
    </div>

    `;

    // ------------------------------------------------for showing edit page for a company Location----------------------------------------------------

    document
      .getElementById("editCompanyGodown")
      .addEventListener("click", async () => {
        try {
          document.getElementById(
            "menu_title"
          ).innerHTML = `Edit Company Godown`;

          document.getElementById("button_container").innerHTML = `
                    <button id='saveGodown' class="submitBtn" type="submit"
                  form="editGodownForm">Save</button>
                
                <button id='cancelButton' class="cancelBtn">Cancel</button>
          `;

          document
            .getElementById("cancelButton")
            .addEventListener("click", showCompanyGodownDetails);

          details_section_content.innerHTML = `
          <form id="editGodownForm">
  <div class="form_content">
    <div class="form_control">
      <label for="stateName">State Name</label>
      <input
        type="text"
        value="${companyGodown.stateName}"
        id="stateName"
        name="stateName"
        disabled
      />
      <br />
    </div>

    <div class="form_control">
      <label for="godownName">Enter Godown Name</label>
      <input
        type="text"
        value="${companyGodown.godownName}"
        id="godownName"
        name="godownName"
        placeholder="Enter Godown Name"
        required
      />
      <br />
    </div>
    <div class="form_control">
        <input
          type="text"
          id="godownId"
          name="godownId"          
          style="display: none"
          value=${companyGodown.godownId}
        />
        <br />
      </div>
  </div>
</form>
          `;

          // ---------------------------------------------------- for updating company Godown----------------------------------------------------

          document
            .getElementById("editGodownForm")
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
                  `/home/manage-account/update-godown/?id=${id}`,
                  data,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                showCompanyGodownDetails();
              } catch (error) {
                errorHandler(error);
              }
            });
        } catch (error) {
          errorHandler(error);
        }
      });

    // ------------------------------------------------for deleting a company Godown----------------------------------------------------

    document
      .getElementById("deleteCompnayGodown")
      .addEventListener("click", (e) => {
        // console.log(";hello from modal");
        const modal_container = document.getElementById("modal_container");
        console.log(modal_container);
        document.getElementById(
          "modal_title"
        ).innerHTML = `Are you sure you want to delete this company Godown ?`;

        document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="deleteBtn">Delete</button>
                  <button id="modal_close" class="cancelBtn">Cancel</button>
        `;

        // modal close code
        modalControl();

        modal_container.classList.add("show");
        document
          .getElementById("modal_action_button")
          .addEventListener("click", async (e) => {
            try {
              const spinner = document.getElementById("loading_spinner");
              spinner.style.visibility = "visible";
              const response = await axios.delete(
                `/home/manage-account/delete-godown/${id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              spinner.style.visibility = "hidden";
              document.getElementById("modal_close").click();
              window.location.href = "/home/manage-account";
            } catch (err) {
              errorHandler(err);
            }
          });
      });
  } catch (error) {
    errorHandler(error);
  }
}

async function showCompanyTraderDetails() {
  try {
    // ------------------------------------------------for showing info page for a company trader----------------------------------------------------

    goback("manage-account");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(
      `/home/manage-account/company-trader/?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const companyTrader = res.data.companyTraders;
    spinner.style.visibility = "hidden";
    console.log(companyTrader);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Company Trader Details`;

    document.getElementById("button_container").innerHTML = `
              <button id='editCompanyTrader' class="submitBtn">Edit</button>
          <button id="deleteCompnayTrader" class="deleteBtn">Delete</button>
    `;

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>Trader Name</h2>
               <p>${companyTrader.traderName}</p>
    </div>

    <div class="details_section_row">
          <h2>Company </h2>
          <p>${companyTrader.companyName}</p>
    </div>

        <div class="details_section_row">
          <h2>Created By </h2>
          <p>${companyTrader.createdBy}</p>
    </div>

    <div class="details_section_row">
          <h2>Last Modified By </h2>
          <p>${companyTrader.lastModifiedBy}</p>
    </div>
    
    <div class="details_section_row">
          <h2>Created At</h2>
          <p>${companyTrader.createdAt}</p>
    </div>
    <div class="details_section_row">
          <h2>Updated At</h2>
          <p>${companyTrader.updatedAt}</p>
    </div>

    `;

    // ------------------------------------------------for showing edit page for a company Trader----------------------------------------------------

    document
      .getElementById("editCompanyTrader")
      .addEventListener("click", async () => {
        try {
          document.getElementById(
            "menu_title"
          ).innerHTML = `Edit Company Trader`;

          document.getElementById("button_container").innerHTML = `
                    <button id='saveTrader' class="submitBtn" type="submit"
                  form="editTraderForm">Save</button>
                
                <button id='cancelButton' class="cancelBtn">Cancel</button>
          `;

          document
            .getElementById("cancelButton")
            .addEventListener("click", showCompanyTraderDetails);

          details_section_content.innerHTML = `
          <form id="editTraderForm">
  <div class="form_content">
    
    <div class="form_control">
      <label for="traderName">Enter Trader Name</label>
      <input
        type="text"
        value="${companyTrader.traderName}"
        id="traderName"
        name="traderName"
        placeholder="Enter Trader Name"
        required
      />
      <br />
    </div>
    <div class="form_control">
        <input
          type="text"
          id="traderId"
          name="traderId"          
          style="display: none"
          value=${companyTrader.traderId}
        />
        <br />
      </div>
  </div>
</form>
          `;

          // ---------------------------------------------------- for updating company Location----------------------------------------------------

          document
            .getElementById("editTraderForm")
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
                  `/home/manage-account/update-trader/?id=${id}`,
                  data,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                showCompanyTraderDetails();
              } catch (error) {
                errorHandler(error);
              }
            });
        } catch (error) {
          errorHandler(error);
        }
      });

    // ------------------------------------------------for deleting a company Trader----------------------------------------------------

    document
      .getElementById("deleteCompnayTrader")
      .addEventListener("click", (e) => {
        // console.log(";hello from modal");
        const modal_container = document.getElementById("modal_container");
        console.log(modal_container);
        document.getElementById(
          "modal_title"
        ).innerHTML = `Are you sure you want to delete this company trader ?`;

        document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="deleteBtn">Delete</button>
                  <button id="modal_close" class="cancelBtn">Cancel</button>
        `;

        // modal close code
        modalControl();

        modal_container.classList.add("show");
        document
          .getElementById("modal_action_button")
          .addEventListener("click", async (e) => {
            try {
              const spinner = document.getElementById("loading_spinner");
              spinner.style.visibility = "visible";
              const response = await axios.delete(
                `/home/manage-account/delete-trader/${id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              spinner.style.visibility = "hidden";
              document.getElementById("modal_close").click();
              window.location.href = "/home/manage-account";
            } catch (err) {
              errorHandler(err);
            }
          });
      });
  } catch (error) {
    errorHandler(error);
  }
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

async function showCompanyUserDetails() {
  try {
    // ------------------------------------------------for showing info page for a company user----------------------------------------------------
    goback("manage-user");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(`/home/manage-user/company-user/?id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const companyUsers = res.data.companyUsers;
    spinner.style.visibility = "hidden";
    console.log(companyUsers);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Company User Details`;

    const freezeStatus = companyUsers.isFreezed;
    console.log(freezeStatus);

    let freezeBtnValue;
    let freezeBtnText;
    if (freezeStatus === false) {
      freezeBtnValue = true;
      freezeBtnText = "Freeze";
    } else {
      freezeBtnValue = false;
      freezeBtnText = "Unfreeze";
    }

    const activeStatus = companyUsers.isActive;
    console.log(activeStatus);

    let activeBtnValue;
    let activeBtnText;
    if (activeStatus === false) {
      activeBtnValue = true;
      activeBtnText = "Activate";
    } else {
      activeBtnValue = false;
      activeBtnText = "Deactivate";
    }

    document.getElementById("button_container").innerHTML = `
              <button id='editCompanyUser' class="submitBtn">Edit</button>
              <button id='resetPassword' class="submitBtn">Reset Password</button>
              <button id='freezeBtn' class="submitBtn" value=${freezeBtnValue}>${freezeBtnText}</button>
              <button id="activeBtn" class="deleteBtn" value=${activeBtnValue}>${activeBtnText}</button>
          
    `;

    //

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>User Name</h2>
               <p>${companyUsers.userName}</p>
    </div>

    <div class="details_section_row">
          <h2>Email </h2>
          <p>${companyUsers.email}</p>
    </div>

    <div class="details_section_row">
          <h2>Phone </h2>
          <p>${companyUsers.phone}</p>
    </div>

    <div class="details_section_row">
          <h2>Role </h2>
          <p>${companyUsers.role}</p>
    </div>

    <div class="details_section_row">
          <h2>Active </h2>
          <p>${companyUsers.isActive}</p>
    </div>

    <div class="details_section_row">
          <h2>Company Name</h2>
          <p>${companyUsers.companyName}</p>
    </div>

    <div class="details_section_row">
          <h2>Created At</h2>
          <p>${companyUsers.createdAt}</p>
    </div>
    <div class="details_section_row">
          <h2>Updated At</h2>
          <p>${companyUsers.updatedAt}</p>
    </div>

    `;

    // ------------------------------------------------for showing edit page for a company user----------------------------------------------------

    document
      .getElementById("editCompanyUser")
      .addEventListener("click", async () => {
        try {
          document.getElementById("menu_title").innerHTML = `Edit User`;

          document.getElementById("button_container").innerHTML = `
                    <button id='saveUser' class="submitBtn" type="submit"
                  form="editUserForm">Save</button>
                
                <button id='cancelButton' class="cancelBtn">Cancel</button>
          `;

          const spinner = document.getElementById("loading_spinner");
          spinner.style.visibility = "visible";

          const res = await axios.get(`/home/manage-user/user-roles`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          spinner.style.visibility = "hidden";

          const roles = res.data.roleDetails;
          console.log(res.data);

          document
            .getElementById("cancelButton")
            .addEventListener("click", showCompanyUserDetails);

          details_section_content.innerHTML = `
          <form id="editUserForm">
  <div class="form_content">
    <div class="error" id="error"></div>
    <div class="form_control">
      <label for="Name">Username</label>
      <input
        type="text"
        id="Name"
        value=${companyUsers.userName}
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
        value=${companyUsers.email}
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
        value=${companyUsers.phone}
        name="Phone"
        placeholder="Enter Phone"
        required
      />
      <br />
    </div>

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

          <div class="selected" data-id="stateSelected">${
            companyUsers.role
          }</div>
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
        value=${companyUsers.roleId}
        style="display: none"
      />
      <br />
    </div>

    
  </div>
</form>

          `;
          userRoleDropdownControl();

          // ---------------------------------------------------- for updating company user info----------------------------------------------------

          document
            .getElementById("editUserForm")
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
                  `/home/manage-user/update-user/?id=${id}`,
                  data,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                showCompanyUserDetails();
              } catch (error) {
                errorHandler(error);
              }
            });
        } catch (error) {
          errorHandler(error);
        }
      });

    // ------------------------------------------------for resetting  password of company user----------------------------------------------------

    document
      .getElementById("resetPassword")
      .addEventListener("click", resetPassword);
    async function resetPassword() {
      try {
        document.getElementById("menu_title").innerHTML = `Reset User Passwprd`;

        document.getElementById("button_container").innerHTML = `
                  <button id='saveUser' class="submitBtn" type="submit"
                form="resetUserPasswordForm">Save</button>
              
              <button id='cancelButton' class="cancelBtn">Cancel</button>
        `;

        // const spinner = document.getElementById("loading_spinner");
        // spinner.style.visibility = "visible";

        // const res = await axios.get(`/home/manage-user/user-roles`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // spinner.style.visibility = "hidden";

        // const roles = res.data.roleDetails;
        // console.log(res.data);

        document
          .getElementById("cancelButton")
          .addEventListener("click", showCompanyUserDetails);

        details_section_content.innerHTML = `
        <form id="resetUserPasswordForm">
<div class="form_content">
  <div class="error" id="error"></div>
  <div class="form_control">
    <label for="password">Enter New Password</label>
    <input
      type="text"
      id="password"
      name="password"
      placeholder="Enter new password"
      required
    />
    <br />
  </div>  
</div>
</form>

        `;

        // ---------------------------------------------------- for updating company user info----------------------------------------------------

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

              // spinner.style.visibility = "visible";
              const res = await axios.post(
                `/home/manage-user/update-user-password/?id=${id}`,
                data,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              showCompanyUserDetails();
            } catch (error) {
              const errorMessage = handleApiError(error);
              document.getElementById("error").innerHTML = errorMessage;
              console.log(error);
            }
          });
      } catch (error) {
        errorHandler(error);
      }
    }

    // ------------------------------------------------for freezing user----------------------------------------------------

    document.getElementById("freezeBtn").addEventListener("click", (e) => {
      // console.log(";hello from modal");
      const modal_container = document.getElementById("modal_container");
      console.log(modal_container);
      const modalBtnText = e.target.textContent;
      let message;
      if (modalBtnText === "Unfreeze") {
        message = `Are you sure you want to ${modalBtnText.toLowerCase()} ${
          companyUsers.userName
        }?`;
      } else {
        message = `Are you sure you want to ${modalBtnText.toLowerCase()} ${
          companyUsers.userName
        }? This will prevent them from logging in, but their spot in the license will remain occupied.`;
      }
      document.getElementById("modal_title").innerHTML = message;

      document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="submitBtn">${modalBtnText}</button>
                  <button id="modal_close" class="cancelBtn">Cancel</button>
        `;

      // modal close code
      modalControl();

      modal_container.classList.add("show");
      document
        .getElementById("modal_action_button")
        .addEventListener("click", async (e) => {
          try {
            const spinner = document.getElementById("loading_spinner");
            spinner.style.visibility = "visible";
            const freezeBtn = document.getElementById("freezeBtn");
            const value = freezeBtn.value;
            console.log(value, typeof value);
            const response = await axios.post(
              `/home/manage-user/freeze-user/?id=${id}`,
              { value: value },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            spinner.style.visibility = "hidden";

            if (value === "true") {
              freezeBtn.value = "false";
              freezeBtn.innerHTML = "Unfreeze";
            } else {
              freezeBtn.value = "true";
              freezeBtn.innerHTML = "Freeze";
            }

            document.getElementById("modal_close").click();
          } catch (err) {
            errorHandler(err);
          }
        });
    });

    // ------------------------------------------------for deactivating user----------------------------------------------------

    document.getElementById("activeBtn").addEventListener("click", (e) => {
      // console.log(";hello from modal");
      const modal_container = document.getElementById("modal_container");
      console.log(modal_container);
      const modalBtnText = e.target.textContent;
      let message;
      if (modalBtnText === "Activate") {
        message = `Are you sure you want to ${modalBtnText.toLowerCase()} ${
          companyUsers.userName
        }?`;
      } else {
        message = `Are you sure you want to ${modalBtnText.toLowerCase()} ${
          companyUsers.userName
        }? This will remove their access and free up their spot in the license.`;
      }
      document.getElementById("modal_title").innerHTML = message;

      document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="submitBtn">${modalBtnText}</button>
                  <button id="modal_close" class="cancelBtn">Cancel</button>
        `;

      // modal close code
      modalControl();

      modal_container.classList.add("show");
      document
        .getElementById("modal_action_button")
        .addEventListener("click", async (e) => {
          try {
            const spinner = document.getElementById("loading_spinner");
            spinner.style.visibility = "visible";
            const activeBtn = document.getElementById("activeBtn");
            const value = activeBtn.value;
            console.log(value, typeof value);
            const response = await axios.post(
              `/home/manage-user/active-user?id=${id}`,
              { value: value },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            // console.log(response.data);
            spinner.style.visibility = "hidden";

            // if (value === "true") {
            //   activeBtn.value = "false";
            //   activeBtn.innerHTML = "Deactivate";
            // } else {
            //   activeBtn.value = "true";
            //   activeBtn.innerHTML = "Activate";
            // }
            document.getElementById("modal_close").click();
            showCompanyUserDetails();
          } catch (error) {
            const errorMessage = handleApiError(error);
            alert(errorMessage);
            spinner.style.visibility = "hidden";
            document.getElementById("modal_close").click();
            console.log(error);
          }
        });
    });
  } catch (error) {
    errorHandler(error);
  }
}

async function showMasterTargetDetails() {
  try {
    // ------------------------------------------------for showing info page for a company user----------------------------------------------------
    goback("paddy-management");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(
      `/home/paddy-management/master-target/?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const masterTarget = res.data.masterTarget;
    spinner.style.visibility = "hidden";
    console.log(masterTarget);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Master Target Details`;

    document.getElementById("button_container").innerHTML = `
              <button id='editMasterDetails' class="submitBtn">Edit</button>
    `;

    //

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>Mandi Name</h2>
               <p>${masterTarget.mandiName}</p>
    </div>

    <div class="details_section_row">
         <h2>Season Name</h2>
               <p>${masterTarget.seasonName}</p>
    </div>

    <div class="details_section_row">
          <h2>Target Qtls </h2>
          <p>${masterTarget.targetQtls}</p>
    </div>

    <div class="details_section_row">
          <h2>Lifted Qauntity </h2>
          <p>${masterTarget.liftedQauntity}</p>
    </div>

    <div class="details_section_row">
          <h2>Target Balance</h2>
          <p>${masterTarget.targetBalance}</p>
    </div>

    <div class="details_section_row">
          <h2>Company Name </h2>
          <p>${masterTarget.companyName}</p>
    </div>

    <div class="details_section_row">
          <h2>Created By </h2>
          <p>${masterTarget.createdBy}</p>
    </div>

    <div class="details_section_row">
          <h2>Last Modified By</h2>
          <p>${masterTarget.lastModifiedBy}</p>
    </div>

    <div class="details_section_row">
          <h2>Created At</h2>
          <p>${masterTarget.createdAt}</p>
    </div>
    <div class="details_section_row">
          <h2>Updated At</h2>
          <p>${masterTarget.updatedAt}</p>
    </div>

    `;

    // ------------------------------------------------for showing edit page for a company user----------------------------------------------------

    document
      .getElementById("editMasterDetails")
      .addEventListener("click", (e) => {
        // console.log(";hello from modal");
        const modal_container = document.getElementById("modal_container");
        // console.log(modal_container);
        document.getElementById(
          "modal_title"
        ).innerHTML = `Are you sure you want to edit this master target ?`;

        document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="submitBtn">Yes</button>
                  <button id="modal_close" class="cancelBtn">No</button>
        `;

        // modal close code
        modalControl();

        modal_container.classList.add("show");
        document
          .getElementById("modal_action_button")
          .addEventListener("click", async (e) => {
            try {
              document.getElementById("modal_close").click();

              document.getElementById(
                "menu_title"
              ).innerHTML = `Edit Master Target`;

              document.getElementById("button_container").innerHTML = `
                    <button id='saveMasterTarget' class="submitBtn" type="submit"
                  form="editMasterTargetForm">Save</button>
                
                <button id='cancelButton' class="cancelBtn">Cancel</button>
          `;

              document
                .getElementById("cancelButton")
                .addEventListener("click", showMasterTargetDetails);

              details_section_content.innerHTML = `
            <form id="editMasterTargetForm">
  <div class="form_content">
  <div class="error" id="inputError"></div>
    <div class="form_control">
      <label for="targetQtls">Mandi Name</label>
      <input type="text" value="${masterTarget.mandiName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label for="targetQtls">Season Name</label>
      <input type="text" value="${masterTarget.seasonName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label for="targetQtls">Target Qtls</label>
      <input
        type="number"
        value="${masterTarget.targetQtls}"
        id="targetQtls"
        name="targetQtls"
        placeholder="Enter target Qtls"
        step="any" 
        min="0"
        required
      />
      <br />
    </div>
  </div>
</form>
            `;

              // ---------------------------------------------------- for updating master target----------------------------------------------------

              document
                .getElementById("editMasterTargetForm")
                .addEventListener("submit", async (e) => {
                  try {
                    e.preventDefault();

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

                    if (+data.targetQtls < +masterTarget.targetQtls) {
                      console.log(data.targetQtls, masterTarget.targetQtls);
                      document.getElementById("inputError").innerHTML =
                        "Invalid Quantity. New target quantity cannot be less than old target quantity.";
                      return;
                    }

                    console.log(data);

                    spinner.style.visibility = "visible";
                    const res = await axios.post(
                      `/home/paddy-management/update-master-target/?id=${id}`,
                      data,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    spinner.style.visibility = "hidden";

                    showMasterTargetDetails();
                  } catch (error) {
                    const errorMessage = handleApiError(error);
                    document.getElementById("inputError").innerHTML =
                      errorMessage;
                  }
                });
            } catch (err) {
              errorHandler(err);
            }
          });
      });

    //     document
    //       .getElementById("editCompanyUser")
    //       .addEventListener("click", async () => {
    //         try {
    //           document.getElementById("menu_title").innerHTML = `Edit User`;

    //           document.getElementById("button_container").innerHTML = `
    //                     <button id='saveUser' class="submitBtn" type="submit"
    //                   form="editUserForm">Save</button>

    //                 <button id='cancelButton' class="cancelBtn">Cancel</button>
    //           `;

    //           const spinner = document.getElementById("loading_spinner");
    //           spinner.style.visibility = "visible";

    //           const res = await axios.get(`/home/manage-user/user-roles`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //           });
    //           spinner.style.visibility = "hidden";

    //           const roles = res.data.roleDetails;
    //           console.log(res.data);

    //           document
    //             .getElementById("cancelButton")
    //             .addEventListener("click", showCompanyUserDetails);

    //           details_section_content.innerHTML = `
    //           <form id="editUserForm">
    //   <div class="form_content">
    //     <div class="error" id="error"></div>
    //     <div class="form_control">
    //       <label for="Name">Username</label>
    //       <input
    //         type="text"
    //         id="Name"
    //         value=${companyUsers.userName}
    //         name="Name"
    //         placeholder="Enter Username"
    //         required
    //       />
    //       <br />
    //     </div>
    //     <div class="form_control">
    //       <label for="Email">Email</label>
    //       <input
    //         type="text"
    //         id="Email"
    //         name="Email"
    //         value=${companyUsers.email}
    //         placeholder="Enter Email"
    //         required
    //       />
    //       <br />
    //     </div>
    //     <div class="form_control">
    //       <label for="Phone">Phone</label>
    //       <input
    //         type="tel"
    //         id="Phone"
    //         value=${companyUsers.phone}
    //         name="Phone"
    //         placeholder="Enter Phone"
    //         required
    //       />
    //       <br />
    //     </div>

    //     <div class="form_control">
    //       <label for="roles">Role</label>

    //       <div class="selection_area" data-id="stateSelectionArea">
    //         <div class="select_box" data-id="selectStateBox">
    //           <div class="option_container" data-id="stateOptionContainer">
    //             ${roles
    //               .map((ele) => {
    //                 if (ele.name !== "Admin") {
    //                   return `
    //             <div class="option" data-id="stateOption">
    //               <input type="radio" class="radio" name="" id="${ele.id}" />
    //               <label for="${ele.name}">${ele.name}</label>
    //             </div>

    //             `;
    //                 }
    //               })
    //               .join("")}
    //           </div>

    //           <div class="selected" data-id="stateSelected">${
    //             companyUsers.role
    //           }</div>
    //           <div class="search_box" data-id="stateSearchBox">
    //             <input
    //               type="text"
    //               placeholder="Start Typing....."
    //               id="state_search_box_input"
    //             />
    //           </div>
    //         </div>
    //         <br />
    //       </div>
    //     </div>

    //     <div class="form_control">
    //       <input
    //         type="text"
    //         id="userRoleId"
    //         name="userRoleId"
    //         value=${companyUsers.roleId}
    //         style="display: none"
    //       />
    //       <br />
    //     </div>

    //   </div>
    // </form>

    //           `;
    //           userRoleDropdownControl();

    //           // ---------------------------------------------------- for updating company user info----------------------------------------------------

    //           document
    //             .getElementById("editUserForm")
    //             .addEventListener("submit", async (e) => {
    //               try {
    //                 e.preventDefault();

    //                 const formdata = new FormData(e.target);
    //                 const data = {};
    //                 formdata.forEach((value, key) => {
    //                   data[key] = value;
    //                 });

    //                 console.log(data);

    //                 // spinner.style.visibility = "visible";
    //                 const res = await axios.post(
    //                   `/home/manage-user/update-user/?id=${id}`,
    //                   data,
    //                   {
    //                     headers: { Authorization: `Bearer ${token}` },
    //                   }
    //                 );

    //                 showCompanyUserDetails();
    //               } catch (error) {
    //                 errorHandler(error);
    //               }
    //             });
    //         } catch (error) {
    //           errorHandler(error);
    //         }
    //       });

    // ------------------------------------------------for resetting  password of company user----------------------------------------------------

    //     document
    //       .getElementById("resetPassword")
    //       .addEventListener("click", resetPassword);
    //     async function resetPassword() {
    //       try {
    //         document.getElementById("menu_title").innerHTML = `Reset User Passwprd`;

    //         document.getElementById("button_container").innerHTML = `
    //                   <button id='saveUser' class="submitBtn" type="submit"
    //                 form="resetUserPasswordForm">Save</button>

    //               <button id='cancelButton' class="cancelBtn">Cancel</button>
    //         `;

    //         // const spinner = document.getElementById("loading_spinner");
    //         // spinner.style.visibility = "visible";

    //         // const res = await axios.get(`/home/manage-user/user-roles`, {
    //         //   headers: { Authorization: `Bearer ${token}` },
    //         // });
    //         // spinner.style.visibility = "hidden";

    //         // const roles = res.data.roleDetails;
    //         // console.log(res.data);

    //         document
    //           .getElementById("cancelButton")
    //           .addEventListener("click", showCompanyUserDetails);

    //         details_section_content.innerHTML = `
    //         <form id="resetUserPasswordForm">
    // <div class="form_content">
    //   <div class="error" id="error"></div>
    //   <div class="form_control">
    //     <label for="password">Enter New Password</label>
    //     <input
    //       type="text"
    //       id="password"
    //       name="password"
    //       placeholder="Enter new password"
    //       required
    //     />
    //     <br />
    //   </div>
    // </div>
    // </form>

    //         `;

    //         // ---------------------------------------------------- for updating company user info----------------------------------------------------

    //         document
    //           .getElementById("resetUserPasswordForm")
    //           .addEventListener("submit", async (e) => {
    //             try {
    //               e.preventDefault();

    //               const formdata = new FormData(e.target);
    //               const data = {};
    //               formdata.forEach((value, key) => {
    //                 data[key] = value;
    //               });

    //               console.log(data);

    //               // spinner.style.visibility = "visible";
    //               const res = await axios.post(
    //                 `/home/manage-user/update-user-password/?id=${id}`,
    //                 data,
    //                 {
    //                   headers: { Authorization: `Bearer ${token}` },
    //                 }
    //               );

    //               showCompanyUserDetails();
    //             } catch (error) {
    //               const errorMessage = handleApiError(error);
    //               document.getElementById("error").innerHTML = errorMessage;
    //               console.log(error);
    //             }
    //           });
    //       } catch (error) {
    //         errorHandler(error);
    //       }
    //     }

    // ------------------------------------------------for freezing user----------------------------------------------------

    // document.getElementById("freezeBtn").addEventListener("click", (e) => {
    //   // console.log(";hello from modal");
    //   const modal_container = document.getElementById("modal_container");
    //   console.log(modal_container);
    //   const modalBtnText = e.target.textContent;
    //   let message;
    //   if (modalBtnText === "Unfreeze") {
    //     message = `Are you sure you want to ${modalBtnText.toLowerCase()} ${
    //       companyUsers.userName
    //     }?`;
    //   } else {
    //     message = `Are you sure you want to ${modalBtnText.toLowerCase()} ${
    //       companyUsers.userName
    //     }? This will prevent them from logging in, but their spot in the license will remain occupied.`;
    //   }
    //   document.getElementById("modal_title").innerHTML = message;

    //   document.getElementById("modal_footer").innerHTML = `
    //     <button id="modal_action_button" class="submitBtn">${modalBtnText}</button>
    //               <button id="modal_close" class="cancelBtn">Cancel</button>
    //     `;

    //   // modal close code
    //   modalControl();

    //   modal_container.classList.add("show");
    //   document
    //     .getElementById("modal_action_button")
    //     .addEventListener("click", async (e) => {
    //       try {
    //         const spinner = document.getElementById("loading_spinner");
    //         spinner.style.visibility = "visible";
    //         const freezeBtn = document.getElementById("freezeBtn");
    //         const value = freezeBtn.value;
    //         console.log(value, typeof value);
    //         const response = await axios.post(
    //           `/home/manage-user/freeze-user/?id=${id}`,
    //           { value: value },
    //           {
    //             headers: { Authorization: `Bearer ${token}` },
    //           }
    //         );
    //         spinner.style.visibility = "hidden";

    //         if (value === "true") {
    //           freezeBtn.value = "false";
    //           freezeBtn.innerHTML = "Unfreeze";
    //         } else {
    //           freezeBtn.value = "true";
    //           freezeBtn.innerHTML = "Freeze";
    //         }

    //         document.getElementById("modal_close").click();
    //       } catch (err) {
    //         errorHandler(err);
    //       }
    //     });
    // });

    // ------------------------------------------------for deactivating user----------------------------------------------------

    // document.getElementById("activeBtn").addEventListener("click", (e) => {
    //   // console.log(";hello from modal");
    //   const modal_container = document.getElementById("modal_container");
    //   console.log(modal_container);
    //   const modalBtnText = e.target.textContent;
    //   let message;
    //   if (modalBtnText === "Activate") {
    //     message = `Are you sure you want to ${modalBtnText.toLowerCase()} ${
    //       companyUsers.userName
    //     }?`;
    //   } else {
    //     message = `Are you sure you want to ${modalBtnText.toLowerCase()} ${
    //       companyUsers.userName
    //     }? This will remove their access and free up their spot in the license.`;
    //   }
    //   document.getElementById("modal_title").innerHTML = message;

    //   document.getElementById("modal_footer").innerHTML = `
    //     <button id="modal_action_button" class="submitBtn">${modalBtnText}</button>
    //               <button id="modal_close" class="cancelBtn">Cancel</button>
    //     `;

    //   // modal close code
    //   modalControl();

    //   modal_container.classList.add("show");
    //   document
    //     .getElementById("modal_action_button")
    //     .addEventListener("click", async (e) => {
    //       try {
    //         const spinner = document.getElementById("loading_spinner");
    //         spinner.style.visibility = "visible";
    //         const activeBtn = document.getElementById("activeBtn");
    //         const value = activeBtn.value;
    //         console.log(value, typeof value);
    //         const response = await axios.post(
    //           `/home/manage-user/active-user?id=${id}`,
    //           { value: value },
    //           {
    //             headers: { Authorization: `Bearer ${token}` },
    //           }
    //         );
    //         // console.log(response.data);
    //         spinner.style.visibility = "hidden";

    //         // if (value === "true") {
    //         //   activeBtn.value = "false";
    //         //   activeBtn.innerHTML = "Deactivate";
    //         // } else {
    //         //   activeBtn.value = "true";
    //         //   activeBtn.innerHTML = "Activate";
    //         // }
    //         document.getElementById("modal_close").click();
    //         showCompanyUserDetails();
    //       } catch (error) {
    //         const errorMessage = handleApiError(error);
    //         alert(errorMessage);
    //         spinner.style.visibility = "hidden";
    //         document.getElementById("modal_close").click();
    //         console.log(error);
    //       }
    //     });
    // });
  } catch (error) {
    errorHandler(error);
  }
}

async function showPaddyPurchaseDetails() {
  try {
    // ------------------------------------------------for showing info page for a company user----------------------------------------------------
    goback("paddy-management");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(
      `/home/paddy-management/paddy-purchase/?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const paddyPurchase = res.data.paddyPurchase;
    spinner.style.visibility = "hidden";
    console.log(paddyPurchase);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Paddy Purchase Details`;

    document.getElementById("button_container").innerHTML = `
              <button id='editPaddyPurchaseDetails' class="submitBtn">Edit</button>
    `;

    //

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>Mandi Name</h2>
               <p>${paddyPurchase.mandiName}</p>
    </div>

    <div class="details_section_row">
          <h2>Factory Name</h2>
          <p>${paddyPurchase.factoryName}</p>
                  
    </div>

    <div class="details_section_row">
          <h2>Season Name</h2>
          <p>${paddyPurchase.seasonName}</p>
                  
    </div>

    <div class="details_section_row">
          <h2>Purchase Qtls Gross </h2>
          <p>${paddyPurchase.purchaseQtlsGross}</p>
    </div>

    <div class="details_section_row">
          <h2>Gunny Bags </h2>
          <p>${paddyPurchase.gunnyBags}</p>
    </div>

    <div class="details_section_row">
          <h2>PP Bags</h2>
          <p>${paddyPurchase.ppBags}</p>
    </div>

    <div class="details_section_row">
          <h2>Bag Weight</h2>
          <p>${paddyPurchase.bagWeight}</p>
    </div>

    <div class="details_section_row">
          <h2>Faq Qtls</h2>
          <p>${paddyPurchase.faqQtls}</p>
    </div>

    <div class="details_section_row">
          <h2>Purchase Bags</h2>
          <p>${paddyPurchase.purBags}</p>
    </div>
    <div class="details_section_row">
          <h2>Nett Purchase Qty Qtls</h2>
          <p>${paddyPurchase.nettPurchaseQtyQtls}</p>
    </div>
    <div class="details_section_row">
          <h2>Upload Hisab</h2>
          <a href="${paddyPurchase.uploadHisab}">Link</a>          
    </div>

        

    <div class="details_section_row">
          <h2>Company Name</h2>
          <p>${paddyPurchase.companyName}</p>
                  
    </div>



    <div class="details_section_row">
          <h2>Created By </h2>
          <p>${paddyPurchase.createdBy}</p>
    </div>

    <div class="details_section_row">
          <h2>Last Modified By</h2>
          <p>${paddyPurchase.lastModifiedBy}</p>
    </div>

    <div class="details_section_row">
          <h2>Created At</h2>
          <p>${paddyPurchase.createdAt}</p>
    </div>
    <div class="details_section_row">
          <h2>Updated At</h2>
          <p>${paddyPurchase.updatedAt}</p>
    </div>

    `;

    // ------------------------------------------------for showing edit page for a company user----------------------------------------------------

    document
      .getElementById("editPaddyPurchaseDetails")
      .addEventListener("click", (e) => {
        // console.log(";hello from modal");
        const modal_container = document.getElementById("modal_container");
        // console.log(modal_container);
        document.getElementById(
          "modal_title"
        ).innerHTML = `Are you sure you want to edit this paddy purchase ?`;

        document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="submitBtn">Yes</button>
                  <button id="modal_close" class="cancelBtn">No</button>
        `;

        // modal close code
        modalControl();

        modal_container.classList.add("show");
        document
          .getElementById("modal_action_button")
          .addEventListener("click", async (e) => {
            try {
              document.getElementById("modal_close").click();

              document.getElementById(
                "menu_title"
              ).innerHTML = `Edit Paddy Purchase`;

              document.getElementById("button_container").innerHTML = `
                    <button id='savePaddyPurchase' class="submitBtn" type="submit"
                  form="editPaddyPurchaseForm">Save</button>
                
                <button id='cancelButton' class="cancelBtn">Cancel</button>
          `;

              document
                .getElementById("cancelButton")
                .addEventListener("click", showPaddyPurchaseDetails);

              details_section_content.innerHTML = `
                <form id="editPaddyPurchaseForm">
  <div class="form_content">
    <div class="error" id="inputError"></div>
    <div class="form_control">
      <label>Mandi Name</label>
      <input type="text" value="${paddyPurchase.mandiName}" disabled />
      <br />
    </div>

        <div class="form_control">
      <label>Season Name</label>
      <input type="text" value="${paddyPurchase.seasonName}" disabled />
      <br />
    </div>


    <div class="form_control">
      <label>Factory Name</label>
      <input type="text" value="${paddyPurchase.factoryName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label for="purchaseQtlsGross"
        >Purchase Qtls (Gross) in Bags (କେତେ ମୋଟ ବ୍ୟାଗ କିଣାଯାଇଛି?)<span
          style="color: red"
          >*</span
        ></label
      >
      <input
        type="number"
        id="purchaseQtlsGross"
        name="purchaseQtlsGross"
        value="${paddyPurchase.purchaseQtlsGross}"
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
        value="${paddyPurchase.gunnyBags}"
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
        value="${paddyPurchase.ppBags}"
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
        value="${paddyPurchase.bagWeight}"
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
        placeholder="Enter Faq Qtls"
        value="${paddyPurchase.faqQtls}"
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
                `;

              // ---------------------------------------------------- for updating master target----------------------------------------------------

              document
                .getElementById("editPaddyPurchaseForm")
                .addEventListener("submit", async (e) => {
                  try {
                    e.preventDefault();

                    const formdata = new FormData(e.target);

                    spinner.style.visibility = "visible";
                    const res = await axios.post(
                      `/home/paddy-management/update-paddy-purchase?id=${id}`,
                      formdata,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );
                    spinner.style.visibility = "hidden";

                    showPaddyPurchaseDetails();
                  } catch (error) {
                    const errorMessage = handleApiError(error);
                    document.getElementById("inputError").innerHTML =
                      errorMessage;
                  }
                });
            } catch (err) {
              errorHandler(err);
            }
          });
      });
  } catch (error) {
    errorHandler(error);
  }
}

async function showPaddyLoadingDetails() {
  try {
    // ------------------------------------------------for showing info page for a paddy loading----------------------------------------------------
    goback("paddy-management");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(
      `/home/paddy-management/paddy-loading/?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const paddyLoading = res.data.paddyLoading;
    spinner.style.visibility = "hidden";
    console.log(paddyLoading);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Paddy Loading Details`;

    document.getElementById("button_container").innerHTML = `
              <button id='editPaddyLoadingDetails' class="submitBtn">Edit</button>
    `;

    //

    details_section_content.innerHTML = `
        <div class="details_section_row">
          <h2>Vehicle Number</h2>
          <p>${paddyLoading.vehicleNumber}</p>
    </div>

    <div class="details_section_row">
          <h2>Bags Loaded</h2>
          <p>${paddyLoading.bagsLoaded}</p>
    </div>
    <div class="details_section_row">
         <h2>Mandi Name</h2>
               <p>${paddyLoading.mandiName}</p>
    </div>

    <div class="details_section_row">
         <h2>Season Name</h2>
               <p>${paddyLoading.seasonName}</p>
    </div>

    <div class="details_section_row">
         <h2>Factory Name</h2>
               <p>${paddyLoading.factoryName}</p>
    </div>


    

    <div class="details_section_row">
          <h2>Company Name</h2>
          <p>${paddyLoading.companyName}</p>
                  
    </div>



    <div class="details_section_row">
          <h2>Created By </h2>
          <p>${paddyLoading.createdBy}</p>
    </div>

    <div class="details_section_row">
          <h2>Last Modified By</h2>
          <p>${paddyLoading.lastModifiedBy}</p>
    </div>

    <div class="details_section_row">
          <h2>Created At</h2>
          <p>${paddyLoading.createdAt}</p>
    </div>
    <div class="details_section_row">
          <h2>Updated At</h2>
          <p>${paddyLoading.updatedAt}</p>
    </div>

    `;

    // ------------------------------------------------for showing edit page for a paddy loading----------------------------------------------------

    document
      .getElementById("editPaddyLoadingDetails")
      .addEventListener("click", (e) => {
        // console.log(";hello from modal");
        const modal_container = document.getElementById("modal_container");
        // console.log(modal_container);
        document.getElementById(
          "modal_title"
        ).innerHTML = `Are you sure you want to edit this paddy loading ?`;

        document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="submitBtn">Yes</button>
                  <button id="modal_close" class="cancelBtn">No</button>
        `;

        // modal close code
        modalControl();

        modal_container.classList.add("show");
        document
          .getElementById("modal_action_button")
          .addEventListener("click", async (e) => {
            try {
              document.getElementById("modal_close").click();

              document.getElementById(
                "menu_title"
              ).innerHTML = `Edit Paddy Loading`;

              document.getElementById("button_container").innerHTML = `
                    <button id='savePaddyLoading' class="submitBtn" type="submit"
                  form="editPaddyLoadingForm">Save</button>
                
                <button id='cancelButton' class="cancelBtn">Cancel</button>
          `;

              document
                .getElementById("cancelButton")
                .addEventListener("click", showPaddyLoadingDetails);

              details_section_content.innerHTML = `
                <form id="editPaddyLoadingForm">
  <div class="form_content">
    <div class="error" id="inputError"></div>

    <div class="form_control">
      <label>Mandi Name</label>
      <input type="text" value="${paddyLoading.mandiName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Factory Name</label>
      <input type="text" value="${paddyLoading.factoryName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Season Name</label>
      <input type="text" value="${paddyLoading.seasonName}" disabled />
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
        value="${paddyLoading.vehicleNumber}"
        required
      />
      <br />
    </div>

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
        value="${paddyLoading.bagsLoaded}"
        required
      />
      <br />
    </div>
  </div>
</form>
                `;

              // ---------------------------------------------------- for updating paddy loading----------------------------------------------------

              document
                .getElementById("editPaddyLoadingForm")
                .addEventListener("submit", async (e) => {
                  try {
                    e.preventDefault();

                    const formdata = new FormData(e.target);
                    const data = {};
                    formdata.forEach((value, key) => {
                      data[key] = value;
                    });

                    spinner.style.visibility = "visible";
                    const res = await axios.post(
                      `/home/paddy-management/update-paddy-loading?id=${id}`,
                      data,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          // "Content-Type": "multipart/form-data",
                        },
                      }
                    );
                    spinner.style.visibility = "hidden";

                    showPaddyLoadingDetails();
                  } catch (error) {
                    const errorMessage = handleApiError(error);
                    document.getElementById("inputError").innerHTML =
                      errorMessage;
                  }
                });
            } catch (err) {
              errorHandler(err);
              window.location.reload();
            }
          });
      });
  } catch (error) {
    errorHandler(error);
  }
}

async function showTransitPassEntryDetails() {
  try {
    // ------------------------------------------------for showing info page for a company user----------------------------------------------------
    goback("paddy-management");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(
      `/home/paddy-management/transit-pass-entry/?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const transitPassEntry = res.data.transitPassEntry;
    spinner.style.visibility = "hidden";
    console.log(transitPassEntry);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById(
      "menu_title"
    ).innerHTML = `Transit Pass Entry Details`;

    document.getElementById("button_container").innerHTML = `
              <button id='editTransitPassEntryDetails' class="submitBtn">Edit</button>
    `;

    //

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>Mandi Name</h2>
               <p>${transitPassEntry.mandiName}</p>
    </div>

    <div class="details_section_row">
          <h2>Factory Name</h2>
          <p>${transitPassEntry.factoryName}</p>
                  
    </div>

    <div class="details_section_row">
          <h2>Season Name</h2>
          <p>${transitPassEntry.seasonName}</p>
                  
    </div>

    <div class="details_section_row">
          <h2>Transit Pass Number</h2>
          <p>${transitPassEntry.transitPassNumber}</p>
    </div>

    <div class="details_section_row">
          <h2>Transit Pass Bags</h2>
          <p>${transitPassEntry.transitPassBags}</p>
    </div>

    <div class="details_section_row">
          <h2>Transit Pass Qty_qtls</h2>
          <p>${transitPassEntry.transitPassQty_qtls}</p>
    </div>

    <div class="details_section_row">
          <h2>Upload TP Copy</h2>
          <a href="${transitPassEntry.uploadTPCopy}">Link</a>          
    </div>        

    <div class="details_section_row">
          <h2>Company Name</h2>
          <p>${transitPassEntry.companyName}</p>
    </div>



    <div class="details_section_row">
          <h2>Created By </h2>
          <p>${transitPassEntry.createdBy}</p>
    </div>

    <div class="details_section_row">
          <h2>Last Modified By</h2>
          <p>${transitPassEntry.lastModifiedBy}</p>
    </div>

    <div class="details_section_row">
          <h2>Created At</h2>
          <p>${transitPassEntry.createdAt}</p>
    </div>
    <div class="details_section_row">
          <h2>Updated At</h2>
          <p>${transitPassEntry.updatedAt}</p>
    </div>

    `;

    // ------------------------------------------------for showing edit page for a company user----------------------------------------------------

    document
      .getElementById("editTransitPassEntryDetails")
      .addEventListener("click", (e) => {
        // console.log(";hello from modal");
        const modal_container = document.getElementById("modal_container");
        // console.log(modal_container);
        document.getElementById(
          "modal_title"
        ).innerHTML = `Are you sure you want to edit this transit pass entry ?`;

        document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="submitBtn">Yes</button>
                  <button id="modal_close" class="cancelBtn">No</button>
        `;

        // modal close code
        modalControl();

        modal_container.classList.add("show");
        document
          .getElementById("modal_action_button")
          .addEventListener("click", async (e) => {
            try {
              document.getElementById("modal_close").click();

              document.getElementById(
                "menu_title"
              ).innerHTML = `Edit Transit Pass Entry`;

              document.getElementById("button_container").innerHTML = `
                    <button id='saveTransitPassEntry' class="submitBtn" type="submit"
                  form="editTransitPassEntryForm">Save</button>
                
                <button id='cancelButton' class="cancelBtn">Cancel</button>
          `;

              document
                .getElementById("cancelButton")
                .addEventListener("click", showTransitPassEntryDetails);

              details_section_content.innerHTML = `
                <form id="editTransitPassEntryForm">
  <div class="form_content">
    <div class="error" id="inputError"></div>
    <div class="form_control">
      <label>Mandi Name</label>
      <input type="text" value=${transitPassEntry.mandiName} disabled />
      <br />
    </div>

        <div class="form_control">
      <label>Season Name</label>
      <input type="text" value=${transitPassEntry.seasonName} disabled />
      <br />
    </div>


    <div class="form_control">
      <label>Factory Name</label>
      <input type="text" value=${transitPassEntry.factoryName} disabled />
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
        value=${transitPassEntry.transitPassNumber}
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
        value=${transitPassEntry.transitPassBags}
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
        value=${transitPassEntry.transitPassQty_qtls}
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
                `;

              // ---------------------------------------------------- for updating master target----------------------------------------------------

              document
                .getElementById("editTransitPassEntryForm")
                .addEventListener("submit", async (e) => {
                  try {
                    e.preventDefault();

                    const formdata = new FormData(e.target);

                    spinner.style.visibility = "visible";
                    const res = await axios.post(
                      `/home/paddy-management/update-transit-pass-entry?id=${id}`,
                      formdata,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );
                    spinner.style.visibility = "hidden";

                    showTransitPassEntryDetails();
                  } catch (error) {
                    const errorMessage = handleApiError(error);
                    document.getElementById("inputError").innerHTML =
                      errorMessage;
                  }
                });
            } catch (err) {
              errorHandler(err);
            }
          });
      });
  } catch (error) {
    errorHandler(error);
  }
}

async function showPaddyUnloadingDetails() {
  try {
    // ------------------------------------------------for showing info page for a paddy unloading----------------------------------------------------
    goback("paddy-management");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(
      `/home/paddy-management/paddy-unloading/?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const paddyUnloading = res.data.paddyUnloading;
    spinner.style.visibility = "hidden";
    console.log(paddyUnloading);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Paddy Unloading Details`;

    document.getElementById("button_container").innerHTML = `
              <button id='editPaddyUnloadingDetails' class="submitBtn">Edit</button>
    `;

    //

    details_section_content.innerHTML = `
    <div class="details_section_row">
  <h2>Season Name</h2>
  <p>${paddyUnloading.seasonName}</p>
</div>

<div class="details_section_row">
  <h2>Mandi Name</h2>
  <p>${paddyUnloading.mandiName}</p>
</div>

<div class="details_section_row">
  <h2>Factory Name</h2>
  <p>${paddyUnloading.factoryName}</p>
</div>

<div class="details_section_row">
  <h2>Godown Name</h2>
  <p>${paddyUnloading.godownName}</p>
</div>

<div class="details_section_row">
  <h2>Vehicle Number</h2>
  <p>${paddyUnloading.vehicleNumber}</p>
</div>

<div class="details_section_row">
  <h2>RST Number</h2>
  <p>${paddyUnloading.rstNumber}</p>
</div>

<div class="details_section_row">
  <h2>Bags</h2>
  <p>${paddyUnloading.gunnyBags}</p>
</div>

<div class="details_section_row">
  <h2>PP Bags</h2>
  <p>${paddyUnloading.ppBags}</p>
</div>

<div class="details_section_row">
  <h2>Total Bags</h2>
  <p>${paddyUnloading.totalBags}</p>
</div>

<div class="details_section_row">
  <h2>Gross</h2>
  <p>${paddyUnloading.qtlsGross}</p>
</div>

<div class="details_section_row">
  <h2>Tare</h2>
  <p>${paddyUnloading.tare}</p>
</div>

<div class="details_section_row">
  <h2>Nett UnloadedQty_qtls</h2>
  <p>${paddyUnloading.nettUnloadedQty_qtls}</p>
</div>

<div class="details_section_row">
  <h2>Notes</h2>
  <p>${paddyUnloading.notes}</p>
</div>

<div class="details_section_row">
  <h2>Company Name</h2>
  <p>${paddyUnloading.companyName}</p>
</div>

<div class="details_section_row">
  <h2>Created By</h2>
  <p>${paddyUnloading.createdBy}</p>
</div>

<div class="details_section_row">
  <h2>Last Modified By</h2>
  <p>${paddyUnloading.lastModifiedBy}</p>
</div>

<div class="details_section_row">
  <h2>Created At</h2>
  <p>${paddyUnloading.createdAt}</p>
</div>
<div class="details_section_row">
  <h2>Updated At</h2>
  <p>${paddyUnloading.updatedAt}</p>
</div>


    `;

    // ------------------------------------------------for showing edit page for a paddy unloading----------------------------------------------------

    document
      .getElementById("editPaddyUnloadingDetails")
      .addEventListener("click", (e) => {
        // console.log(";hello from modal");
        const modal_container = document.getElementById("modal_container");
        // console.log(modal_container);
        document.getElementById(
          "modal_title"
        ).innerHTML = `Are you sure you want to edit this paddy unloading ?`;

        document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="submitBtn">Yes</button>
                  <button id="modal_close" class="cancelBtn">No</button>
        `;

        // modal close code
        modalControl();

        modal_container.classList.add("show");
        document
          .getElementById("modal_action_button")
          .addEventListener("click", async (e) => {
            try {
              document.getElementById("modal_close").click();

              document.getElementById(
                "menu_title"
              ).innerHTML = `Edit Paddy Loading`;

              document.getElementById("button_container").innerHTML = `
                    <button id='savePaddyUnloading' class="submitBtn" type="submit"
                  form="editPaddyUnloadingForm">Save</button>
                
                <button id='cancelButton' class="cancelBtn">Cancel</button>
          `;

              document
                .getElementById("cancelButton")
                .addEventListener("click", showPaddyUnloadingDetails);

              details_section_content.innerHTML = `
                <form id="editPaddyUnloadingForm">
  <div class="form_content">
    <div class="error" id="inputError"></div>

    <div class="form_control">
      <label>Mandi</label>
      <input type="text" value="${paddyUnloading.mandiName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Factory</label>
      <input type="text" value="${paddyUnloading.factoryName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Season</label>
      <input type="text" value="${paddyUnloading.seasonName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Godown</label>
      <input type="text" value="${paddyUnloading.godownName}" disabled />
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
        value="${paddyUnloading.vehicleNumber}"
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
        value="${paddyUnloading.rstNumber}"
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
        value="${paddyUnloading.gunnyBags}"
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
        value="${paddyUnloading.ppBags}"
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
        value="${paddyUnloading.qtlsGross}"
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
        value="${paddyUnloading.tare}"
        step="any"
        min="0"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="notes">Notes<span style="color: red">*</span></label>
      <input
        type="text"
        id="notes"
        name="notes"
        placeholder="Enter notes"
        value="${paddyUnloading.notes}"
      />
      <br />
    </div>
  </div>
</form>
                `;

              // ---------------------------------------------------- for updating paddy loading----------------------------------------------------

              document
                .getElementById("editPaddyUnloadingForm")
                .addEventListener("submit", async (e) => {
                  try {
                    e.preventDefault();

                    const formdata = new FormData(e.target);
                    const data = {};
                    formdata.forEach((value, key) => {
                      data[key] = value;
                    });

                    spinner.style.visibility = "visible";
                    const res = await axios.post(
                      `/home/paddy-management/update-paddy-unloading?id=${id}`,
                      data,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    spinner.style.visibility = "hidden";

                    showPaddyUnloadingDetails();
                  } catch (error) {
                    const errorMessage = handleApiError(error);
                    document.getElementById("inputError").innerHTML =
                      errorMessage;
                  }
                });
            } catch (err) {
              errorHandler(err);
              window.location.reload();
            }
          });
      });
  } catch (error) {
    errorHandler(error);
  }
}

async function showTraderPaddyAdvanceDetails() {
  try {
    // ------------------------------------------------for showing info page for a trader paddy advance----------------------------------------------------
    goback("trader-management");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(
      `/home/trader-management/trader-paddy-advance/?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const traderAdvance = res.data.traderPaddyAdvance;
    spinner.style.visibility = "hidden";
    console.log(traderAdvance);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Trader Paddy Advance`;

    document.getElementById("button_container").innerHTML = `
              <button id='editTraderPaddyAdvanceDetails' class="submitBtn">Edit</button>
    `;

    //

    details_section_content.innerHTML = `

    <div class="details_section_row">
  <h2>Trader Name</h2>
  <p>${traderAdvance.traderName}</p>
</div>

    <div class="details_section_row">
  <h2>Season Name</h2>
  <p>${traderAdvance.seasonName}</p>
</div>



<div class="details_section_row">
  <h2>Factory Name</h2>
  <p>${traderAdvance.factoryName}</p>
</div>

<div class="details_section_row">
  <h2>Godown Name</h2>
  <p>${traderAdvance.godownName}</p>
</div>

<div class="details_section_row">
  <h2>IN Bags</h2>
  <p>${traderAdvance.inBags}</p>
</div>

<div class="details_section_row">
  <h2>Gross</h2>
  <p>${traderAdvance.gross}</p>
</div>

<div class="details_section_row">
  <h2>Bag Weight In Kg</h2>
  <p>${traderAdvance.bagWeightInKg}</p>
</div>

<div class="details_section_row">
  <h2>Faq Percentage</h2>
  <p>${traderAdvance.faqPercentage}</p>
</div>

<div class="details_section_row">
  <h2>Special Cutting In Kg</h2>
  <p>${traderAdvance.specialCuttingInKg}</p>
</div>

<div class="details_section_row">
  <h2>Faq</h2>
  <p>${traderAdvance.faq}</p>
</div>

<div class="details_section_row">
  <h2>Nett In</h2>
  <p>${traderAdvance.nettIn}</p>
</div>


<div class="details_section_row">
  <h2>Company Name</h2>
  <p>${traderAdvance.companyName}</p>
</div>

<div class="details_section_row">
  <h2>Created By</h2>
  <p>${traderAdvance.createdBy}</p>
</div>

<div class="details_section_row">
  <h2>Last Modified By</h2>
  <p>${traderAdvance.lastModifiedBy}</p>
</div>

<div class="details_section_row">
  <h2>Created At</h2>
  <p>${traderAdvance.createdAt}</p>
</div>
<div class="details_section_row">
  <h2>Updated At</h2>
  <p>${traderAdvance.updatedAt}</p>
</div>


    `;

    // ------------------------------------------------for showing edit page for a trader paddy Advance----------------------------------------------------

    document
      .getElementById("editTraderPaddyAdvanceDetails")
      .addEventListener("click", (e) => {
        // console.log(";hello from modal");
        const modal_container = document.getElementById("modal_container");
        // console.log(modal_container);
        document.getElementById(
          "modal_title"
        ).innerHTML = `Are you sure you want to edit this trader paddy advance ?`;

        document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="submitBtn">Yes</button>
                  <button id="modal_close" class="cancelBtn">No</button>
        `;

        // modal close code
        modalControl();

        modal_container.classList.add("show");
        document
          .getElementById("modal_action_button")
          .addEventListener("click", async (e) => {
            try {
              document.getElementById("modal_close").click();

              document.getElementById(
                "menu_title"
              ).innerHTML = `Edit Trader Paddy Advance`;

              document.getElementById("button_container").innerHTML = `
                    <button id='saveTraderPaddyAdvance' class="submitBtn" type="submit"
                  form="editTraderPaddyAdvanceForm">Save</button>
                
                <button id='cancelButton' class="cancelBtn">Cancel</button>
          `;

              document
                .getElementById("cancelButton")
                .addEventListener("click", showTraderPaddyAdvanceDetails);

              details_section_content.innerHTML = `
                <form id="editTraderPaddyAdvanceForm">
  <div class="form_content">
    <div class="error" id="inputError"></div>

    <div class="form_control">
      <label>Trader</label>
      <input type="text" value="${traderAdvance.traderName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Factory</label>
      <input type="text" value="${traderAdvance.factoryName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Season</label>
      <input type="text" value="${traderAdvance.seasonName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Godown</label>
      <input type="text" value="${traderAdvance.godownName}" disabled />
      <br />
    </div>

        <div class="form_control">
      <label for="inBags">In Bags<span style="color: red">*</span></label>
      <input
        type="number"
        id="inBags"
        name="inBags"
        placeholder="Enter IN Bags"
        value="${traderAdvance.inBags}"
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
        value="${traderAdvance.gross}"
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
        value="${traderAdvance.bagWeightInKg}"
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
        value="${traderAdvance.faqPercentage}"
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
        value="${traderAdvance.specialCuttingInKg}"
        step="any"
        min="0"
      />
      <br />
    </div>

  </div>
</form>
                `;

              // ---------------------------------------------------- for updating trader paddy advance----------------------------------------------------

              document
                .getElementById("editTraderPaddyAdvanceForm")
                .addEventListener("submit", async (e) => {
                  try {
                    e.preventDefault();

                    const formdata = new FormData(e.target);
                    const data = {};
                    formdata.forEach((value, key) => {
                      data[key] = value;
                    });

                    spinner.style.visibility = "visible";
                    const res = await axios.post(
                      `/home/trader-management/update-trader-paddy-advance?id=${id}`,
                      data,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    spinner.style.visibility = "hidden";

                    showTraderPaddyAdvanceDetails();
                  } catch (error) {
                    const errorMessage = handleApiError(error);
                    document.getElementById("inputError").innerHTML =
                      errorMessage;
                  }
                });
            } catch (err) {
              errorHandler(err);
              window.location.reload();
            }
          });
      });
  } catch (error) {
    errorHandler(error);
  }
}

async function showTraderPaddyReleaseDetails() {
  try {
    // ------------------------------------------------for showing info page for a trader paddy release----------------------------------------------------
    goback("trader-management");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(
      `/home/trader-management/trader-paddy-release/?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const traderRelease = res.data.traderPaddyRelease;
    spinner.style.visibility = "hidden";
    console.log(traderRelease);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Trader Paddy Release`;

    document.getElementById("button_container").innerHTML = `
              <button id='editTraderPaddyReleaseDetails' class="submitBtn">Edit</button>
    `;

    //

    details_section_content.innerHTML = `

    <div class="details_section_row">
  <h2>Trader Name</h2>
  <p>${traderRelease.traderName}</p>
</div>

    <div class="details_section_row">
  <h2>Season Name</h2>
  <p>${traderRelease.seasonName}</p>
</div>



<div class="details_section_row">
  <h2>Mandi Name</h2>
  <p>${traderRelease.mandiName}</p>
</div>



<div class="details_section_row">
  <h2>Release Qtls</h2>
  <p>${traderRelease.releaseQtls}</p>
</div>

<div class="details_section_row">
  <h2>releaseBags</h2>
  <p>${traderRelease.releaseBags}</p>
</div>



<div class="details_section_row">
  <h2>Company Name</h2>
  <p>${traderRelease.companyName}</p>
</div>

<div class="details_section_row">
  <h2>Created By</h2>
  <p>${traderRelease.createdBy}</p>
</div>

<div class="details_section_row">
  <h2>Last Modified By</h2>
  <p>${traderRelease.lastModifiedBy}</p>
</div>

<div class="details_section_row">
  <h2>Created At</h2>
  <p>${traderRelease.createdAt}</p>
</div>
<div class="details_section_row">
  <h2>Updated At</h2>
  <p>${traderRelease.updatedAt}</p>
</div>


    `;

    // ------------------------------------------------for showing edit page for a trader paddy release----------------------------------------------------

    document
      .getElementById("editTraderPaddyReleaseDetails")
      .addEventListener("click", (e) => {
        // console.log(";hello from modal");
        const modal_container = document.getElementById("modal_container");
        // console.log(modal_container);
        document.getElementById(
          "modal_title"
        ).innerHTML = `Are you sure you want to edit this trader paddy release ?`;

        document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="submitBtn">Yes</button>
                  <button id="modal_close" class="cancelBtn">No</button>
        `;

        // modal close code
        modalControl();

        modal_container.classList.add("show");
        document
          .getElementById("modal_action_button")
          .addEventListener("click", async (e) => {
            try {
              document.getElementById("modal_close").click();

              document.getElementById(
                "menu_title"
              ).innerHTML = `Edit Trader Paddy Release`;

              document.getElementById("button_container").innerHTML = `
                    <button id='saveTraderPaddyRelease' class="submitBtn" type="submit"
                  form="editTraderPaddyReleaseForm">Save</button>
                
                <button id='cancelButton' class="cancelBtn">Cancel</button>
          `;

              document
                .getElementById("cancelButton")
                .addEventListener("click", showTraderPaddyReleaseDetails);

              details_section_content.innerHTML = `
                <form id="editTraderPaddyReleaseForm">
  <div class="form_content">
    <div class="error" id="inputError"></div>

    <div class="form_control">
      <label>Trader</label>
      <input type="text" value="${traderRelease.traderName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Mandi</label>
      <input type="text" value="${traderRelease.mandiName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Season</label>
      <input type="text" value="${traderRelease.seasonName}" disabled />
      <br />
    </div>



        <div class="form_control">
      <label for="releaseBags">Release Bags<span style="color: red">*</span></label>
      <input
        type="number"
        id="releaseBags"
        name="releaseBags"
        placeholder="Enter bags released"
        value="${traderRelease.releaseBags}"
        required
      />
      <br />
    </div>

    <div class="form_control">
      <label for="releaseQtls">Release Qtls<span style="color: red">*</span></label>
      <input
        type="number"
        id="releaseQtls"
        name="releaseQtls"
        placeholder="Enter release qtls"
        required
        value="${traderRelease.releaseQtls}"
        step="any"
        min="0"
      />
      <br />
    </div>

    

  </div>
</form>
                `;

              // ---------------------------------------------------- for updating trader paddy release----------------------------------------------------

              document
                .getElementById("editTraderPaddyReleaseForm")
                .addEventListener("submit", async (e) => {
                  try {
                    e.preventDefault();

                    const formdata = new FormData(e.target);
                    const data = {};
                    formdata.forEach((value, key) => {
                      data[key] = value;
                    });

                    spinner.style.visibility = "visible";
                    const res = await axios.post(
                      `/home/trader-management/update-trader-paddy-release?id=${id}`,
                      data,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    spinner.style.visibility = "hidden";

                    showTraderPaddyReleaseDetails();
                  } catch (error) {
                    const errorMessage = handleApiError(error);
                    document.getElementById("inputError").innerHTML =
                      errorMessage;
                  }
                });
            } catch (err) {
              errorHandler(err);
              window.location.reload();
            }
          });
      });
  } catch (error) {
    errorHandler(error);
  }
}

async function showDeliveryCertificateDetails() {
  try {
    // ------------------------------------------------for showing info page for a delivery certificate----------------------------------------------------
    goback("rice-management");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(
      `/home/rice-management/delivery-certificate/?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const deliveryCertificate = res.data.deliveryCertificate;

    spinner.style.visibility = "hidden";
    console.log(deliveryCertificate);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Delivery Certificate`;

    document.getElementById("button_container").innerHTML = `
              <button id='editDeliveryCertificateDetails' class="submitBtn">Edit</button>
    `;

    //

    details_section_content.innerHTML = `
    <div class="details_section_row">
  <h2>Season Name</h2>
  <p>${deliveryCertificate.seasonName}</p>
</div>

<div class="details_section_row">
  <h2>Depot Name</h2>
  <p>${deliveryCertificate.depotName}</p>
</div>

<div class="details_section_row">
  <h2>Factory Name</h2>
  <p>${deliveryCertificate.factoryName}</p>
</div>

<div class="details_section_row">
  <h2>Dc Number</h2>
  <p>${deliveryCertificate.dcNumber}</p>
</div>

<div class="details_section_row">
  <h2>Qty Qtls</h2>
  <p>${deliveryCertificate.qtyQtls}</p>
</div>

<div class="details_section_row">
  <h2>DC Balance</h2>
  <p>${deliveryCertificate.dcBalance}</p>
</div>

<div class="details_section_row">
  <h2>Active</h2>
  <p>${deliveryCertificate.isActive}</p>
</div>

<div class="details_section_row">
  <h2>Company Name</h2>
  <p>${deliveryCertificate.companyName}</p>
</div>

<div class="details_section_row">
  <h2>Created By</h2>
  <p>${deliveryCertificate.createdBy}</p>
</div>

<div class="details_section_row">
  <h2>Last Modified By</h2>
  <p>${deliveryCertificate.lastModifiedBy}</p>
</div>

<div class="details_section_row">
  <h2>Created At</h2>
  <p>${deliveryCertificate.createdAt}</p>
</div>
<div class="details_section_row">
  <h2>Updated At</h2>
  <p>${deliveryCertificate.updatedAt}</p>
</div>
    `;

    // ------------------------------------------------for showing edit page for a delivery certificate----------------------------------------------------

    document
      .getElementById("editDeliveryCertificateDetails")
      .addEventListener("click", (e) => {
        // console.log(";hello from modal");
        const modal_container = document.getElementById("modal_container");
        // console.log(modal_container);
        document.getElementById(
          "modal_title"
        ).innerHTML = `Are you sure you want to edit this delivery certificate details ?`;

        document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="submitBtn">Yes</button>
                  <button id="modal_close" class="cancelBtn">No</button>
        `;

        // modal close code
        modalControl();

        modal_container.classList.add("show");
        document
          .getElementById("modal_action_button")
          .addEventListener("click", async (e) => {
            try {
              document.getElementById("modal_close").click();

              document.getElementById(
                "menu_title"
              ).innerHTML = `Edit Delivery Certificate`;

              document.getElementById("button_container").innerHTML = `
                    <button id='saveDeliveryCertificate' class="submitBtn" type="submit"
                  form="editDeliveryCertificateForm">Save</button>
                
                <button id='cancelButton' class="cancelBtn">Cancel</button>
          `;

              document
                .getElementById("cancelButton")
                .addEventListener("click", showDeliveryCertificateDetails);

              details_section_content.innerHTML = `
                <form id="editDeliveryCertificateForm">
  <div class="form_content">
    <div class="error" id="inputError"></div>

    <div class="form_control">
      <label>Season</label>
      <input type="text" value="${deliveryCertificate.seasonName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Factory</label>
      <input type="text" value="${deliveryCertificate.factoryName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Depot</label>
      <input type="text" value="${deliveryCertificate.depotName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label for="dcNumber">Dc Number<span style="color: red">*</span></label>
      <input
        type="text"
        id="dcNumber"
        name="dcNumber"
        placeholder="Enter DC Number"
        value="${deliveryCertificate.dcNumber}"
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
        placeholder="Enter Qty Qtls"
        required
        value="${deliveryCertificate.qtyQtls}"
        step="any"
        min="0"
      />
      <br />
    </div>
  </div>
</form>
                `;

              // ---------------------------------------------------- for updating delivery  certificate----------------------------------------------------

              document
                .getElementById("editDeliveryCertificateForm")
                .addEventListener("submit", async (e) => {
                  try {
                    e.preventDefault();

                    const formdata = new FormData(e.target);
                    const data = {};
                    formdata.forEach((value, key) => {
                      data[key] = value;
                    });

                    spinner.style.visibility = "visible";
                    const res = await axios.post(
                      `/home/rice-management/update-delivery-certificate?id=${id}`,
                      data,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    spinner.style.visibility = "hidden";

                    showDeliveryCertificateDetails();
                  } catch (error) {
                    const errorMessage = handleApiError(error);
                    console.log(errorMessage);
                    document.getElementById("inputError").innerHTML =
                      errorMessage;
                    spinner.style.visibility = "hidden";
                  }
                });
            } catch (err) {
              errorHandler(err);
              window.location.reload();
            }
          });
      });
  } catch (error) {
    errorHandler(error);
  }
}

async function showFactoryRiceLoadingDetails() {
  try {
    // ------------------------------------------------for showing info page for a factory rice loading----------------------------------------------------
    goback("rice-management");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(
      `/home/rice-management/factory-rice-loading/?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const factoryRiceLoading = res.data.factoryRiceLoading;

    spinner.style.visibility = "hidden";
    console.log(factoryRiceLoading);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Factory Rice Loading`;

    document.getElementById("button_container").innerHTML = `
              <button id='editFactoryRiceLoadingDetails' class="submitBtn">Edit</button>
    `;

    //

    details_section_content.innerHTML = `
    <div class="details_section_row">
  <h2>Dc Number</h2>
  <p>${factoryRiceLoading.dcNumber}</p>
</div>

<div class="details_section_row">
  <h2>Vehicle Number</h2>
  <p>${factoryRiceLoading.vehicleNumber}</p>
</div>

<div class="details_section_row">
  <h2>Qty Bags</h2>
  <p>${factoryRiceLoading.qtyBags}</p>
</div>

<div class="details_section_row">
  <h2>Qty Qtls</h2>
  <p>${factoryRiceLoading.qtyQtls}</p>
</div>

    <div class="details_section_row">
  <h2>Season Name</h2>
  <p>${factoryRiceLoading.seasonName}</p>
</div>

<div class="details_section_row">
  <h2>Depot Name</h2>
  <p>${factoryRiceLoading.depotName}</p>
</div>

<div class="details_section_row">
  <h2>Factory Name</h2>
  <p>${factoryRiceLoading.factoryName}</p>
</div>


<div class="details_section_row">
  <h2>Company Name</h2>
  <p>${factoryRiceLoading.companyName}</p>
</div>

<div class="details_section_row">
  <h2>Created By</h2>
  <p>${factoryRiceLoading.createdBy}</p>
</div>

<div class="details_section_row">
  <h2>Last Modified By</h2>
  <p>${factoryRiceLoading.lastModifiedBy}</p>
</div>

<div class="details_section_row">
  <h2>Created At</h2>
  <p>${factoryRiceLoading.createdAt}</p>
</div>
<div class="details_section_row">
  <h2>Updated At</h2>
  <p>${factoryRiceLoading.updatedAt}</p>
</div>
    `;

    // ------------------------------------------------for showing edit page for a factory rice loading----------------------------------------------------

    document
      .getElementById("editFactoryRiceLoadingDetails")
      .addEventListener("click", (e) => {
        // console.log(";hello from modal");
        const modal_container = document.getElementById("modal_container");
        // console.log(modal_container);
        document.getElementById(
          "modal_title"
        ).innerHTML = `Are you sure you want to edit this factory rice loading details ?`;

        document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="submitBtn">Yes</button>
                  <button id="modal_close" class="cancelBtn">No</button>
        `;

        // modal close code
        modalControl();

        modal_container.classList.add("show");
        document
          .getElementById("modal_action_button")
          .addEventListener("click", async (e) => {
            try {
              document.getElementById("modal_close").click();

              document.getElementById(
                "menu_title"
              ).innerHTML = `Edit Factory Rice Loading`;

              document.getElementById("button_container").innerHTML = `
                    <button id='saveFactoryRiceLoading' class="submitBtn" type="submit"
                  form="editFactoryRiceLoadingForm">Save</button>
                
                <button id='cancelButton' class="cancelBtn">Cancel</button>
          `;

              document
                .getElementById("cancelButton")
                .addEventListener("click", showFactoryRiceLoadingDetails);

              details_section_content.innerHTML = `
                <form id="editFactoryRiceLoadingForm">
  <div class="form_content">
    <div class="error" id="inputError"></div>

    <div class="form_control">
      <label>Season</label>
      <input type="text" value="${factoryRiceLoading.seasonName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Factory</label>
      <input type="text" value="${factoryRiceLoading.factoryName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Depot</label>
      <input type="text" value="${factoryRiceLoading.depotName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label for="dcNumber">Dc Number<span style="color: red">*</span></label>
      <input
        type="text"
        value="${factoryRiceLoading.dcNumber}"
        disabled
      />
      <br />
    </div>

        <div class="form_control">
      <label for="vehicleNumber">Vehicle Number<span style="color: red">*</span></label>
      <input
        type="text"
        id="vehicleNumber"
        name="vehicleNumber"
        placeholder="Enter vehicle number"
        required
        value="${factoryRiceLoading.vehicleNumber}"
        
      />
      <br />
    </div>

            <div class="form_control">
      <label for="qtyBags">Qty Bags<span style="color: red">*</span></label>
      <input
        type="number"
        id="qtyBags"
        name="qtyBags"
        placeholder="Enter Bags Quantity"
        required
        value="${factoryRiceLoading.qtyBags}"
        
      />
      <br />
    </div>

    <div class="form_control">
      <label for="qtyQtls">Qty Qtls<span style="color: red">*</span></label>
      <input
        type="number"
        id="qtyQtls"
        name="qtyQtls"
        placeholder="Enter Qty Qtls"
        required
        value="${factoryRiceLoading.qtyQtls}"
        step="any"
        min="0"
      />
      <br />
    </div>
  </div>
</form>
                `;

              // ---------------------------------------------------- for updating delivery  certificate----------------------------------------------------

              document
                .getElementById("editFactoryRiceLoadingForm")
                .addEventListener("submit", async (e) => {
                  try {
                    e.preventDefault();

                    const formdata = new FormData(e.target);
                    const data = {};
                    formdata.forEach((value, key) => {
                      data[key] = value;
                    });

                    spinner.style.visibility = "visible";
                    const res = await axios.post(
                      `/home/rice-management/update-factory-rice-loading?id=${id}`,
                      data,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    spinner.style.visibility = "hidden";

                    showFactoryRiceLoadingDetails();
                  } catch (error) {
                    const errorMessage = handleApiError(error);
                    console.log(errorMessage);
                    document.getElementById("inputError").innerHTML =
                      errorMessage;
                    spinner.style.visibility = "hidden";
                  }
                });
            } catch (err) {
              errorHandler(err);
              window.location.reload();
            }
          });
      });
  } catch (error) {
    errorHandler(error);
  }
}

async function showRiceAcNoteDetails() {
  try {
    // ------------------------------------------------for showing info page for a factory rice loading----------------------------------------------------
    goback("rice-management");

    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(`/home/rice-management/rice-AcNote/?id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const riceAcNote = res.data.riceAcNote;

    spinner.style.visibility = "hidden";
    console.log(riceAcNote);

    console.log(id);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Rice Ac Note`;

    document.getElementById("button_container").innerHTML = `
              <button id='editRiceAcNoteDetails' class="submitBtn">Edit</button>
    `;

    //

    details_section_content.innerHTML = `
    <div class="details_section_row">
  <h2>Ac Note Number</h2>
  <p>${riceAcNote.acNoteNumber}</p>
</div>

<div class="details_section_row">
  <h2>Qty Bags</h2>
  <p>${riceAcNote.qtyBags}</p>
</div>

<div class="details_section_row">
  <h2>Qty Qtls</h2>
  <p>${riceAcNote.qtyQtls}</p>
</div>

<div class="details_section_row">
  <h2>Note</h2>
  <p>${riceAcNote.note}</p>
</div>

    <div class="details_section_row">
  <h2>Season Name</h2>
  <p>${riceAcNote.seasonName}</p>
</div>

<div class="details_section_row">
  <h2>Depot Name</h2>
  <p>${riceAcNote.depotName}</p>
</div>

<div class="details_section_row">
  <h2>Factory Name</h2>
  <p>${riceAcNote.factoryName}</p>
</div>


<div class="details_section_row">
  <h2>Company Name</h2>
  <p>${riceAcNote.companyName}</p>
</div>

<div class="details_section_row">
  <h2>Created By</h2>
  <p>${riceAcNote.createdBy}</p>
</div>

<div class="details_section_row">
  <h2>Last Modified By</h2>
  <p>${riceAcNote.lastModifiedBy}</p>
</div>

<div class="details_section_row">
  <h2>Created At</h2>
  <p>${riceAcNote.createdAt}</p>
</div>
<div class="details_section_row">
  <h2>Updated At</h2>
  <p>${riceAcNote.updatedAt}</p>
</div>
    `;

    // ------------------------------------------------for showing edit page for a rice AcNote----------------------------------------------------

    document
      .getElementById("editRiceAcNoteDetails")
      .addEventListener("click", (e) => {
        // console.log(";hello from modal");
        const modal_container = document.getElementById("modal_container");
        // console.log(modal_container);
        document.getElementById(
          "modal_title"
        ).innerHTML = `Are you sure you want to edit this Rice AcNote details ?`;

        document.getElementById("modal_footer").innerHTML = `
        <button id="modal_action_button" class="submitBtn">Yes</button>
                  <button id="modal_close" class="cancelBtn">No</button>
        `;

        // modal close code
        modalControl();

        modal_container.classList.add("show");
        document
          .getElementById("modal_action_button")
          .addEventListener("click", async (e) => {
            try {
              document.getElementById("modal_close").click();

              document.getElementById(
                "menu_title"
              ).innerHTML = `Edit Rice AcNote`;

              document.getElementById("button_container").innerHTML = `
                    <button id='saveRiceAcNote' class="submitBtn" type="submit"
                  form="editRiceAcNoteForm">Save</button>
                
                <button id='cancelButton' class="cancelBtn">Cancel</button>
          `;

              document
                .getElementById("cancelButton")
                .addEventListener("click", showRiceAcNoteDetails);

              details_section_content.innerHTML = `
                <form id="editRiceAcNoteForm">
  <div class="form_content">
    <div class="error" id="inputError"></div>

    <div class="form_control">
      <label>Season</label>
      <input type="text" value="${riceAcNote.seasonName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Factory</label>
      <input type="text" value="${riceAcNote.factoryName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label>Depot</label>
      <input type="text" value="${riceAcNote.depotName}" disabled />
      <br />
    </div>

    <div class="form_control">
      <label for="acNoteNumber">Ac Note Number<span style="color: red">*</span></label>
      <input
        type="text"
        id="acNoteNumber"
        name="acNoteNumber"
        value="${riceAcNote.acNoteNumber}"
        disabled
      />
      <br />
    </div>       

            <div class="form_control">
      <label for="qtyBags">Qty Bags<span style="color: red">*</span></label>
      <input
        type="number"
        id="qtyBags"
        name="qtyBags"
        placeholder="Enter Bags Quantity"
        required
        value="${riceAcNote.qtyBags}"
        
      />
      <br />
    </div>

    <div class="form_control">
      <label for="qtyQtls">Qty Qtls<span style="color: red">*</span></label>
      <input
        type="number"
        id="qtyQtls"
        name="qtyQtls"
        placeholder="Enter Qty Qtls"
        required
        value="${riceAcNote.qtyQtls}"
        step="any"
        min="0"
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
        value="${riceAcNote.note}"
        
      />
      <br />
    </div>
  </div>
</form>
                `;

              // ---------------------------------------------------- for updating rice AcNote----------------------------------------------------

              document
                .getElementById("editRiceAcNoteForm")
                .addEventListener("submit", async (e) => {
                  try {
                    e.preventDefault();

                    const formdata = new FormData(e.target);
                    const data = {};
                    formdata.forEach((value, key) => {
                      data[key] = value;
                    });

                    spinner.style.visibility = "visible";
                    const res = await axios.post(
                      `/home/rice-management/update-rice-AcNote?id=${id}`,
                      data,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    spinner.style.visibility = "hidden";

                    showRiceAcNoteDetails();
                  } catch (error) {
                    const errorMessage = handleApiError(error);
                    console.log(errorMessage);
                    document.getElementById("inputError").innerHTML =
                      errorMessage;
                    spinner.style.visibility = "hidden";
                  }
                });
            } catch (err) {
              errorHandler(err);
              window.location.reload();
            }
          });
      });
  } catch (error) {
    errorHandler(error);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    //------------------------------- manage account data handling-------------------------------
    if (tab === "manageAccount") {
      if (menu === "companyLocation") {
        // updateUserLocation();
        showCompanyLocationDetails();
      }
      if (menu === "companySeason") {
        // updateUserLocation();
        showCompanySeasonDetails();
      }
      if (menu === "companyFactory") {
        // updateUserLocation();
        showCompanyFactoryDetails();
      }
      if (menu === "companyGodown") {
        // updateUserLocation();
        showCompanyGodownDetails();
      }
      if (menu === "companyTrader") {
        // updateUserLocation();
        showCompanyTraderDetails();
      }
    }

    //------------------------------- manage user data handling-------------------------------
    if (tab === "manageUser") {
      if (menu === "companyUser") {
        // updateUserLocation();
        showCompanyUserDetails();
      }
    }

    //------------------------------- paddy management data handling-------------------------------
    if (tab === "paddyManagement") {
      if (menu === "masterTarget") {
        // updateUserLocation();
        showMasterTargetDetails();
      }
      if (menu === "paddyPurchase") {
        // updateUserLocation();
        showPaddyPurchaseDetails();
      }

      if (menu === "paddyLoading") {
        // updateUserLocation();
        showPaddyLoadingDetails();
      }

      if (menu === "transitPassEntry") {
        // updateUserLocation();
        showTransitPassEntryDetails();
      }

      if (menu === "paddyUnloading") {
        // updateUserLocation();
        showPaddyUnloadingDetails();
      }
    }

    //------------------------------- trader management data handling-------------------------------

    if (tab === "traderManagement") {
      if (menu === "trader_advance") {
        // updateUserLocation();
        showTraderPaddyAdvanceDetails();
      }
      if (menu === "trader_release") {
        // updateUserLocation();
        showTraderPaddyReleaseDetails();
      }
    }

    //------------------------------- rice management data handling-------------------------------

    if (tab === "riceManagement") {
      if (menu === "delivery_certificate") {
        // updateUserLocation();
        showDeliveryCertificateDetails();
      }
      if (menu === "factory_rice_loading") {
        // updateUserLocation();
        showFactoryRiceLoadingDetails();
      }

      if (menu === "rice_ac_note") {
        // updateUserLocation();
        showRiceAcNoteDetails();
      }
    }
  } catch (error) {
    errorHandler(error);
  }
});
