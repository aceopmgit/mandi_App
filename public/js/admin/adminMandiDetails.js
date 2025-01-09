const token = localStorage.getItem("adminToken");

// modal close
function modalControl() {
  const modalClose = document.getElementById("modal_close");
  modalClose.addEventListener("click", () => {
    document.getElementById("modal_container").classList.remove("show");
  });
}

// ------------------------side-menu-state data handling------------------------
const states = document.getElementById("states");
states.addEventListener("click", showStates);

async function showStates(e) {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";
    const children = e.target.parentElement.parentElement.children;

    for (let i = 0; i < children.length; i++) {
      children[i].children[0].style.backgroundColor = "white";
    }
    e.currentTarget.children[0].style.backgroundColor = "#ccc";
    localStorage.setItem("side_menu_tab", "states");

    const main_section_container = document.getElementById(
      "main_section_container"
    );
    // main_section_container.style.display = "flex";
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
    addButton.addEventListener("click", () => {
      // console.log("hio");
      window.location.href = `/admin/viewMenuItemDetails?tab=mandiDetails&menu=state&method=add&id=null`;
    });

    //---------------------------------------------------- for showing state list----------------------------------------------------
    const res = await axios.get(`/admin/getStates`, {
      headers: { Authorization: token },
    });
    spinner.style.visibility = "hidden";

    // console.log(res);

    if (res.data.stateDetails.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
      <div style="margin: auto">
            <h1 style="font-size: 2.5rem; font-weight: 400;">No States Added.</h1>
        </div>`;
      return;
    }

    const stateIndexTitle = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
    <li>State Name</li>
    <li>Created Date</li>
    `);
    const stateData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = res.data.stateDetails
      .map((data) => {
        return `
        
      <ul class="main_section_data_part" id=${data.id}>
<li>${data.name}</li>
<li>${data.createdAt}</li>
      </ul>
      `;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a state----------------------------------------------------
    const stateList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );
    stateList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        console.log(e.currentTarget.id, e.currentTarget);

        window.location.href = `/admin/viewMenuItemDetails?tab=mandiDetails&menu=state&method=view&id=${e.currentTarget.id}`;
        // const res = await axios.get("", {
        //   headers: { Authorization: token },
        //   params: {
        //     menu: "states",
        //     id: e.currentTarget.id,
        //   },
        // });

        //     const addContentForm = document.getElementById("addContentForm");
        //     addContentForm.style.visibility = "visible";
        //     const spinner = document.getElementById("loading_spinner");
        //     spinner.style.visibility = "visible";

        //     const res = await axios.get(`/admin/getStates/${e.currentTarget.id}`, {
        //       headers: { Authorization: token },
        //     });
        //     spinner.style.visibility = "hidden";
        //     console.log(res.data.stateDetails);
        //     const state = res.data.stateDetails;

        //     addContentForm.innerHTML = `
        //         <div id="showDetails">
        //   <div class="showDetails_header">
        //     <h1>State Details</h1>
        //     <div class="showDetails_buttons">
        //       <button class="editBtn" id="editStateBtn" data-id=${
        //         state.id
        //       }>Edit</button>
        //       <button class="deleteBtn" id="deleteStateBtn" data-id=${
        //         state.id
        //       }>Delete</button>
        //     </div>
        //   </div>
        //   <div class="showDetails_content">
        //     <div class="showDetails_content_row">
        //       <h2>Name</h2>
        //       <p>${state.name}</p>
        //     </div>
        //     <div class="showDetails_content_row">
        //       <h2>Created At</h2>
        //       <p>${new Date(state.createdAt).toISOString().split("T")[0]}</p>
        //     </div>
        //     <div class="showDetails_content_row">
        //       <h2>Updated At</h2>
        //       <p>${new Date(state.updatedAt).toISOString().split("T")[0]}</p>
        //     </div>
        //   </div>
        // </div>
        //     `;
        //---------------------------------------------------- for showing edit page for a state----------------------------------------------------
        //         document
        //           .getElementById("editStateBtn")
        //           .addEventListener("click", async (Event) => {
        //             const addContentForm = document.getElementById("addContentForm");
        //             addContentForm.style.visibility = "visible";
        //             const spinner = document.getElementById("loading_spinner");
        //             spinner.style.visibility = "visible";

        //             const stateId = Event.currentTarget.dataset.id;

        //             const res = await axios.get(`/admin/getStates/${stateId}`, {
        //               headers: { Authorization: token },
        //             });
        //             spinner.style.visibility = "hidden";
        //             console.log(res.data.stateDetails);
        //             const state = res.data.stateDetails;
        //             console.log(state);

        //             addContentForm.innerHTML = `
        // <form id="editStateForm">
        // <div class="form_header">
        // <h1>Edit State</h1>
        // <div class="form_buttons">
        //   <button id="cancelBtn" type="button">Cancel</button>
        //   <button
        //     class="submitBtn"
        //     id="editStateButn"
        //     type="submit"
        //     form="editStateForm"
        //   >
        //     Save
        //   </button>
        // </div>
        // </div>
        // <div class="form_content">
        // <div class="form_control">
        //   <label for="stateName">Enter State</label>
        //   <input
        //     type="text"
        //     id="stateName"
        //     name="stateName"
        //     placeholder="Enter State Name"
        //     value="${state.name}"
        //     required
        //   />
        //   <br />
        // </div>
        // </div>
        // </form>`;

        //             document
        //               .getElementById("cancelBtn")
        //               .addEventListener("click", (e) => {
        //                 document
        //                   .getElementById(localStorage.getItem("side_menu_tab"))
        //                   .click();
        //               });

        //             const editStateForm = document.getElementById("editStateForm");
        //             editStateForm.addEventListener("submit", async (e) => {
        //               try {
        //                 e.preventDefault();
        //                 const spinner = document.getElementById("loading_spinner");
        //                 spinner.style.visibility = "visible";

        //                 const formdata = new FormData(e.target);
        //                 const data = {};
        //                 formdata.forEach((value, key) => {
        //                   data[key] = value;
        //                 });

        //                 const res = await axios.post(
        //                   `/admin/updateStateDetails/${stateId}`,
        //                   data,
        //                   {
        //                     headers: {
        //                       Authorization: token,
        //                     },
        //                   }
        //                 );
        //                 spinner.style.visibility = "visible";
        //                 document
        //                   .getElementById(localStorage.getItem("side_menu_tab"))
        //                   .click();
        //               } catch (error) {
        //                 console.log(error);
        //               }
        //             });
        //           });

        //         // ----------------------------------------------------for showing delete state dialog box----------------------------------------------------
        //         document
        //           .getElementById("deleteStateBtn")
        //           .addEventListener("click", (e) => {
        //             console.log(";hello from modal");
        //             const modal_container = document.getElementById("modal_container");
        //             console.log(modal_container);
        //             document.getElementById(
        //               "modal_title"
        //             ).innerHTML = `Are you sure you want to delete this State ?`;

        //             modal_container.classList.add("show");
        //             document
        //               .getElementById("modal_action_button")
        //               .addEventListener("click", async (e) => {
        //                 try {
        //                   const spinner = document.getElementById("loading_spinner");
        //                   spinner.style.visibility = "visible";
        //                   const stateId = deleteStateBtn.dataset.id;
        //                   const response = await axios.delete(
        //                     `/admin/deleteState/${stateId}`,
        //                     {
        //                       headers: { Authorization: token },
        //                     }
        //                   );
        //                   spinner.style.visibility = "hidden";
        //                   document.getElementById("modal_close").click();
        //                   document
        //                     .getElementById(localStorage.getItem("side_menu_tab"))
        //                     .click();
        //                 } catch (err) {
        //                   console.log(err);
        //                 }
        //               });
        //           });
      });
    });
  } catch (error) {
    console.log(error);
    // console.log(error.response.data.error);
    if (error.response.data.error === "jwt expired") {
      alert("Your Session has expired ! Please Login Again");
      window.location.href = "/admin/";
      localStorage.removeItem("adminToken");
    }
  }
}

// ------------------------side-menu-district data handling------------------------
const district = document.getElementById("district");
district.addEventListener("click", showDistrict);

async function showDistrict(e) {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const children = e.target.parentElement.parentElement.children;

    for (let i = 0; i < children.length; i++) {
      children[i].children[0].style.backgroundColor = "white";
    }
    e.currentTarget.children[0].style.backgroundColor = "#ccc";
    localStorage.setItem("side_menu_tab", "district");

    const main_section_container = document.getElementById(
      "main_section_container"
    );

    // getting state details
    const res = await axios.get(`/admin/getStates`, {
      headers: { Authorization: token },
    });
    spinner.style.visibility = "hidden";

    // console.log(res);

    const states = res.data.stateDetails;

    if (states.length < 1) {
      main_section_container.innerHTML = `
      <div style="margin: auto">
            <h1 style="font-size: 2.5rem; font-weight: 400;">No States Added.Please add states to add and view districts.</h1>
        </div>`;
      return;
    }

    main_section_container.innerHTML = `
    <div class="selection_area" data-id="stateSelectionArea">
            <div class="select_box" data-id="selectBox">
              <div class="option_container" data-id="stateOptionContainer">
              ${states
                .map((ele) => {
                  return `
                  <div class="option" data-id="stateOption">
                  <input
                    type="radio"
                    class="radio"
                    name=""
                    id="${ele.id}"
                  />
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
          </div>

<div class="content_section">
            
          </div>


    
    `;

    district_stateDropdownControl();
  } catch (error) {
    console.log(error);
    // console.log(error.response.data.error);
    if (error && error.response.data.error === "jwt expired") {
      alert("Your Session has expired ! Please Login Again");
      window.location.href = "/admin/";
      localStorage.removeItem("adminToken");
    }
  }
}

function district_stateDropdownControl() {
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

        //---------------------------------------------------- for showing district list----------------------------------------------------
        const res = await axios.get(`/admin/getDistricts?stateId=${id}`, {
          headers: { Authorization: token },
        });
        spinner.style.visibility = "hidden";

        // const content_section =
        //   document.getElementsByClassName("content_section")[0];
        const main_section_container = document.getElementById(
          "main_section_container"
        );

        main_section_container.innerHTML = `
        <div class="create_btn_div">
        <button id="goBack" class='backBtn'>
            <i class="fa fa-arrow-left" aria-hidden="true"></i> Go Back
          </button>
                <button class="submitBtn" id="addDistrict">Add</button>
              </div>
  
              <div class="main_section_content" id="district_main_content">
                <ul class="main_section_title"></ul>
                <div class="main_section_data"></div>
              </div>
        `;

        // back button code
        document.getElementById("goBack").addEventListener("click", () => {
          document
            .getElementById(localStorage.getItem("side_menu_tab"))
            .click();
        });

        // for adding district details
        const addButton = document.getElementById("addDistrict");
        addButton.addEventListener("click", () => {
          // console.log("hio");
          window.location.href = `/admin/viewMenuItemDetails?tab=mandiDetails&menu=district&method=add&stateId=${id}`;
        });

        const district = res.data.districtDetails;

        if (district.length < 1) {
          document.getElementById("district_main_content").innerHTML = `
        <div style="margin: auto">
              <h1 style="font-size: 2.5rem; font-weight: 400;">No district Added.</h1>
          </div>`;
          return;
        }

        const districtIndexTitle = (document.getElementsByClassName(
          "main_section_title"
        )[0].innerHTML = `
        <li>District Name</li>
        <li>State Name</li>
        <li>Created Date</li>
        `);

        const districtData = (document.getElementsByClassName(
          "main_section_data"
        )[0].innerHTML = district
          .map((data) => {
            return `
            
          <ul class="main_section_data_part" id=${data.id}>
    <li>${data.name}</li>
    <li>${data.state.name}</li>
    <li>${data.createdAt}</li>
          </ul>
          `;
          })
          .join(""));

        //----------------------------------------------------for showing details page of a district----------------------------------------------------
        const districtList = Array.from(
          document.getElementsByClassName("main_section_data_part")
        );

        districtList.map((ele) => {
          ele.addEventListener("click", (e) => {
            window.location.href = `/admin/viewMenuItemDetails?tab=mandiDetails&menu=district&method=view&id=${e.currentTarget.id}`;
          });
        });
      } catch (error) {
        console.log(error);
        if (error.response.data.error === "jwt expired") {
          alert("Your Session has expired ! Please Login Again");
          window.location.href = "/admin/";
          localStorage.removeItem("adminToken");
        }
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

// ------------------------side-menu-mandi data handling------------------------
const mandi = document.getElementById("mandi");
mandi.addEventListener("click", showMandi);

async function showMandi(e) {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const children = e.target.parentElement.parentElement.children;

    for (let i = 0; i < children.length; i++) {
      children[i].children[0].style.backgroundColor = "white";
    }
    e.currentTarget.children[0].style.backgroundColor = "#ccc";
    localStorage.setItem("side_menu_tab", "mandi");

    const main_section_container = document.getElementById(
      "main_section_container"
    );

    // getting state details
    const res = await axios.get(`/admin/getStates`, {
      headers: { Authorization: token },
    });
    spinner.style.visibility = "hidden";

    // console.log(res);

    const states = res.data.stateDetails;

    if (states.length < 1) {
      main_section_container.innerHTML = `
      <div style="margin: auto">
            <h1 style="font-size: 2.5rem; font-weight: 400;">No States Added.Please add states to add and view mandi.</h1>
        </div>`;
      return;
    }

    main_section_container.innerHTML = `
    <div class="selection_area" data-id="stateSelectionArea">
            <div class="select_box" data-id="selectStateBox">
              <div class="option_container" data-id="stateOptionContainer">
              ${states
                .map((ele) => {
                  return `
                  <div class="option" data-id="stateOption">
                  <input
                    type="radio"
                    class="radio"
                    name=""
                    id="${ele.id}"
                  />
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
            <br>
            <div class="select_box" data-id="selectDistrictBox">
              <div class="option_container" data-id="districtOptionContainer">
              
              </div>

              <div class="selected" data-id="districtSelected">Please select a state to view district</div>
              <div class="search_box" data-id="districtSearchBox">
                <input type="text" placeholder="Start Typing....." /
                id="district_search_box_input">
              </div>
              
            </div>
          </div>

<div class="content_section">
            
          </div>


    
    `;

    mandi_stateDropdownControl();
  } catch (error) {
    console.log(error);
    // console.log(error.response.data.error);
    if (error && error.response.data.error === "jwt expired") {
      alert("Your Session has expired ! Please Login Again");
      window.location.href = "/admin/";
      localStorage.removeItem("adminToken");
    }
  }
}

function mandi_stateDropdownControl() {
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

        //---------------------------------------------------- for showing district list----------------------------------------------------
        const res = await axios.get(`/admin/getDistricts?stateId=${id}`, {
          headers: { Authorization: token },
        });
        spinner.style.visibility = "hidden";

        // const content_section =
        //   document.getElementsByClassName("content_section")[0];
        const main_section_container = document.getElementById(
          "main_section_container"
        );

        const district = res.data.districtDetails;
        const districtOptionContainer = document.querySelector(
          '[data-id="districtOptionContainer"]'
        );

        if (district.length < 1) {
          alert("No district Added for the state");
          mandi.click();

          return;
        }

        console.log(district, districtOptionContainer);

        districtOptionContainer.innerHTML = `
        ${district
          .map((ele) => {
            return `
            <div class="option" data-id="districtOption">
            <input
              type="radio"
              class="radio"
              name=""
              id="${ele.id}"
            />
            <label for="${ele.name}">${ele.name}</label>
          </div>
            
            `;
          })
          .join("")}
        `;

        mandi_districtDropdownControl();
      } catch (error) {
        console.log(error);
        if (error.response.data.error === "jwt expired") {
          alert("Your Session has expired ! Please Login Again");
          window.location.href = "/admin/";
          localStorage.removeItem("adminToken");
        }
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

function mandi_districtDropdownControl() {
  const selected = document.querySelector('[data-id="districtSelected"]');
  // const districtSelected = document.querySelector(
  //   '[data-id="districtSelected"]'
  // );
  const option_container = document.querySelector(
    '[data-id="districtOptionContainer"]'
  );
  const optionsList = Array.from(
    document.querySelectorAll('[data-id="districtOption"]')
  );
  const searchBox = document.getElementById("district_search_box_input");
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

        //---------------------------------------------------- for showing mandi list of a district----------------------------------------------------
        const res = await axios.get(`/admin/getMandis?districtId=${id}`, {
          headers: { Authorization: token },
        });
        spinner.style.visibility = "hidden";

        const main_section_container = document.getElementById(
          "main_section_container"
        );

        const mandiList = res.data.mandiDetails;

        main_section_container.innerHTML = `
        <div class="create_btn_div">
        <button id="goBack" class='backBtn'>
            <i class="fa fa-arrow-left" aria-hidden="true"></i> Go Back
          </button>
                <button class="submitBtn" id="addMandi">Add</button>
              </div>
  
              <div class="main_section_content" id="district_main_content">
                <ul class="main_section_title"></ul>
                <div class="main_section_data"></div>
              </div>
        `;

        // back button code
        document.getElementById("goBack").addEventListener("click", () => {
          document
            .getElementById(localStorage.getItem("side_menu_tab"))
            .click();
        });

        // for adding district details
        const addButton = document.getElementById("addMandi");
        addButton.addEventListener("click", () => {
          // console.log("hio");
          window.location.href = `/admin/viewMenuItemDetails?tab=mandiDetails&menu=mandi&method=add&districtId=${id}`;
        });

        if (mandiList.length < 1) {
          document.getElementById("district_main_content").innerHTML = `
        <div style="margin: auto">
              <h1 style="font-size: 2.5rem; font-weight: 400;">No mandi added for the district of the state</h1>
          </div>`;
          return;
        }

        const MandiIndexTitle = (document.getElementsByClassName(
          "main_section_title"
        )[0].innerHTML = `
        <li>Mandi Name</li>
        <li>District Name</li>
        <li>State Name</li>
        <li>Created Date</li>
        `);

        const mandiData = (document.getElementsByClassName(
          "main_section_data"
        )[0].innerHTML = mandiList
          .map((data) => {
            return `
            
          <ul class="main_section_data_part" id=${data.id}>
    <li>${data.name}</li>
    <li>${data.district}</li>
    <li>${data.state}</li>
    <li>${data.createdAt}</li>
          </ul>
          `;
          })
          .join(""));

        //----------------------------------------------------for showing details page of a mandi----------------------------------------------------
        const districtList = Array.from(
          document.getElementsByClassName("main_section_data_part")
        );

        districtList.map((ele) => {
          ele.addEventListener("click", (e) => {
            window.location.href = `/admin/viewMenuItemDetails?tab=mandiDetails&menu=mandi&method=view&id=${e.currentTarget.id}`;
          });
        });
      } catch (error) {
        console.log(error);
        if (error.response.data.error === "jwt expired") {
          alert("Your Session has expired ! Please Login Again");
          window.location.href = "/admin/";
          localStorage.removeItem("adminToken");
        }
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

// ------------------------side-menu-mandi data handling------------------------
const depot = document.getElementById("depot");
depot.addEventListener("click", showDepot);

async function showDepot(e) {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const children = e.target.parentElement.parentElement.children;

    for (let i = 0; i < children.length; i++) {
      children[i].children[0].style.backgroundColor = "white";
    }
    e.currentTarget.children[0].style.backgroundColor = "#ccc";
    localStorage.setItem("side_menu_tab", "depot");

    const main_section_container = document.getElementById(
      "main_section_container"
    );

    // getting state details
    const res = await axios.get(`/admin/getStates`, {
      headers: { Authorization: token },
    });
    spinner.style.visibility = "hidden";

    // console.log(res);

    const states = res.data.stateDetails;

    if (states.length < 1) {
      main_section_container.innerHTML = `
      <div style="margin: auto">
            <h1 style="font-size: 2.5rem; font-weight: 400;">No States Added.Please add states to add and view mandi.</h1>
        </div>`;
      return;
    }

    main_section_container.innerHTML = `
    <div class="selection_area" data-id="stateSelectionArea">
            <div class="select_box" data-id="selectStateBox">
              <div class="option_container" data-id="stateOptionContainer">
              ${states
                .map((ele) => {
                  return `
                  <div class="option" data-id="stateOption">
                  <input
                    type="radio"
                    class="radio"
                    name=""
                    id="${ele.id}"
                  />
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
            <br>
            <div class="select_box" data-id="selectDistrictBox">
              <div class="option_container" data-id="districtOptionContainer">
              
              </div>

              <div class="selected" data-id="districtSelected">Please select a state to view district</div>
              <div class="search_box" data-id="districtSearchBox">
                <input type="text" placeholder="Start Typing....." /
                id="district_search_box_input">
              </div>
              
            </div>
          </div>

<div class="content_section">
            
          </div>


    
    `;

    depot_stateDropdownControl();
  } catch (error) {
    console.log(error);
    // console.log(error.response.data.error);
    if (error && error.response.data.error === "jwt expired") {
      alert("Your Session has expired ! Please Login Again");
      window.location.href = "/admin/";
      localStorage.removeItem("adminToken");
    }
  }
}

function depot_stateDropdownControl() {
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

        //---------------------------------------------------- for showing district list----------------------------------------------------
        const res = await axios.get(`/admin/getDistricts?stateId=${id}`, {
          headers: { Authorization: token },
        });
        spinner.style.visibility = "hidden";

        // const content_section =
        //   document.getElementsByClassName("content_section")[0];
        const main_section_container = document.getElementById(
          "main_section_container"
        );

        const district = res.data.districtDetails;
        const districtOptionContainer = document.querySelector(
          '[data-id="districtOptionContainer"]'
        );

        if (district.length < 1) {
          alert("No district Added for the state");
          depot.click();

          return;
        }

        console.log(district, districtOptionContainer);

        districtOptionContainer.innerHTML = `
        ${district
          .map((ele) => {
            return `
            <div class="option" data-id="districtOption">
            <input
              type="radio"
              class="radio"
              name=""
              id="${ele.id}"
            />
            <label for="${ele.name}">${ele.name}</label>
          </div>
            
            `;
          })
          .join("")}
        `;

        depot_districtDropdownControl();
      } catch (error) {
        console.log(error);
        if (error.response.data.error === "jwt expired") {
          alert("Your Session has expired ! Please Login Again");
          window.location.href = "/admin/";
          localStorage.removeItem("adminToken");
        }
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

function depot_districtDropdownControl() {
  const selected = document.querySelector('[data-id="districtSelected"]');
  // const districtSelected = document.querySelector(
  //   '[data-id="districtSelected"]'
  // );
  const option_container = document.querySelector(
    '[data-id="districtOptionContainer"]'
  );
  const optionsList = Array.from(
    document.querySelectorAll('[data-id="districtOption"]')
  );
  const searchBox = document.getElementById("district_search_box_input");
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

        //---------------------------------------------------- for showing mandi list of a district----------------------------------------------------
        const res = await axios.get(`/admin/getDepots?districtId=${id}`, {
          headers: { Authorization: token },
        });
        spinner.style.visibility = "hidden";

        const main_section_container = document.getElementById(
          "main_section_container"
        );

        const depotList = res.data.depotDetails;

        main_section_container.innerHTML = `
        <div class="create_btn_div">
        <button id="goBack" class='backBtn'>
            <i class="fa fa-arrow-left" aria-hidden="true"></i> Go Back
          </button>
                <button class="submitBtn" id="addDepot">Add</button>
              </div>
  
              <div class="main_section_content" id="district_main_content">
                <ul class="main_section_title"></ul>
                <div class="main_section_data"></div>
              </div>
        `;

        // back button code
        document.getElementById("goBack").addEventListener("click", () => {
          document
            .getElementById(localStorage.getItem("side_menu_tab"))
            .click();
        });

        // for adding district details
        const addButton = document.getElementById("addDepot");
        addButton.addEventListener("click", () => {
          // console.log("hio");
          window.location.href = `/admin/viewMenuItemDetails?tab=mandiDetails&menu=depot&method=add&districtId=${id}`;
        });

        if (depotList.length < 1) {
          document.getElementById("district_main_content").innerHTML = `
        <div style="margin: auto">
              <h1 style="font-size: 2.5rem; font-weight: 400;">No depot added for the district of the state</h1>
          </div>`;
          return;
        }

        const depotIndexTitle = (document.getElementsByClassName(
          "main_section_title"
        )[0].innerHTML = `
        <li>Depot Name</li>
        <li>District Name</li>
        <li>State Name</li>
        <li>Created Date</li>
        `);

        const depotData = (document.getElementsByClassName(
          "main_section_data"
        )[0].innerHTML = depotList
          .map((data) => {
            return `
            
          <ul class="main_section_data_part" id=${data.id}>
    <li>${data.name}</li>
    <li>${data.district}</li>
    <li>${data.state}</li>
    <li>${data.createdAt}</li>
          </ul>
          `;
          })
          .join(""));

        //----------------------------------------------------for showing details page of a mandi----------------------------------------------------
        const districtList = Array.from(
          document.getElementsByClassName("main_section_data_part")
        );

        districtList.map((ele) => {
          ele.addEventListener("click", (e) => {
            window.location.href = `/admin/viewMenuItemDetails?tab=mandiDetails&menu=depot&method=view&id=${e.currentTarget.id}`;
          });
        });
      } catch (error) {
        console.log(error);
        if (error.response.data.error === "jwt expired") {
          alert("Your Session has expired ! Please Login Again");
          window.location.href = "/admin/";
          localStorage.removeItem("adminToken");
        }
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

// ------------------------page reload data handling------------------------
window.addEventListener("DOMContentLoaded", async () => {
  document.getElementById(localStorage.getItem("side_menu_tab")).click();
});
