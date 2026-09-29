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

const welcomeText =
    document.getElementById("welcomeText");

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

let currentOrder = null;

let selectedPaymentMethod = null;


// ========================================
// ВЫБОР ИГРЫ
// ========================================

function selectGame(gameName) {

    console.log(
        "Выбрана игра:",
        gameName
    );

    selectedGame = gameName;

    selectedPackage = null;


    // Выделяем игру

    const gameCards =
        document.querySelectorAll(
            ".game-card"
        );

    gameCards.forEach(card => {

        card.classList.remove(
            "active"
        );

        const text =
            card.innerText.trim();

        if (text.includes(gameName)) {

            card.classList.add(
                "active"
            );

        }

    });


    // Название игры

    const selectedGameElement =
        document.getElementById(
            "selectedGame"
        );

    if (selectedGameElement) {

        selectedGameElement.textContent =
            gameName;

    }


    // Пакеты

    renderPackages(gameName);


    // Итог

    updateSummary();

}


// ========================================
// СОЗДАНИЕ ПАКЕТОВ
// ========================================

function renderPackages(gameName) {

    const packagesContainer =
        document.getElementById(
            "packages"
        );

    if (!packagesContainer) {

        return;

    }


    packagesContainer.innerHTML = "";


    const packages =
        games[gameName];

    if (!packages) {

        return;

    }


    packages.forEach(item => {

        const button =
            document.createElement(
                "button"
            );

        button.type = "button";

        button.className =
            "package";


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


        packagesContainer.appendChild(
            button
        );

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


    const packages =
        document.querySelectorAll(
            ".package"
        );

    packages.forEach(item => {

        item.classList.remove(
            "active"
        );

    });


    button.classList.add(
        "active"
    );


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
        document.getElementById(
            "summaryGame"
        );

    const summaryPackage =
        document.getElementById(
            "summaryPackage"
        );

    const summaryPrice =
        document.getElementById(
            "summaryPrice"
        );


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
// НОМЕР ЗАКАЗА
// ========================================

function generateOrderNumber() {

    const random =
        Math.floor(
            100000 +
            Math.random() * 900000
        );

    return `BP-${random}`;

}


// ========================================
// СОЗДАНИЕ ЗАКАЗА
// ========================================

function createOrder() {

    // Проверка игры

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


    // Проверка пакета

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


    // ID игрока

    const playerInput =
        document.getElementById(
            "playerId"
        );


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


    // ====================================
    // СОЗДАЁМ ЗАКАЗ
    // ====================================

    currentOrder = {

        order_number:
            generateOrderNumber(),

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
            "Ожидает оплаты",

        payment_method:
            "",

        created_at:
            new Date().toISOString()

    };


    selectedPaymentMethod = null;


    // Открываем оплату

    showPaymentScreen();

}


// ========================================
// ЭКРАН ОПЛАТЫ
// ========================================

function showPaymentScreen() {

    if (!currentOrder) {

        return;

    }


    // Удаляем старый экран

    const oldScreen =
        document.getElementById(
            "paymentScreen"
        );

    if (oldScreen) {

        oldScreen.remove();

    }


    // Создаём экран

    const screen =
        document.createElement(
            "div"
        );

    screen.id =
        "paymentScreen";


    screen.innerHTML = `

        <div class="payment-overlay">

            <div class="payment-box">

                <button
                    class="payment-close"
                    onclick="closePaymentScreen()"
                >
                    ✕
                </button>


                <h2>💳 Оплата заказа</h2>


                <div class="payment-order">

                    <div>
                        <span>Заказ</span>
                        <strong>
                            #${currentOrder.order_number}
                        </strong>
                    </div>


                    <div>
                        <span>Игра</span>
                        <strong>
                            ${currentOrder.game}
                        </strong>
                    </div>


                    <div>
                        <span>Пакет</span>
                        <strong>
                            ${currentOrder.package}
                        </strong>
                    </div>


                    <div>
                        <span>ID игрока</span>
                        <strong>
                            ${currentOrder.player_id}
                        </strong>
                    </div>


                    <div class="payment-total">

                        <span>К оплате</span>

                        <strong>
                            ${currentOrder.price.toLocaleString()}
                            сум
                        </strong>

                    </div>

                </div>


                <h3>Выберите способ оплаты</h3>


                <div class="payment-methods">

                    <button
                        type="button"
                        class="payment-method"
                        onclick="selectPaymentMethod(this, 'Payme')"
                    >
                        💳 Payme
                    </button>


                    <button
                        type="button"
                        class="payment-method"
                        onclick="selectPaymentMethod(this, 'Click')"
                    >
                        💳 Click
                    </button>


                    <button
                        type="button"
                        class="payment-method"
                        onclick="selectPaymentMethod(this, 'Другой')"
                    >
                        💰 Другой способ
                    </button>

                </div>


                <div class="payment-info">

                    ℹ️ Способ оплаты будет подключён
                    на следующем этапе.

                </div>


                <button
                    type="button"
                    class="payment-confirm"
                    onclick="confirmPayment()"
                >
                    ✅ Я оплатил
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        screen
    );


    addPaymentStyles();

}


// ========================================
// ВЫБОР СПОСОБА ОПЛАТЫ
// ========================================

function selectPaymentMethod(
    button,
    method
) {

    const buttons =
        document.querySelectorAll(
            ".payment-method"
        );


    buttons.forEach(item => {

        item.classList.remove(
            "active"
        );

    });


    button.classList.add(
        "active"
    );


    selectedPaymentMethod =
        method;


    console.log(
        "Выбран способ оплаты:",
        method
    );

}


// ========================================
// ПОДТВЕРЖДЕНИЕ ОПЛАТЫ
// ========================================

function confirmPayment() {

    if (!currentOrder) {

        return;

    }


    if (!selectedPaymentMethod) {

        tg.showPopup({

            title: "Выберите способ",

            message:
                "Сначала выберите способ оплаты.",

            buttons: [
                {
                    type: "ok"
                }
            ]

        });

        return;

    }


    // Обновляем заказ

    currentOrder.payment_method =
        selectedPaymentMethod;

    currentOrder.status =
        "Оплата на проверке";


    // Сохраняем

    localStorage.setItem(
        "lastOrder",
        JSON.stringify(
            currentOrder
        )
    );


    console.log(
        "Отправляем заказ:",
        currentOrder
    );


    // ====================================
    // ОТПРАВЛЯЕМ БОТУ
    // ====================================

    try {

        tg.sendData(
            JSON.stringify(
                currentOrder
            )
        );

    } catch (error) {

        console.error(
            "Ошибка отправки:",
            error
        );


        tg.showPopup({

            title: "Ошибка",

            message:
                "Не удалось отправить заказ.",

            buttons: [
                {
                    type: "ok"
                }
            ]

        });

    }

}


// ========================================
// ЗАКРЫТИЕ ОПЛАТЫ
// ========================================

function closePaymentScreen() {

    const screen =
        document.getElementById(
            "paymentScreen"
        );


    if (screen) {

        screen.remove();

    }

}


// ========================================
// МОИ ЗАКАЗЫ
// ========================================

function showOrders() {

    const savedOrder =
        localStorage.getItem(
            "lastOrder"
        );


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


    try {

        const order =
            JSON.parse(
                savedOrder
            );


        tg.showPopup({

            title: "Мой заказ",

            message:

`🆔 #${order.order_number}

🎮 ${order.game}

💎 ${order.package}

👤 ID: ${order.player_id}

💰 ${order.price.toLocaleString()} сум

💳 Оплата: ${order.payment_method || "—"}

📦 Статус: ${order.status}`,

            buttons: [
                {
                    type: "ok"
                }
            ]

        });

    } catch {

        tg.showPopup({

            title: "Ошибка",

            message:
                "Не удалось загрузить заказ.",

            buttons: [
                {
                    type: "ok"
                }
            ]

        });

    }

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
// СТИЛИ ЭКРАНА ОПЛАТЫ
// ========================================

function addPaymentStyles() {

    if (
        document.getElementById(
            "paymentStyles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "paymentStyles";


    style.textContent = `

        #paymentScreen {

            position: fixed;

            inset: 0;

            z-index: 9999;

        }


        .payment-overlay {

            width: 100%;

            height: 100%;

            background: rgba(0, 0, 0, 0.65);

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 20px;

            box-sizing: border-box;

        }


        .payment-box {

            position: relative;

            width: 100%;

            max-width: 430px;

            max-height: 90vh;

            overflow-y: auto;

            background: var(--tg-theme-bg-color, #ffffff);

            color: var(--tg-theme-text-color, #111111);

            border-radius: 22px;

            padding: 24px;

            box-sizing: border-box;

        }


        .payment-box h2 {

            margin-top: 0;

            text-align: center;

        }


        .payment-box h3 {

            margin-top: 24px;

            font-size: 17px;

        }


        .payment-close {

            position: absolute;

            top: 12px;

            right: 12px;

            width: 36px;

            height: 36px;

            border: none;

            border-radius: 50%;

            background: rgba(127, 127, 127, 0.15);

            font-size: 18px;

            cursor: pointer;

        }


        .payment-order {

            background: rgba(127, 127, 127, 0.10);

            border-radius: 16px;

            padding: 14px;

        }


        .payment-order > div {

            display: flex;

            justify-content: space-between;

            gap: 15px;

            padding: 8px 0;

        }


        .payment-order span {

            opacity: 0.7;

        }


        .payment-order strong {

            text-align: right;

        }


        .payment-total {

            margin-top: 8px;

            padding-top: 14px !important;

            border-top: 1px solid rgba(127, 127, 127, 0.2);

        }


        .payment-total strong {

            font-size: 19px;

        }


        .payment-methods {

            display: flex;

            flex-direction: column;

            gap: 10px;

        }


        .payment-method {

            width: 100%;

            padding: 14px;

            border: 2px solid rgba(127, 127, 127, 0.18);

            border-radius: 14px;

            background: transparent;

            color: inherit;

            font-size: 16px;

            text-align: left;

            cursor: pointer;

        }


        .payment-method.active {

            border-color: #2481cc;

            background: rgba(36, 129, 204, 0.10);

        }


        .payment-info {

            margin-top: 16px;

            padding: 12px;

            border-radius: 12px;

            background: rgba(127, 127, 127, 0.10);

            font-size: 13px;

            line-height: 1.4;

        }


        .payment-confirm {

            width: 100%;

            margin-top: 18px;

            padding: 15px;

            border: none;

            border-radius: 14px;

            background: #2481cc;

            color: white;

            font-size: 16px;

            font-weight: 600;

            cursor: pointer;

        }

    `;


    document.head.appendChild(
        style
    );

}


// ========================================
// ГОТОВО
// ========================================

console.log(
    "BuyPay Web App запущен!"
);