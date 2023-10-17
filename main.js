$(document).ready(function () {
  $("#list").click(function (event) {
      event.preventDefault();
      $("#products .item").addClass("list-group-item");
  });
  $("#grid").click(function (event) {
      event.preventDefault();
      $("#products .item").removeClass("list-group-item");
      $("#products .item").addClass("grid-group-item");
  });
});
function fetchProducts() {
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
      const rowElement = document.querySelector("#products");

      rowElement.innerHTML = '';

      data.forEach(product => {
        const productDiv = createProductDiv(product);
        rowElement.appendChild(productDiv);
      });
    });
}

const product = {fetchProducts};

// Hämta den befintliga varukorgen från localStorage eller skapa en ny om den inte finns
const cart = JSON.parse(localStorage.getItem("addToCart")) || [];

// Lägg till produkten i varukorgen
cart.push(product);

// Spara den uppdaterade varukorgen i localStorage
localStorage.setItem("addToCart", JSON.stringify(cart));
console.log(cart)

function createProductDiv(product) {
  const productDiv = document.createElement("div");
  productDiv.className = "item col-xs-4 col-lg-4";

  productDiv.innerHTML = `
      <div class="thumbnail">

          <img src="${product.image}" style="max-height: 200px" onclick="onClick(this)" id="imgbtn">
          <div class="caption">
              <h4 class="group inner list-group-item-heading" >
                  ${product.title}
              </h4>
              <p class="group inner list-group-item-text line-clamp" >
                  ${product.description} ${product.category}
              </p>
              <div class="row">
                  <div class="col-xs-12 col-md-6">
                      <p class="lead">
                          $${product.price}
                      </p>
                  </div>
                  <div class="col-xs-12 col-md-6">
                      <button onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="buy-now btn btn-success effect effect-4 add-to-cart">add to cart</button>
                  </div>
                  
              </div>
          </div>
      </div>
        </div>
      
      
      <div id="modal01" class="modal" onclick="this.style.display='none'">
        <span class="close">&times;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <div class="modal-content">
          <img id="img01" style="max-width:100%">
          <h4 style="color: white;" >${product.description}</h4>
        </div>
      </div>
          
  `;

  return productDiv;
}

function filterProductsByCategory(category) {
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
      const filteredProducts = data.filter(product => product.category === category);
      displayFilteredProducts(filteredProducts);
    });
}

function displayFilteredProducts(products) {
  const rowElement = document.querySelector("#products");
  rowElement.innerHTML = '';

  products.forEach(product => {
    const productDiv = createProductDiv(product);
    rowElement.appendChild(productDiv);
  });
}

fetchProducts();

let count = 0;

const addToCart = (id, price) => {
  count = count + 1;
  updatePrice("price", price);
  updateTaxAndCharge();
  updateTotal();
  document.getElementById("total-Products").innerText = count;
};

const getInputValue = (id) => {
  const element = document.getElementById(id).innerText;
  const converted = parseInt(element);
  return converted;
};

const updatePrice = (id, value) => {
  const convertedOldPrice = getInputValue(id);
  const convertPrice = parseFloat(value);
  const total = convertedOldPrice + convertPrice;
  document.getElementById(id).innerText = Math.round(total);
};

const setInnerText = (id, value) => {
  document.getElementById(id).innerText = Math.round(value);
};

const updateTaxAndCharge = () => {
  const priceConverted = getInputValue("price");
  let deliveryCharge = 20;
  let totalTax = 0;

  if (priceConverted > 200) {
    deliveryCharge = 0
    totalTax = priceConverted * -0.2;
  }

  if (priceConverted > 400) {
    totalTax = priceConverted * -0.3;
  }

  if (priceConverted > 500) {
    totalTax = priceConverted * -0.4;
  }

  setInnerText("delivery-charge", deliveryCharge);
  setInnerText("total-tax", totalTax);
};

const updateTotal = () => {
  const priceConverted = getInputValue("price");
  const deliveryCharge = getInputValue("delivery-charge");
  const totalTax = getInputValue("total-tax");
  const grandTotal = priceConverted + deliveryCharge + totalTax;

  document.getElementById("total").innerText = grandTotal;
};
function resetProducts() {
  fetchProducts(); 
}
const resetButton = document.getElementById("reset-button");

function onClick(element) {
  document.getElementById("img01").src = element.src;
  document.getElementById("modal01").style.display = "block";
}




