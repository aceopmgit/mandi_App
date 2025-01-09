const token = localStorage.getItem("userToken");

//showing master report
const masterReportBtn = document.getElementById("master-report-btn");
masterReportBtn.addEventListener("click", showMasterReport);

async function showMasterReport(e) {
  const children = e.target.parentElement.children;
  //   console.log(children);
  for (let i = 0; i < children.length; i++) {
    // console.log(children[i]);
    children[i].style.backgroundColor = "white";
  }
  e.target.style.backgroundColor = "#4db8e8";

  try {
    const res = await axios.get(`/home/report/getMasterReport`, {
      headers: { Authorization: token },
    });

    console.log(res.data.details);

    const data = res.data.details;

    const part2 = document.getElementsByClassName("part2");
    part2[0].innerHTML = `
    <table>
          <tr>
            <th>Date</th>
            <th>Mandi Name</th>
            <th>Target in Qtls</th>
            <th>Lifted</th>
            <th>Mandi Traget Balance</th>
          </tr>

          ${data.map((ele) => {
            return `<tr>
            <td>${ele.createdAt.split("T")[0]}</td>
            <td>${ele.mandiName}</td>
            <td>${ele.targetQtls}</td>
            <td>${ele.liftedQauntity}</td>
            <td>${ele.targetBalance}</td>
          </tr>`;
          })}
        </table>`;
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}

//showing master report
const mandiReportBtn = document.getElementById("mandiPurchase-report-btn");
mandiReportBtn.addEventListener("click", showMandiPurchaseReport);

async function showMandiPurchaseReport(e) {
  const children = e.target.parentElement.children;
  //   console.log(children);
  for (let i = 0; i < children.length; i++) {
    // console.log(children[i]);
    children[i].style.backgroundColor = "white";
  }
  e.target.style.backgroundColor = "#4db8e8";

  try {
    const res = await axios.get(`/home/report/getMandiPurchaseReport`, {
      headers: { Authorization: token },
    });

    console.log(res.data.details);

    const data = res.data.details;

    const part2 = document.getElementsByClassName("part2");
    part2[0].innerHTML = `
    <table>
          <tr>
            <th>Date</th>
            <th>Mandi Name</th>
            <th>Purchase Qtls (Gross)</th>
            <th>Gunny Bags</th>
            <th>PP Bags</th>
            <th>Bag Weight</th>
            <th>Faq</th>
            <th>Pur Bags</th>
            <th>Nett Pur Qtls</th>
          </tr>

          ${data.map((ele) => {
            return `<tr>
            <td>${ele.createdAt.split("T")[0]}</td>
            <td>${ele.mandiName}</td>
            <td>${ele.quantity}</td>
            <td>${ele.gunnyBags}</td>
            <td>${ele.ppBags}</td>
            <td>${ele.bagWeight}</td>
            <td>${ele.faq}</td>
            <td>${ele.purBags}</td>
            <td>${ele.nettPurchaseQty}</td>
          </tr>`;
          })}
        </table>`;
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}

//showing mandi loading report
const loadingReportBtn = document.getElementById("loading-report-btn");
loadingReportBtn.addEventListener("click", showLoadingReport);

async function showLoadingReport(e) {
  const children = e.target.parentElement.children;
  //   console.log(children);
  for (let i = 0; i < children.length; i++) {
    // console.log(children[i]);
    children[i].style.backgroundColor = "white";
  }
  e.target.style.backgroundColor = "#4db8e8";

  try {
    const res = await axios.get(`/home/report/getLoadingReport`, {
      headers: { Authorization: token },
    });

    console.log(res.data.details);

    const data = res.data.details;

    const part2 = document.getElementsByClassName("part2");
    part2[0].innerHTML = `
    <table>
          <tr>
            <th>Date</th>
            <th>Loading Mandi Name</th>
            <th>TP Number</th>
            <th>Vehicle No</th>
            <th>Bags Loaded</th>
            <th>TP Bags</th>
            <th>TP Qty</th>
            <th>TP Copy</th>
          </tr>

          ${data.map((ele) => {
            return `<tr>
            <td>${ele.createdAt.split("T")[0]}</td>
            <td>${ele.mandiName}</td>
            <td>${ele.tpNumber}</td>
            <td>${ele.vehicleNumber}</td>
            <td>${ele.bagsLoaded}</td>
            <td>${ele.tpBags}</td>
            <td>${ele.tpQty}</td>
            <td>${ele.uploadVehiclePhoto}</td>
          </tr>`;
          })}
        </table>`;
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}

//showing mandi loading report
const directTradersReportBtn = document.getElementById(
  "directTraders-report-btn"
);
directTradersReportBtn.addEventListener("click", showDirectTradersReport);

async function showDirectTradersReport(e) {
  const children = e.target.parentElement.children;
  //   console.log(children);
  for (let i = 0; i < children.length; i++) {
    // console.log(children[i]);
    children[i].style.backgroundColor = "white";
  }
  e.target.style.backgroundColor = "#4db8e8";

  try {
    const res = await axios.get(`/home/report/getDirectTradersReport`, {
      headers: { Authorization: token },
    });

    // console.log(res.data.details);

    const data = res.data.details;

    const part2 = document.getElementsByClassName("part2");
    part2[0].innerHTML = `
    <table>
          <tr>
            <th>Date</th>
            <th>Party Name</th>
            <th>In Bags</th>
            <th>Gross</th>
            <th>Bg Wt (Kg)</th>
            <th>Percent</th>
            <th>Special Cutting IN KG</th>
            <th>FAQ</th>
            <th>Nett IN</th>
          </tr>

          ${data.map((ele) => {
            return `<tr>
            <td>${ele.createdAt.split("T")[0]}</td>
            <td>${ele.partyName}</td>
            <td>${ele.inBags}</td>
            <td>${ele.gross}</td>
            <td>${ele.bagWtInKg}</td>
            <td>${ele.percent}</td>
            <td>${ele.specialCuttingInKg}</td>
            <td>${ele.faq}</td>
            <td>${ele.nettIn}</td>
          </tr>`;
          })}
        </table>`;
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}
