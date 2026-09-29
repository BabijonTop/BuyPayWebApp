const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const API_URL = "https://buypayserver.onrender.com";

const telegramUser = tg.initDataUnsafe?.user || {};

let selectedGame = null;
let selectedPackage = null;
let currentBalance = 0;


// ========================================
// ИГРЫ
// ========================================

const games = {

    "PUBG Mobile": [
        { name: "60 UC", price: 12000 },
        { name: "325 UC", price: 55000 },
        { name: "660 UC", price: 105000 },
        { name: "1800 UC", price: 270000 }
    ],

    "Mobile Legends": [
        { name: "86 Diamonds", price: 15000 },
        { name: "172 Diamonds", price: 30000 },
        { name: "257 Diamonds", price: 45000 },
        { name: "706 Diamonds", price: 80000 }
    ],

    "Free Fire": [
        { name: "100 Diamonds", price: 15000 },
        { name: "310 Diamonds", price: 40000 },
        { name: "520 Diamonds", price: 65000 },
        { name: "1060 Diamonds", price: 120000 }
    ],

    "Brawl Stars": [
        { name: "30 Gems", price: 15000 },
        { name: "80 Gems", price: 35000 },
        { name: "170 Gems", price: 70000 },
        { name: "360 Gems", price: 140000 }
    ]

};


// ========================================
// ФОРМАТ СУММЫ
// ========================================

function formatSum(number) {
    return Number(number || 0).toLocaleString("ru-RU") + " сум";
}


// ========================================
// ОБЩЕЕ СООБЩЕНИЕ
// ========================================

function showMessage(text) {

    if (typeof tg.showPopup === "function") {

        tg.showPopup({
            title: "BuyPay",
            message: text,
            buttons: [
                {
                    type: "ok"
                }
            ]
        });

    } else {

        alert(text);

    }

}


// ========================================
// ВЫБОР ИГРЫ
// ========================================

function selectGame(game) {

    selectedGame = game;
    selectedPackage = null;

    const selectedGameElement =
        document.getElementById("selectedGame");

    if (selectedGameElement) {
        selectedGameElement.textContent = game;
    }

    renderPackages();

    showSection("packageSection");

    scrollToElement("packageSection");
}


// ========================================
// ПАКЕТЫ
// ========================================

function renderPackages() {

    const container =
        document.getElementById("packages");

    if (!container) return;

    container.innerHTML = "";

    const packages = games[selectedGame] || [];

    packages.forEach((item, index) => {

        const button =
            document.createElement("button");

        button.type = "button";
        button.className = "package-card";

        button.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <span>Игровая валюта</span>
            </div>

            <b>${formatSum(item.price)}</b>
        `;

        button.addEventListener("click", function () {
            selectPackage(index);
        });

        container.appendChild(button);
    });
}


// ========================================
// ВЫБОР ПАКЕТА
// ========================================

function selectPackage(index) {

    if (!selectedGame) return;

    selectedPackage =
        games[selectedGame][index];

    updateSummary();

    showSection("playerSection");
    showSection("summarySection");

    scrollToElement("playerSection");
}


// ========================================
// ОБНОВЛЕНИЕ ЗАКАЗА
// ========================================

function updateSummary() {

    const playerInput =
        document.getElementById("playerId");

    const playerId =
        playerInput?.value.trim() || "—";

    const summaryGame =
        document.getElementById("summaryGame");

    const summaryPackage =
        document.getElementById("summaryPackage");

    const summaryPlayer =
        document.getElementById("summaryPlayer");

    const summaryPrice =
        document.getElementById("summaryPrice");

    if (summaryGame) {
        summaryGame.textContent =
            selectedGame || "—";
    }

    if (summaryPackage) {
        summaryPackage.textContent =
            selectedPackage?.name || "—";
    }

    if (summaryPlayer) {
        summaryPlayer.textContent =
            playerId;
    }

    if (summaryPrice) {
        summaryPrice.textContent =
            formatSum(
                selectedPackage?.price || 0
            );
    }
}


// ========================================
// РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
// ========================================

async function registerUser() {

    if (!telegramUser.id) {
        console.log("Telegram user ID отсутствует");
        return;
    }

    try {

        const response =
            await fetch(`${API_URL}/user`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    telegram_id: telegramUser.id,
                    username: telegramUser.username || "",
                    first_name: telegramUser.first_name || ""
                })
            });

        console.log(
            "Регистрация:",
            response.status
        );

    } catch (error) {

        console.error(
            "Ошибка регистрации:",
            error
        );
    }
}


// ========================================
// БАЛАНС
// ========================================

async function loadBalance() {

    if (!telegramUser.id) {

        console.log(
            "ID Telegram пользователя отсутствует"
        );

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/balance/${telegramUser.id}`
            );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data =
            await response.json();

        currentBalance =
            Number(data.balance || 0);

        const balanceElement =
            document.getElementById(
                "balanceAmount"
            );

        if (balanceElement) {

            balanceElement.textContent =
                formatSum(currentBalance);

        }

    } catch (error) {

        console.error(
            "Ошибка загрузки баланса:",
            error
        );
    }
}


// ========================================
// СЕКЦИЯ
// ========================================

function showSection(id) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.classList.remove(
        "hidden-section"
    );
}


// ========================================
// ПРОКРУТКА
// ========================================

function scrollToElement(id) {

    const element =
        document.getElementById(id);

    if (!element) return;

    setTimeout(() => {

        element.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);
}


// ========================================
// ОКНО ПОПОЛНЕНИЯ
// ========================================

function openDeposit() {

    console.log(
        "💰 Открытие пополнения"
    );

    let modal =
        document.getElementById(
            "depositScreen"
        );

    if (modal) {

        modal.style.display = "flex";

        return;
    }


    modal =
        document.createElement("div");

    modal.id = "depositScreen";
    modal.className = "deposit-modal";

    modal.innerHTML = `

        <div class="deposit-window">

            <button
                type="button"
                class="deposit-close"
                id="depositClose"
            >
                ✕
            </button>

            <div class="deposit-icon">
                💰
            </div>

            <h2>
                Пополнение баланса
            </h2>

            <p class="deposit-description">
                Выберите сумму пополнения
            </p>

            <div class="deposit-presets">

                <button
                    type="button"
                    class="deposit-preset"
                    data-amount="10000"
                >
                    10 000
                </button>

                <button
                    type="button"
                    class="deposit-preset"
                    data-amount="25000"
                >
                    25 000
                </button>

                <button
                    type="button"
                    class="deposit-preset"
                    data-amount="50000"
                >
                    50 000
                </button>

                <button
                    type="button"
                    class="deposit-preset"
                    data-amount="100000"
                >
                    100 000
                </button>

            </div>

            <input
                id="depositAmount"
                class="deposit-input"
                type="number"
                inputmode="numeric"
                min="1000"
                step="1000"
                placeholder="Введите сумму"
            >

            <div
                class="deposit-selected"
                id="depositSelected"
            >
                Сумма не выбрана
            </div>

            <button
                type="button"
                class="deposit-confirm"
                id="depositConfirm"
            >
                💳 Пополнить
            </button>

            <div
                id="depositResult"
                class="deposit-result"
            ></div>

            <p class="deposit-note">
                Минимальная сумма: 1 000 сум
            </p>

        </div>

    `;

    document.body.appendChild(modal);

    addDepositStyles();


    // ========================================
    // ЭЛЕМЕНТЫ
    // ========================================

    const amountInput =
        document.getElementById(
            "depositAmount"
        );

    const selectedText =
        document.getElementById(
            "depositSelected"
        );

    const closeButton =
        document.getElementById(
            "depositClose"
        );

    const confirmButton =
        document.getElementById(
            "depositConfirm"
        );

    const resultElement =
        document.getElementById(
            "depositResult"
        );

    const presetButtons =
        document.querySelectorAll(
            ".deposit-preset"
        );


    // ========================================
    // БЫСТРЫЕ СУММЫ
    // ========================================

    presetButtons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const amount =
                    Number(
                        this.dataset.amount
                    );

                amountInput.value =
                    amount;

                selectedText.textContent =
                    `Выбрано: ${formatSum(amount)}`;

                presetButtons.forEach(item => {

                    item.classList.remove(
                        "selected"
                    );

                });

                this.classList.add(
                    "selected"
                );

                if (resultElement) {
                    resultElement.innerHTML = "";
                }

            }
        );

    });


    // ========================================
    // ВВОД СУММЫ
    // ========================================

    amountInput.addEventListener(
        "input",
        function () {

            const amount =
                Number(this.value);

            presetButtons.forEach(item => {
                item.classList.remove("selected");
            });

            if (amount > 0) {

                selectedText.textContent =
                    `Выбрано: ${formatSum(amount)}`;

            } else {

                selectedText.textContent =
                    "Сумма не выбрана";

            }

            if (resultElement) {
                resultElement.innerHTML = "";
            }
        }
    );


    // ========================================
    // ЗАКРЫТЬ
    // ========================================

    closeButton.addEventListener(
        "click",
        function () {

            modal.style.display = "none";

        }
    );


    // ========================================
    // ЗАКРЫТИЕ ПО ФОНУ
    // ========================================

    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {

                modal.style.display = "none";

            }

        }
    );


    // ========================================
    // ПОПОЛНИТЬ
    // ========================================

    confirmButton.addEventListener(
        "click",
        createDeposit
    );
}


// ========================================
// СОЗДАНИЕ ЗАЯВКИ
// ========================================

async function createDeposit() {

    console.log(
        "💳 Начинаем создание заявки"
    );

    const amountInput =
        document.getElementById(
            "depositAmount"
        );

    const confirmButton =
        document.getElementById(
            "depositConfirm"
        );

    const resultElement =
        document.getElementById(
            "depositResult"
        );


    if (!amountInput) {

        console.error(
            "depositAmount не найден"
        );

        return;
    }


    const amount =
        Number(
            amountInput.value
        );


    // ========================================
    // ПРОВЕРКА СУММЫ
    // ========================================

    if (!amount || amount < 1000) {

        if (resultElement) {

            resultElement.className =
                "deposit-result error";

            resultElement.innerHTML =
                "❌ Минимальная сумма — 1 000 сум";

        }

        return;
    }


    // ========================================
    // ПРОВЕРКА TELEGRAM
    // ========================================

    if (!telegramUser.id) {

        if (resultElement) {

            resultElement.className =
                "deposit-result error";

            resultElement.innerHTML =
                "❌ Откройте приложение через Telegram";

        }

        return;
    }


    // ========================================
    // СОСТОЯНИЕ ОТПРАВКИ
    // ========================================

    if (confirmButton) {

        confirmButton.disabled = true;

        confirmButton.textContent =
            "⏳ Отправляем...";

    }


    if (resultElement) {

        resultElement.className =
            "deposit-result loading";

        resultElement.innerHTML =
            "⏳ Создаём заявку...";

    }


    try {

        console.log(
            "📤 Отправляем:",
            {
                telegram_id: telegramUser.id,
                amount: amount
            }
        );


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


        console.log(
            "📥 HTTP:",
            response.status
        );


        // ========================================
        // ЧИТАЕМ ОТВЕТ
        // ========================================

        const rawText =
            await response.text();


        console.log(
            "📥 Ответ сервера:",
            rawText
        );


        let data = {};

        try {

            data =
                JSON.parse(rawText);

        } catch {

            data = {
                detail: rawText
            };

        }


        // ========================================
        // ОШИБКА СЕРВЕРА
        // ========================================

        if (!response.ok) {

            const errorText =
                data.detail ||
                data.message ||
                `Ошибка сервера: ${response.status}`;

            throw new Error(
                errorText
            );
        }


        // ========================================
        // НЕТ НОМЕРА ЗАЯВКИ
        // ========================================

        if (!data.deposit_id) {

            console.warn(
                "Сервер не вернул deposit_id",
                data
            );

        }


        const depositId =
            data.deposit_id ||
            "—";

        const depositAmount =
            Number(
                data.amount || amount
            );


        // ========================================
        // УСПЕХ
        // ========================================

        if (resultElement) {

            resultElement.className =
                "deposit-result success";

            resultElement.innerHTML = `

                <div class="success-icon">
                    ✅
                </div>

                <strong>
                    Заявка создана!
                </strong>

                <span>
                    Номер заявки:
                    <b>#${depositId}</b>
                </span>

                <span>
                    Сумма:
                    <b>${formatSum(depositAmount)}</b>
                </span>

                <small>
                    Ожидайте подтверждения администратора.
                </small>

            `;

        }


        // ========================================
        // ОБНОВЛЯЕМ БАЛАНС
        // ========================================

        await loadBalance();


    } catch (error) {

        console.error(
            "❌ Ошибка создания заявки:",
            error
        );


        if (resultElement) {

            resultElement.className =
                "deposit-result error";

            resultElement.innerHTML = `

                <div class="error-icon">
                    ❌
                </div>

                <strong>
                    Не удалось создать заявку
                </strong>

                <span>
                    ${escapeHtml(
                        error.message ||
                        "Неизвестная ошибка"
                    )}
                </span>

            `;

        }

    } finally {

        if (confirmButton) {

            confirmButton.disabled =
                false;

            confirmButton.textContent =
                "💳 Пополнить";

        }

    }
}


// ========================================
// БЕЗОПАСНЫЙ ВЫВОД ТЕКСТА
// ========================================

function escapeHtml(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ========================================
// CSS ПОПОЛНЕНИЯ
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
        document.createElement("style");


    style.id =
        "depositStyles";


    style.textContent = `

        .deposit-modal {

            position: fixed;

            inset: 0;

            z-index: 99999;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 20px;

            background:
                rgba(0, 0, 0, 0.75);

            backdrop-filter:
                blur(10px);

        }


        .deposit-window {

            position: relative;

            width: 100%;

            max-width: 420px;

            max-height: 90vh;

            overflow-y: auto;

            box-sizing: border-box;

            padding: 28px 20px 22px;

            border-radius: 24px;

            background:
                linear-gradient(
                    145deg,
                    #171b2d,
                    #0d1020
                );

            border:
                1px solid
                rgba(255,255,255,0.12);

            box-shadow:
                0 25px 80px
                rgba(0,0,0,0.5);

            text-align: center;

            animation:
                depositAppear
                0.2s ease;

        }


        @keyframes depositAppear {

            from {

                opacity: 0;

                transform:
                    translateY(20px)
                    scale(0.96);

            }

            to {

                opacity: 1;

                transform:
                    translateY(0)
                    scale(1);

            }

        }


        .deposit-close {

            position: absolute;

            top: 12px;

            right: 14px;

            width: 36px;

            height: 36px;

            border: none;

            border-radius: 50%;

            background:
                rgba(255,255,255,0.08);

            color: white;

            font-size: 18px;

            cursor: pointer;

        }


        .deposit-icon {

            font-size: 48px;

            margin-bottom: 8px;

        }


        .deposit-window h2 {

            margin:
                0 0 8px;

            color: white;

            font-size: 24px;

        }


        .deposit-description {

            margin:
                0 0 20px;

            color:
                rgba(255,255,255,0.65);

            font-size: 14px;

        }


        .deposit-presets {

            display: grid;

            grid-template-columns:
                repeat(2, 1fr);

            gap: 10px;

            margin-bottom: 14px;

        }


        .deposit-preset {

            padding: 13px 8px;

            border:
                1px solid
                rgba(255,255,255,0.10);

            border-radius: 14px;

            background:
                rgba(255,255,255,0.06);

            color: white;

            font-size: 15px;

            font-weight: 700;

            cursor: pointer;

        }


        .deposit-preset.selected {

            border-color:
                #6c63ff;

            background:
                rgba(108,99,255,0.25);

        }


        .deposit-input {

            box-sizing: border-box;

            width: 100%;

            padding: 15px;

            border:
                1px solid
                rgba(255,255,255,0.12);

            border-radius: 14px;

            outline: none;

            background:
                rgba(255,255,255,0.07);

            color: white;

            font-size: 17px;

            text-align: center;

        }


        .deposit-input::placeholder {

            color:
                rgba(255,255,255,0.4);

        }


        .deposit-input:focus {

            border-color:
                #6c63ff;

        }


        .deposit-selected {

            min-height: 22px;

            margin:
                12px 0;

            color:
                rgba(255,255,255,0.75);

            font-size: 14px;

        }


        .deposit-confirm {

            width: 100%;

            padding: 16px;

            border: none;

            border-radius: 15px;

            background:
                linear-gradient(
                    135deg,
                    #6c63ff,
                    #8b5cf6
                );

            color: white;

            font-size: 16px;

            font-weight: 800;

            cursor: pointer;

        }


        .deposit-confirm:disabled {

            opacity: 0.6;

            cursor:
                not-allowed;

        }


        .deposit-result {

            margin-top: 16px;

            padding: 14px;

            border-radius: 15px;

            font-size: 14px;

            line-height: 1.5;

        }


        .deposit-result.loading {

            background:
                rgba(255,255,255,0.06);

            color:
                rgba(255,255,255,0.8);

        }


        .deposit-result.success {

            background:
                rgba(34,197,94,0.12);

            border:
                1px solid
                rgba(34,197,94,0.25);

            color: #d8ffe3;

            display: flex;

            flex-direction: column;

            gap: 6px;

        }


        .deposit-result.success .success-icon {

            font-size: 30px;

        }


        .deposit-result.success strong {

            color: white;

            font-size: 17px;

        }


        .deposit-result.success small {

            margin-top: 4px;

            color:
                rgba(255,255,255,0.6);

        }


        .deposit-result.error {

            background:
                rgba(239,68,68,0.12);

            border:
                1px solid
                rgba(239,68,68,0.25);

            color: #ffd7d7;

            display: flex;

            flex-direction: column;

            gap: 6px;

        }


        .deposit-result.error .error-icon {

            font-size: 30px;

        }


        .deposit-result.error strong {

            color: white;

            font-size: 17px;

        }


        .deposit-note {

            margin:
                14px 0 0;

            color:
                rgba(255,255,255,0.4);

            font-size: 12px;

        }

    `;


    document.head.appendChild(style);
}


// ========================================
// МОИ ЗАКАЗЫ
// ========================================

function showOrders() {

    showMessage(
        "Раздел «Мои заказы» пока находится в разработке."
    );

}


// ========================================
// ПОМОЩЬ
// ========================================

function showHelp() {

    showMessage(
        "Если у вас возникли проблемы, обратитесь в поддержку BuyPay."
    );

}


// ========================================
// ИСТОРИЯ ПОПОЛНЕНИЙ
// ========================================

async function showDepositHistory() {

    if (!telegramUser.id) {

        showMessage(
            "Откройте приложение через Telegram."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/deposits/${telegramUser.id}`
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const deposits =
            await response.json();


        if (
            !deposits ||
            deposits.length === 0
        ) {

            showMessage(
                "История пополнений пока пуста."
            );

            return;
        }


        let text =
            "💰 История пополнений\n\n";


        deposits
            .slice(0, 10)
            .forEach(item => {

                let status =
                    item.status || "pending";


                if (status === "pending") {
                    status = "⏳ На проверке";
                }

                if (status === "confirmed") {
                    status = "✅ Подтверждено";
                }

                if (status === "rejected") {
                    status = "❌ Отклонено";
                }


                text +=
                    `#${item.id} — ` +
                    `${formatSum(item.amount)}\n` +
                    `${status}\n\n`;

            });


        showMessage(text);


    } catch (error) {

        console.error(
            "Ошибка истории:",
            error
        );


        showMessage(
            "Не удалось загрузить историю."
        );

    }

}


// ========================================
// СОЗДАНИЕ ЗАКАЗА
// ========================================

async function createOrder() {

    if (!selectedGame) {

        showMessage(
            "Сначала выберите игру."
        );

        return;
    }


    if (!selectedPackage) {

        showMessage(
            "Сначала выберите пакет."
        );

        return;
    }


    const playerInput =
        document.getElementById(
            "playerId"
        );


    const playerId =
        playerInput?.value.trim();


    if (!playerId) {

        showMessage(
            "Введите ID игрока."
        );

        playerInput?.focus();

        return;
    }


    if (!telegramUser.id) {

        showMessage(
            "Откройте приложение через Telegram."
        );

        return;
    }


    if (
        currentBalance <
        selectedPackage.price
    ) {

        showMessage(
            "Недостаточно средств на балансе."
        );

        return;
    }


    showMessage(
        "Функция покупки будет подключена следующим этапом."
    );
}


// ========================================
// КНОПКА ОБНОВЛЕНИЯ БАЛАНСА
// ========================================

const refreshButton =
    document.getElementById(
        "balanceRefresh"
    );


if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        loadBalance
    );
}


// ========================================
// КНОПКА ПОПОЛНЕНИЯ
// ========================================

const depositButton =
    document.getElementById(
        "depositButton"
    );


if (depositButton) {

    depositButton.addEventListener(
        "click",
        function () {

            console.log(
                "🔥 Кнопка пополнения нажата"
            );

            openDeposit();

        }
    );
}


// ========================================
// ID ИГРОКА
// ========================================

const playerInput =
    document.getElementById(
        "playerId"
    );


if (playerInput) {

    playerInput.addEventListener(
        "input",
        updateSummary
    );
}


// ========================================
// ПРИВЕТСТВИЕ
// ========================================

const welcomeText =
    document.getElementById(
        "welcomeText"
    );


if (
    welcomeText &&
    telegramUser.first_name
) {

    welcomeText.textContent =
        `Xush kelibsiz, ${telegramUser.first_name}! 👋`;

}


// ========================================
// ЗАПУСК
// ========================================

registerUser();
loadBalance();


console.log(
    "🔥 BuyPay Web App v26 запущен"
);