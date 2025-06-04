
        // Product data
        const products = [
  {
    id: 1,
    name: "Uria 100",
    image: "cover_image.png",
    basePrice: 45,
    sizes: [
      { size: "1kg", multiplier: 1 },
      { size: "5kg", multiplier: 4.8 },
      { size: "10kg", multiplier: 9.5 }
    ]
  },
  {
    id: 2,
    name: "Agro Acharya",
    image: "cover_image.png",
    basePrice: 80,
    sizes: [
      { size: "1kg", multiplier: 1 },
      { size: "5kg", multiplier: 4.7 },
      { size: "10kg", multiplier: 9.2 }
    ]
  },
  {
    id: 3,
    name: "Ts Agri Organic Fertilizer",
    image: "cover_image.png",
    basePrice: 1140,
    sizes: [
      { size: "1kg", multiplier: 1 },
      { size: "5kg", multiplier: 4.5 },
      { size: "10kg", multiplier: 8.5 }
    ]
  },
  {
    id: 4,
    name: "Pancha Ghavya 1 Liter",
    image: "cover_image.png",
    basePrice: 50,
    sizes: [
      { size: "1L", multiplier: 1 },
      { size: "5L", multiplier: 4.5 },
      { size: "10L", multiplier: 8.5 }
    ]
  },
  {
    id: 5,
    name: "Aries Agromin Max",
    image: "cover_image.png",
    basePrice: 294,
    sizes: [
      { size: "1kg", multiplier: 1 },
      { size: "5kg", multiplier: 4.5 },
      { size: "10kg", multiplier: 8.5 }
    ]
  },
  {
    id: 6,
    name: "Aries Fertisol",
    image: "cover_image.png",
    basePrice: 2789,
    sizes: [
      { size: "1kg", multiplier: 1 },
      { size: "5kg", multiplier: 4.5 },
      { size: "10kg", multiplier: 8.5 }
    ]
  },
  {
    id: 7,
    name: "Granulated Organic Fertilizer",
    image: "cover_image.png",
    basePrice: 90,
    sizes: [
      { size: "1kg", multiplier: 1 },
      { size: "5kg", multiplier: 4.5 },
      { size: "10kg", multiplier: 8.5 }
    ]
  },
  {
    id: 8,
    name: "YaraTera NPK 12:61:00",
    image: "cover_image.png",
    basePrice: 3899,
    sizes: [
      { size: "1kg", multiplier: 1 },
      { size: "5kg", multiplier: 4.5 },
      { size: "10kg", multiplier: 8.5 }
    ]
  },
  {
    id: 9,
    name: "Grow++",
    image: "cover_image.png",
    basePrice: 500,
    sizes: [
      { size: "1L", multiplier: 1 },
      { size: "5L", multiplier: 4.5 },
      { size: "10L", multiplier: 8.5 }
    ]
  },
  {
    id: 10,
    name: "Soil Gold",
    image: "cover_image.png",
    basePrice: 500,
    sizes: [
      { size: "500g", multiplier: 1 },
      { size: "1kg", multiplier: 1.8 },
      { size: "5kg", multiplier: 4.5 }
    ]
  },
  {
    id: 11,
    name: "Potaaz++",
    image: "cover_image.png",
    basePrice: 500,
    sizes: [
      { size: "1kg", multiplier: 1 },
      { size: "5kg", multiplier: 4.5 },
      { size: "10kg", multiplier: 8.5 }
    ]
  },
  {
    id: 12,
    name: "Organic Fertilizer",
    image: "cover_image.png",
    basePrice: 100,
    sizes: [
      { size: "1kg", multiplier: 1 },
      { size: "5kg", multiplier: 4.5 },
      { size: "10kg", multiplier: 8.5 }
    ]
  }
];

        let cart = [];

        // Initialize the app
        function init() {
            loadCart();
            displayProducts();
            updateCartCount();
        }

        // Display products
        function displayProducts(productsToShow = products) {
            const grid = document.getElementById('products-grid');
            grid.innerHTML = '';

            productsToShow.forEach(product => {
                const card = createProductCard(product);
                grid.appendChild(card);
            });
        }

        // Create product card
        function createProductCard(product) {
            const col = document.createElement('div');
            col.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
            
            col.innerHTML = `
                <div class="card product-card h-100">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <div class="mb-3">
                            <label class="form-label">Size:</label>
                            <select class="form-select form-select-sm" id="size-${product.id}" onchange="updatePrice(${product.id})">
                                ${product.sizes.map(size => 
                                    `<option value="${size.size}" data-multiplier="${size.multiplier}">
                                        ${size.size} - ₹${Math.round(product.basePrice * size.multiplier)}
                                    </option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Quantity:</label>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)">-</button>
                                <input type="number" class="quantity-input" id="qty-${product.id}" value="1" min="1" max="99">
                                <button class="quantity-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
                            </div>
                        </div>
                        <div class="mt-auto">
                            <div class="price-tag mb-3" id="price-${product.id}">₹${product.basePrice}</div>
                            <button class="btn btn-success w-100" onclick="addToCart(${product.id})">
                                <i class="fas fa-cart-plus me-2"></i>Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            return col;
        }

        // Update price when size changes
        function updatePrice(productId) {
            const product = products.find(p => p.id === productId);
            const sizeSelect = document.getElementById(`size-${productId}`);
            const selectedOption = sizeSelect.selectedOptions[0];
            const multiplier = parseFloat(selectedOption.dataset.multiplier);
            const newPrice = Math.round(product.basePrice * multiplier);
            
            document.getElementById(`price-${productId}`).textContent = `₹${newPrice}`;
        }

        // Change quantity
        function changeQuantity(productId, change) {
            const qtyInput = document.getElementById(`qty-${productId}`);
            let newQty = parseInt(qtyInput.value) + change;
            if (newQty < 1) newQty = 1;
            if (newQty > 99) newQty = 99;
            qtyInput.value = newQty;
        }

        // Search products
        function searchProducts() {
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );
            displayProducts(filteredProducts);
        }

        // Add to cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const sizeSelect = document.getElementById(`size-${productId}`);
            const selectedSize = sizeSelect.value;
            const multiplier = parseFloat(sizeSelect.selectedOptions[0].dataset.multiplier);
            const quantity = parseInt(document.getElementById(`qty-${productId}`).value);
            const price = Math.round(product.basePrice * multiplier);

            const cartItem = {
                id: productId,
                name: product.name,
                size: selectedSize,
                quantity: quantity,
                price: price,
                total: price * quantity,
                image: product.image
            };

            // Check if item already exists in cart
            const existingIndex = cart.findIndex(item => 
                item.id === productId && item.size === selectedSize
            );

            if (existingIndex > -1) {
                cart[existingIndex].quantity += quantity;
                cart[existingIndex].total = cart[existingIndex].price * cart[existingIndex].quantity;
            } else {
                cart.push(cartItem);
            }

            saveCart();
            updateCartCount();
            
            // Show success message
            alert(`${product.name} (${selectedSize}) added to cart!`);
        }

        // Show cart
        function showCart() {
            document.getElementById('products-section').style.display = 'none';
            document.getElementById('cart-section').style.display = 'block';
            displayCartItems();
        }

        // Show products
        function showProducts() {
            document.getElementById('cart-section').style.display = 'none';
            document.getElementById('products-section').style.display = 'block';
        }

        // Display cart items
        function displayCartItems() {
            const cartItemsContainer = document.getElementById('cart-items');
            const cartSummary = document.getElementById('cart-summary');

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart fa-3x mb-3"></i>
                        <h4>Your cart is empty</h4>
                        <p>Add some fresh products to get started!</p>
                        <button class="btn btn-success" onclick="showProducts()">
                            <i class="fas fa-leaf me-2"></i>Shop Now
                        </button>
                    </div>
                `;
                cartSummary.style.display = 'none';
                return;
            }

            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="card mb-3">
                    <div class="row g-0">
                        <div class="col-md-2">
                            <img src="${item.image}" class="img-fluid rounded-start h-100" style="object-fit: cover;" alt="${item.name}">
                        </div>
                        <div class="col-md-10">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h5 class="card-title">${item.name}</h5>
                                        <p class="card-text">
                                            <small class="text-muted">Size: ${item.size}</small><br>
                                            <small class="text-muted">Price: ₹${item.price} each</small>
                                        </p>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="quantity-controls">
                                            <button class="quantity-btn" onclick="updateCartQuantity(${cart.indexOf(item)}, -1)">-</button>
                                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
                                            <button class="quantity-btn" onclick="updateCartQuantity(${cart.indexOf(item)}, 1)">+</button>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="price-tag">₹${item.total}</div>
                                    </div>
                                    <div class="col-md-1">
                                        <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${cart.indexOf(item)})">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

            updateCartSummary();
            cartSummary.style.display = 'block';
        }

        // Update cart quantity
        function updateCartQuantity(index, change) {
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            } else {
                cart[index].total = cart[index].price * cart[index].quantity;
            }
            
            saveCart();
            updateCartCount();
            displayCartItems();
        }

        // Remove from cart
        function removeFromCart(index) {
            cart.splice(index, 1);
            saveCart();
            updateCartCount();
            displayCartItems();
        }

        // Update cart summary
        function updateCartSummary() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);
            
            document.getElementById('total-items').textContent = totalItems;
            document.getElementById('total-amount').textContent = `₹${totalAmount}`;
        }

       // Order on WhatsApp
function orderOnWhatsApp() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    let message = "🛒 *New Order from Jilani Agro Products*\n\n";
    message += "*Order Details:*\n";
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Size: ${item.size}\n`;
        message += `   Quantity: ${item.quantity}\n`;
        message += `   Price: ₹${item.total}\n\n`;
    });

    const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);
    message += `*Total Amount: ₹${totalAmount}*\n\n`;
    message += "Please confirm this order and let me know the delivery address.";

    // 👇 Your WhatsApp number here (India example: 919876543210)
    const whatsappNumber = "919561768395"; 
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}


        // Update cart count
        function updateCartCount() {
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cart-count').textContent = count;
            
            if (count === 0) {
                document.getElementById('cart-count').style.display = 'none';
            } else {
                document.getElementById('cart-count').style.display = 'inline';
            }
        }

        // Save cart to localStorage
        function saveCart() {
            try {
                const cartData = JSON.stringify(cart);
                // Using a variable instead of localStorage for Claude.ai compatibility
                window.cartData = cartData;
            } catch (error) {
                console.log('Cart data stored in memory');
            }
        }

        // Load cart from localStorage
        function loadCart() {
            try {
                const cartData = window.cartData || '[]';
                cart = JSON.parse(cartData);
            } catch (error) {
                cart = [];
            }
        }

        // Initialize the app when page loads
        document.addEventListener('DOMContentLoaded', init);