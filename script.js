const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

let selectedGame = "";
let selectedPackage = null;

// ===============================
// ДАННЫЕ ИГР
// ===============================

const games = {
    PUBG: [
        { amount: "60 UC", price: 15000 },
        { amount: "325 UC", price: 70000 },
        { amount: "660 UC", price: 130000 },
        { amount: "1800 UC", price: 330000 }
    ],

    "Mobile Legends": [
        { amount: "86 Diamonds", price: 15000 },
        { amount: "172 Diamonds", price: 30000 },
        { amount: "257 Diamonds", price: 45000 },
        { amount: "706 Diamonds", price: 110000 }
    ],

    "Free Fire": [
        { amount: "100 Diamonds", price: 15000 },
        { amount: "310 Diamonds", price: 40000 },
        { amount: "520 Diamonds", price: 65000 },
        { amount: "1060 Diamonds", price: 125000 }
    ],

    "Brawl Stars": [
        { amount: "30 Gems", price: 15000 },
        { amount: "80 Gems", price: 35000 },
        { amount: "170 Gems", price: 70000 },
        { amount: "360 Gems", price: 140000 }
    ]
};


// ===============================
// ВЫБОР ИГРЫ
// ===============================

function selectGame(game) {

    selectedGame = game;
    selectedPackage = null;

    document.querySelectorAll(".game-card").forEach(card => {
        card.classList.remove("active");
    });

    const packagesContainer = document.querySelector(".packages");

    packagesContainer.innerHTML = "";

    games[game].forEach((item, index) => {

        const packageElement = document.createElement("div");

        packageElement.className = "package";

        packageElement.innerHTML = `
            <div>
                <strong>${item.amount}</strong>
                <span>${item.price.toLocaleString()} сум</span>
            </div>
        `;

        packageElement.onclick = () => selectPackage(index, packageElement);

        packagesContainer.appendChild(packageElement);
    });

    updateSummary();
}


// ===============================
// ВЫБОР ПАКЕТА
// ===============================

function selectPackage(index, element) {

    document.querySelectorAll(".package").forEach(item => {
        item.classList.remove("active");
    });

    element.classList.add("active");

    selectedPackage = games[selectedGame][index];

    updateSummary();
}


// ===============================
// ОБНОВЛЕНИЕ ИНФОРМАЦИИ О ЗАКАЗЕ
// ===============================

function updateSummary() {

    const gameElement = document.getElementById("summary-game");
    const amountElement = document.getElementById("summary-amount");
    const priceElement = document.getElementById("summary-price");

    if (gameElement) {
        gameElement.textContent = selectedGame || "Не выбрана";
    }

    if (amountElement) {
        amountElement.textContent =
            selectedPackage ? selectedPackage.amount : "Не выбран";
    }

    if (priceElement) {
        priceElement.textContent =
            selectedPackage
                ? selectedPackage.price.toLocaleString() + " сум"
                : "0 сум";
    }
}


// ===============================
// УНИКАЛЬНЫЙ НОМЕР ЗАКАЗА
// ===============================

function generateOrderNumber() {

    const randomNumber = Math.floor(
        100000 + Math.random() * 900000
    );

    return `BP-${randomNumber}`;
}


// ===============================
// СОЗДАНИЕ ЗАКАЗА
// ===============================

function createOrder() {

    const playerInput = document.getElementById("player-id");

    if (!selectedGame) {

        tg.showPopup({
            title: "Ошибка",
            message: "Сначала выберите игру.",
            buttons: [{ type: "ok" }]
        });

        return;
    }

    if (!selectedPackage) {

        tg.showPopup({
            title: "Ошибка",
            message: "Выберите пакет.",
            buttons: [{ type: "ok" }]
        });

        return;
    }

    if (!playerInput || !playerInput.value.trim()) {

        tg.showPopup({
            title: "Ошибка",
            message: "Введите ID игрока.",
            buttons: [{ type: "ok" }]
        });

        return;
    }

    const playerId = playerInput.value.trim();

    // Создаём уникальный номер
    const orderNumber = generateOrderNumber();

    const user = tg.initDataUnsafe?.user || {};

    const order = {

        order_number: orderNumber,

        game: selectedGame,

        amount: selectedPackage.amount,

        price: selectedPackage.price,

        player_id: playerId,

        telegram_id: user.id || "",

        telegram_username: user.username || "",

        first_name: user.first_name || "",

        status: "Новый",

        created_at: new Date().toISOString()
    };


    // Красивое сообщение пользователю

    const message = `
🎉 ЗАКАЗ СОЗДАН!

🆔 Номер заказа: #${orderNumber}

🎮 Игра: ${order.game}
💎 Товар: ${order.amount}
👤 ID игрока: ${order.player_id}

💰 Сумма: ${order.price.toLocaleString()} сум

📦 Статус: Новый

Спасибо за заказ в BuyPay! 🚀
    `;


    tg.showPopup(
        {
            title: "Заказ создан!",
            message: message,
            buttons: [
                {
                    id: "send",
                    type: "default",
                    text: "Продолжить"
                },
                {
                    id: "cancel",
                    type: "cancel",
                    text: "Отмена"
                }
            ]
        },

        function(buttonId) {

            if (buttonId === "send") {

                // Отправляем заказ Telegram-боту
                tg.sendData(JSON.stringify(order));

                // На всякий случай сохраняем заказ
                localStorage.setItem(
                    "lastOrder",
                    JSON.stringify(order)
                );
            }
        }
    );
}


// ===============================
// ЗАКАЗЫ
// ===============================

function showOrders() {

    const savedOrder = localStorage.getItem("lastOrder");

    if (!savedOrder) {

        tg.showPopup({
            title: "Мои заказы",
            message: "У вас пока нет заказов.",
            buttons: [{ type: "ok" }]
        });

        return;
    }

    const order = JSON.parse(savedOrder);

    tg.showPopup({
        title: "Мой заказ",
        message: `
🆔 #${order.order_number}

🎮 ${order.game}
💎 ${order.amount}

👤 ID: ${order.player_id}

💰 ${order.price.toLocaleString()} сум

📦 Статус: ${order.status}
        `,
        buttons: [{ type: "ok" }]
    });
}


// ===============================
// ПОМОЩЬ
// ===============================

function showHelp() {

    tg.showPopup({
        title: "YORDAM",
        message:
            "Если у вас возникли проблемы с заказом, обратитесь в поддержку BuyPay.",
        buttons: [{ type: "ok" }]
    });
}