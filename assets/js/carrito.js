document.addEventListener('DOMContentLoaded', () => {
    const cartTableBody = document.querySelector('#cart-items-table tbody');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTotal = document.getElementById('cart-total');
    const cartQuantity = document.getElementById('cart-quantity');
    const clearCartBtn = document.getElementById('clear-cart');
    const checkoutBtn = document.getElementById('proceed-to-checkout');
    const confirmationMsg = document.getElementById('purchase-confirmation-message');

    const saveCart = (cart) => localStorage.setItem('shoppingCart', JSON.stringify(cart));
    const loadCart = () => JSON.parse(localStorage.getItem('shoppingCart')) || [];

    const updateCartTotals = () => {
        const cart = loadCart();
        let subtotal = 0;
        let totalItems = 0;

        cartTableBody.innerHTML = '';

        if (cart.length === 0) {
            cartTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-5">Tu carrito está vacío.</td></tr>`;
        } else {
            cart.forEach(item => {
                const itemSubtotal = item.price * item.quantity;
                subtotal += itemSubtotal;
                totalItems += item.quantity;

                const row = document.createElement('tr');
                row.className = 'cart-item';
                row.dataset.productId = item.id;
                row.innerHTML = `
                    <td><img src="${item.image}" class="cart-item-img" alt="${item.name}"></td>
                    <td>${item.name}</td>
                    <td>$<span class="item-price">${item.price.toFixed(2)}</span></td>
                    <td>
                        <div class="input-group quantity-control">
                            <button class="btn btn-sm btn-outline-secondary btn-minus" type="button">-</button>
                            <input type="text" class="form-control form-control-sm text-center item-quantity" value="${item.quantity}" min="1" readonly>
                            <button class="btn btn-sm btn-outline-secondary btn-plus" type="button">+</button>
                        </div>
                    </td>
                    <td>$<span class="item-subtotal">${itemSubtotal.toFixed(2)}</span></td>
                    <td class="text-end"><button class="btn btn-sm btn-danger remove-item"><i class="fa fa-trash"></i></button></td>
                `;
                cartTableBody.appendChild(row);
            });
        }

        const shipping = subtotal > 0 ? 5.00 : 0.00;
        const total = subtotal + shipping;

        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartShipping.textContent = `$${shipping.toFixed(2)}`;
        cartTotal.textContent = `$${total.toFixed(2)}`;
        cartQuantity.textContent = totalItems;

        saveCart(cart);
    };

    window.addToCart = (product) => {
        const cart = loadCart();
        const index = cart.findIndex(item => item.id === product.id);

        if (index > -1) {
            cart[index].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart(cart);
        updateCartTotals();
    };

    cartTableBody.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const row = button.closest('.cart-item');
        const productId = row.dataset.productId;
        let cart = loadCart();
        const index = cart.findIndex(item => item.id === productId);

        if (button.classList.contains('btn-plus') && index > -1) {
            cart[index].quantity += 1;
        } else if (button.classList.contains('btn-minus') && index > -1 && cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else if (button.classList.contains('remove-item') && index > -1) {
            cart.splice(index, 1);
        } else {
            return;
        }

        saveCart(cart);
        updateCartTotals();
    });

    clearCartBtn?.addEventListener('click', () => {
        saveCart([]);
        updateCartTotals();
    });

    checkoutBtn?.addEventListener('click', () => {
        const cart = loadCart();
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Añade productos para proceder al pago.');
            return;
        }

        saveCart([]);
        updateCartTotals();

        confirmationMsg.style.display = 'block';
        setTimeout(() => confirmationMsg.style.display = 'none', 5000);
    });

    const addDemoProductsIfEmpty = () => {
        const cart = loadCart();
        if (cart.length === 0) {
            const demoCart = [
                { id: 'prod1', name: 'Zapato Deportivo Zay Verde', price: 25.00, image: './assets/img/product_single_01.jpg', quantity: 1 },
                { id: 'prod2', name: 'Accesorios Zay Clásicos', price: 10.00, image: './assets/img/product_single_02.jpg', quantity: 2 }
            ];
            saveCart(demoCart);
        }
    };

    addDemoProductsIfEmpty();
    updateCartTotals();
});
