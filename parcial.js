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
    amount: []
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
                    } else {
                        pedidos.amount[pedidos.names.indexOf(founded)] += pedidos.amount[pedidos.names.indexOf(founded)];
                    }
                }
                s++;
            }
        };
    }
}

function actCart(space) {
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
            <td>${pedidos.names[k]}</td>
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
        <button type="button" class="btn btn btn-light"> Confirm order </button>
    </div>
    <label id = "info"><strong>Contact us: +57 3102105253 - info@restaurant.com - @restaurant`
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
                    const amount = document.getElementById("amount" + pedidos.names[s].replace(/\s/g, ''));
                    amount.innerHTML = parseFloat(pedidos.amount[s].toFixed(2));
                }
                total += parseFloat(pedidos.amount[s].toFixed(2));
                s++;
            }
            labelTotal.innerHTML=`<strong>Total: $ ${parseFloat(total.toFixed(2))}</strong>`;
        };
    }
    for (let k of btnDiminish){
        const labelTotal = document.getElementById("total");
        k.onclick = () => {
            let t = 0;
            let total = 0;
            while (t < pedidos.names.length) {
                if ("menos" + pedidos.names[t].replace(/\s/g, '') === k.id) {
                    pedidos.amount[t] -= pedidos.prices[t];
                    const amount = document.getElementById("amount" + pedidos.names[t].replace(/\s/g, ''));
                    amount.innerHTML = parseFloat(pedidos.amount[t].toFixed(2));
                }
                total += parseFloat(pedidos.amount[t].toFixed(2));
                t++;
            }
            console.log(total);
            labelTotal.innerHTML=`<strong>Total: $ ${parseFloat(total.toFixed(2))}</strong>`;
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
            let tableSelected = `<h2>${res[key].name}</h2> <div class="row">`;
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
            tableSelected += "</div>"
            space.innerHTML = tableSelected;
            const btn = document.getElementsByClassName("add");
            addCart(btn);
        }
        imgCarrito.onclick = () => {
            actCart(space);
            const btnCancel = document.getElementById("cancel");
            btnCancel.onclick=()=>{
                bootbox.confirm("Are you sure?", function(result){ 
                })
            }
            change();
        }
    });
}));