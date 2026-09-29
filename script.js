const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

let selectedGame = "";
let selectedPackage = null;


// ===============================
// ПАКЕТЫ ИГР
// ===============================

const games = {

    "PUBG Mobile": [
        { amount: "60 UC", price: 12000 },
        { amount: "325 UC", price: 55000 },
        { amount: "660 UC", price: 105000 },
        { amount: "1800 UC", price: 270000 }
    ],

    "Mobile Legends": [
        { amount: "86 Diamonds", price: 15000 },
        { amount: "172 Diamonds", price: 30000 },
        { amount: "257 Diamonds", price: 45000 },
        { amount: "706 Diamonds", price: 80000 }
    ],

    "Free Fire": [
        { amount: "100 Diamonds", price: 15000 },
        { amount: "310 Diamonds", price: 40000 },
        { amount: "520 Diamonds", price: 65000 },
        { amount: "1060 Diamonds", price: 120000 }
    ],

    "Brawl Stars": [
        { amount: "30 Gems", price: 15000 },
        { amount: "80 Gems", price: 35000 },
        { amount: "170 Gems", price: 70000 },
        { amount: "360 Gems", price: 140000 }
    ]

};


// ===============================
// ПРИВЕТСТВИЕ
// ===============================

const user = tg.initDataUnsafe?.user;

if (user) {

    const welcome = document.getElementById("welcomeText");

    if (welcome) {
        welcome.textContent = `Xush kelibsiz, ${user.first_name || ""}!`;
    }

}


// ===============================
// ВЫБОР ИГРЫ
// ===============================

function selectGame(game) {

    selectedGame = game;
    selectedPackage = null;

    console.log("Выбрана игра:", game);


    // Убираем выделение со всех игр

    document.querySelectorAll(".game-card").forEach(card => {
        card.classList.remove("active");
    });


    // Выделяем нажатую кнопку

    const cards = document.querySelectorAll(".game-card");

    cards.forEach(card => {

        if (card.innerText.includes(game)) {
            card.classList.add("active");
        }

    });


    // Показываем выбранную игру

    const selectedGameElement =
        document.getElementById("selectedGame");

    if (selectedGameElement) {
        selectedGameElement.textContent = game;
    }


    // Обновляем пакеты

    const packagesContainer =
        document.querySelector(".packages");

    packagesContainer.innerHTML = "";


    games[game].forEach((item, index) => {

        const button = document.createElement("button");

        button.className = "package";

        button.innerHTML = `
            <strong>${item.amount}</strong>
            <span>${item.price.toLocaleString()} сум</span>
        `;


        button.onclick = function () {
            selectPackage(this, item.amount, item.price);
        };


        packagesContainer.appendChild(button);

    });


    updateSummary();

}


// ===============================
// ВЫБОР ПАКЕТА
// ===============================

function selectPackage(button, amount, price) {

    document.querySelectorAll(".package").forEach(item => {
        item.classList.remove("active");
    });


    button.classList.add("active");


    selectedPackage = {
        amount: amount,
        price: price
    };


    console.log("Выбран пакет:", selectedPackage);


    updateSummary();

}


// ===============================
// ОБНОВЛЕНИЕ ИТОГА
// ===============================

function updateSummary() {

    const summaryGame =
        document.getElementById("summaryGame");

    const summaryPackage =
        document.getElementById("summaryPackage");

    const summaryPrice =
        document.getElementById("summaryPrice");


    if (summaryGame) {
        summaryGame.textContent =
            selectedGame || "—";
    }


    if (summaryPackage) {
        summaryPackage.textContent =
            selectedPackage
                ? selectedPackage.amount
                : "—";
    }


    if (summaryPrice) {
        summaryPrice.textContent =
            selectedPackage
                ? selectedPackage.price.toLocaleString() + " сум"
                : "0 сум";
    }

}


// ===============================
// УНИКАЛЬНЫЙ НОМЕР ЗАКАЗА
// ===============================

function generateOrderNumber() {

    const number = Math.floor(
        100000 + Math.random() * 900000
    );

    return `BP-${number}`;

}


// ===============================
// СОЗДАНИЕ ЗАКАЗА
// ===============================

function createOrder() {

    // Проверяем игру

    if (!selectedGame) {

        tg.showPopup({
            title: "Выберите игру",
            message: "Сначала выберите игру.",
            buttons: [
                {
                    type: "ok"
                }
            ]
        });

        return;
    }


    // Проверяем пакет

    if (!selectedPackage) {

        tg.showPopup({
            title: "Выберите пакет",
            message: "Сначала выберите пакет игровой валюты.",
            buttons: [
                {
                    type: "ok"
                }
            ]
        });

        return;
    }


    // Получаем ID игрока

    const playerInput =
        document.getElementById("playerId");


    const playerId =
        playerInput.value.trim();


    if (!playerId) {

        tg.showPopup({
            title: "Введите ID",
            message: "Введите ID игрока.",
            buttons: [
                {
                    type: "ok"
                }
            ]
        });

        return;
    }


    // Создаём номер

    const orderNumber =
        generateOrderNumber();


    // Данные Telegram

    const telegramUser =
        tg.initDataUnsafe?.user || {};


    // Создаём заказ

    const order = {

        order_number: orderNumber,

        game: selectedGame,

        package: selectedPackage.amount,

        price: selectedPackage.price,

        player_id: playerId,

        telegram_id: telegramUser.id || "",

        username: telegramUser.username || "",

        first_name: telegramUser.first_name || "",

        status: "Новый",

        created_at: new Date().toISOString()

    };


    // Сохраняем последний заказ

    localStorage.setItem(
        "lastOrder",
        JSON.stringify(order)
    );


    // Красивое сообщение

    const message =

`🎉 ЗАКАЗ СОЗДАН!

🆔 Номер заказа: #${orderNumber}

🎮 Игра: ${selectedGame}
💎 Пакет: ${selectedPackage.amount}
👤 ID игрока: ${playerId}

💰 Сумма: ${selectedPackage.price.toLocaleString()} сум

📦 Статус: Новый

Спасибо за заказ в BuyPay! 🚀`;


    tg.showPopup({

        title: "Заказ создан!",

        message: message,

        buttons: [
            {
                id: "send",
                type: "default",
                text: "Готово"
            }
        ]

    }, function(buttonId) {

        if (buttonId === "send") {

            // Отправляем заказ Telegram-боту

            tg.sendData(
                JSON.stringify(order)
            );

        }

    });

}


// ===============================
// МОИ ЗАКАЗЫ
// ===============================

function showOrders() {

    const savedOrder =
        localStorage.getItem("lastOrder");


    if (!savedOrder) {

        tg.showPopup({

            title: "Мои заказы",

            message:
                "У вас пока нет заказов.",

            buttons: [
                {
                    type: "ok"
                }
            ]

        });

        return;
    }


    const order =
        JSON.parse(savedOrder);


    tg.showPopup({

        title: "Мой заказ",

        message:

`🆔 #${order.order_number}

🎮 ${order.game}
💎 ${order.package}

👤 ID: ${order.player_id}

💰 ${order.price.toLocaleString()} сум

📦 Статус: ${order.status}`,

        buttons: [
            {
                type: "ok"
            }
        ]

    });

}


// ===============================
// ПОМОЩЬ
// ===============================

function showHelp() {

    tg.showPopup({

        title: "YORDAM",

        message:
            "Если у вас возникли вопросы или проблемы с заказом, обратитесь в поддержку BuyPay.",

        buttons: [
            {
                type: "ok"
            }
        ]

    });

}