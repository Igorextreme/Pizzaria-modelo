document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggle-hours");
    const hoursList = document.getElementById("hours-list");
    const showDeliveryButton = document.getElementById("show-delivery-section");
    const deliverySection = document.getElementById("delivery-section");
    const cartTotalElement = document.getElementById("cart-total");
    const finalizeOrderButton = document.getElementById("finalize-order");
    const addressInput = document.getElementById("address");

    // Adiciona o evento apenas se o botão de delivery existir no DOM
    if (showDeliveryButton) {
        showDeliveryButton.addEventListener("click", function () {
            deliverySection.classList.remove("hidden");
            showDeliveryButton.classList.add("hidden");
            updateCart(); // Atualizar o total com a taxa de entrega se aplicável
        });
    }

    toggleButton.addEventListener("click", function () {
        hoursList.classList.toggle("hidden");
    });

    function checkOperatingHours() {
        const currentDate = new Date();
        const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();

        // Pizzaria operating hours (adjust as needed)
        const openingHour = 18;
        const closingHour = 23;

        let isOpen = currentHour >= openingHour && currentHour < closingHour;

        if (currentHour === closingHour && currentMinute === 0) {
            isOpen = false;
        }

        if (isOpen) {
            toggleButton.classList.remove("bg-red-500", "hover:bg-red-600");
            toggleButton.classList.add("bg-green-500", "hover:bg-green-600");
            toggleButton.textContent = `Abre às ${openingHour}:00 às ${closingHour}:00`;
        } else {
            toggleButton.classList.remove("bg-green-500", "hover:bg-green-600");
            toggleButton.classList.add("bg-red-500", "hover:bg-red-600");
            toggleButton.textContent = "Fora do Horário de Funcionamento";
        }
    }

    checkOperatingHours(); // Check when the page loads
    setInterval(checkOperatingHours, 60000); // Recheck every minute
});


function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.remove("hidden");

    // Ocultar a notificação após 3 segundos
    setTimeout(() => {
        notification.classList.add("hidden");
    }, 3000);
}

let cart = [];
let cartTotal = 0;

function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
    showNotification(`${name} foi adicionado ao carrinho!`);
  
    // Atualizar exibição do carrinho
    document.getElementById('cart-count').classList.remove('hidden');
    document.getElementById('cart-count').textContent = cart.length;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();

    // Atualizar o contador do carrinho
    if (cart.length === 0) {
        document.getElementById('cart-count').classList.add('hidden');
    } else {
        document.getElementById('cart-count').textContent = cart.length;
    }
}
// Adiciona um event listener para detectar mudanças no campo de observações
document.getElementById('order-notes').addEventListener('input', updateCart);

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const finalizeOrder = document.getElementById('finalize-order');
    const address = document.getElementById('address').value;
    const orderNotes = document.getElementById('order-notes').value; // Pega o valor atualizado das observações sempre que a função é chamada

    cartItems.innerHTML = '';
    let total = 0;
    let orderText = 'Pedido: %0A'; // Inicia o texto do pedido

    cart.forEach((item, index) => {
        total += item.price;
        cartItems.innerHTML += `
            <li class="flex justify-between items-center border-b py-2">
                <span>${item.name}</span>
                <span>R$ ${item.price.toFixed(2)}</span>
                <button class="text-red-500 hover:text-red-700" onclick="removeFromCart(${index})">
                    Remover
                </button>
            </li>`;
        orderText += `- ${item.name}: R$ ${item.price.toFixed(2)}%0A`; // Adiciona cada item ao texto do pedido
    });

    // Sempre pega o valor atualizado das observações
    if (orderNotes) {
        orderText += `%0AObservações: ${orderNotes}%0A`; // Adiciona as observações ao texto do pedido
    }

    // Se houver endereço, adicionar taxa de entrega
    if (address) {
        total += 4; // Adiciona taxa de entrega de R$ 4,00
        orderText += `%0ATaxa de Entrega: R$ 4.00%0A`; // Adiciona a taxa de entrega ao texto do pedido
        orderText += `%0AEndereço de Entrega: ${address}%0A`; // Adiciona o endereço ao texto do pedido
    }

    

    cartTotalElement.innerText = `R$ ${total.toFixed(2)}`;
    orderText += `%0ATotal: R$ ${total.toFixed(2)}%0A`; // Adiciona o total ao texto do pedido

    // Link para o WhatsApp com o texto do pedido
    finalizeOrder.href = `https://wa.me/558698553437?text=${orderText}`;
}



function toggleCart() {
    const cart = document.getElementById('cart');
    cart.classList.toggle('hidden'); // Mostra ou esconde o carrinho

    if (!cart.classList.contains('hidden')) {
        document.body.classList.add('no-scroll'); // Desabilita o scroll no fundo
    } else {
        document.body.classList.remove('no-scroll'); // Habilita o scroll no fundo
    }
}


// Atualiza o link do pedido quando o endereço é alterado
document.getElementById('address').addEventListener('input', updateCart);
