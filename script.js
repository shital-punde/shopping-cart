document.addEventListener("DOMContentLoaded", function() {
    const productsContainer = document.querySelector(".products");
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPrice = document.getElementById("total-price");
    const averagePrice = document.getElementById("average-price");
    const clearCartBtn = document.getElementById("clear-cart"); // Get the Clear Cart button element
    let cart = [];
    let products = [];

    // Fetch products from JSON file
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(data);
        });

    // Display products on the webpage
    function displayProducts(products) {
        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product");
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productsContainer.appendChild(productCard);
        });
    }

    // Add item to cart
    window.addToCart = function(productId) {
        const product = getProductById(productId);
        const existingCartItem = cart.find(item => item.id === productId);

        if (existingCartItem) {
            existingCartItem.quantity++;
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        displayCart();
    };

    // Remove item from cart
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        displayCart();
    };

    // Update item quantity in cart
    window.updateCart = function(index, quantity) {
        if (quantity <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = quantity;
        }
        displayCart();
    };

    // Clear the cart
    clearCartBtn.addEventListener("click", function() {
        cart = [];
        displayCart();
    });

    // Display cart items and calculate total price
    function displayCart() {
        cartItemsContainer.innerHTML = "";
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty</p>";
            totalPrice.textContent = "0.00";
            averagePrice.textContent = "0.00";
            return;
        }
        let total = 0;
        cart.forEach((item, index) => {
            const cartItem = document.createElement("li");
            cartItem.innerHTML = `
                ${item.name} - $${item.price} x 
                <input type="number" min="1" value="${item.quantity}" onchange="updateCart(${index}, this.value)">
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
            total += item.price * item.quantity;
        });
        totalPrice.textContent = total.toFixed(2);
        
        // Calculate and display average price
        calculateAveragePrice();
    }

    function calculateAveragePrice() {
        if (cart.length > 0) {
            const totalPrices = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
            const average = totalPrices / cart.reduce((acc, item) => acc + item.quantity, 0);
            averagePrice.textContent = average.toFixed(2);
        } else {
            averagePrice.textContent = "0.00";
        }
    }

    function getProductById(productId) {
        return products.find(product => product.id === productId);
    }
});
