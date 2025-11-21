
class Product {
    constructor(name, image, price, description, rating) {
        this.name = name;
        this.image = image;
        this.price = price;
        this.description = description;
        this.rating = rating;
    }

    addToCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const exists = cart.find(item => item.name === this.name);

        if (!exists) {
            cart.push({
                name: this.name,
                image: this.image,
                price: this.price,
                description: this.description,
                rating: this.rating
            });
            localStorage.setItem('cart', JSON.stringify(cart));
            renderProducts();
            updateCartPage();
        }
    }

    removeFromCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.name !== this.name);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderProducts();
        updateCartPage();
    }

    isInCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart.some(item => item.name === this.name);
    }

    renderCard() {
        const card = document.createElement('div');
        card.className = 'product-card';

        const inCart = this.isInCart();
        const buttonClass = inCart ? 'btn btn-remove' : 'btn btn-add';
        const buttonText = inCart ? 'Убрать из корзины' : 'В корзину';

        card.innerHTML = `
            <img src="${this.image}" alt="${this.name}" class="product-image">
            <h3 class="product-name">${this.name}</h3>
            <p class="product-description">${this.description}</p>
            <div class="product-price">${this.price} сом</div>
            <div class="product-rating">${'⭐'.repeat(this.rating)}</div>
            <button class="${buttonClass}" onclick="handleCartAction('${this.name}')">${buttonText}</button>
        `;

        return card;
    }
}


const products = [
    new Product(
        'Смартфон Galaxy S24',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        76990,
        'Флагманский смартфон с мощным процессором и камерой высокого разрешения',
        5
    ),
    new Product(
        'Ноутбук MacBook Pro',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        128490,
        'Профессиональный ноутбук для работы и творчества',
        5
    ),
    new Product(
        'Наушники AirPods Pro',
        'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
        21390,
        'Беспроводные наушники с активным шумоподавлением',
        4
    ),
    new Product(
        'Умные часы Galaxy Watch',
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
        25690,
        'Стильные умные часы с множеством функций для здоровья',
        4
    ),
    new Product(
        'Планшет iPad Air',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        51390,
        'Мощный планшет для работы и развлечений',
        5
    ),
    new Product(
        'Игровая консоль PS5',
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
        47090,
        'Новейшая игровая консоль следующего поколения',
        5
    ),
    new Product(
        'Камера Canon EOS',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
        68490,
        'Профессиональная зеркальная камера для фотографов',
        5
    ),
    new Product(
        'Монитор Dell UltraSharp',
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
        34290,
        '27-дюймовый монитор с высоким разрешением 4K',
        4
    ),
    new Product(
        'Клавиатура механическая',
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
        7690,
        'Игровая механическая клавиатура с RGB подсветкой',
        4
    ),
    new Product(
        'Мышь Logitech MX',
        'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
        5990,
        'Беспроводная мышь для профессионалов',
        4
    )
];


function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    products.forEach(product => {
        grid.appendChild(product.renderCard());
    });
}


function handleCartAction(productName) {
    const product = products.find(p => p.name === productName);
    if (product) {
        if (product.isInCart()) {
            product.removeFromCart();
        } else {
            product.addToCart();
        }
    }
}

function updateCartPage() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cartItems');
    const cartSummaryDiv = document.getElementById('cartSummary');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <div class="empty-cart-text">Корзина пуста</div>
            </div>
        `;
        cartSummaryDiv.innerHTML = '';
        return;
    }

    cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} сом</div>
            </div>
            <button class="btn btn-remove" onclick="removeFromCartByName('${item.name}')">Удалить</button>
        </div>
    `).join('');

    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    const totalCount = cart.length;

    cartSummaryDiv.innerHTML = `
        <div class="cart-summary">
            <div class="summary-row">
                <span>Количество товаров:</span>
                <span>${totalCount}</span>
            </div>
            <div class="summary-row summary-total">
                <span>Итого:</span>
                <span>${totalPrice.toLocaleString()} сом</span>
            </div>
            <button class="btn btn-buy" onclick="buyProducts()">Купить</button>
        </div>
    `;
}


function removeFromCartByName(productName) {
    const product = products.find(p => p.name === productName);
    if (product) {
        product.removeFromCart();
    }
}


function buyProducts() {
    alert('Успешно куплено!');
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartPage();
    renderProducts();
}


document.getElementById('navHome').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('mainPage').classList.add('active');
    document.getElementById('cartPage').classList.remove('active');
    document.getElementById('navHome').classList.add('active');
    document.getElementById('navCart').classList.remove('active');
});

document.getElementById('navCart').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('mainPage').classList.remove('active');
    document.getElementById('cartPage').classList.add('active');
    document.getElementById('navHome').classList.remove('active');
    document.getElementById('navCart').classList.add('active');
    updateCartPage();
});


renderProducts();