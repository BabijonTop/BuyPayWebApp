const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


const API_URL = "https://buypayserver.onrender.com";


const telegramUser =
    tg.initDataUnsafe?.user || {};


let selectedGame = null;
let selectedPackage = null;
let currentBalance = 0;


const games = {

    "PUBG Mobile": [
        {
            name: "60 UC",
            price: 12000
        },
        {
            name: "325 UC",
            price: 55000
        },
        {
            name: "660 UC",
            price: 105000
        },
        {
            name: "1800 UC",
            price: 270000
        }
    ],

    "Mobile Legends": [
        {
            name: "86 Diamonds",
            price: 15000
        },
        {
            name: "172 Diamonds",
            price: 30000
        },
        {
            name: "257 Diamonds",
            price: 45000
        },
        {
            name: "706 Diamonds",
            price: 80000
        }
    ],

    "Free Fire": [
        {
            name: "100 Diamonds",
            price: 15000
        },
        {
            name: "310 Diamonds",
            price: 40000
        },
        {
            name: "520 Diamonds",
            price: 65000
        },
        {
            name: "1060 Diamonds",
            price: 120000
        }
    ],

    "Brawl Stars": [
        {
            name: "30 Gems",
            price: 15000
        },
        {
            name: "80 Gems",
            price: 35000
        },
        {
            name: "170 Gems",
            price: 70000
        },
        {
            name: "360 Gems",
            price: 140000
        }
    ]

};


function formatSum(number) {

    return Number(number || 0)
        .toLocaleString("ru-RU") + " сум";

}


function showMessage(text) {

    if (tg.showPopup) {

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


function testDepositButton() {

    alert("🔥 КНОПКА РАБОТАЕТ!");

    console.log(
        "🔥 Пополнение: кнопка нажата"
    );

}


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


function renderPackages() {

    const container =
        document.getElementById("packages");

    if (!container) return;


    container.innerHTML = "";


    const packages =
        games[selectedGame] || [];


    packages.forEach((item, index) => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className = "package-card";


        button.innerHTML = `

            <div>

                <strong>
                    ${item.name}
                </strong>

                <span>
                    Игровая валюта
                </span>

            </div>

            <b>
                ${formatSum(item.price)}
            </b>

        `;


        button.addEventListener(
            "click",
            function () {

                selectPackage(index);

            }
        );


        container.appendChild(button);

    });

}


function selectPackage(index) {

    if (!selectedGame) return;


    selectedPackage =
        games[selectedGame][index];


    updateSummary();


    showSection("playerSection");

    showSection("summarySection");


    scrollToElement("playerSection");

}


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


async function registerUser() {

    if (!telegramUser.id) {

        console.log(
            "Telegram user ID отсутствует"
        );

        return;

    }


    try {

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
                        telegramUser.username ||
                        "",

                    first_name:
                        telegramUser.first_name ||
                        ""

                })

            }
        );

    } catch (error) {

        console.error(
            "Ошибка регистрации:",
            error
        );

    }

}


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
                "Ошибка сервера"
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


function showSection(id) {

    const element =
        document.getElementById(id);

    if (!element) return;


    element.classList.remove(
        "hidden-section"
    );

}


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
        document.getElementById("playerId");


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
        "Заказ создан."
    );

}


function showOrders() {

    showMessage(
        "Раздел «Мои заказы» пока находится в разработке."
    );

}


function showHelp() {

    showMessage(
        "Если у вас возникли проблемы, обратитесь в поддержку BuyPay."
    );

}


function showDepositHistory() {

    showMessage(
        "История пополнений пока находится в разработке."
    );

}


const refreshButton =
    document.getElementById(
        "balanceRefresh"
    );


if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        function () {

            loadBalance();

        }
    );

}


const depositButton =
    document.getElementById(
        "depositButton"
    );


if (depositButton) {

    depositButton.addEventListener(
        "click",
        function () {

            console.log(
                "🔥 depositButton CLICK"
            );

            testDepositButton();

        }
    );

}


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


registerUser();

loadBalance();


console.log(
    "🔥 BuyPay Web App v24 запущен"
);