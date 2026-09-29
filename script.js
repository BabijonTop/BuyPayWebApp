// ========================================
// BUY PAY — WEB APP
// ========================================

const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


// ========================================
// SERVER
// ========================================

const API_URL =
    "https://buypayserver.onrender.com";


// ========================================
// TELEGRAM USER
// ========================================

const telegramUser =
    tg.initDataUnsafe?.user || {};


// ========================================
// WELCOME
// ========================================

const welcomeText =
    document.getElementById("welcomeText");

if (
    welcomeText &&
    telegramUser.first_name
) {

    welcomeText.textContent =
        `Xush kelibsiz, ${telegramUser.first_name}!`;

}


// ========================================
// ИГРЫ И ЦЕНЫ
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

let currentBalance = 0;


// ========================================
// ФОРМАТ ЦЕНЫ
// ========================================

function formatSum(amount) {

    return Number(amount || 0)
        .toLocaleString("ru-RU") + " сум";

}


// ========================================
// ПОКАЗ POPUP
// ========================================

function showMessage(
    title,
    message
) {

    if (
        tg &&
        typeof tg.showPopup === "function"
    ) {

        tg.showPopup({

            title: title,

            message: message,

            buttons: [
                {
                    type: "ok"
                }
            ]

        });

    } else {

        alert(
            title + "\n\n" + message
        );

    }

}


// ========================================
// ПРОКРУТКА
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
// ПОКАЗ / СКРЫТИЕ СЕКЦИЙ
// ========================================

function showSection(id) {

    const section =
        document.getElementById(id);

    if (!section) {
        return;
    }

    section.classList.remove(
        "hidden-section"
    );

    section.classList.add(
        "show-section"
    );

    scrollToElement(section);

}


function hideSection(id) {

    const section =
        document.getElementById(id);

    if (!section) {
        return;
    }

    section.classList.remove(
        "show-section"
    );

    section.classList.add(
        "hidden-section"
    );

}


// ========================================
// СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ
// ========================================

async function registerUser() {

    if (!telegramUser.id) {

        console.log(
            "Telegram user не найден"
        );

        return false;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/user`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        telegram_id:
                            telegramUser.id,

                        username:
                            telegramUser.username || "",

                        first_name:
                            telegramUser.first_name || ""

                    })

                }
            );


        if (!response.ok) {

            console.error(
                "Ошибка создания пользователя:",
                response.status
            );

            return false;

        }


        const data =
            await response.json();

        console.log(
            "Пользователь:",
            data
        );

        return true;

    } catch (error) {

        console.error(
            "Ошибка соединения с сервером:",
            error
        );

        return false;

    }

}


// ========================================
// ЗАГРУЗКА БАЛАНСА
// ========================================

async function loadBalance() {

    const balanceElement =
        document.getElementById(
            "balanceAmount"
        );


    if (!telegramUser.id) {

        if (balanceElement) {

            balanceElement.textContent =
                "0 сум";

        }

        return;

    }


    if (balanceElement) {

        balanceElement.textContent =
            "Загрузка...";

    }


    try {

        await registerUser();


        const response =
            await fetch(
                `${API_URL}/balance/${telegramUser.id}`
            );


        if (!response.ok) {

            throw new Error(
                "Ошибка загрузки баланса"
            );

        }


        const data =
            await response.json();


        currentBalance =
            Number(data.balance || 0);


        if (balanceElement) {

            balanceElement.textContent =
                formatSum(currentBalance);

        }


        console.log(
            "Баланс:",
            currentBalance
        );


    } catch (error) {

        console.error(
            "Баланс:",
            error
        );


        if (balanceElement) {

            balanceElement.textContent =
                "Ошибка";

        }

    }

}


// ========================================
// ВЫБОР ИГРЫ
// ========================================

function selectGame(gameName) {

    console.log(
        "Выбрана игра:",
        gameName
    );


    selectedGame =
        gameName;

    selectedPackage =
        null;


    document
        .querySelectorAll(".game-card")
        .forEach(card => {

            card.classList.remove(
                "active"
            );

        });


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

                card.classList.add(
                    "active"
                );

            }

        });


    const selectedGameElement =
        document.getElementById(
            "selectedGame"
        );


    if (selectedGameElement) {

        selectedGameElement.textContent =
            gameName;

    }


    renderPackages(
        gameName
    );


    showSection(
        "packageSection"
    );


    hideSection(
        "playerSection"
    );


    hideSection(
        "summarySection"
    );


    updateSummary();

}


// ========================================
// ПОКАЗ ПАКЕТОВ
// ========================================

function renderPackages(gameName) {

    const container =
        document.getElementById(
            "packages"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const packages =
        games[gameName];


    if (!packages) {
        return;
    }


    packages.forEach(
        (item, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "package";


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

                    ${formatSum(item.price)}

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


            container.appendChild(
                button
            );

        }
    );

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


    document
        .querySelectorAll(".package")
        .forEach(item => {

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


    showSection(
        "playerSection"
    );


    hideSection(
        "summarySection"
    );


    updateSummary();


    setTimeout(() => {

        const input =
            document.getElementById(
                "playerId"
            );


        if (input) {

            input.focus();

        }

    }, 500);

}


// ========================================
// ОБНОВЛЕНИЕ ЗАКАЗА
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


    const summaryPlayer =
        document.getElementById(
            "summaryPlayer"
        );


    const summaryPrice =
        document.getElementById(
            "summaryPrice"
        );


    const playerInput =
        document.getElementById(
            "playerId"
        );


    const playerId =
        playerInput
            ? playerInput.value.trim()
            : "";


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


    if (summaryPlayer) {

        summaryPlayer.textContent =
            playerId || "—";

    }


    if (summaryPrice) {

        summaryPrice.textContent =
            selectedPackage
                ? formatSum(
                    selectedPackage.price
                )
                : "0 сум";

    }


    if (
        selectedGame &&
        selectedPackage &&
        playerId.length > 0
    ) {

        const summarySection =
            document.getElementById(
                "summarySection"
            );


        if (
            summarySection &&
            summarySection.classList.contains(
                "hidden-section"
            )
        ) {

            showSection(
                "summarySection"
            );

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

        showMessage(
            "Выберите игру",
            "Сначала выберите игру."
        );

        return;

    }


    if (!selectedPackage) {

        showMessage(
            "Выберите пакет",
            "Сначала выберите пакет."
        );

        return;

    }


    const playerInput =
        document.getElementById(
            "playerId"
        );


    const playerId =
        playerInput
            ? playerInput.value.trim()
            : "";


    if (!playerId) {

        showMessage(
            "Введите ID игрока",
            "Введите ID аккаунта."
        );

        return;

    }


    // Проверяем баланс

    if (
        currentBalance <
        selectedPackage.price
    ) {

        showMessage(

            "Недостаточно средств",

            `Ваш баланс: ${formatSum(currentBalance)}\n\n` +
            `Стоимость заказа: ${formatSum(selectedPackage.price)}\n\n` +
            "Пополните баланс и попробуйте снова."

        );

        return;

    }


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


    selectedPaymentMethod =
        null;


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
                            ${formatSum(
                                currentOrder.price
                            )}
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


    document.body.appendChild(
        screen
    );


    addPaymentStyles();

}


// ========================================
// ВЫБОР ОПЛАТЫ
// ========================================

function selectPaymentMethod(
    button,
    method
) {

    document
        .querySelectorAll(
            ".payment-method"
        )
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });


    button.classList.add(
        "active"
    );


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

        showMessage(
            "Выберите способ",
            "Сначала выберите способ оплаты."
        );

        return;

    }


    currentOrder.payment_method =
        selectedPaymentMethod;


    currentOrder.status =
        "Оплата на проверке";


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


    try {

        tg.sendData(
            JSON.stringify(
                currentOrder
            )
        );

    }


    catch (error) {

        console.error(
            "Ошибка отправки:",
            error
        );


        showMessage(
            "Ошибка",
            "Не удалось отправить заказ."
        );

    }

}


// ========================================
// ЗАКРЫТЬ ОПЛАТУ
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
// ПОПОЛНЕНИЕ БАЛАНСА
// ========================================

function openDeposit() {

    if (!telegramUser.id) {

        showMessage(
            "Ошибка",
            "Telegram ID не найден."
        );

        return;

    }


    const oldScreen =
        document.getElementById(
            "depositScreen"
        );


    if (oldScreen) {

        oldScreen.remove();

    }


    const screen =
        document.createElement(
            "div"
        );


    screen.id =
        "depositScreen";


    screen.innerHTML = `

        <div class="deposit-overlay">

            <div class="deposit-box">


                <button
                    class="deposit-close"
                    onclick="closeDeposit()"
                >
                    ✕
                </button>


                <div class="deposit-icon">
                    💰
                </div>


                <h2>
                    Пополнение баланса
                </h2>


                <p class="deposit-subtitle">
                    Минимальная сумма — 1 000 сум
                </p>


                <div class="deposit-current">

                    <span>
                        Текущий баланс
                    </span>

                    <strong>
                        ${formatSum(currentBalance)}
                    </strong>

                </div>


                <label class="deposit-label">
                    Сумма пополнения
                </label>


                <input
                    id="depositAmount"
                    class="deposit-input"
                    type="number"
                    inputmode="numeric"
                    min="1000"
                    step="1000"
                    placeholder="Например: 10000"
                >


                <div class="deposit-presets">


                    <button
                        type="button"
                        onclick="setDepositAmount(5000)"
                    >
                        5 000
                    </button>


                    <button
                        type="button"
                        onclick="setDepositAmount(10000)"
                    >
                        10 000
                    </button>


                    <button
                        type="button"
                        onclick="setDepositAmount(50000)"
                    >
                        50 000
                    </button>


                    <button
                        type="button"
                        onclick="setDepositAmount(100000)"
                    >
                        100 000
                    </button>


                </div>


                <div class="deposit-info">

                    ℹ️ После создания заявки
                    пополнение будет ожидать
                    подтверждения администратора.

                </div>


                <button
                    type="button"
                    class="deposit-confirm"
                    onclick="createDeposit()"
                >
                    ➕ Создать заявку
                </button>


            </div>

        </div>

    `;


    document.body.appendChild(
        screen
    );


    addDepositStyles();

}


// ========================================
// УСТАНОВИТЬ СУММУ
// ========================================

function setDepositAmount(amount) {

    const input =
        document.getElementById(
            "depositAmount"
        );


    if (input) {

        input.value =
            amount;

    }

}


// ========================================
// СОЗДАТЬ ЗАЯВКУ
// ========================================

async function createDeposit() {

    const input =
        document.getElementById(
            "depositAmount"
        );


    if (!input) {
        return;
    }


    const amount =
        Number(
            input.value
        );


    if (
        !amount ||
        amount < 1000
    ) {

        showMessage(
            "Неверная сумма",
            "Минимальная сумма пополнения — 1 000 сум."
        );

        return;

    }


    if (
        !Number.isInteger(amount)
    ) {

        showMessage(
            "Неверная сумма",
            "Введите целую сумму в сумах."
        );

        return;

    }


    try {

        const registered =
            await registerUser();


        if (!registered) {

            showMessage(
                "Ошибка",
                "Не удалось создать пользователя."
            );

            return;

        }


        const response =
            await fetch(
                `${API_URL}/deposit`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        telegram_id:
                            telegramUser.id,

                        amount:
                            amount

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Не удалось создать заявку"
            );

        }


        closeDeposit();


        showMessage(

            "Заявка создана ✅",

            `Заявка #${data.deposit_id}\n\n` +
            `Сумма: ${formatSum(data.amount)}\n\n` +
            "Ожидайте подтверждения администратора."

        );


        await loadBalance();


    }


    catch (error) {

        console.error(
            "Deposit error:",
            error
        );


        showMessage(
            "Ошибка",
            error.message ||
            "Не удалось создать заявку."
        );

    }

}


// ========================================
// ЗАКРЫТЬ ПОПОЛНЕНИЕ
// ========================================

function closeDeposit() {

    const screen =
        document.getElementById(
            "depositScreen"
        );


    if (screen) {

        screen.remove();

    }

}


// ========================================
// ИСТОРИЯ ПОПОЛНЕНИЙ
// ========================================

async function showDepositHistory() {

    if (!telegramUser.id) {

        showMessage(
            "Ошибка",
            "Telegram ID не найден."
        );

        return;

    }


    const oldScreen =
        document.getElementById(
            "historyScreen"
        );


    if (oldScreen) {

        oldScreen.remove();

    }


    const screen =
        document.createElement(
            "div"
        );


    screen.id =
        "historyScreen";


    screen.innerHTML = `

        <div class="history-overlay">

            <div class="history-box">


                <button
                    class="history-close"
                    onclick="closeHistory()"
                >
                    ✕
                </button>


                <div class="history-icon">
                    📋
                </div>


                <h2>
                    История пополнений
                </h2>


                <div
                    id="depositHistoryList"
                    class="deposit-history-list"
                >
                    Загрузка...
                </div>


            </div>

        </div>

    `;


    document.body.appendChild(
        screen
    );


    addDepositStyles();


    await loadDepositHistory();

}


// ========================================
// ЗАГРУЗИТЬ ИСТОРИЮ
// ========================================

async function loadDepositHistory() {

    const list =
        document.getElementById(
            "depositHistoryList"
        );


    if (!list) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/deposits/${telegramUser.id}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Ошибка загрузки"
            );

        }


        if (
            !data.deposits ||
            data.deposits.length === 0
        ) {

            list.innerHTML = `

                <div class="empty-history">

                    📭

                    <p>
                        Пополнений пока нет
                    </p>

                </div>

            `;

            return;

        }


        list.innerHTML = "";


        data.deposits.forEach(
            deposit => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "deposit-history-item";


                let statusText =
                    "Ожидает";

                let statusClass =
                    "pending";


                if (
                    deposit.status ===
                    "confirmed"
                ) {

                    statusText =
                        "Подтверждено";

                    statusClass =
                        "confirmed";

                }


                if (
                    deposit.status ===
                    "rejected"
                ) {

                    statusText =
                        "Отклонено";

                    statusClass =
                        "rejected";

                }


                const date =
                    new Date(
                        deposit.created_at
                    );


                const dateText =
                    date.toLocaleString(
                        "ru-RU"
                    );


                item.innerHTML = `

                    <div>

                        <strong>
                            +${formatSum(
                                deposit.amount
                            )}
                        </strong>

                        <small>
                            Заявка #${deposit.id}
                        </small>

                    </div>


                    <div class="history-right">

                        <span
                            class="
                                deposit-status
                                ${statusClass}
                            "
                        >
                            ${statusText}
                        </span>

                        <small>
                            ${dateText}
                        </small>

                    </div>

                `;


                list.appendChild(
                    item
                );

            }
        );

    }


    catch (error) {

        console.error(
            "History error:",
            error
        );


        list.innerHTML = `

            <div class="empty-history">

                ❌

                <p>
                    Не удалось загрузить историю
                </p>

            </div>

        `;

    }

}


// ========================================
// ЗАКРЫТЬ ИСТОРИЮ
// ========================================

function closeHistory() {

    const screen =
        document.getElementById(
            "historyScreen"
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

        showMessage(
            "Мои заказы",
            "У вас пока нет заказов."
        );

        return;

    }


    try {

        const order =
            JSON.parse(
                savedOrder
            );


        showMessage(

            "Мой заказ",

`🆔 #${order.order_number}

🎮 ${order.game}

💎 ${order.package}

👤 ID: ${order.player_id}

💰 ${formatSum(order.price)}

💳 Оплата: ${
    order.payment_method || "—"
}

📦 Статус: ${
    order.status
}`

        );

    }


    catch (error) {

        console.error(
            error
        );


        showMessage(
            "Ошибка",
            "Не удалось загрузить заказ."
        );

    }

}


// ========================================
// ПОМОЩЬ
// ========================================

function showHelp() {

    showMessage(

        "YORDAM",

        "Если у вас возникли вопросы " +
        "или проблемы с заказом, " +
        "обратитесь в поддержку BuyPay."

    );

}


// ========================================
// СТИЛИ БАЛАНСА
// ========================================

function addBalanceStyles() {

    if (
        document.getElementById(
            "balanceStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "balanceStyles";


    style.textContent = `

        .balance-card {

            margin-top: 20px;

            padding: 18px;

            border-radius: 22px;

            background:
                linear-gradient(
                    135deg,
                    rgba(71,124,255,.18),
                    rgba(138,82,255,.14)
                );

            border:
                1px solid
                rgba(255,255,255,.12);

            box-shadow:
                0 15px 40px
                rgba(0,0,0,.18);

            backdrop-filter:
                blur(10px);

        }


        .balance-top {

            display: flex;

            justify-content:
                space-between;

            align-items:
                center;

            opacity: .75;

            font-size: 14px;

        }


        .balance-refresh {

            width: 32px;

            height: 32px;

            border: none;

            border-radius: 50%;

            background:
                rgba(255,255,255,.08);

            color: white;

            font-size: 20px;

            cursor: pointer;

        }


        .balance-amount {

            margin-top: 5px;

            font-size: 28px;

            font-weight: 800;

        }


        .deposit-button {

            width: 100%;

            margin-top: 14px;

            padding: 12px;

            border: none;

            border-radius: 13px;

            background:
                linear-gradient(
                    110deg,
                    #477cff,
                    #8a52ff
                );

            color: white;

            font-weight: 700;

            cursor: pointer;

            transition: .25s;

        }


        .deposit-button:active {

            transform:
                scale(.97);

        }

    `;


    document.head.appendChild(
        style
    );

}


// ========================================
// СТИЛИ ПОПОЛНЕНИЯ
// ========================================

function addDepositStyles() {

    if (
        document.getElementById(
            "depositStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "depositStyles";


    style.textContent = `

        #depositScreen,
        #historyScreen {

            position: fixed;

            inset: 0;

            z-index: 9999;

        }


        .deposit-overlay,
        .history-overlay {

            width: 100%;

            height: 100%;

            padding: 18px;

            display: flex;

            align-items: center;

            justify-content: center;

            background:
                rgba(0,0,0,.72);

            backdrop-filter:
                blur(8px);

        }


        .deposit-box,
        .history-box {

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
                depositBoxAppear
                .35s ease;

        }


        .deposit-close,
        .history-close {

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

        }


        .deposit-icon,
        .history-icon {

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

        }


        .deposit-box h2,
        .history-box h2 {

            text-align: center;

            margin:
                5px 0;

        }


        .deposit-subtitle {

            text-align: center;

            opacity: .55;

            font-size: 13px;

        }


        .deposit-current {

            display: flex;

            justify-content:
                space-between;

            align-items: center;

            margin-top: 20px;

            padding: 14px;

            border-radius: 15px;

            background:
                rgba(255,255,255,.05);

        }


        .deposit-current span {

            opacity: .55;

        }


        .deposit-current strong {

            font-size: 17px;

        }


        .deposit-label {

            display: block;

            margin-top: 18px;

            margin-bottom: 7px;

            opacity: .7;

            font-size: 13px;

        }


        .deposit-input {

            box-sizing: border-box;

            width: 100%;

            padding: 15px;

            border-radius: 14px;

            border:
                1px solid
                rgba(255,255,255,.12);

            outline: none;

            background:
                rgba(255,255,255,.06);

            color: white;

            font-size: 17px;

        }


        .deposit-presets {

            display: grid;

            grid-template-columns:
                1fr 1fr;

            gap: 9px;

            margin-top: 12px;

        }


        .deposit-presets button {

            padding: 11px;

            border: none;

            border-radius: 12px;

            background:
                rgba(255,255,255,.07);

            color: white;

            cursor: pointer;

        }


        .deposit-info {

            margin-top: 15px;

            padding: 13px;

            border-radius: 14px;

            background:
                rgba(255,255,255,.05);

            font-size: 13px;

            line-height: 1.5;

        }


        .deposit-confirm {

            width: 100%;

            margin-top: 17px;

            padding: 15px;

            border: none;

            border-radius: 14px;

            background:
                linear-gradient(
                    110deg,
                    #477cff,
                    #8a52ff
                );

            color: white;

            font-size: 16px;

            font-weight: 700;

            cursor: pointer;

        }


        .deposit-history-list {

            margin-top: 20px;

        }


        .deposit-history-item {

            display: flex;

            justify-content:
                space-between;

            gap: 12px;

            padding: 13px;

            margin-bottom: 9px;

            border-radius: 14px;

            background:
                rgba(255,255,255,.05);

        }


        .deposit-history-item > div {

            display: flex;

            flex-direction: column;

            gap: 4px;

        }


        .deposit-history-item strong {

            font-size: 15px;

        }


        .deposit-history-item small {

            opacity: .45;

            font-size: 11px;

        }


        .history-right {

            align-items: flex-end;

            text-align: right;

        }


        .deposit-status {

            padding: 4px 8px;

            border-radius: 8px;

            font-size: 11px;

        }


        .deposit-status.pending {

            background:
                rgba(255,180,0,.15);

        }


        .deposit-status.confirmed {

            background:
                rgba(0,200,100,.15);

        }


        .deposit-status.rejected {

            background:
                rgba(255,60,60,.15);

        }


        .empty-history {

            text-align: center;

            padding: 35px 10px;

            opacity: .55;

        }


        .empty-history p {

            margin-top: 8px;

        }


        @keyframes depositBoxAppear {

            from {

                opacity: 0;

                transform:
                    translateY(30px)
                    scale(.95);

            }

            to {

                opacity: 1;

                transform:
                    translateY(0)
                    scale(1);

            }

        }

    `;


    document.head.appendChild(
        style
    );

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

            animation:
                paymentAppear
                .35s ease;

        }


        .payment-overlay {

            width: 100%;

            height: 100%;

            background:
                rgba(0,0,0,.72);

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
                paymentBoxAppear
                .45s ease;

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

        }


        .payment-method.active {

            border-color:
                #6e9cff;

            background:
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

            background-size:
                200%;

            color: white;

            font-size: 16px;

            font-weight: 700;

            cursor: pointer;

            animation:
                paymentGradient
                4s linear infinite;

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


    document.head.appendChild(
        style
    );

}


// ========================================
// ЗАПУСК
// ========================================

addBalanceStyles();


// Загружаем баланс
// после запуска Web App

loadBalance();


console.log(
    "🔥 BuyPay Web App запущен!"
);
