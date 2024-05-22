const listProductHTML = document.querySelector('.listProduct');
const listCartHTML = document.querySelector('.listCart');
const iconCart = document.querySelector('.icon-cart');
const cartCounter = document.querySelector('.cart-counter');
const body = document.querySelector('body');
const closeCart = document.querySelector('.close');
const emptyCartMessage = document.querySelector('.empty-cart-message');
let products = [];
let cart = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const addDataToHTML = () => {
    if (products.length > 0) {
        products.forEach(product => {
            const newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
};

listProductHTML.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('addCart')) {
        const productId = target.parentElement.dataset.id;
        addToCart(productId);
    }
});

const addToCart = (productId) => {
    let positionThisProductInCart = cart.findIndex(item => item.product_id == productId);
    if (positionThisProductInCart === -1) {
        cart.push({ product_id: productId, quantity: 1 });
    } else {
        cart[positionThisProductInCart].quantity++;
    }
    updateCart();
};

const updateCart = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {
        emptyCartMessage.style.display = 'none';
        cart.forEach(item => {
            totalQuantity += item.quantity;
            const newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            const positionProduct = products.findIndex(value => value.id == item.product_id);
            const info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">${info.name}</div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${item.quantity}</span>
                    <span class="plus">+</span>
                </div>`;
        });
    } else {
        emptyCartMessage.style.display = 'block';
    }
    cartCounter.innerText = totalQuantity;
};

listCartHTML.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('minus') || target.classList.contains('plus')) {
        const productId = target.parentElement.parentElement.dataset.id;
        const type = target.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(productId, type);
    }
});

const changeQuantityCart = (productId, type) => {
    const index = cart.findIndex(item => item.product_id == productId);
    if (index >= 0) {
        switch (type) {
            case 'plus':
                cart[index].quantity++;
                break;
            default:
                const changeQuantity = cart[index].quantity - 1;
                if (changeQuantity > 0) {
                    cart[index].quantity = changeQuantity;
                } else {
                    cart.splice(index, 1);
                }
                break;
        }
        updateCart();
    }
};

const clearCart = () => {
    cart = [];
    updateCart();
    alert("Your cart is empty");
};

const getData = () => {
    // get data product
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();

            // get data cart from memory
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                updateCart();
            }
        });
};

getData
