const url =
    "datos.json";
let itemsActuales = {
    names: [],
    descriptions: [],
    prices: []
};

let pedidos = {
    names: [],
    descriptions: [],
    prices: [],
    amount: [],
    quantity: []
};
let items = 0;
const carrito = document.getElementById("carrito");
function addCart(btn) {
    for (let j of btn) {
        j.onclick = () => {
            items++;
            carrito.innerHTML = items + " items";
            let s = 0;
            while (s < itemsActuales.names.length) {
                if (itemsActuales.names[s].replace(/\s/g, '') === j.id) {
                    let founded = pedidos.names.find(elem => elem === itemsActuales.names[s])
                    if (!founded) {
                        pedidos.names.unshift(itemsActuales.names[s]);
                        pedidos.descriptions.unshift(itemsActuales.descriptions[s]);
                        pedidos.prices.unshift(itemsActuales.prices[s]);
                        pedidos.amount.unshift(itemsActuales.prices[s]);
                        pedidos.quantity.unshift(1);
                    } else {
                        pedidos.amount[pedidos.names.indexOf(founded)] += pedidos.amount[pedidos.names.indexOf(founded)];
                        pedidos.quantity[pedidos.names.indexOf(founded)]++;
                    }
                }
                s++;
            }
        };
    }
}

function actCart() {
    const space = document.getElementById("space");
    let prod =
        `<h2>Order detail</h2> 
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty.</th>
                            <th>Description</th>
                            <th>Unit Price</th>
                            <th>Amount</th>
                            <th>Modify</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
    let k = 0;
    let total = 0;
    while (k < pedidos.names.length) {
        total += pedidos.amount[k];
        prod +=
            `<tr>
            <td>${k + 1}</td>
            <td id = "quantity${pedidos.names[k].replace(/\s/g, '')}">${pedidos.quantity[k]}</td>
            <td>${pedidos.descriptions[k]}</td>
            <td>${pedidos.prices[k]}</td>
            <td id = "amount${pedidos.names[k].replace(/\s/g, '')}">${pedidos.amount[k]}</td>
            <td><button id = "mas${pedidos.names[k].replace(/\s/g, '')}" class="modMas">+</button><button id = "menos${pedidos.names[k].replace(/\s/g, '')}" class="modMenos">-</button>
            </td>
        </tr>`
        k++;
    }
    prod += `
        </tbody>
    </table>
    <label id="total"><strong>Total: $ ${total}</strong></label>
    <div id = "buttons">
        <button id="cancel" type="button" class="btn btn-danger"> Cancel </button>
        <button id="confirm" type="button" class="btn btn btn-light"> Confirm order </button>
    </div>`
    space.innerHTML = prod;
}

function change() {
    const btnAumento = document.getElementsByClassName("modMas");
    const btnDiminish = document.getElementsByClassName("modMenos");
    for (let j of btnAumento) {
        const labelTotal = document.getElementById("total");
        j.onclick = () => {
            let s = 0;
            let total = 0;
            while (s < pedidos.names.length) {
                if ("mas" + pedidos.names[s].replace(/\s/g, '') === j.id) {
                    pedidos.amount[s] += pedidos.prices[s];
                    pedidos.quantity[s]++;
                    const amount = document.getElementById("amount" + pedidos.names[s].replace(/\s/g, ''));
                    amount.innerHTML = parseFloat(pedidos.amount[s].toFixed(2));
                    const quantity = document.getElementById("quantity" + pedidos.names[s].replace(/\s/g, ''));
                    quantity.innerHTML = pedidos.quantity[s];
                }
                total += parseFloat(pedidos.amount[s].toFixed(2));
                s++;
            }
            labelTotal.innerHTML = `<strong>Total: $ ${parseFloat(total.toFixed(2))}</strong>`;
        };
    }
    for (let k of btnDiminish) {
        const labelTotal = document.getElementById("total");
        k.onclick = () => {
            let t = 0;
            let total = 0;
            while (t < pedidos.names.length) {
                if ("menos" + pedidos.names[t].replace(/\s/g, '') === k.id) {
                    if (pedidos.amount[t] > 0) {
                        pedidos.amount[t] -= pedidos.prices[t];
                        pedidos.quantity[t]--;
                    }
                    const amount = document.getElementById("amount" + pedidos.names[t].replace(/\s/g, ''));
                    amount.innerHTML = parseFloat(pedidos.amount[t].toFixed(2));
                    const quantity = document.getElementById("quantity" + pedidos.names[t].replace(/\s/g, ''));
                    quantity.innerHTML = pedidos.quantity[t];
                }
                total += parseFloat(pedidos.amount[t].toFixed(2));
                t++;
            }
            labelTotal.innerHTML = `<strong>Total: $ ${parseFloat(total.toFixed(2))}</strong>`;
        };
    }
}

fetch(url).then(res => res.json().then(res => {
    const space = document.getElementById("space");
    Object.keys(res).forEach((key) => {
        const enlace = document.getElementById(res[key].name.replace(/\s/g, ''));
        const imgCarrito = document.getElementById("imgCarrito");
        enlace.onclick = () => {
            let i = 0;
            let tableSelected = `<hr /> <h2>${res[key].name}</h2> <hr />`;
            while (i < res[key].products.length) {
                if (!itemsActuales.names.find(element => element === res[key].products[i].name)) {
                    itemsActuales.names.push(res[key].products[i].name);
                    itemsActuales.descriptions.push(res[key].products[i].description);
                    itemsActuales.prices.push(res[key].products[i].price);
                }
                tableSelected += `
                <div class="col-3">
                    <img class="img-fluid" src="${res[key].products[i].image}" alt = ${res[key].products[i].name}>
                    <h3>${res[key].products[i].name}</h3> 
                    <p>${res[key].products[i].description}</p> 
                    <p><strong>$${res[key].products[i].price}</strong></p>
                    <button id = ${res[key].products[i].name.replace(/\s/g, '')} class = "add"> Add to car </button>
                </div>
            `;
                i++;
            }
            space.innerHTML = tableSelected;
            const btn = document.getElementsByClassName("add");
            addCart(btn);
        }
        imgCarrito.onclick = () => {
            actCart();
            change();
            const btnCancel = document.getElementById("cancel");
            const btnConfirm = document.getElementById("confirm");
            btnCancel.onclick = () => {
                save();
            };
            btnConfirm.onclick = () => {
                confirmed('conf');
                actCart();
            }
        }
    });
}));

function confirmed(type){
    let array = [];
    for (let index = 0; index < pedidos.names.length; index++) {
        let obj = {
            item: index + 1,
            quantity: pedidos.quantity[index],
            description: pedidos.descriptions[index],
            unitPrice: pedidos.prices[index]
        }
        array.push(obj);
    }
    if(type==='conf'){
        console.log(array);
    }
    pedidos.names = [];
    pedidos.descriptions = [];
    pedidos.prices = [];
    pedidos.amount = [];
    pedidos.quantity = [];
    items = 0;
    carrito.innerHTML = items + " items";
}

const ui = {
    confirm: async (message) => createConfirm(message)
}
  
  const createConfirm = (message) => {
    return new Promise((complete, failed)=>{
      let msg = document.querySelector('#confirmMessage');
      let mYes = document.querySelector('#confirmYes');
      let mNo = document.querySelector('#confirmNo');
      let mClose = document.querySelector('#close');
      let confirm = document.querySelector('.confirm');
      msg.innerHTML = message;
      mYes.onclick = () => {
        confirm.style.display = 'none';
        complete(true);
      }

      mNo.onclick = () => {
        confirm.style.display = 'none';
        complete(false);
      }
      
      mClose.onclick = () => {
        confirm.style.display = 'none';
        complete(false);
      }
      confirm.style.display = 'inline';
    });
  }
                       
  const save = async () => {
    const confirm = await ui.confirm('Are you sure about cancelling the order?');
    if(confirm){
        confirmed('cancel');
        actCart();
    }
  }