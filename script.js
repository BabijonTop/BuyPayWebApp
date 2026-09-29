// ========================================
// TELEGRAM WEB APP
// ========================================

const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


// ========================================
// ПОЛЬЗОВАТЕЛЬ TELEGRAM
// ========================================

const telegramUser = tg.initDataUnsafe?.user || {};

const welcomeText = document.getElementById("welcomeText");

if (welcomeText && telegramUser.first_name) {
    welcomeText.textContent =
        `Xush kelibsiz, ${telegramUser.first_name}!`;
}


// ========================================
// ДАННЫЕ ИГР
// ========================================

const games = {

    "PUBG Mobile": [
        {
            amount: "60 UC",
            price: 12000
        },
        {
            amount: "325 UC",
            price: 55000
        },
        {
            amount: "660 UC",
            price: 105000
        },
        {
            amount: "1800 UC",
            price: 270000
        }
    ],


    "Mobile Legends": [
        {
            amount: "86 Diamonds",
            price: 15000
        },
        {
            amount: "172 Diamonds",
            price: 30000
        },
        {
            amount: "257 Diamonds",
            price: 45000
        },
        {
            amount: "706 Diamonds",
            price: 80000
        }
    ],


    "Free Fire": [
        {
            amount: "100 Diamonds",
            price: 15000
        },
        {
            amount: "310 Diamonds",
            price: 40000
        },
        {
            amount: "520 Diamonds",
            price: 65000
        },
        {
            amount: "1060 Diamonds",
            price: 120000
        }
    ],


    "Brawl Stars": [
        {
            amount: "30 Gems",
            price: 15000
        },
        {
            amount: "80 Gems",
            price: 35000
        },
        {
            amount: "170 Gems",
            price: 70000
        },
        {
            amount: "360 Gems",
            price: 140000
        }
    ]

};


// ========================================
// ПЕРЕМЕННЫЕ
// ========================================

let selectedGame = null;
let selectedPackage = null;


// ========================================
// ВЫБОР ИГРЫ
// ========================================

function selectGame(gameName) {

    console.log("Выбрана игра:", gameName);

    selectedGame = gameName;

    selectedPackage = null;


    // ----------------------------
    // Выделяем игру
    // ----------------------------

    const gameCards =
        document.querySelectorAll(".game-card");

    gameCards.forEach(card => {

        card.classList.remove("active");

        const text =
            card.innerText.trim();

        if (text.includes(gameName)) {
            card.classList.add("active");
        }

    });


    // ----------------------------
    // Показываем название игры
    // ----------------------------

    const selectedGameElement =
        document.getElementById("selectedGame");

    if (selectedGameElement) {

        selectedGameElement.textContent =
            gameName;

    }


    // ----------------------------
    // Обновляем список пакетов
    // ----------------------------

    renderPackages(gameName);


    // ----------------------------
    // Обновляем итог
    // ----------------------------

    updateSummary();

}


// ========================================
// СОЗДАНИЕ ПАКЕТОВ
// ========================================

function renderPackages(gameName) {

    const packagesContainer =
        document.getElementById("packages");


    if (!packagesContainer) {
        return;
    }


    packagesContainer.innerHTML = "";


    const packages =
        games[gameName];


    if (!packages) {
        return;
    }


    packages.forEach((item, index) => {

        const button =
            document.createElement("button");


        button.type = "button";

        button.className = "package";


        button.innerHTML = `
            <strong>${item.amount}</strong>
            <span>${item.price.toLocaleString()} сум</span>
        `;


        button.addEventListener(
            "click",
            function () {

                selectPackage(
                    button,
                    item.amount,
                    item.price
                );

            }
        );


        packagesContainer.appendChild(button);

    });

}


// ========================================
// ВЫБОР ПАКЕТА
// ========================================

function selectPackage(
    button,
    amount,
    price
) {

    console.log(
        "Выбран пакет:",
        amount,
        price
    );


    // Убираем старое выделение

    const packages =
        document.querySelectorAll(".package");

    packages.forEach(item => {
        item.classList.remove("active");
    });


    // Выделяем выбранный

    button.classList.add("active");


    // Сохраняем

    selectedPackage = {

        amount: amount,

        price: price

    };


    updateSummary();

}


// ========================================
// ОБНОВЛЕНИЕ ИТОГА
// ========================================

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


// ========================================
// УНИКАЛЬНЫЙ НОМЕР ЗАКАЗА
// ========================================

function generateOrderNumber() {

    const random =
        Math.floor(
            100000 + Math.random() * 900000
        );

    return `BP-${random}`;

}


// ========================================
// СОЗДАНИЕ ЗАКАЗА
// ========================================

function createOrder() {

    // ----------------------------
    // Проверяем игру
    // ----------------------------

    if (!selectedGame) {

        tg.showPopup({

            title: "Выберите игру",

            message:
                "Сначала выберите игру.",

            buttons: [
                {
                    type: "ok"
                }
            ]

        });

        return;
    }


    // ----------------------------
    // Проверяем пакет
    // ----------------------------

    if (!selectedPackage) {

        tg.showPopup({

            title: "Выберите пакет",

            message:
                "Сначала выберите пакет игровой валюты.",

            buttons: [
                {
                    type: "ok"
                }
            ]

        });

        return;
    }


    // ----------------------------
    // Получаем ID
    // ----------------------------

    const playerInput =
        document.getElementById("playerId");


    const playerId =
        playerInput
            ? playerInput.value.trim()
            : "";


    if (!playerId) {

        tg.showPopup({

            title: "Введите ID игрока",

            message:
                "Пожалуйста, введите ID игрока.",

            buttons: [
                {
                    type: "ok"
                }
            ]

        });

        return;
    }


    // ----------------------------
    // Номер заказа
    // ----------------------------

    const orderNumber =
        generateOrderNumber();


    // ----------------------------
    // Создаём заказ
    // ----------------------------

    const order = {

        order_number:
            orderNumber,

        game:
            selectedGame,

        package:
            selectedPackage.amount,

        price:
            selectedPackage.price,

        player_id:
            playerId,

        telegram_id:
            telegramUser.id || "",

        username:
            telegramUser.username || "",

        first_name:
            telegramUser.first_name || "",

        status:
            "Новый",

        created_at:
            new Date().toISOString()

    };


    // ----------------------------
    // Сохраняем заказ
    // ----------------------------

    localStorage.setItem(
        "lastOrder",
        JSON.stringify(order)
    );


    // ----------------------------
    // Сообщение
    // ----------------------------

    const message =

`🎉 ЗАКАЗ СОЗДАН!

🆔 Номер заказа: #${orderNumber}

🎮 Игра: ${selectedGame}

💎 Пакет: ${selectedPackage.amount}

👤 ID игрока: ${playerId}

💰 Сумма: ${selectedPackage.price.toLocaleString()} сум

📦 Статус: Новый

🚀 Спасибо за заказ в BuyPay!`;


    // ----------------------------
    // Показываем заказ
    // ----------------------------

    tg.showPopup({

        title: "Заказ создан!",

        message: message,

        buttons: [
            {
                id: "ok",
                type: "default",
                text: "Готово"
            }
        ]

    });


    // ----------------------------
    // Отправляем боту
    // ----------------------------

    try {

        tg.sendData(
            JSON.stringify(order)
        );

        console.log(
            "Заказ отправлен:",
            order
        );

    } catch (error) {

        console.error(
            "Ошибка отправки:",
            error
        );

    }

}


// ========================================
// МОИ ЗАКАЗЫ
// ========================================

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


// ========================================
// ПОМОЩЬ
// ========================================

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


// ========================================
// ГОТОВО
// ========================================

console.log("BuyPay Web App запущен!");