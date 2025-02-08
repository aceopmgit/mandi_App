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

// async function updateUserLocation() {
//   try {
//     const spinner = document.getElementById("loading_spinner");
//     spinner.style.visibility = "visible";

//     const res = await axios.get(`/home/get-states/`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     spinner.style.visibility = "hidden";

//     const states = res.data.stateDetails;
//     // console.log(states);

//     const details_section_content = document.getElementById(
//       "details_section_content"
//     );

//     document.getElementById("menu_title").innerHTML = `Update company Location`;

//     document.getElementById("button_container").innerHTML = `
//               <button id='saveStates' class="submitBtn" type="submit"
//             form="updateCompanyLocationForm">Save</button>
//           <button id='cancelUpdateButton' class="cancelBtn">Cancel</button>
//     `;

//     details_section_content.innerHTML = `
//     <div class="content_area">
//       <div class="selection_area" data-id="stateSelectionArea">
//         <div class="select_box" data-id="selectStateBox">
//           <div class="option_container" data-id="stateOptionContainer">
//             ${states
//               .map((ele) => {
//                 return `
//             <div class="option" data-id="stateOption">
//               <input type="radio" class="radio" name="" id="${ele.id}" />
//               <label for="${ele.name}">${ele.name}</label>
//             </div>

//             `;
//               })
//               .join("")}
//           </div>

//           <div class="selected" data-id="stateSelected">Select State</div>
//           <div class="search_box" data-id="stateSearchBox">
//             <input type="text" placeholder="Start Typing....." /
//             id="state_search_box_input">
//           </div>
//         </div>
//         <br />
//       </div>

//       <div class="content_section" id="content_section"></div>
//     </div>
//     `;
//     stateDropdownControl();
//     // details_section_content.innerHTML = `
//     //   <form id="updateUserStateForm">
//     //   <div class="form_content">

//     //     <div class="permissions">
//     //   <label>Select States</label>
//     //   <br>
//     //   <br>
//     //   <div class="error" id="error"></div>
//     //   <br>
//     //   ${states
//     //     .map((ele) => {
//     //       return `
//     //       <div class="input_checkbox">
//     //       <input
//     //         type="checkbox"
//     //         id="${ele.id}"
//     //         name="${ele.name} permissions"
//     //         value="${ele.id}"
//     //       />
//     //       <label for="${ele.name}">${ele.name}</label>
//     //     </div>
//     //       `;
//     //     })
//     //     .join("")}

//     //   </div>
//     // </form>
//     //   `;

//     //   getting user states and showing user selected states
//     // const response = await axios.get(`/home/user-states`, {
//     //   headers: { Authorization: `Bearer ${token}` },
//     // });

//     // console.log(res.data);
//     // const userStatesDetails = response.data.userStates;

//     // const checkboxes = document.querySelectorAll('input[type="checkbox"]');

//     // const selectedChecboxId = userStatesDetails.map((ele) => ele.id);

//     // Array.from(checkboxes).map((ele) => {
//     //   console.log(
//     //     selectedChecboxId.includes(ele.id),
//     //     ele.id
//     //     // selectedChecboxId
//     //   );
//     //   if (selectedChecboxId.includes(ele.id)) {
//     //     ele.checked = true;
//     //   }
//     // });

//     // // for updating user states
//     // document
//     //   .getElementById("updateUserStateForm")
//     //   .addEventListener("submit", async (e) => {
//     //     try {
//     //       e.preventDefault();
//     //       // console.log("hello");

//     //       const errorDiv = document.getElementById("error");
//     //       const checkboxes = document.querySelectorAll(
//     //         'input[type="checkbox"]'
//     //       );

//     //       errorDiv.textContent = "";

//     //       const isChecked = Array.from(checkboxes).some((cb) => cb.checked);

//     //       if (!isChecked) {
//     //         errorDiv.textContent = "Please select at least one state.";
//     //         return;
//     //       }

//     //       const states = Array.from(checkboxes).filter((cb) => cb.checked);
//     //       const details = {
//     //         userStates: states.map((ele) => ele.id),
//     //       };

//     //       console.log(states, details);

//     //       const spinner = document.getElementById("loading_spinner");
//     //       spinner.style.visibility = "visible";

//     //       const res = await axios.post(`/home/update-user-states`, details, {
//     //         headers: {
//     //           Authorization: token,
//     //         },
//     //       });
//     //       // showRoleDetails(id);
//     //     } catch (error) {
//     //       console.log(error);
//     //       const errorMessage = handleApiError(error);
//     //       console.log(errorMessage);
//     //       alert(errorMessage);
//     //       // if (error.response.data.error === "jwt expired") {
//     //       //   alert("Your Session has expired ! Please Login Again");
//     //       //   window.location.href = "/admin/";
//     //       //   localStorage.removeItem("adminToken");
//     //       // }
//     //     }
//     //   });
//   } catch (error) {
//     const errorMessage = handleApiError(error);
//     alert(errorMessage);
//     console.log(errorMessage);
//   }
// }

// function stateDropdownControl() {
//   const selected = document.querySelector('[data-id="stateSelected"]');

//   const option_container = document.querySelector(
//     '[data-id="stateOptionContainer"]'
//   );
//   const optionsList = Array.from(
//     document.querySelectorAll('[data-id="stateOption"]')
//   );
//   const searchBox = document.getElementById("state_search_box_input");
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
//         console.log(id);

//         const spinner = document.getElementById("loading_spinner");
//         spinner.style.visibility = "visible";

//         // //---------------------------------------------------- for showing district list----------------------------------------------------
//         const res = await axios.get(`/home/get-districts?stateId=${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         spinner.style.visibility = "hidden";

//         const districts = res.data.districtDetails;

//         // console.log(districts);

//         const content_section = document.getElementById("content_section");
//         content_section.innerHTML = `<form id="updateCompanyLocationForm">
//       <div class="form_content">
//         <div class="permissions">
//           <label>Select Company's District For the state:</label>
//           <br />
//           <br />
//           <div class="error" id="error"></div>
//           <br />
//           ${districts
//             .map((ele) => {
//               return `
//           <div class="input_checkbox">
//             <input
//               type="checkbox"
//               id="${ele.id}"
//               name="${ele.name} permissions"
//               value="${ele.id}"
//             />
//             <label for="${ele.name}">${ele.name}</label>
//           </div>
//           `;
//             })
//             .join("")}
//         </div>
//       </div>
//     </form>
//     `;

//         document
//           .getElementById("updateCompanyLocationForm")
//           .addEventListener("sumit", async (e) => {
//             e.preventDefault();
//             const errorDiv = document.getElementById("error");

//             const checkboxes = document.querySelectorAll(
//               'input[type="checkbox"]'
//             );

//             errorDiv.textContent = "";

//             const isChecked = Array.from(checkboxes).some((cb) => cb.checked);

//             if (!isChecked) {
//               errorDiv.textContent = "Please select at least one district.";
//               return;
//             }

//             const districtList = Array.from(checkboxes).filter(
//               (cb) => cb.checked
//             );

//             spinner.style.visibility = "visible";

//             const details = {
//               stateId: id,
//               districts: districtList.map((ele) => ele.id),
//             };

//             console.log(details);
//           });

//         // const content_section =
//         //   document.getElementsByClassName("content_section")[0];
//         // const main_section_container = document.getElementById(
//         //   "main_section_container"
//         // );

//         // const districtOptionContainer = document.querySelector(
//         //   '[data-id="districtOptionContainer"]'
//         // );

//         // if (district.length < 1) {
//         //   alert("No district Added for the state");
//         //   mandi.click();

//         //   return;
//         // }

//         // console.log(district, districtOptionContainer);

//         // districtOptionContainer.innerHTML = `;
//         // // ${district
//         //   .map((ele) => {
//         //     return `
//         //     <div class="option" data-id="districtOption">
//         //     <input
//         //       type="radio"
//         //       class="radio"
//         //       name=""
//         //       id="${ele.id}"
//         //     />
//         //     <label for="${ele.name}">${ele.name}</label>
//         //   </div>

//         //     `;
//         //   })
//         //   .join("")}
//         // `;

//         // mandi_districtDropdownControl();
//       } catch (error) {
//         console.log(error);
//         const errorMessage = handleApiError(error);
//         alert(errorMessage);
//         console.log(errorMessage);
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

async function showCompanyLocationDetails() {
  try {
    // ------------------------------------------------for showing info page for a company location----------------------------------------------------

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

async function showCompanyFactoryDetails() {
  try {
    // ------------------------------------------------for showing info page for a company location----------------------------------------------------

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

async function showCompanyTraderDetails() {
  try {
    // ------------------------------------------------for showing info page for a company trader----------------------------------------------------

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

window.addEventListener("DOMContentLoaded", async () => {
  try {
    //------------------------------- manage account data handling-------------------------------
    if (tab === "manageAccount") {
      if (menu === "companyLocation") {
        // updateUserLocation();
        showCompanyLocationDetails();
      }
      if (menu === "companyFactory") {
        // updateUserLocation();
        showCompanyFactoryDetails();
      }
      if (menu === "companyTrader") {
        // updateUserLocation();
        showCompanyTraderDetails();
      }
    }
  } catch (error) {
    errorHandler(error);
  }
});
