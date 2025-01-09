window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const spinner = document.getElementById("loading_spinner");
    spinner.style.visibility = "visible";

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
      window.location.href = `/admin/viewMenuItemDetails?tab=license&method=add&id=null`;
    });

    //---------------------------------------------------- for showing roles list----------------------------------------------------
    const res = await axios.get(`/admin/getLicenses`, {
      headers: { Authorization: token },
    });
    spinner.style.visibility = "hidden";

    const licenses = res.data.licenseDetails;

    // console.log(res);

    if (licenses.length < 1) {
      document.getElementsByClassName("main_section_content")[0].innerHTML = `
            <div style="margin: auto">
                  <h1 style="font-size: 2.5rem; font-weight: 400;">No License Added.</h1>
              </div>`;
      return;
    }

    const licenseIndexTitle = (document.getElementsByClassName(
      "main_section_title"
    )[0].innerHTML = `
      <li>License Name</li>
      <li>Created Date</li>
      `);
    const licenseData = (document.getElementsByClassName(
      "main_section_data"
    )[0].innerHTML = licenses
      .map((data) => {
        return `
          
        <ul class="main_section_data_part" id=${data.id}>
  <li>${data.name}</li>
  <li>${data.createdAt}</li>
        </ul>
        `;
      })
      .join(""));

    //----------------------------------------------------for showing details page of a license----------------------------------------------------
    const licenseList = Array.from(
      document.getElementsByClassName("main_section_data_part")
    );
    licenseList.map((ele) => {
      ele.addEventListener("click", async (e) => {
        console.log(e.currentTarget.id, e.currentTarget);
        // console.log("hello from show license");

        window.location.href = `/admin/viewMenuItemDetails?tab=license&method=view&id=${e.currentTarget.id}`;
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
});
