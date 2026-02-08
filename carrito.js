const CLAVE_STORAGE = 'carrito_solanbeat';

// Agregar producto
function addToCart(p) {
    let cart = JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];
    const item = cart.find(i => i.id === p.id);
    if (item) { item.cantidad++; } 
    else { cart.push({ id: p.id, nombre: p.name, precio: p.price, imagen: p.image, cantidad: 1 }); }
    
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(cart));
    actualizarContador();
    alert("✅ " + p.name + " agregado.");
}

// Dibujar la tabla
function cargarTablaCarrito() {
    const cart = JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];
    const tabla = document.querySelector('#cart-items-table tbody');
    if (!tabla) return;

    tabla.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        tabla.innerHTML = '<tr><td colspan="5" class="text-center py-4">Tu carrito está vacío 😢</td></tr>';
    } else {
        cart.forEach(i => {
            const sub = i.precio * i.cantidad;
            total += sub;
            tabla.innerHTML += `
                <tr>
                    <td><img src="${i.imagen}" width="50" class="me-2 rounded border">${i.nombre}</td>
                    <td>$${i.precio.toFixed(2)}</td>
                    <td class="text-center">${i.cantidad}</td>
                    <td>$${sub.toFixed(2)}</td>
                    <td><button class="btn btn-sm text-danger" onclick="eliminarItem('${i.id}')"><i class="fas fa-trash"></i></button></td>
                </tr>`;
        });
    }
    const totalElem = document.getElementById('cart-total');
    if (totalElem) totalElem.innerText = `$${total.toFixed(2)}`;
}

function eliminarItem(id) {
    let cart = JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(cart));
    cargarTablaCarrito();
    actualizarContador();
}

function actualizarContador() {
    const cart = JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];
    const count = cart.reduce((acc, i) => acc + i.cantidad, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = count;
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();
    cargarTablaCarrito();
});