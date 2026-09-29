// ========================================
// BUY PAY — ANIMATED SCRIPT
// ========================================

const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


// ========================================
// TELEGRAM USER
// ========================================

const telegramUser = tg.initDataUnsafe?.user || {};

const welcomeText =
    document.getElementById("welcomeText");

if (welcomeText && telegramUser.first_name) {
    welcomeText.textContent =
        `Xush kelibsiz, ${telegramUser.first_name}!`;
}


// ========================================
// ИГРЫ
// ========================================

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


// ========================================
// ПЕРЕМЕННЫЕ
// ========================================

let selectedGame = null;
let selectedPackage = null;
let currentOrder = null;
let selectedPaymentMethod = null;


// ========================================
// ПЛАВНАЯ ПРОКРУТКА
// ========================================

function scrollToElement(element) {

    if (!element) {
        return;
    }

    setTimeout(() => {

        const rect =
            element.getBoundingClientRect();

        const currentScroll =
            window.pageYOffset ||
            document.documentElement.scrollTop;

        const target =
            currentScroll +
            rect.top -
            15;

        window.scrollTo({
            top: target,
            behavior: "smooth"
        });

    }, 200);
}


// ========================================
// ПОКАЗ БЛОКА
// ========================================

function showSection(id) {

    const section =
        document.getElementById(id);

    if (!section) {
        return;
    }

    section.classList.remove("hidden-section");

    section.classList.add("show-section");

    scrollToElement(section);
}


// ========================================
// СКРЫТИЕ БЛОКА
// ========================================

function hideSection(id) {

    const section =
        document.getElementById(id);

    if (!section) {
        return;
    }

    section.classList.remove("show-section");

    section.classList.add("hidden-section");
}


// ========================================
// ВЫБОР ИГРЫ
// ========================================

function selectGame(gameName) {

    console.log("Выбрана игра:", gameName);

    selectedGame = gameName;

    selectedPackage = null;


    // Убираем активность со всех игр

    document
        .querySelectorAll(".game-card")
        .forEach(card => {

            card.classList.remove("active");

        });


    // Делаем выбранную игру активной

    document
        .querySelectorAll(".game-card")
        .forEach(card => {

            if (
                card.innerText
                    .toLowerCase()
                    .includes(
                        gameName.toLowerCase()
                    )
            ) {

                card.classList.add("active");

            }

        });


    // Название выбранной игры

    const selectedGameElement =
        document.getElementById("selectedGame");

    if (selectedGameElement) {

        selectedGameElement.textContent =
            gameName;

    }


    // Создаём пакеты

    renderPackages(gameName);


    // Показываем выбор валюты

    showSection("packageSection");


    // Скрываем следующие этапы

    hideSection("playerSection");

    hideSection("summarySection");


    updateSummary();
}


// ========================================
// СОЗДАНИЕ ПАКЕТОВ
// ========================================

function renderPackages(gameName) {

    const container =
        document.getElementById("packages");

    if (!container) {
        return;
    }


    container.innerHTML = "";


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

        button.style.animationDelay =
            `${index * 0.08}s`;


        button.innerHTML = `

            <div class="package-left">

                <strong>
                    ${item.amount}
                </strong>

                <small>
                    Игровая валюта
                </small>

            </div>

            <div class="package-price">

                ${item.price.toLocaleString()}
                сум

                <span>›</span>

            </div>

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


        container.appendChild(button);

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


    // Убираем активность

    document
        .querySelectorAll(".package")
        .forEach(item => {

            item.classList.remove("active");

        });


    // Активный пакет

    button.classList.add("active");


    selectedPackage = {

        amount: amount,

        price: price

    };


    // Показываем ID

    showSection("playerSection");


    // Пока ID не введён,
    // итог скрыт

    hideSection("summarySection");


    updateSummary();


    // Фокус на поле ID

    setTimeout(() => {

        const input =
            document.getElementById("playerId");

        if (input) {

            input.focus();

        }

    }, 500);
}


// ========================================
// ОБНОВЛЕНИЕ ИТОГА
// ========================================

function updateSummary() {

    const summaryGame =
        document.getElementById("summaryGame");

    const summaryPackage =
        document.getElementById("summaryPackage");

    const summaryPlayer =
        document.getElementById("summaryPlayer");

    const summaryPrice =
        document.getElementById("summaryPrice");


    const playerInput =
        document.getElementById("playerId");


    const playerId =
        playerInput
            ? playerInput.value.trim()
            : "";


    // Игра

    if (summaryGame) {

        summaryGame.textContent =
            selectedGame || "—";

    }


    // Пакет

    if (summaryPackage) {

        summaryPackage.textContent =
            selectedPackage
                ? selectedPackage.amount
                : "—";

    }


    // ID игрока

    if (summaryPlayer) {

        summaryPlayer.textContent =
            playerId || "—";

    }


    // Цена

    if (summaryPrice) {

        summaryPrice.textContent =
            selectedPackage
                ? selectedPackage.price
                    .toLocaleString() + " сум"
                : "0 сум";

    }


    // Показываем итог,
    // если всё заполнено

    if (
        selectedGame &&
        selectedPackage &&
        playerId.length > 0
    ) {

        const summarySection =
            document.getElementById(
                "summarySection"
            );


        const wasHidden =
            summarySection &&
            summarySection.classList.contains(
                "hidden-section"
            );


        showSection("summarySection");


        // Если блок только появился —
        // прокручиваем к нему

        if (!wasHidden) {
            return;
        }

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


    if (!selectedPackage) {

        tg.showPopup({

            title: "Выберите пакет",

            message:
                "Сначала выберите пакет.",

            buttons: [
                {
                    type: "ok"
                }
            ]

        });

        return;
    }


    const playerInput =
        document.getElementById("playerId");


    const playerId =
        playerInput
            ? playerInput.value.trim()
            : "";


    if (!playerId) {

        tg.showPopup({

            title:
                "Введите ID игрока",

            message:
                "Введите ID аккаунта.",

            buttons: [
                {
                    type: "ok"
                }
            ]

        });

        return;
    }


    // Создаём заказ

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


    const oldScreen =
        document.getElementById(
            "paymentScreen"
        );


    if (oldScreen) {
        oldScreen.remove();
    }


    const screen =
        document.createElement("div");


    screen.id = "paymentScreen";


    screen.innerHTML = `

        <div class="payment-overlay">

            <div class="payment-box">

                <button
                    class="payment-close"
                    onclick="closePaymentScreen()"
                >
                    ✕
                </button>


                <div class="payment-icon">
                    💳
                </div>


                <h2>
                    Оплата заказа
                </h2>


                <p class="payment-subtitle">
                    Проверьте данные заказа
                </p>


                <div class="payment-order">

                    <div>
                        <span>
                            Заказ
                        </span>

                        <strong>
                            #${currentOrder.order_number}
                        </strong>
                    </div>


                    <div>
                        <span>
                            Игра
                        </span>

                        <strong>
                            ${currentOrder.game}
                        </strong>
                    </div>


                    <div>
                        <span>
                            Пакет
                        </span>

                        <strong>
                            ${currentOrder.package}
                        </strong>
                    </div>


                    <div>
                        <span>
                            ID игрока
                        </span>

                        <strong>
                            ${currentOrder.player_id}
                        </strong>
                    </div>


                    <div class="payment-total">

                        <span>
                            К оплате
                        </span>

                        <strong>
                            ${currentOrder.price.toLocaleString()}
                            сум
                        </strong>

                    </div>

                </div>


                <h3>
                    Способ оплаты
                </h3>


                <div class="payment-methods">

                    <button
                        type="button"
                        class="payment-method"
                        onclick="
                            selectPaymentMethod(
                                this,
                                'Payme'
                            )
                        "
                    >
                        💳 Payme
                    </button>


                    <button
                        type="button"
                        class="payment-method"
                        onclick="
                            selectPaymentMethod(
                                this,
                                'Click'
                            )
                        "
                    >
                        💳 Click
                    </button>


                    <button
                        type="button"
                        class="payment-method"
                        onclick="
                            selectPaymentMethod(
                                this,
                                'Другой'
                            )
                        "
                    >
                        💰 Другой способ
                    </button>

                </div>


                <div class="payment-info">

                    ℹ️ После выбора способа
                    оплаты появится инструкция.

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


    document.body.appendChild(screen);

    addPaymentStyles();
}


// ========================================
// ВЫБОР СПОСОБА ОПЛАТЫ
// ========================================

function selectPaymentMethod(
    button,
    method
) {

    document
        .querySelectorAll(".payment-method")
        .forEach(item => {

            item.classList.remove("active");

        });


    button.classList.add("active");


    selectedPaymentMethod =
        method;


    const info =
        document.querySelector(
            ".payment-info"
        );


    if (!info) {
        return;
    }


    if (method === "Payme") {

        info.innerHTML =
            "💳 Вы выбрали Payme.<br><br>" +
            "Инструкция по оплате будет " +
            "подключена на следующем этапе.";

    }

    else if (method === "Click") {

        info.innerHTML =
            "💳 Вы выбрали Click.<br><br>" +
            "Инструкция по оплате будет " +
            "подключена на следующем этапе.";

    }

    else {

        info.innerHTML =
            "💰 Выбран другой способ оплаты.";

    }
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

            title:
                "Выберите способ",

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


    currentOrder.payment_method =
        selectedPaymentMethod;


    currentOrder.status =
        "Оплата на проверке";


    // Сохраняем последний заказ

    localStorage.setItem(
        "lastOrder",
        JSON.stringify(currentOrder)
    );


    console.log(
        "Отправляем заказ:",
        currentOrder
    );


    try {

        tg.sendData(
            JSON.stringify(currentOrder)
        );

    }

    catch (error) {

        console.error(
            "Ошибка отправки:",
            error
        );


        tg.showPopup({

            title:
                "Ошибка",

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

            title:
                "Мои заказы",

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
            JSON.parse(savedOrder);


        tg.showPopup({

            title:
                "Мой заказ",

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

    }

    catch (error) {

        console.error(error);


        tg.showPopup({

            title:
                "Ошибка",

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

        title:
            "YORDAM",

        message:
            "Если у вас возникли вопросы " +
            "или проблемы с заказом, " +
            "обратитесь в поддержку BuyPay.",

        buttons: [
            {
                type: "ok"
            }
        ]

    });
}


// ========================================
// СТИЛИ ОПЛАТЫ
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
        document.createElement("style");


    style.id =
        "paymentStyles";


    style.textContent = `

        #paymentScreen {
            position: fixed;
            inset: 0;
            z-index: 9999;

            animation:
                paymentAppear .35s ease;
        }


        .payment-overlay {

            width: 100%;
            height: 100%;

            background:
                rgba(0, 0, 0, .72);

            display: flex;

            align-items: center;
            justify-content: center;

            padding: 18px;

            backdrop-filter:
                blur(8px);

        }


        .payment-box {

            position: relative;

            width: 100%;
            max-width: 430px;

            max-height: 90vh;

            overflow-y: auto;

            padding: 25px;

            border-radius: 26px;

            background:
                linear-gradient(
                    145deg,
                    #151a32,
                    #0c1020
                );

            border:
                1px solid
                rgba(255,255,255,.12);

            box-shadow:
                0 25px 80px
                rgba(0,0,0,.55);

            animation:
                paymentBoxAppear .45s ease;

        }


        .payment-icon {

            width: 65px;
            height: 65px;

            margin:
                0 auto 12px;

            border-radius: 20px;

            display: flex;

            align-items: center;
            justify-content: center;

            font-size: 32px;

            background:
                linear-gradient(
                    135deg,
                    #477cff,
                    #8a52ff
                );

            box-shadow:
                0 10px 35px
                rgba(80,100,255,.3);

        }


        .payment-box h2 {

            text-align: center;

            margin:
                5px 0;

        }


        .payment-subtitle {

            text-align: center;

            opacity: .55;

            margin-top: 5px;

        }


        .payment-close {

            position: absolute;

            top: 13px;
            right: 13px;

            width: 38px;
            height: 38px;

            border: none;

            border-radius: 50%;

            background:
                rgba(255,255,255,.08);

            color: white;

            cursor: pointer;

            transition: .2s;

        }


        .payment-close:hover {

            transform:
                rotate(90deg);

            background:
                rgba(255,255,255,.15);

        }


        .payment-order {

            margin-top: 20px;

            padding: 15px;

            border-radius: 18px;

            background:
                rgba(255,255,255,.055);

            border:
                1px solid
                rgba(255,255,255,.08);

        }


        .payment-order > div {

            display: flex;

            justify-content:
                space-between;

            gap: 15px;

            padding: 9px 0;

        }


        .payment-order span {

            opacity: .55;

        }


        .payment-order strong {

            text-align: right;

        }


        .payment-total {

            margin-top: 8px;

            padding-top: 15px !important;

            border-top:
                1px solid
                rgba(255,255,255,.10);

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

            padding: 15px;

            border-radius: 15px;

            border:
                1px solid
                rgba(255,255,255,.10);

            background:
                rgba(255,255,255,.05);

            color: white;

            text-align: left;

            font-size: 16px;

            cursor: pointer;

            transition: .25s;

        }


        .payment-method:hover {

            transform:
                translateX(4px);

            background:
                rgba(255,255,255,.09);

        }


        .payment-method.active {

            border-color:
                #6e9cff;

            background:
                rgba(70,120,255,.15);

            box-shadow:
                0 0 20px
                rgba(70,120,255,.15);

        }


        .payment-info {

            margin-top: 15px;

            padding: 13px;

            border-radius: 14px;

            background:
                rgba(255,255,255,.05);

            font-size: 13px;

            line-height: 1.5;

        }


        .payment-confirm {

            width: 100%;

            margin-top: 18px;

            padding: 16px;

            border: none;

            border-radius: 15px;

            background:
                linear-gradient(
                    110deg,
                    #477cff,
                    #8a52ff,
                    #477cff
                );

            background-size: 200%;

            color: white;

            font-size: 16px;

            font-weight: 700;

            cursor: pointer;

            animation:
                paymentGradient
                4s linear infinite;

            transition: .2s;

        }


        .payment-confirm:hover {

            transform:
                translateY(-3px);

        }


        @keyframes paymentAppear {

            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }

        }


        @keyframes paymentBoxAppear {

            from {
                opacity: 0;

                transform:
                    translateY(35px)
                    scale(.94);
            }

            to {
                opacity: 1;

                transform:
                    translateY(0)
                    scale(1);
            }

        }


        @keyframes paymentGradient {

            0% {
                background-position: 0%;
            }

            100% {
                background-position: 200%;
            }

        }

    `;


    document.head.appendChild(style);
}


// ========================================
// ГОТОВО
// ========================================

console.log(
    "🔥 BuyPay Animated Web App запущен!"
);