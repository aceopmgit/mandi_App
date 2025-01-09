const token = localStorage.getItem("adminToken");

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
  document.getElementById(tab).click();
});

function modalControl() {
  const modalClose = document.getElementById("modal_close");
  modalClose.addEventListener("click", () => {
    document.getElementById("modal_container").classList.remove("show");
  });
}

// ----------------------------------------------------handling state data ----------------------------------------------------
function addState() {
  console.log("hello");
  const details_section_content = document.getElementById(
    "details_section_content"
  );
  document.getElementById("menu_title").innerHTML = `Add State`;
  document.getElementById("button_container").innerHTML = `
              <button id='saveState' class="editBtn" type="submit"
            form="addStateForm">Save</button>
          <button id='cancelAddButton' class="cancelBtn">Cancel</button>
    `;

  details_section_content.innerHTML = `
      <form id="addStateForm">
      <div class="form_content">
        <div class="form_control">
          <label for="stateName">Enter State</label>
          <input
            type="text"
            id="stateName"
            name="stateName"
            placeholder="Enter State Name"
            required
          />
          <br />
        </div>
      </div>
    </form>
      `;

  document
    .getElementById("addStateForm")
    .addEventListener("submit", async (e) => {
      try {
        e.preventDefault();
        // console.log("hello");

        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const formdata = new FormData(e.target);
        const data = {};
        formdata.forEach((value, key) => {
          data[key] = value;
        });

        console.log(data);

        const res = await axios.post(`/admin/addState`, data, {
          headers: {
            Authorization: token,
          },
        });
        document.getElementById("mandiDetails").click();
        // document.getElementById("states").click();
      } catch (error) {
        console.log(error);
        if (error.response.data.error === "jwt expired") {
          alert("Your Session has expired ! Please Login Again");
          window.location.href = "/admin/";
          localStorage.removeItem("adminToken");
        }
      }
    });

  document.getElementById("cancelAddButton").addEventListener("click", () => {
    document.getElementById("mandiDetails").click();
  });
}

async function showStateDetails() {
  try {
    // ------------------------------------------------for showing info page for a state----------------------------------------------------
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";
    console.log(id);

    const res = await axios.get(`/admin/getStates/${id}`, {
      headers: { Authorization: token },
    });

    const state = res.data.stateDetails;
    spinner.style.visibility = "hidden";
    console.log(state);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `State Details`;
    document.getElementById("button_container").innerHTML = `
              <button id='editState' class="editBtn">Edit</button>
          <button id="deleteState" class="deleteBtn">Delete</button>
    `;

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>Name</h2>
               <p>${state.name}</p>
             </div>
             <div class="details_section_row">
               <h2>Created At</h2>
               <p>${state.createdAt}</p>
             </div>
             <div class="details_section_row">
               <h2>Updated At</h2>
               <p>${state.updatedAt}</p>
             </div>
    `;

    // ------------------------------------------------for showing edit page for a state----------------------------------------------------
    document.getElementById("editState").addEventListener("click", () => {
      // const spinner = document.getElementById("loading_spinner");
      // spinner.style.visibility = "visible";

      document.getElementById("menu_title").innerHTML = `Edit State Details`;

      document.getElementById("button_container").innerHTML = `
              <button id='saveState' class="editBtn" type="submit"
            form="editStateForm">Save</button>
          <button onClick="showStateDetails()" class="cancelBtn">Cancel</button>
    `;

      // const res = await axios.get(`/admin/getStates/${id}`, {
      //   headers: { Authorization: token },
      // });

      details_section_content.innerHTML = `
      <form id="editStateForm">
      <div class="form_content">
        <div class="form_control">
          <label for="stateName">Enter State</label>
          <input
            type="text"
            id="stateName"
            name="stateName"
            placeholder="Enter State Name"
            value="${state.name}"
            required
          />
          <br />
        </div>
      </div>
    </form>
      `;

      // ---------------------------------------------------- for updating state info----------------------------------------------------
      document
        .getElementById("editStateForm")
        .addEventListener("submit", async (e) => {
          try {
            e.preventDefault();
            console.log("hello");

            const spinner = document.getElementById("loading_spinner");
            spinner.style.visibility = "visible";

            const formdata = new FormData(e.target);
            const data = {};
            formdata.forEach((value, key) => {
              data[key] = value;
            });

            console.log(data);

            const res = await axios.post(
              `/admin/updateStateDetails/${id}`,
              data,
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            showStateDetails(id);
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

    // ------------------------------------------------for deleting a state info----------------------------------------------------

    document.getElementById("deleteState").addEventListener("click", (e) => {
      // console.log(";hello from modal");
      const modal_container = document.getElementById("modal_container");
      console.log(modal_container);
      document.getElementById(
        "modal_title"
      ).innerHTML = `Are you sure you want to delete this State ?`;

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
            const response = await axios.delete(`/admin/deleteState/${id}`, {
              headers: { Authorization: token },
            });
            spinner.style.visibility = "hidden";
            document.getElementById("modal_close").click();
            document.getElementById("mandiDetails").click();
          } catch (err) {
            console.log(err);
          }
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
}

// ----------------------------------------------------handling district data ----------------------------------------------------
function addDistrict() {
  const stateId = params.get("stateId");
  const details_section_content = document.getElementById(
    "details_section_content"
  );
  document.getElementById("menu_title").innerHTML = `Add District`;
  document.getElementById("button_container").innerHTML = `
              <button id='saveDistrict' class="editBtn" type="submit"
            form="addDistrictForm">Save</button>
          <button id='cancelAddButton' class="cancelBtn">Cancel</button>
    `;

  details_section_content.innerHTML = `
      <form id="addDistrictForm">
      <div class="form_content">
        <div class="form_control">
          <label for="districtName">Enter District </label>
          <input
            type="text"
            id="districtName"
            name="districtName"
            placeholder="Enter District Name"
            required
          />
          <br />
        </div>
      </div>
    </form>
      `;

  document
    .getElementById("addDistrictForm")
    .addEventListener("submit", async (e) => {
      try {
        e.preventDefault();
        // console.log("hello");

        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const formdata = new FormData(e.target);
        const data = {};
        formdata.forEach((value, key) => {
          data[key] = value;
        });

        data["stateId"] = stateId;

        console.log(data);

        const res = await axios.post(`/admin/addDistrict`, data, {
          headers: {
            Authorization: token,
          },
        });
        document.getElementById("mandiDetails").click();
        // document.getElementById("states").click();
      } catch (error) {
        console.log(error);
        if (error.response.data.error === "jwt expired") {
          alert("Your Session has expired ! Please Login Again");
          window.location.href = "/admin/";
          localStorage.removeItem("adminToken");
        }
      }
    });

  document.getElementById("cancelAddButton").addEventListener("click", () => {
    document.getElementById("mandiDetails").click();
  });
}

async function showDistrictDetails() {
  try {
    // ------------------------------------------------for showing info page for a district----------------------------------------------------
    console.log("in the show district");
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(`/admin/getDistricts?id=${id}`, {
      headers: { Authorization: token },
    });

    const district = res.data.districtDetails;
    spinner.style.visibility = "hidden";
    console.log(district);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `District Details`;
    document.getElementById("button_container").innerHTML = `
              <button id='editDistrict' class="editBtn">Edit</button>
          <button id="deleteDistrict" class="deleteBtn">Delete</button>
    `;

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>District Name</h2>
               <p>${district.name}</p>
             </div>
             <div class="details_section_row">
         <h2>State Name</h2>
               <p>${district.stateName}</p>
             </div>
             <div class="details_section_row">
               <h2>Created At</h2>
               <p>${district.createdAt}</p>
             </div>
             <div class="details_section_row">
               <h2>Updated At</h2>
               <p>${district.updatedAt}</p>
             </div>
    `;

    // ------------------------------------------------for showing edit page for a state----------------------------------------------------
    document.getElementById("editDistrict").addEventListener("click", () => {
      // const spinner = document.getElementById("loading_spinner");
      // spinner.style.visibility = "visible";

      document.getElementById("menu_title").innerHTML = `Edit District Details`;

      document.getElementById("button_container").innerHTML = `
              <button id='saveDistrict' class="editBtn" type="submit"
            form="editDistrictForm">Save</button>
          <button onClick="showDistrictDetails()" class="cancelBtn">Cancel</button>
    `;

      // const res = await axios.get(`/admin/getStates/${id}`, {
      //   headers: { Authorization: token },
      // });

      details_section_content.innerHTML = `
      <form id="editDistrictForm">
      <div class="form_content">
        <div class="form_control">
          <label for="districtName">Enter District</label>
          <input
            type="text"
            id="districtName"
            name="districtName"
            placeholder="Enter District Name"
            value="${district.name}"
            required
          />
          <br />
        </div>
      </div>
    </form>
      `;

      // ---------------------------------------------------- for updating state info----------------------------------------------------
      document
        .getElementById("editDistrictForm")
        .addEventListener("submit", async (e) => {
          try {
            e.preventDefault();
            console.log("hello");

            const spinner = document.getElementById("loading_spinner");
            spinner.style.visibility = "visible";

            const formdata = new FormData(e.target);
            const data = {};
            formdata.forEach((value, key) => {
              data[key] = value;
            });

            console.log(data);

            const res = await axios.post(
              `/admin/updateDistrictDetails/${id}`,
              data,
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            showDistrictDetails(id);
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

    // ------------------------------------------------for deleting a state info----------------------------------------------------

    document.getElementById("deleteDistrict").addEventListener("click", (e) => {
      // console.log(";hello from modal");
      const modal_container = document.getElementById("modal_container");
      console.log(modal_container);
      document.getElementById(
        "modal_title"
      ).innerHTML = `Are you sure you want to delete this district of ${district.stateName} ?`;

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
            const response = await axios.delete(`/admin/deleteDistrict/${id}`, {
              headers: { Authorization: token },
            });
            spinner.style.visibility = "hidden";
            document.getElementById("modal_close").click();
            document.getElementById("mandiDetails").click();
          } catch (err) {
            console.log(err);
          }
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
}

// ----------------------------------------------------handling mandi data ----------------------------------------------------
function addMandi() {
  const districtId = params.get("districtId");
  const details_section_content = document.getElementById(
    "details_section_content"
  );
  document.getElementById("menu_title").innerHTML = `Add Mandi`;
  document.getElementById("button_container").innerHTML = `
              <button id='saveMandi' class="editBtn" type="submit"
            form="addMandiForm">Save</button>
          <button id='cancelAddButton' class="cancelBtn">Cancel</button>
    `;

  details_section_content.innerHTML = `
      <form id="addMandiForm">
      <div class="form_content">
        <div class="form_control">
          <label for="mandiName">Enter Mandi Name </label>
          <input
            type="text"
            id="mandiName"
            name="mandiName"
            placeholder="Enter Mandi Name"
            required
          />
          <br />
        </div>
      </div>
    </form>
      `;

  document
    .getElementById("addMandiForm")
    .addEventListener("submit", async (e) => {
      try {
        e.preventDefault();
        // console.log("hello");

        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const formdata = new FormData(e.target);
        const data = {};
        formdata.forEach((value, key) => {
          data[key] = value;
        });

        data["districtId"] = districtId;

        console.log(data);

        const res = await axios.post(`/admin/addMandi`, data, {
          headers: {
            Authorization: token,
          },
        });
        document.getElementById("mandiDetails").click();
        // document.getElementById("states").click();
      } catch (error) {
        console.log(error);
        if (error.response.data.error === "jwt expired") {
          alert("Your Session has expired ! Please Login Again");
          window.location.href = "/admin/";
          localStorage.removeItem("adminToken");
        }
      }
    });

  document.getElementById("cancelAddButton").addEventListener("click", () => {
    document.getElementById("mandiDetails").click();
  });
}

async function showMandiDetails() {
  try {
    // ------------------------------------------------for showing info page for a mandi----------------------------------------------------
    console.log("in the show district");
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(`/admin/getMandis?id=${id}`, {
      headers: { Authorization: token },
    });

    const mandi = res.data.mandiDetails;
    spinner.style.visibility = "hidden";
    console.log(mandi);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Mandi Details`;
    document.getElementById("button_container").innerHTML = `
              <button id='editMandi' class="editBtn">Edit</button>
          <button id="deleteMandi" class="deleteBtn">Delete</button>
    `;

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>Mandi Name</h2>
               <p>${mandi.name}</p>
             </div>
             <div class="details_section_row">
         <h2>District Name</h2>
               <p>${mandi.district}</p>
             </div>
             <div class="details_section_row">
         <h2>State Name</h2>
               <p>${mandi.state}</p>
             </div>
             <div class="details_section_row">
               <h2>Created At</h2>
               <p>${mandi.createdAt}</p>
             </div>
             <div class="details_section_row">
               <h2>Updated At</h2>
               <p>${mandi.updatedAt}</p>
             </div>
    `;

    // ------------------------------------------------for showing edit page for a mandi----------------------------------------------------
    document.getElementById("editMandi").addEventListener("click", () => {
      // const spinner = document.getElementById("loading_spinner");
      // spinner.style.visibility = "visible";

      document.getElementById("menu_title").innerHTML = `Edit Mandi Details`;

      document.getElementById("button_container").innerHTML = `
              <button id='saveMandi' class="editBtn" type="submit"
            form="editMandiForm">Save</button>
          <button onClick="showMandiDetails()" class="cancelBtn">Cancel</button>
    `;

      // const res = await axios.get(`/admin/getStates/${id}`, {
      //   headers: { Authorization: token },
      // });

      details_section_content.innerHTML = `
      <form id="editMandiForm">
      <div class="form_content">
        <div class="form_control">
          <label for="mandiName">Enter Mandi</label>
          <input
            type="text"
            id="mandiName"
            name="mandiName"
            placeholder="Enter Mandi Name"
            value="${mandi.name}"
            required
          />
          <br />
        </div>
      </div>
    </form>
      `;

      // ---------------------------------------------------- for updating depot info----------------------------------------------------
      document
        .getElementById("editMandiForm")
        .addEventListener("submit", async (e) => {
          try {
            e.preventDefault();
            // console.log("hello");

            const spinner = document.getElementById("loading_spinner");
            spinner.style.visibility = "visible";

            const formdata = new FormData(e.target);
            const data = {};
            formdata.forEach((value, key) => {
              data[key] = value;
            });

            console.log(data);

            const res = await axios.post(
              `/admin/updateMandiDetails/${id}`,
              data,
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            showMandiDetails(id);
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

    // ------------------------------------------------for deleting a depot info----------------------------------------------------

    document.getElementById("deleteMandi").addEventListener("click", (e) => {
      // console.log(";hello from modal");
      const modal_container = document.getElementById("modal_container");
      // console.log(modal_container);
      document.getElementById(
        "modal_title"
      ).innerHTML = `Are you sure you want to delete this mandi of ${mandi.district} district of ${mandi.state} ?`;

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
            const response = await axios.delete(`/admin/deleteMandi/${id}`, {
              headers: { Authorization: token },
            });
            spinner.style.visibility = "hidden";
            document.getElementById("modal_close").click();
            document.getElementById("mandiDetails").click();
          } catch (err) {
            console.log(err);
          }
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
}
// ----------------------------------------------------handling depot data ----------------------------------------------------
function addDepot() {
  const districtId = params.get("districtId");
  const details_section_content = document.getElementById(
    "details_section_content"
  );
  console.log(districtId, details_section_content);
  document.getElementById("menu_title").innerHTML = `Add Depot`;
  document.getElementById("button_container").innerHTML = `
              <button id='saveDepot' class="editBtn" type="submit"
            form="addDepotForm">Save</button>
          <button id='cancelAddButton' class="cancelBtn">Cancel</button>
    `;

  details_section_content.innerHTML = `
      <form id="addDepotForm">
      <div class="form_content">
        <div class="form_control">
          <label for="depotName">Enter Depot Name </label>
          <input
            type="text"
            id="depotName"
            name="depotName"
            placeholder="Enter Depot Name"
            required
          />
          <br />
        </div>
      </div>
    </form>
      `;

  document
    .getElementById("addDepotForm")
    .addEventListener("submit", async (e) => {
      try {
        e.preventDefault();
        // console.log("hello");

        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const formdata = new FormData(e.target);
        const data = {};
        formdata.forEach((value, key) => {
          data[key] = value;
        });

        data["districtId"] = districtId;

        console.log(data);

        const res = await axios.post(`/admin/addDepot`, data, {
          headers: {
            Authorization: token,
          },
        });
        document.getElementById("mandiDetails").click();
        // document.getElementById("states").click();
      } catch (error) {
        console.log(error);
        if (error.response.data.error === "jwt expired") {
          alert("Your Session has expired ! Please Login Again");
          window.location.href = "/admin/";
          localStorage.removeItem("adminToken");
        }
      }
    });

  document.getElementById("cancelAddButton").addEventListener("click", () => {
    document.getElementById("mandiDetails").click();
  });
}

async function showDepotDetails() {
  try {
    // ------------------------------------------------for showing info page for a mandi----------------------------------------------------
    console.log("in the show district");
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

    const res = await axios.get(`/admin/getDepots?id=${id}`, {
      headers: { Authorization: token },
    });

    const depot = res.data.depotDetails;
    spinner.style.visibility = "hidden";
    console.log(depot);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Depot Details`;
    document.getElementById("button_container").innerHTML = `
              <button id='editDepot' class="editBtn">Edit</button>
          <button id="deleteDepot" class="deleteBtn">Delete</button>
    `;

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>Depot Name</h2>
               <p>${depot.name}</p>
             </div>
             <div class="details_section_row">
         <h2>District Name</h2>
               <p>${depot.district}</p>
             </div>
             <div class="details_section_row">
         <h2>State Name</h2>
               <p>${depot.state}</p>
             </div>
             <div class="details_section_row">
               <h2>Created At</h2>
               <p>${depot.createdAt}</p>
             </div>
             <div class="details_section_row">
               <h2>Updated At</h2>
               <p>${depot.updatedAt}</p>
             </div>
    `;

    // ------------------------------------------------for showing edit page for a depot----------------------------------------------------
    document.getElementById("editDepot").addEventListener("click", () => {
      // const spinner = document.getElementById("loading_spinner");
      // spinner.style.visibility = "visible";

      document.getElementById("menu_title").innerHTML = `Edit Depot Details`;

      document.getElementById("button_container").innerHTML = `
              <button id='saveDepot' class="editBtn" type="submit"
            form="editDepotForm">Save</button>
          <button onClick="showDepotDetails()" class="cancelBtn">Cancel</button>
    `;

      // const res = await axios.get(`/admin/getStates/${id}`, {
      //   headers: { Authorization: token },
      // });

      details_section_content.innerHTML = `
      <form id="editDepotForm">
      <div class="form_content">
        <div class="form_control">
          <label for="depotName">Enter Depot Name</label>
          <input
            type="text"
            id="depotName"
            name="depotName"
            placeholder="Enter Depot Name"
            value="${depot.name}"
            required
          />
          <br />
        </div>
      </div>
    </form>
      `;

      // ---------------------------------------------------- for updating depot info----------------------------------------------------
      document
        .getElementById("editDepotForm")
        .addEventListener("submit", async (e) => {
          try {
            e.preventDefault();
            // console.log("hello");

            const spinner = document.getElementById("loading_spinner");
            spinner.style.visibility = "visible";

            const formdata = new FormData(e.target);
            const data = {};
            formdata.forEach((value, key) => {
              data[key] = value;
            });

            console.log(data);

            const res = await axios.post(
              `/admin/updateDepotDetails/${id}`,
              data,
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            showDepotDetails(id);
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

    // ------------------------------------------------for deleting a depot info----------------------------------------------------

    document.getElementById("deleteDepot").addEventListener("click", (e) => {
      // console.log(";hello from modal");
      const modal_container = document.getElementById("modal_container");
      // console.log(modal_container);
      document.getElementById(
        "modal_title"
      ).innerHTML = `Are you sure you want to delete this depot of ${depot.district} district of ${depot.state} ?`;

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
            const response = await axios.delete(`/admin/deleteDepot/${id}`, {
              headers: { Authorization: token },
            });
            spinner.style.visibility = "hidden";
            document.getElementById("modal_close").click();
            document.getElementById("mandiDetails").click();
          } catch (err) {
            console.log(err);
          }
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
}

// ----------------------------------------------------handling role data ----------------------------------------------------
async function addRole() {
  // console.log("hello");
  const spinner = document.getElementById("loading_spinner");
  spinner.style.visibility = "visible";

  const res = await axios.get(`/admin/getPermissions/`, {
    headers: { Authorization: token },
  });

  const permissions = res.data.permissionDetails;
  spinner.style.visibility = "hidden";

  const details_section_content = document.getElementById(
    "details_section_content"
  );
  document.getElementById("menu_title").innerHTML = `Add Role`;
  document.getElementById("button_container").innerHTML = `
              <button id='saveRole' class="editBtn" type="submit"
            form="addRoleForm">Save</button>
          <button id='cancelAddButton' class="cancelBtn">Cancel</button>
    `;

  details_section_content.innerHTML = `
      <form id="addRoleForm">
      <div class="form_content">
        <div class="form_control">
          <label for="roleName">Enter Role</label>
          <input
            type="text"
            id="roleName"
            name="roleName"
            placeholder="Enter Role Name"
            required
          />
          <br />
        </div>
        <div class="permissions">
      <label>Select Permissions for the Role :</label>
      <br>
      <br>
      <div class="error" id="error"></div>
      <br>
      ${permissions
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

  document
    .getElementById("addRoleForm")
    .addEventListener("submit", async (e) => {
      try {
        e.preventDefault();
        const errorDiv = document.getElementById("error");
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        errorDiv.textContent = "";

        const isChecked = Array.from(checkboxes).some((cb) => cb.checked);

        if (!isChecked) {
          errorDiv.textContent = "Please select at least one permission.";
          return;
        }

        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const roleName = document.getElementById("roleName").value;
        const permissions = Array.from(checkboxes).filter((cb) => cb.checked);
        const details = {
          roleName: roleName,
          permissions: permissions.map((ele) => ele.id),
        };
        console.log(details);

        const res = await axios.post(`/admin/addRole`, details, {
          headers: {
            Authorization: token,
          },
        });
        document.getElementById("rolesAndPermission").click();
        document.getElementById("states").click();
      } catch (error) {
        console.log(error);
        if (error.response.data.error === "jwt expired") {
          alert("Your Session has expired ! Please Login Again");
          window.location.href = "/admin/";
          localStorage.removeItem("adminToken");
        }
      }
    });

  document.getElementById("cancelAddButton").addEventListener("click", () => {
    document.getElementById("rolesAndPermission").click();
  });
}

async function showRoleDetails() {
  try {
    // ------------------------------------------------for showing info page for a role----------------------------------------------------
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";
    console.log(id);

    const res = await axios.get(`/admin/getRoles/?id=${id}`, {
      headers: { Authorization: token },
    });

    const role = res.data.roleDetails;
    spinner.style.visibility = "hidden";
    console.log(role);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Role Details`;
    document.getElementById("button_container").innerHTML = `
              <button id='editRole' class="editBtn">Edit</button>
          <button id="deleteRole" class="deleteBtn">Delete</button>
    `;

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>Name</h2>
               <p>${role.name}</p>
    </div>
    <div class="details_section_premissions">
          <h2>Permissions</h2>
          <ul>
             ${role.permissions.map((ele) => `<li>${ele.name}</li>`).join("")}
          </ul>
    </div>
    <div class="details_section_row">
          <h2>Created At</h2>
          <p>${role.createdAt}</p>
    </div>
    <div class="details_section_row">
          <h2>Updated At</h2>
          <p>${role.updatedAt}</p>
    </div>

    `;

    // ------------------------------------------------for showing edit page for a role----------------------------------------------------
    document.getElementById("editRole").addEventListener("click", async () => {
      try {
        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const res = await axios.get(`/admin/getPermissions/`, {
          headers: { Authorization: token },
        });

        const permissions = res.data.permissionDetails;
        spinner.style.visibility = "hidden";

        document.getElementById("menu_title").innerHTML = `Edit Role Details`;

        document.getElementById("button_container").innerHTML = `
              <button id='saveRole' class="editBtn" type="submit"
            form="editRoleForm">Save</button>
          <button onClick="showRoleDetails()" class="cancelBtn">Cancel</button>
    `;

        details_section_content.innerHTML = `
      <form id="editRoleForm">
        <div class="form_content">
          <div class="form_control">
            <label for="roleName">Enter Role</label>
            <input
              type="text"
              id="roleName"
              name="roleName"
              placeholder="Enter Role Name"
              value="${role.name}"
              required
            />
            <br />
          </div>
          
          <div class="permissions">
            <label>Select Permissions for the Role :</label>
            <br />
            <br />
            <div class="error" id="error"></div>
            <br />
            ${permissions
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

        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const selectedChecboxId = role.permissions.map((ele) => ele.id);

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

        // ---------------------------------------------------- for updating role info----------------------------------------------------
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
              const permissions = Array.from(checkboxes).filter(
                (cb) => cb.checked
              );
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
        console.log(error);
        if (error.response.data.error === "jwt expired") {
          alert("Your Session has expired ! Please Login Again");
          window.location.href = "/admin/";
          localStorage.removeItem("adminToken");
        }
      }
    });

    // ------------------------------------------------for deleting a state info----------------------------------------------------

    document.getElementById("deleteRole").addEventListener("click", (e) => {
      // console.log(";hello from modal");
      const modal_container = document.getElementById("modal_container");
      console.log(modal_container);
      document.getElementById(
        "modal_title"
      ).innerHTML = `Are you sure you want to delete this role ?`;

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
            const response = await axios.delete(`/admin/deleteRole/${id}`, {
              headers: { Authorization: token },
            });
            spinner.style.visibility = "hidden";
            document.getElementById("modal_close").click();
            document.getElementById("rolesAndPermission").click();
          } catch (err) {
            console.log(err);
          }
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
}

// ----------------------------------------------------handling permissions data ----------------------------------------------------
function addPermission() {
  // console.log("hello");
  const details_section_content = document.getElementById(
    "details_section_content"
  );
  document.getElementById("menu_title").innerHTML = `Add Permission`;
  document.getElementById("button_container").innerHTML = `
              <button id='savePermission' class="submitBtn" type="submit"
            form="addPermissionForm">Save</button>
          <button id='cancelAddButton' class="cancelBtn">Cancel</button>
    `;

  details_section_content.innerHTML = `
      <form id="addPermissionForm">
      <div class="form_content">
        <div class="form_control">
          <label for="permissionName">Enter Permission</label>
          <input
            type="text"
            id="permissionName"
            name="permissionName"
            placeholder="Enter Permission Name"
            required
          />
          <br />
        </div>
      </div>
    </form>
      `;

  document
    .getElementById("addPermissionForm")
    .addEventListener("submit", async (e) => {
      try {
        e.preventDefault();
        // console.log("hello");

        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const formdata = new FormData(e.target);
        const data = {};
        formdata.forEach((value, key) => {
          data[key] = value;
        });

        console.log(data);

        const res = await axios.post(`/admin/addPermission`, data, {
          headers: {
            Authorization: token,
          },
        });
        document.getElementById("rolesAndPermission").click();
        // document.getElementById("states").click();
      } catch (error) {
        console.log(error);
        if (error.response.data.error === "jwt expired") {
          alert("Your Session has expired ! Please Login Again");
          window.location.href = "/admin/";
          localStorage.removeItem("adminToken");
        }
      }
    });

  document.getElementById("cancelAddButton").addEventListener("click", () => {
    document.getElementById("rolesAndPermission").click();
  });
}

async function showPermissionDetails() {
  try {
    // ------------------------------------------------for showing info page for a Permission----------------------------------------------------
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";
    console.log(id);

    const res = await axios.get(`/admin/getPermissions/?id=${id}`, {
      headers: { Authorization: token },
    });

    const permission = res.data.permissionDetails;
    spinner.style.visibility = "hidden";
    console.log(permission);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `Permission Details`;
    document.getElementById("button_container").innerHTML = `
              <button id='editPermission' class="editBtn">Edit</button>
          <button id="deletePermission" class="deleteBtn">Delete</button>
    `;

    details_section_content.innerHTML = `
    <div class="details_section_row">
         <h2>Name</h2>
               <p>${permission.name}</p>
             </div>
             <div class="details_section_row">
               <h2>Created At</h2>
               <p>${permission.createdAt}</p>
             </div>
             <div class="details_section_row">
               <h2>Updated At</h2>
               <p>${permission.updatedAt}</p>
             </div>
    `;

    // ------------------------------------------------for showing edit page for a permission----------------------------------------------------
    document.getElementById("editPermission").addEventListener("click", () => {
      // const spinner = document.getElementById("loading_spinner");
      // spinner.style.visibility = "visible";

      document.getElementById(
        "menu_title"
      ).innerHTML = `Edit Permission Details`;

      document.getElementById("button_container").innerHTML = `
              <button id='savePermission' class="editBtn" type="submit"
            form="editPermissionForm">Save</button>
          <button onClick="showPermissionDetails()" class="cancelBtn">Cancel</button>
    `;

      // const res = await axios.get(`/admin/getStates/${id}`, {
      //   headers: { Authorization: token },
      // });

      details_section_content.innerHTML = `
      <form id="editPermissionForm">
      <div class="form_content">
        <div class="form_control">
          <label for="permissionName">Enter Permission</label>
          <input
            type="text"
            id="permissionName"
            name="permissionName"
            placeholder="Enter Permission Name"
            value="${permission.name}"
            required
          />
          <br />
        </div>
      </div>
    </form>
      `;

      // ---------------------------------------------------- for updating state info----------------------------------------------------
      document
        .getElementById("editPermissionForm")
        .addEventListener("submit", async (e) => {
          try {
            e.preventDefault();
            // console.log("hello");

            const spinner = document.getElementById("loading_spinner");
            spinner.style.visibility = "visible";

            const formdata = new FormData(e.target);
            const data = {};
            formdata.forEach((value, key) => {
              data[key] = value;
            });

            console.log(data);

            const res = await axios.post(
              `/admin/updatePermissionDetails/${id}`,
              data,
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            showPermissionDetails(id);
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

    // ------------------------------------------------for deleting a state info----------------------------------------------------

    document
      .getElementById("deletePermission")
      .addEventListener("click", (e) => {
        // console.log(";hello from modal");
        const modal_container = document.getElementById("modal_container");
        console.log(modal_container);
        document.getElementById(
          "modal_title"
        ).innerHTML = `Are you sure you want to delete this permission ?`;

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
                `/admin/deletePermission/${id}`,
                {
                  headers: { Authorization: token },
                }
              );
              spinner.style.visibility = "hidden";
              document.getElementById("modal_close").click();
              document.getElementById("rolesAndPermission").click();
            } catch (err) {
              console.log(err);
            }
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
}

// ----------------------------------------------------handling license data ----------------------------------------------------
function addLicense() {
  // console.log("hello");
  const details_section_content = document.getElementById(
    "details_section_content"
  );
  document.getElementById("menu_title").innerHTML = `Add License`;
  document.getElementById("button_container").innerHTML = `
              <button id='saveLicense' class="editBtn" type="submit"
            form="addLicenseForm">Save</button>
          <button id='cancelAddButton' class="cancelBtn">Cancel</button>
    `;

  details_section_content.innerHTML = `
      <form id="addLicenseForm">
      <div class="form_content">

        <div class="form_control">
          <label for="licenseName">License Name</label>
          <input
            type="text"
            id="licenseName"
            name="licenseName"
            placeholder="Enter License Name"
            required
          />
          <br />
        </div>

        <div class="form_control">
          <label for="subAdmin">Maximum Sub-Admins</label>
          <input
            type="number"
            id="subAdmin"
            name="subAdmin"
            placeholder="Enter maximum sub-admins for the license"
            min="1" 
            step="1"
            required
          />
          <br />
        </div>

        <div class="form_control">
          <label for="accounts">Maximum Accounts</label>
          <input
            type="number"
            id="accounts"
            name="accounts"
            placeholder="Enter maximum Accounts for the license"
            min="1" 
            step="1"
            required
          />
          <br />
        </div>

        <div class="form_control">
          <label for="nUsers">Maximum Normal Users</label>
          <input
            type="number"
            id="nUsers"
            name="nUsers"
            placeholder="Enter maximum normal users for the license"
            min="1" 
            step="1"
            required
          />
          <br />
        </div>

        <div class="form_control">
          <label for="validDuration">License Validity</label>
          <input
            type="number"
            id="validDuration"
            name="validDuration"
            placeholder="Enter valid duration for the  license"
            min="1" 
            step="1"
            required
          />
          <br />
        </div>

      </div>
    </form>
      `;

  document
    .getElementById("addLicenseForm")
    .addEventListener("submit", async (e) => {
      try {
        e.preventDefault();
        // console.log("hello");

        const spinner = document.getElementById("loading_spinner");
        spinner.style.visibility = "visible";

        const formdata = new FormData(e.target);
        const data = {};
        formdata.forEach((value, key) => {
          data[key] = value;
        });

        console.log(data);

        const res = await axios.post(`/admin/addLicense`, data, {
          headers: {
            Authorization: token,
          },
        });
        document.getElementById("license").click();
      } catch (error) {
        console.log(error);
        if (error.response.data.error === "jwt expired") {
          alert("Your Session has expired ! Please Login Again");
          window.location.href = "/admin/";
          localStorage.removeItem("adminToken");
        }
      }
    });

  document.getElementById("cancelAddButton").addEventListener("click", () => {
    document.getElementById("license").click();
  });
}

async function showLicenseDetails() {
  try {
    console.log("show license details");
    // ------------------------------------------------for showing info page for a license----------------------------------------------------
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";
    console.log(id);

    const res = await axios.get(`/admin/getLicenses?id=${id}`, {
      headers: { Authorization: token },
    });

    const license = res.data.licenseDetails;
    spinner.style.visibility = "hidden";
    console.log(license);

    const details_section_content = document.getElementById(
      "details_section_content"
    );
    document.getElementById("menu_title").innerHTML = `License Details`;
    document.getElementById("button_container").innerHTML = `
              <button id='editLicense' class="editBtn">Edit</button>
          <button id="deleteLicense" class="deleteBtn">Delete</button>
    `;

    details_section_content.innerHTML = `
    <div class="details_section_row">
      <h2>License Name</h2>
      <p>${license.name}</p>
    </div>

    <div class="details_section_row">
      <h2>Maximum Sub-Admins</h2>
      <p>${license.maxSubAdmin}</p>
    </div>

    <div class="details_section_row">
      <h2>Maximum Accounts</h2>
      <p>${license.maxAccounts}</p>
    </div>

    <div class="details_section_row">
      <h2>Maximum Normal Users</h2>
      <p>${license.maxNormalUsers}</p>
    </div>

    <div class="details_section_row">
      <h2>Maximum License Validity</h2>
      <p>${license.validDuration} days</p>
    </div>

    <div class="details_section_row">
      <h2>Created At</h2>
      <p>${license.createdAt}</p>
    </div>

    <div class="details_section_row">
      <h2>Updated At</h2>
      <p>${license.updatedAt}</p>
    </div>
    `;

    // ------------------------------------------------for showing edit page for a license----------------------------------------------------
    document.getElementById("editLicense").addEventListener("click", () => {
      // const spinner = document.getElementById("loading_spinner");
      // spinner.style.visibility = "visible";

      document.getElementById("menu_title").innerHTML = `Edit License Details`;

      document.getElementById("button_container").innerHTML = `
              <button id='saveLicense' class="editBtn" type="submit"
            form="editLicenseForm">Save</button>
          <button onClick="showLicenseDetails()" class="cancelBtn">Cancel</button>
    `;

      details_section_content.innerHTML = `
      <form id="editLicenseForm">
      <div class="form_content">

        <div class="form_control">
          <label for="licenseName">License Name</label>
          <input
            type="text"
            id="licenseName"
            name="licenseName"
            placeholder="Enter License Name"
            value="${license.name}"
            required
          />
          <br />
        </div>

        <div class="form_control">
          <label for="subAdmin">Maximum Sub-Admins</label>
          <input
            type="number"
            id="subAdmin"
            name="subAdmin"
            placeholder="Enter maximum sub-admins for the license"
            min="1" 
            step="1"
            value="${license.maxSubAdmin}"
            required
          />
          <br />
        </div>

        <div class="form_control">
          <label for="accounts">Maximum Accounts</label>
          <input
            type="number"
            id="accounts"
            name="accounts"
            placeholder="Enter maximum Accounts for the license"
            min="1" 
            step="1"
            value="${license.maxAccounts}"
            required
          />
          <br />
        </div>

        <div class="form_control">
          <label for="nUsers">Maximum Normal Users</label>
          <input
            type="number"
            id="nUsers"
            name="nUsers"
            placeholder="Enter maximum normal users for the license"
            min="1" 
            step="1"
            value="${license.maxNormalUsers}"
            required
          />
          <br />
        </div>

        <div class="form_control">
          <label for="validDuration">License Validity</label>
          <input
            type="number"
            id="validDuration"
            name="validDuration"
            placeholder="Enter valid duration for the  license"
            min="1" 
            step="1"
            value="${license.validDuration}"
            required
          />
          <br />
        </div>

      </div>
    </form>
      `;

      // ---------------------------------------------------- for updating license info----------------------------------------------------
      document
        .getElementById("editLicenseForm")
        .addEventListener("submit", async (e) => {
          try {
            e.preventDefault();
            console.log("hello");

            const spinner = document.getElementById("loading_spinner");
            spinner.style.visibility = "visible";

            const formdata = new FormData(e.target);
            const data = {};
            formdata.forEach((value, key) => {
              data[key] = value;
            });

            console.log(data);

            const res = await axios.post(
              `/admin/updateLicenseDetails/${id}`,
              data,
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            showLicenseDetails();
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

    // ------------------------------------------------for deleting a license info----------------------------------------------------

    document.getElementById("deleteLicense").addEventListener("click", (e) => {
      // console.log(";hello from modal");
      const modal_container = document.getElementById("modal_container");
      console.log(modal_container);
      document.getElementById(
        "modal_title"
      ).innerHTML = `Are you sure you want to delete this license ?`;

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
            const response = await axios.delete(`/admin/deleteLicense/${id}`, {
              headers: { Authorization: token },
            });
            spinner.style.visibility = "hidden";
            document.getElementById("modal_close").click();
            document.getElementById("license").click();
          } catch (err) {
            console.log(err);
          }
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
}

// // ----------------------------------------------------handling page-reload data ----------------------------------------------------
window.addEventListener("DOMContentLoaded", async () => {
  try {
    //------------------------------- mandiDetails tab data handling-------------------------------
    if (tab === "mandiDetails") {
      console.log("1");
      document.getElementById("mandiDetails").classList.add("menu_active");
      if (menu === "state") {
        console.log("2");
        if (method === "view") {
          console.log("3");
          showStateDetails();
        }
        if (method === "add") {
          console.log("4");
          addState();
        }
      }

      if (menu === "district") {
        if (method === "view") {
          console.log("3");
          showDistrictDetails();
        }
        if (method === "add") {
          console.log("4");
          addDistrict();
        }
      }

      if (menu === "mandi") {
        if (method === "view") {
          console.log("3");
          showMandiDetails();
        }
        if (method === "add") {
          console.log("4");
          addMandi();
        }
      }

      if (menu === "depot") {
        if (method === "view") {
          console.log("3");
          showDepotDetails();
        }
        if (method === "add") {
          console.log("4");
          addDepot();
        }
      }
    }
    //------------------------------- rolesAndPermission tab data handling-------------------------------
    if (tab === "rolesAndPermission") {
      // console.log("1");
      document
        .getElementById("rolesAndPermission")
        .classList.add("menu_active");

      if (menu === "roles") {
        console.log("2");
        if (method === "view") {
          console.log("3");
          showRoleDetails();
        }
        if (method === "add") {
          console.log("4");
          addRole();
        }
      }
      if (menu === "permissions") {
        console.log("2");
        if (method === "view") {
          console.log("3");
          showPermissionDetails();
        }
        if (method === "add") {
          console.log("4");
          addPermission();
        }
      }
    }

    if (tab === "license") {
      // console.log("1");
      document.getElementById("license").classList.add("menu_active");

      if (method === "view") {
        console.log("3");
        showLicenseDetails();
      }
      if (method === "add") {
        console.log("4");
        addLicense();
      }
    }

    // if (details.tab === "mandiDetails" && details.menu === "states") {
    //   document.getElementById("mandiDetails").classList.add("menu_active");
    //   showStateDetails();
    // }

    // console.log(res);
  } catch (error) {
    console.log(error);
    if (error.response.data.error === "jwt expired") {
      alert("Your Session has expired ! Please Login Again");
      window.location.href = "/admin/";
      localStorage.removeItem("adminToken");
    }
  }
});
