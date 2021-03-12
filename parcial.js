const url =
    "datos.json";



fetch(url).then(res => res.json().then(res => {
    const space = document.getElementById("space");
    Object.keys(res).forEach((key) => {
        const enlace = document.getElementById(res[key].name);
        enlace.onclick = () => {
            let i = 0;
            while (i < res[key].products.length) {
                //console.log(res[key].products[i]);
                let tableSelected = `<h1>${res[key].name}</h1>
        <table class="table">
              <tbody id ="menutable">
                <td>${res[key].products[i].name}</td>
                <td>${res[key].products[i].description}</td>
                <td>${res[key].products[i].price}</td>
                <td>${res[key].products[i].image}</td>
              </tbody>
        </table>
    </div>`;
                space.innerHTML = tableSelected;
                i++;
            }
        }
    });

}));