const token = localStorage.getItem("userToken");

const mandiBtn = document.getElementById("mandi-btn");
mandiBtn.addEventListener("click", showMandi);
//for showing mandi entered by user
async function showMandi(e) {
  e.target.style.backgroundColor = "#4db8e8";
  document.getElementById("trader-btn").style.backgroundColor = "White";
  try {
    const part2header = document.getElementsByClassName("part-2-header");

    //setting the header for mandi
    part2header[0].innerHTML = `
    <p id="part2-title">Mandi List</p>
            <button
              id="part2-addButton"
              data-bs-toggle="modal"
              data-bs-target="#addMandiModal"
            >
              +
            </button>
    `;

    const res = await axios.get(`/home//userInput/getMandi`, {
      headers: { Authorization: token },
    });
    console.log(res.data.details.length);

    const part2body = document.getElementsByClassName("part2-body");

    //if no mandis are present
    if (res.data.details.length === 0) {
      part2body.className = "part2-body-empty";
      part2body[0].innerHTML = `
    
          <div class="part2-body-empty">
            <p class="part2-listItem">Mandi List is Empty</p>
          </div>
        
  `;
      return;
    }
    //if mandis are present
    part2body[0].innerHTML = res.data.details.map((ele) => {
      return `
      
            <div class="part2-body-content">
              <p class="part2-listItem">${ele.name}</p>
            <button class="part2-listItem-deleteBtn"> &#x274c;</button>
            </div>
          
  `;
    });
    console.log(part2body[0]);
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}

const addMandiForm = document.getElementById("addMandiForm");
addMandiForm.addEventListener("submit", addMandi);
console.log(addMandiForm);

//for adding mandi by user
async function addMandi(e) {
  try {
    e.preventDefault();
    mandiName = document.getElementById("mandiName").value;

    console.log("mandi name", mandiName);

    if (mandiName.trim() === "") {
      return;
    }
    const details = {
      name: mandiName,
    };

    const res = await axios.post(`/home/userInput/addMandi`, details, {
      headers: { Authorization: token },
    });

    document.getElementById("mandiName").value = "";
    document.getElementById("addMandiModalClose").click();
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}

const traderBtn = document.getElementById("trader-btn");
traderBtn.addEventListener("click", showTrader);
//for showing tarders entered by user
async function showTrader(e) {
  e.target.style.backgroundColor = "#4db8e8";
  document.getElementById("mandi-btn").style.backgroundColor = "White";
  try {
    const part2header = document.getElementsByClassName("part-2-header");

    //setting the header for mandi
    part2header[0].innerHTML = `
      <p id="part2-title">Trader List</p>
              <button
                id="part2-addButton"
                data-bs-toggle="modal"
                data-bs-target="#addTraderModal"
              >
                +
              </button>
      `;

    const res = await axios.get(`/home/userInput/getTrader`, {
      headers: { Authorization: token },
    });
    console.log(res.data.details.length);

    const part2body = document.getElementsByClassName("part2-body");

    //if no mandis are present
    if (res.data.details.length === 0) {
      part2body.className = "part2-body-empty";
      part2body[0].innerHTML = `
      
            <div class="part2-body-empty">
              <p class="part2-listItem">Trader List is Empty</p>
            </div>
          
    `;
      return;
    }
    //if mandis are present
    part2body[0].innerHTML = res.data.details.map((ele) => {
      return `
        
              <div class="part2-body-content">
                <p class="part2-listItem">${ele.name}</p>
              <button class="part2-listItem-deleteBtn"> &#x274c;</button>
              </div>
            
    `;
    });
    console.log(part2body[0]);
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}

const addTraderForm = document.getElementById("addTraderForm");
addTraderForm.addEventListener("submit", addTrader);
//for adding trader by user
async function addTrader(e) {
  try {
    e.preventDefault();
    traderName = document.getElementById("traderName").value;

    if (traderName.trim() === "") {
      return;
    }
    const details = {
      name: traderName,
    };

    const res = await axios.post(`/home//userInput/addTrader`, details, {
      headers: { Authorization: token },
    });

    document.getElementById("traderName").value = "";
    document.getElementById("addTraderModalClose").click();
  } catch (err) {
    document.body.innerHTML =
      document.body.innerHTML +
      '<h4 style="color: red;">Could not show Details</h4>';

    console.log(err);
  }
}
