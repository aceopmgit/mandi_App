const token = localStorage.getItem("adminToken");

// modal close
function modalControl() {
  const modalClose = document.getElementById("modal_close");
  modalClose.addEventListener("click", () => {
    document.getElementById("modal_container").classList.remove("show");
  });
}

// ------------------------side-menu-roles data handling------------------------
const roles = document.getElementById("roles");
roles.addEventListener("click", showRoles);

async function showRoles(e) {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";
    const children = e.target.parentElement.parentElement.children;

    for (let i = 0; i < children.length; i++) {
      children[i].children[0].style.backgroundColor = "white";
    }
    e.currentTarget.children[0].style.backgroundColor = "#ccc";

    localStorage.setItem("side_menu_tab", "roles");

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
      window.location.href = `/admin/viewMenuItemDetails?tab=rolesAndPermission&menu=roles&method=add&id=null`;
    });

    //---------------------------------------------------- for showing roles list----------------------------------------------------
    const res = await axios.get(`/admin/getRoles`, {
      headers: { Authorization: token },
    });
    spinner.style.visibility = "hidden";

    // console.log(res);

    if (res.data.roleDetails.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
      <div style="margin: auto">
            <h1 style="font-size: 2.5rem; font-weight: 400;">No Roles Added.</h1>
        </div>`;
      return;
    }

    const roleIndexTitle = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
    <li>Role Name</li>
    <li>Created Date</li>
    `);
    const roleData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = res.data.roleDetails
      .map((data) => {
        return `
        
      <ul class="main_section_data_part" id=${data.id}>
<li>${data.name}</li>
<li>${data.createdAt}</li>
      </ul>
      `;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a role----------------------------------------------------
    const roleList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );
    roleList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        console.log(e.currentTarget.id, e.currentTarget);

        window.location.href = `/admin/viewMenuItemDetails?tab=rolesAndPermission&menu=roles&method=view&id=${e.currentTarget.id}`;
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

// ------------------------side-menu-permissions data handling------------------------
const permissions = document.getElementById("permissions");
permissions.addEventListener("click", showPermissions);

async function showPermissions(e) {
  try {
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";
    const children = e.target.parentElement.parentElement.children;

    for (let i = 0; i < children.length; i++) {
      children[i].children[0].style.backgroundColor = "white";
    }
    e.currentTarget.children[0].style.backgroundColor = "#ccc";

    localStorage.setItem("side_menu_tab", "permissions");

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
      window.location.href = `/admin/viewMenuItemDetails?tab=rolesAndPermission&menu=permissions&method=add&id=null`;
    });

    //---------------------------------------------------- for showing permissions list----------------------------------------------------
    const res = await axios.get(`/admin/getPermissions`, {
      headers: { Authorization: token },
    });
    spinner.style.visibility = "hidden";

    // console.log(res);

    if (res.data.permissionDetails.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
      <div style="margin: auto">
            <h1 style="font-size: 2.5rem; font-weight: 400;">No Permission Added.</h1>
        </div>`;
      return;
    }

    const permissionIndexTitle = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
    <li>Permission Name</li>
    <li>Created Date</li>
    `);
    const permissionData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = res.data.permissionDetails
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
    const permissionList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );
    permissionList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        console.log(e.currentTarget.id, e.currentTarget);

        window.location.href = `/admin/viewMenuItemDetails?tab=rolesAndPermission&menu=permissions&method=view&id=${e.currentTarget.id}`;
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

// ------------------------page reload data handling------------------------
window.addEventListener("DOMContentLoaded", async () => {
  document.getElementById(localStorage.getItem("side_menu_tab")).click();
});
