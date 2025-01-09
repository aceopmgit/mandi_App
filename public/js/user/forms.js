const token = localStorage.getItem("userToken");

//showing purchase form
const purchaseBtn = document.getElementById("purchase-btn");
purchaseBtn.addEventListener("click", showPurchaseForm);

async function showPurchaseForm(e) {
  const children = e.target.parentElement.children;
  console.log(children);
  for (let i = 0; i < children.length; i++) {
    console.log(children[i]);
    children[i].style.backgroundColor = "white";
  }
  e.target.style.backgroundColor = "#4db8e8";

  const part2 = document.getElementsByClassName("part2");
  console.log(part2[0]);
  part2[0].innerHTML = `
  <div class="row">
          <div class="col-sm-12 col-md-9 mx-auto">
            <div class="container">
              <br />
              <br />

              <div class="card" style="background-color: white">
                <p style="height: 10px; background-color: #1ca1ee"></p>
                <div class="card-body">
                  <h2 class="card-title">Mandi Purchase Form</h2>
                  <br />

                  <form enctype="multipart/form-data" id="mandiPurchaseForm">
                    <div>
                      <label for="mandiName" class="form-label"
                        ><b
                          >Mandi Name (ମଣ୍ଡି ନାମ)<span style="color: red">*</span></b
                        ></label
                      >
                      <select
                        class="form-control"
                        id="mandiName"
                        name="mandiName"
                        required
                      >
                      </select>
                      <br />
                    </div>
                    <div>
                      <label for="purchaseQuantity" class="form-label"
                        ><b
                          >Purchase Qtls (Gross) in Bags (କେତେ ମୋଟ ବ୍ୟାଗ
                          କିଣାଯାଇଛି?)<span style="color: red">*</span></b
                        ></label
                      >
                      <input
                        type="Number"
                        id="purchaseQuantity"
                        name="purchaseQuantity"
                        class="form-control"
                        step="0.01"
                        required
                      />

                      <br />
                    </div>

                    <div>
                      <label for="gunnyBags" class="form-label"
                        ><b
                          >Gunny Bags (ସେଠାରେ କେତେ "ଗନି" ବ୍ୟାଗ ଅଛି?)
                          <span style="color: red">*</span></b
                        ></label
                      >
                      <input
                        type="Number"
                        id="gunnyBags"
                        name="gunnyBags"
                        class="form-control"
                        required
                      />
                      <br />
                    </div>

                    <div>
                      <label for="ppBags" class="form-label"
                        ><b
                          >PP Bags (କେତେ ପିପି ବ୍ୟାଗ୍ |)
                          <span style="color: red">*</span></b
                        ></label
                      >
                      <input
                        type="Number"
                        id="ppBags"
                        name="ppBags"
                        class="form-control"
                        required
                      />
                      <br />
                    </div>

                    <div>
                      <label for="bagWeight" class="form-label"
                        ><b
                          >Bag Weight (Quintal) (ବ୍ୟାଗ କ୍ୱିଣ୍ଟାଲରେ ଓଜନ)<span
                            style="color: red"
                            >*</span
                          ></b
                        ></label
                      >
                      <input
                        type="Number"
                        id="bagWeight"
                        name="bagWeight"
                        step="0.01"
                        class="form-control"
                        required
                      />
                      <br />
                    </div>

                    <div>
                      <label for="faq" class="form-label"
                        ><b
                          >Faq Quintal ( ଫ୍ୟାକ୍ ଓଜନ କେତେ )<span
                            style="color: red"
                            >*</span
                          ></b
                        ></label
                      >
                      <input
                        type="Number"
                        id="faq"
                        name="faq"
                        class="form-control"
                        step="0.01"
                        required
                      />
                      <br />
                    </div>

                    <div>
                      <label for="uploadHisab" class="form-label"
                        ><b
                          >Upload Hisab (ହିସାବ ଅପଲୋଡ୍ କରନ୍ତୁ |)<span
                            style="color: red"
                            >*</span
                          ></b
                        ></label
                      >

                      <input
                        type="file"
                        id="uploadHisab"
                        name="uploadHisab"
                        class="form-control"
                        accept=".jpg,.jpeg,.png,.pdf"
                        required
                      />
                      <br />
                    </div>

                    <br />
                    <button class="btn btn-primary" id="button" type="submit">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>`;

  const mandiPurchaseForm = document.getElementById("mandiPurchaseForm");
  mandiPurchaseForm.addEventListener("submit", onSubmitMandiPurchaseForm);

  try {
    const mandiName = document.getElementById("mandiName");
    const res = await axios.get(`/home/userInput/getMandi`, {
      headers: { Authorization: token },
    });

    if (res.data.details.length === 0) {
      mandiName.innerHTML = `<option value="#">No options available</option>`;
    } else {
      mandiName.innerHTML = res.data.details.map((ele) => {
        return `<option value="${ele.name}">${ele.name}</option>`;
      });
    }
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}

//handlimg purchase form data

async function onSubmitMandiPurchaseForm(e) {
  e.preventDefault();

  const form = document.getElementById("mandiPurchaseForm");
  const formData = new FormData(form);

  //   // Log all form data to the console
  //   for (const [key, value] of formData.entries()) {
  //     console.log(key, value);
  //   }
  //   console.log("formdata", formData);

  try {
    const response = await axios.post(
      "/home/forms/addMandiPurchaseData",
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    form.reset();
    console.log("form data submiited");
    alert(response.data.message); // Success message from the server
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}

//showing loading form
const loadingBtn = document.getElementById("loading-btn");
loadingBtn.addEventListener("click", showLoadingForm);

async function showLoadingForm(e) {
  const children = e.target.parentElement.children;
  console.log(children);
  for (let i = 0; i < children.length; i++) {
    console.log(children[i]);
    children[i].style.backgroundColor = "white";
  }
  e.target.style.backgroundColor = "#4db8e8";

  const part2 = document.getElementsByClassName("part2");
  console.log(part2[0]);
  part2[0].innerHTML = `
  <div class="row">
          <div class="col-sm-12 col-md-9 mx-auto">
            <div class="container">
              <br />
              <br />

              <div class="card" style="background-color: white">
                <p style="height: 10px; background-color: #1ca1ee"></p>
                <div class="card-body">
                  <h2 class="card-title">Loading Details Form</h2>
                  <br />

                  <form enctype="multipart/form-data" id="loadingDetailsForm">
                    <div>
                      <label for="mandiName" class="form-label"
                        ><b
                          >Mandi Name (ମଣ୍ଡି ନାମ)<span style="color: red">*</span></b
                        ></label
                      >
                      <select
                        class="form-control"
                        id="mandiName"
                        name="mandiName"
                        required
                      >
                      </select>
                      <br />
                    </div>

                    <div>
                      <label for="tpNumber" class="form-label"
                        ><b
                          >Transaction Pass Number(କାରବାର ପାସ୍ ସଂଖ୍ଯ଼ା)<span
                            style="color: red"
                            >*</span
                          ></b
                        ></label
                      >
                      <input
                        type="Number"
                        id="tpNumber"
                        name="tpNumber"
                        class="form-control"
                        required
                      />

                      <br />
                    </div>

                    <div>
                      <label for="vehicleNumber" class="form-label"
                        ><b
                          >Vehicle No (ଯାନ ନଂ)
                          <span style="color: red">*</span></b
                        ></label
                      >
                      <input
                        type="text"
                        id="vehicleNumber"
                        name="vehicleNumber"
                        class="form-control"
                        required
                      />
                      <br />
                    </div>

                    <div>
                      <label for="bagsLoaded" class="form-label"
                        ><b
                          >Bags Loaded (କେତେ ବ୍ୟାଗ୍ ଲୋଡ୍ ହୋଇଛି?)
                          <span style="color: red">*</span></b
                        ></label
                      >
                      <input
                        type="Number"
                        id="bagsLoaded"
                        name="bagsLoaded"
                        class="form-control"
                        required
                      />
                      <br />
                    </div>

                    <div>
                      <label for="tpBags" class="form-label"
                        ><b
                          >Transaction Pass Bag(କାରବାର ପାସ୍ ବ୍ଯ଼ାଗ୍)<span
                            style="color: red"
                            >*</span
                          ></b
                        ></label
                      >
                      <input
                        type="Number"
                        id="tpBags"
                        name="tpBags"
                        class="form-control"
                        required
                      />
                      <br />
                    </div>

                    <div>
                      <label for="tpQty" class="form-label"
                        ><b
                          >Transaction Pass Qty(କାରବାର ପାସ୍ ପରିମାଣ )<span
                            style="color: red"
                            >*</span
                          ></b
                        ></label
                      >
                      <input
                        type="Number"
                        id="tpQty"
                        name="tpQty"
                        class="form-control"
                        step="0.01"
                        required
                      />
                      <br />
                    </div>

                    <div>
                      <label for="uploadVehiclePhoto" class="form-label"
                        ><b
                          >Upload Vehicle photo (ଯାନ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ )<span
                            style="color: red"
                            >*</span
                          ></b
                        ></label
                      >

                      <input
                        type="file"
                        id="uploadVehiclePhoto"
                        name="uploadVehiclePhoto"
                        class="form-control"
                        accept=".jpg,.jpeg,.png,.pdf"
                        required
                      />
                      <br />
                    </div>

                    <br />
                    <button class="btn btn-primary" id="button" type="submit">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>`;

  const loadingDetailsForm = document.getElementById("loadingDetailsForm");
  loadingDetailsForm.addEventListener("submit", onSubmitLoadingForm);

  try {
    const mandiName = document.getElementById("mandiName");
    const res = await axios.get(`/home/userInput/getMandi`, {
      headers: { Authorization: token },
    });

    if (res.data.details.length === 0) {
      mandiName.innerHTML = `<option value="#">No options available</option>`;
    } else {
      mandiName.innerHTML = res.data.details.map((ele) => {
        return `<option value="${ele.name}">${ele.name}</option>`;
      });
    }
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}

//handling loading form data
async function onSubmitLoadingForm(e) {
  e.preventDefault();

  const form = document.getElementById("loadingDetailsForm");
  const formData = new FormData(form);

  //   // Log all form data to the console
  //   for (const [key, value] of formData.entries()) {
  //     console.log(key, value);
  //   }
  //   console.log("formdata", formData);

  try {
    const response = await axios.post(
      "/home/forms/addLoadingFormData",
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    form.reset();
    console.log("form data submiited");
    alert(response.data.message); // Success message from the server
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}

//showing master form
const masterBtn = document.getElementById("master-btn");
masterBtn.addEventListener("click", showMasterForm);

async function showMasterForm(e) {
  // document.getElementById("purchase-btn").style.backgroundColor = "white";
  // console.log(e.target.parentElement.children);
  const children = e.target.parentElement.children;
  console.log(children);
  for (let i = 0; i < children.length; i++) {
    console.log(children[i]);
    children[i].style.backgroundColor = "white";
  }
  e.target.style.backgroundColor = "#4db8e8";

  const part2 = document.getElementsByClassName("part2");
  console.log(part2[0]);
  part2[0].innerHTML = `
  <div class="row">
          <div class="col-sm-12 col-md-9 mx-auto">
            <div class="container">
              <br />
              <br />

              <div class="card" style="background-color: white">
                <p style="height: 10px; background-color: #1ca1ee"></p>
                <div class="card-body">
                  <h2 class="card-title">Target Details Form</h2>
                  <br />

                  <form id="masterForm">
                    <div>
                      <label for="mandiName" class="form-label"
                        ><b
                          >Mandi Name (ମଣ୍ଡି ନାମ)<span style="color: red">*</span></b
                        ></label
                      >
                      <select
                        class="form-control"
                        id="mandiName"
                        name="mandiName"
                        required
                      >
                      </select>
                      <br />
                    </div>

                    <div>
                      <label for="targetQtls" class="form-label"
                        ><b
                          >Target Qtls<span
                            style="color: red"
                            >*</span
                          ></b
                        ></label
                      >
                      <input
                        type="Number"
                        id="targetQtls"
                        name="targetQtls"
                        class="form-control"
                        step="0.01"
                        required
                      />

                      <br />
                    </div>

                    <div>
                      <label for="liftedQauntity" class="form-label"
                        ><b
                          >Lifted Quantity
                          <span style="color: red">*</span></b
                        ></label
                      >
                      <input
                        type="number"
                        id="liftedQauntity"
                        name="liftedQauntity"
                        step="0.01"
                        class="form-control"
                        required
                      />
                      <br />
                    </div>

                    <div>
                      <label for="targetBalance" class="form-label"
                        ><b
                          >Target Balance
                          <span style="color: red">*</span></b
                        ></label
                      >
                      <input
                        type="Number"
                        id="targetBalance"
                        name="targetBalance"
                        step="0.01"
                        class="form-control"
                        required
                      />
                      <br />
                    </div>                    

                    <br />
                    <button class="btn btn-primary" id="button" type="submit">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>`;

  const masterDetailsForm = document.getElementById("masterForm");
  masterDetailsForm.addEventListener("submit", onSubmitMasterDetailsForm);

  try {
    const mandiName = document.getElementById("mandiName");
    const res = await axios.get(`/home/userInput/getMandi`, {
      headers: { Authorization: token },
    });

    if (res.data.details.length === 0) {
      mandiName.innerHTML = `<option value="#">No options available</option>`;
    } else {
      mandiName.innerHTML = res.data.details.map((ele) => {
        return `<option value="${ele.name}">${ele.name}</option>`;
      });
    }
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}

async function onSubmitMasterDetailsForm(e) {
  e.preventDefault();

  const form = document.getElementById("masterForm");
  const formData = new FormData(form);

  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  console.log(data);

  //   // Log all form data to the console
  //   for (const [key, value] of formData.entries()) {
  //     console.log(key, value);
  //   }
  //   console.log("formdata", formData);

  try {
    const response = await axios.post("/home/forms/addMasterFormData", data, {
      headers: {
        Authorization: token,
      },
    });
    form.reset();
    console.log("form data submiited");
    alert(response.data.message); // Success message from the server
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}

//showing direct trader form
const directTraderBtn = document.getElementById("directTrader-btn");
directTraderBtn.addEventListener("click", showDirectTraderForm);

async function showDirectTraderForm(e) {
  // document.getElementById("purchase-btn").style.backgroundColor = "white";
  // console.log(e.target.parentElement.children);
  const children = e.target.parentElement.children;
  console.log(children);
  for (let i = 0; i < children.length; i++) {
    console.log(children[i]);
    children[i].style.backgroundColor = "white";
  }
  e.target.style.backgroundColor = "#4db8e8";

  const part2 = document.getElementsByClassName("part2");
  console.log(part2[0]);
  part2[0].innerHTML = `
  <div class="row">
          <div class="col-sm-12 col-md-9 mx-auto">
            <div class="container">
              <br />
              <br />

              <div class="card" style="background-color: white">
                <p style="height: 10px; background-color: #1ca1ee"></p>
                <div class="card-body">
                  <h2 class="card-title">Target Details Form</h2>
                  <br />

                  <form id="directTraderForm">
                    <div>
                      <label for="partyName" class="form-label"
                        ><b
                          >Trader Name <span style="color: red">*</span></b
                        ></label
                      >
                      <select
                        class="form-control"
                        id="partyName"
                        name="partyName"
                        required
                      >
                      </select>
                      <br />
                    </div>

                    <div>
                      <label for="inBags" class="form-label"
                        ><b
                          >In Bags<span
                            style="color: red"
                            >*</span
                          ></b
                        ></label
                      >
                      <input
                        type="Number"
                        id="inBags"
                        name="inBags"
                        class="form-control"
                        required
                      />

                      <br />
                    </div>

                    <div>
                      <label for="gross" class="form-label"
                        ><b
                          >Gross
                          <span style="color: red">*</span></b
                        ></label
                      >
                      <input
                        type="number"
                        id="gross"
                        name="gross"
                        class="form-control"
                        required
                      />
                      <br />
                    </div>

                    <div>
                      <label for="bagWtInKg" class="form-label"
                        ><b
                          >Bg Wt (Kg)
                          <span style="color: red">*</span></b
                        ></label
                      >
                      <input
                        type="Number"
                        id="bagWtInKg"
                        name="bagWtInKg"
                        class="form-control"
                        step="0.01"
                        required
                      />
                      <br />
                    </div>
                    
                    <div>
                      <label for="percent" class="form-label"
                        ><b
                          > %
                          <span style="color: red">*</span></b
                        ></label
                      >
                      <input
                        type="Number"
                        id="percent"
                        name="percent"
                        class="form-control"
                        step="0.01"
                        required
                      />
                      <br />
                    </div>

                    <div>
                      <label for="specialCuttingInKg" class="form-label"
                        ><b
                          > Special Cutting IN KG
                          <span style="color: red">*</span></b
                        ></label
                      >
                      <input
                        type="Number"
                        id="specialCuttingInKg"
                        name="specialCuttingInKg"
                        class="form-control"
                        step="0.01"
                        required
                      />
                      <br />
                    </div>

                    <br />
                    <button class="btn btn-primary" id="button" type="submit">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>`;

  const directTraderForm = document.getElementById("directTraderForm");
  directTraderForm.addEventListener("submit", onSubmitDirectTraderForm);

  try {
    const partyName = document.getElementById("partyName");
    const res = await axios.get(`/home/userInput/gettrader`, {
      headers: { Authorization: token },
    });

    if (res.data.details.length === 0) {
      partyName.innerHTML = `<option value="#">No options available</option>`;
    } else {
      partyName.innerHTML = res.data.details.map((ele) => {
        return `<option value="${ele.name}">${ele.name}</option>`;
      });
    }
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}

//handling direct trader form data
async function onSubmitDirectTraderForm(e) {
  e.preventDefault();

  const form = document.getElementById("directTraderForm");
  const formData = new FormData(form);

  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  console.log(data);

  //   // Log all form data to the console
  //   for (const [key, value] of formData.entries()) {
  //     console.log(key, value);
  //   }
  //   console.log("formdata", formData);

  try {
    const response = await axios.post(
      "/home/forms/addDirectTraderFormData",
      data,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    form.reset();
    console.log("form data submiited");
    alert(response.data.message); // Success message from the server
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}
