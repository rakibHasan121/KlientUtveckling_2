async function fetchdata() {
    fetch('fakestore.json')
        .then(response => {
            if (!response.ok) {
                throw Error("ERROR");
            }
            return response.json();
        })
        .then(data => {

            const html = data
                .map(products => {
                    return `
                    <div class="card_item">
                        <div class="card_inner">
                            <div class="card_top">
                                <img src="${products.image}" alt="image not found" />
                            </div>
                            <div class="card_bottom">
                                <div class="card_title">
                                    <h4>${products.title}</h4>
                                </div>
                                
                                <div class="product_price">
                                    <h3>${products.price + ' kr'}</h3>
                                </div>
                                <p><button class="add-cart">Lägg i varukorg</button></p>
                            </div>
                        </div>
                    </div>
                    `;
                })
                .join("");

            console.log(html);
            document.querySelector(".divholder").insertAdjacentHTML("afterbegin", html);
            addToCart(data);
        })
        .catch(error => {
            console.log(error);
        });
}
fetchdata();

function addToCart(product) {
    let cart = document.querySelectorAll('.add-cart');
    for (let i = 0; i < cart.length; i++) {
        cart[i].addEventListener('click', () => {
            cartNumber(product[i]);
            totalCost(product[i]);
        })
    }
}

function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumber');
    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }

}

function cartNumber(product) {
    console.log("The product is: ", product);
    let productNumbers = localStorage.getItem('cartNumber');

    productNumbers = parseInt(productNumbers);
    if (productNumbers) {
        localStorage.setItem('cartNumber', productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumber', 1);
        document.querySelector('.cart span').textContent = 1;
    }
    setItems(product);
}
function setItems(product) {
    let cartItem = localStorage.getItem('productsInCart');
    cartItem = JSON.parse(cartItem);


    if (cartItem != null) {
        if (cartItem[product.title] == undefined) {
            cartItem = {
                ...cartItem,
                [product.title]: product
            }
        }
        cartItem[product.title].incart += 1;
    } else {
        product.incart = 1;
        cartItem = {
            [product.title]: product
        }
    }
    console.log("My items are: ", cartItem);
    localStorage.setItem("productsInCart", JSON.stringify(cartItem));
}
function totalCost(product) {
    let cartCost = localStorage.getItem('totalCost');

    if (cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalCost", cartCost + product.price);
    } else {
        localStorage.setItem("totalCost", product.price);
    }
}

function displayCart() {
    let cartItem = localStorage.getItem("productsInCart");
    cartItem = JSON.parse(cartItem);
    let productContainer = document.querySelector(".products");
    let cartCost = localStorage.getItem('totalCost');
    if (cartItem && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItem).map(item => {
            productContainer.innerHTML += `
            <div class="checkoutProducts">
                <div class="product-img"><img src="${item.image}"></div>
                <div class="product-name">${item.title}</div>
                <div class="product-price">${item.price}</div>
                <div class="product-quantity">${item.incart}</div>
                <div class="totalINcart">${item.incart * item.price} kr</div>
            </div>
            `
        });
        productContainer.innerHTML += `
                <div class="totalContainer">Total: ${cartCost}kr</div>
        `;
    }
}
const name = document.getElementById('name')
const tel = document.getElementById('tel')
const form = document.getElementById('form')
const errorElement = document.getElementById('error')
const postnumber = document.getElementById('postnummer')

form.addEventListener('submit', (e) => {
    let messages = []
    if (name.value === '' || name.value == null) {
        messages.push('Name is required')
    }
    if(tel.value)
    if (postnumber.value.length != 5) {
        messages.push("Postnumber should be 5 digits")
    }

    if (messages.length > 0) {
        e.preventDefault();
        errorElement.innerText = messages.join(', ')
    }
    if(messages.length==0){
        alert("Tack.Din beställning är mottagen och hanteras inom kort.");
    }
})

onLoadCartNumbers();
displayCart();