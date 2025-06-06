
    let products = [
      {
        id: 1,
        name: "Uria 100 - Premium Nitrogen Fertilizer",
        image: "./images/product.png",
        basePrice: 45,
        category: "Fertilizer",
        description: "High-purity nitrogen fertilizer for enhanced plant growth and green foliage.",
        sizes: [
          { size: "1kg", multiplier: 1 },
          { size: "5kg", multiplier: 4.8 },
          { size: "10kg", multiplier: 9.5 }
        ]
      },
      {
        id: 2,
        name: "Agro Acharya - Complete Plant Food",
        image: "./images/product.png",
        basePrice: 80,
        category: "Plant Food",
        description: "Balanced nutrient formula for all stages of plant growth.",
        sizes: [
          { size: "1kg", multiplier: 1 },
          { size: "5kg", multiplier: 4.7 },
          { size: "10kg", multiplier: 9.2 }
        ]
      },
      {
        id: 3,
        name: "Ts Agri Organic Fertilizer",
        image: "./images/product.png",
        basePrice: 1140,
        category: "Organic",
        description: "100% organic fertilizer for sustainable farming practices.",
        sizes: [
          { size: "1kg", multiplier: 1 },
          { size: "5kg", multiplier: 4.5 },
          { size: "10kg", multiplier: 8.5 }
        ]
      },
      {
        id: 4,
        name: "Pancha Ghavya - Liquid Fertilizer",
        image: "./images/product.png",
        basePrice: 50,
        category: "Liquid Fertilizer",
        description: "Traditional Indian liquid fertilizer made from five cow products.",
        sizes: [
          { size: "1L", multiplier: 1 },
          { size: "5L", multiplier: 4.5 },
          { size: "10L", multiplier: 8.5 }
        ]
      },
      {
        id: 5,
        name: "Aries Agromin Max - Soil Enhancer",
        image: "./images/product.png",
        basePrice: 294,
        category: "Soil Conditioner",
        description: "Improves soil structure and nutrient retention capacity.",
        sizes: [
          { size: "1kg", multiplier: 1 },
          { size: "5kg", multiplier: 4.5 },
          { size: "10kg", multiplier: 8.5 }
        ]
      },
      {
        id: 6,
        name: "Aries Fertisol - Complete Nutrition",
        image: "./images/product.png",
        basePrice: 2789,
        category: "Fertilizer",
        description: "Complete NPK formula with essential micronutrients.",
        sizes: [
          { size: "1kg", multiplier: 1 },
          { size: "5kg", multiplier: 4.5 },
          { size: "10kg", multiplier: 8.5 }
        ]
      }
    ];

    let cart = [];
    let currentSort = 'default';
    let nextProductId = 7;
    let adminLoggedIn = false;
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

    // Initialize the app
    function init() {
      loadCart();
      loadProducts();
      displayProducts();
      updateCartCount();
      updateSizeInputs();
    }

    // Load products from localStorage
    function loadProducts() {
      try {
        const storedProducts = localStorage.getItem('jilaniAgroProducts');
        if (storedProducts) {
          const parsed = JSON.parse(storedProducts);
          products = parsed.products;
          nextProductId = parsed.nextId;
        }
      } catch (error) {
        console.log('Error loading products from localStorage');
      }
    }

    // Save products to localStorage
    function saveProducts() {
      try {
        const data = {
          products: products,
          nextId: nextProductId
        };
        localStorage.setItem('jilaniAgroProducts', JSON.stringify(data));
      } catch (error) {
        console.log('Error saving products to localStorage');
      }
    }

    // Display products
    function displayProducts(productsToShow = products) {
      const grid = document.getElementById('products-grid');
      grid.innerHTML = '';

      // Apply sorting
      let sortedProducts = [...productsToShow];
      if (currentSort === 'price-low') {
        sortedProducts.sort((a, b) => a.basePrice - b.basePrice);
      } else if (currentSort === 'price-high') {
        sortedProducts.sort((a, b) => b.basePrice - a.basePrice);
      } else if (currentSort === 'name') {
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      }

      sortedProducts.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
      });
    }

    // Create product card
    function createProductCard(product) {
      const col = document.createElement('div');
      col.className = 'col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-4';
      
      // Get default size
      const defaultSize = product.sizes[0];
      const defaultPrice = Math.round(product.basePrice * defaultSize.multiplier);
      
      col.innerHTML = `
        <div class="card product-card h-100 position-relative">
          <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start">
              <h5 class="card-title">${product.name}</h5>
            </div>
            <p class="small text-muted mb-2">${product.category}</p>
            <div class="mb-3">
              <label class="form-label fw-medium">Size:</label>
              <select class="form-select form-select-sm border-success" id="size-${product.id}" onchange="updatePrice(${product.id})">
                ${product.sizes.map(size => {
                  const price = Math.round(product.basePrice * size.multiplier);
                  return `<option value="${size.size}" data-multiplier="${size.multiplier}">
                            ${size.size} - ₹${price}
                          </option>`;
                }).join('')}
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Quantity:</label>
              <div class="quantity-controls">
                <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)">-</button>
                <input type="number" class="quantity-input" id="qty-${product.id}" value="1" min="1" max="99">
                <button class="quantity-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
              </div>
            </div>
            <div class="mt-auto">
              <div class="d-flex align-items-center">
                <div class="price-tag me-2" id="price-${product.id}">₹${defaultPrice}</div>
              </div>
              <button class="btn btn-success w-100 mt-2 fw-medium" onclick="addToCart(${product.id})">
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
      const price = Math.round(product.basePrice * multiplier);
      
      document.getElementById(`price-${productId}`).innerHTML = `₹${price}`;
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
        product.name.toLowerCase().includes(searchTerm) || 
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
      displayProducts(filteredProducts);
    }

    // Add to cart
    function addToCart(productId) {
      const product = products.find(p => p.id === productId);
      const sizeSelect = document.getElementById(`size-${productId}`);
      const selectedOption = sizeSelect.selectedOptions[0];
      const selectedSize = sizeSelect.value;
      const multiplier = parseFloat(selectedOption.dataset.multiplier);
      const quantity = parseInt(document.getElementById(`qty-${product.id}`).value);
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
      
      // Show toast notification
      showToast(`${product.name} (${selectedSize}) added to cart!`);
    }

    // Show toast notification
    function showToast(message) {
      // Remove existing toasts
      const existingToasts = document.querySelectorAll('.toast');
      existingToasts.forEach(toast => toast.remove());
      
      const toastEl = document.createElement('div');
      toastEl.className = 'toast align-items-center text-white bg-success border-0 position-fixed bottom-0 end-0 m-3';
      toastEl.setAttribute('role', 'alert');
      toastEl.setAttribute('aria-live', 'assertive');
      toastEl.setAttribute('aria-atomic', 'true');
      
      toastEl.innerHTML = `
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center">
            <i class="fas fa-check-circle me-2"></i> ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      `;
      
      document.body.appendChild(toastEl);
      
      // Initialize and show toast
      const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: 3000
      });
      toast.show();
    }

    // Show cart
    function showCart() {
      document.getElementById('products-section').style.display = 'none';
      document.getElementById('cart-section').style.display = 'block';
      document.getElementById('admin-section').style.display = 'none';
      displayCartItems();
    }

    // Show products
    function showProducts() {
      document.getElementById('cart-section').style.display = 'none';
      document.getElementById('products-section').style.display = 'block';
      document.getElementById('admin-section').style.display = 'none';
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
            <p class="mb-4">Add some fresh products to get started!</p>
            <button class="btn btn-success px-4 py-2 fw-medium" onclick="showProducts()">
              <i class="fas fa-leaf me-2"></i>Browse Products
            </button>
          </div>
        `;
        cartSummary.style.display = 'none';
        return;
      }

      cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="card mb-3 overflow-hidden">
          <div class="row g-0">
            <div class="col-md-2 col-4">
              <img src="${item.image}" class="cart-item-img w-100" alt="${item.name}">
            </div>
            <div class="col-md-10 col-8">
              <div class="card-body py-2">
                <div class="row">
                  <div class="col-md-6 col-12 cart-item-details">
                    <h5 class="card-title mb-1">${item.name}</h5>
                    <p class="card-text mb-1">
                      <span class="text-muted">Size: ${item.size}</span>
                    </p>
                    <p class="card-text mb-0">
                      <span class="text-success fw-medium">₹${item.price} each</span>
                    </p>
                  </div>
                  <div class="col-md-3 col-12 mt-2 mt-md-0">
                    <div class="quantity-controls">
                      <button class="quantity-btn" onclick="updateCartQuantity(${index}, -1)">-</button>
                      <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" readonly>
                      <button class="quantity-btn" onclick="updateCartQuantity(${index}, 1)">+</button>
                    </div>
                  </div>
                  <div class="col-md-2 col-6 mt-2 mt-md-0">
                    <div class="price-tag">₹${item.total}</div>
                  </div>
                  <div class="col-md-1 col-6 mt-2 mt-md-0 text-end">
                    <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${index})">
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
        showToast('Your cart is empty!');
        return;
      }

      let message = "🛒 *NEW ORDER - JILANI AGRO PRODUCTS* 🛒\n\n";
      message += "*Order Details:*\n\n";
      
      cart.forEach((item, index) => {
        message += `➤ *${item.name}*\n`;
        message += `   ▫️ Size: ${item.size}\n`;
        message += `   ▫️ Quantity: ${item.quantity}\n`;
        message += `   ▫️ Price: ₹${item.total}\n\n`;
      });

      const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);
      message += `*TOTAL ITEMS: ${cart.reduce((sum, item) => sum + item.quantity, 0)}*\n`;
      message += `*TOTAL AMOUNT: ₹${totalAmount}*\n\n`;
      message += "Please confirm this order and provide delivery address.\n\n";
      message += "_Thank you for choosing Jilani Agro!_";

      const whatsappNumber = "919561768395"; 
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }

    // Update cart count
    function updateCartCount() {
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      const badge = document.getElementById('cart-count');
      badge.textContent = count;
      
      if (count === 0) {
        badge.style.display = 'none';
      } else {
        badge.style.display = 'inline';
      }
    }

    // Save cart to localStorage
    function saveCart() {
      try {
        localStorage.setItem('jilaniAgroCart', JSON.stringify(cart));
      } catch (error) {
        console.log('Error saving cart to localStorage');
      }
    }

    // Load cart from localStorage
    function loadCart() {
      try {
        const cartData = localStorage.getItem('jilaniAgroCart');
        if (cartData) {
          cart = JSON.parse(cartData);
        }
      } catch (error) {
        console.log('Error loading cart from localStorage');
        cart = [];
      }
    }
    
    // ADMIN FUNCTIONS
    
    // Show admin login modal
    function showAdminLogin() {
      document.getElementById('admin-login-modal').style.display = 'block';
    }
    
    // Hide admin login modal
    function hideAdminLogin() {
      document.getElementById('admin-login-modal').style.display = 'none';
    }
    
    // Admin login
    function adminLogin(event) {
      event.preventDefault();
      const username = document.getElementById('admin-username').value;
      const password = document.getElementById('admin-password').value;
      
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        adminLoggedIn = true;
        hideAdminLogin();
        showAdminPanel();
      } else {
        showToast('Invalid admin credentials!');
      }
    }
    
    // Admin logout
    function adminLogout() {
      adminLoggedIn = false;
      showProducts();
    }
    
    // Show admin panel
    function showAdminPanel() {
      document.getElementById('products-section').style.display = 'none';
      document.getElementById('cart-section').style.display = 'none';
      document.getElementById('admin-section').style.display = 'block';
      updateAdminProductsList();
    }
    
    // Add size input fields
    function addSizeInput() {
      const sizeContainer = document.getElementById('size-container');
      const sizeId = Date.now();
      
      const sizeDiv = document.createElement('div');
      sizeDiv.className = 'size-controls';
      sizeDiv.innerHTML = `
        <div class="size-inputs">
          <input type="text" class="form-control" placeholder="Size (e.g., 1kg)" required>
          <input type="number" class="form-control" placeholder="Multiplier" min="0.1" step="0.1" required>
        </div>
        <button type="button" class="btn-remove-size" onclick="removeSizeInput(this)">
          <i class="fas fa-times"></i>
        </button>
      `;
      
      sizeContainer.appendChild(sizeDiv);
    }
    
    // Remove size input
    function removeSizeInput(button) {
      button.closest('.size-controls').remove();
    }
    
    // Update size inputs on page load
    function updateSizeInputs() {
      const sizeContainer = document.getElementById('size-container');
      sizeContainer.innerHTML = `
        <div class="size-controls">
          <div class="size-inputs">
            <input type="text" class="form-control" placeholder="Size (e.g., 1kg)" required>
            <input type="number" class="form-control" placeholder="Multiplier" min="0.1" step="0.1" required>
          </div>
        </div>
      `;
    }
    
    // Handle image preview
    document.getElementById('product-image').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const preview = document.getElementById('image-preview');
          preview.src = event.target.result;
          preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
      }
    });
    
    // Add product to the store
    function addProduct(event) {
      event.preventDefault();
      
      // Get form values
      const name = document.getElementById('product-name').value;
      const category = document.getElementById('product-category').value;
      const basePrice = parseFloat(document.getElementById('product-price').value);
      const description = document.getElementById('product-description').value;
      const imageFile = document.getElementById('product-image').files[0];
      
      // Get sizes
      const sizes = [];
      const sizeControls = document.querySelectorAll('.size-controls');
      sizeControls.forEach(control => {
        const inputs = control.querySelectorAll('input');
        const size = inputs[0].value;
        const multiplier = parseFloat(inputs[1].value);
        
        if (size && multiplier) {
          sizes.push({ size, multiplier });
        }
      });
      
      // Validate inputs
      if (!name || !category || isNaN(basePrice)) {
        showToast('Please fill all required fields!');
        return;
      }
      
      if (!imageFile) {
        showToast('Please select a product image!');
        return;
      }
      
      if (sizes.length === 0) {
        showToast('Please add at least one size option!');
        return;
      }
      
      // Process image
      const reader = new FileReader();
      reader.onload = function(event) {
        const newProduct = {
          id: nextProductId++,
          name,
          image: event.target.result,
          basePrice,
          category,
          description,
          sizes
        };
        
        // Add to products array
        products.push(newProduct);
        
        // Save to localStorage
        saveProducts();
        
        // Reset form
        document.getElementById('product-form').reset();
        document.getElementById('image-preview').style.display = 'none';
        updateSizeInputs();
        
        // Show success message
        showToast(`${name} added successfully!`);
        
        // Update products list
        updateAdminProductsList();
      };
      
      reader.readAsDataURL(imageFile);
    }
    
    // Update admin products list
    function updateAdminProductsList() {
      const list = document.getElementById('admin-products-list');
      list.innerHTML = '';
      
      products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>₹${product.basePrice}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">
              <i class="fas fa-trash"></i> Delete
            </button>
          </td>
        `;
        list.appendChild(row);
      });
    }
    
    // Delete product
    function deleteProduct(productId) {
      if (confirm('Are you sure you want to delete this product?')) {
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
          products.splice(index, 1);
          saveProducts();
          updateAdminProductsList();
          showToast('Product deleted successfully!');
        }
      }
    }

    // Initialize the app when page loads
    document.addEventListener('DOMContentLoaded', init);
