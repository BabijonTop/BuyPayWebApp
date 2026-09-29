 // ================================
// TELEGRAM WEB APP
// ================================

const tg = window.Telegram?.WebApp || null;

if (tg) {
    tg.ready();
    tg.expand();
}


// ================================
// ДАННЫЕ ЗАКАЗА
// ================================

let selectedGame = "";
let selectedAmount = 0;
let selectedPrice = 0;


// ================================
// ПОЛЬЗОВАТЕЛЬ TELEGRAM
// ================================

const user = tg?.initDataUnsafe?.user;


// ================================
// ПРИВЕТСТВИЕ
// ================================

const welcomeText = document.getElementById("welcomeText");
const profile = document.getElementById("profile");

if (user) {

    const firstName = user.first_name || "Пользователь";

    welcomeText.textContent =
        `Xush kelibsiz, ${firstName}!`;

    if (user.photo_url) {

        profile.innerHTML = `
            <img
                src="${user.photo_url}"
                style="
                    width:100%;
                    height:100%;
                    border-radius:50%;
                    object-fit:cover;
                "
            >
        `;
    }

} else {

    welcomeText.textContent =
        "Xush kelibsiz!";

}


// ================================
// ВЫБОР ИГРЫ
// ================================

function selectGame(game) {

    selectedGame = game;

    document.getElementById("selectedGame").textContent = game;
    document.getElementById("summaryGame").textContent = game;

    let packages = "";


    // PUBG MOBILE

    if (game === "PUBG Mobile") {

        packages = `

            <button class="package"
                onclick="selectPackage(this, 60, 12000)">
                <strong>60 UC</strong>
                <span>12 000 сум</span>
            </button>

            <button class="package"
                onclick="selectPackage(this, 325, 55000)">
                <strong>325 UC</strong>
                <span>55 000 сум</span>
            </button>

            <button class="package"
                onclick="selectPackage(this, 660, 105000)">
                <strong>660 UC</strong>
                <span>105 000 сум</span>
            </button>

            <button class="package"
                onclick="selectPackage(this, 1800, 270000)">
                <strong>1800 UC</strong>
                <span>270 000 сум</span>
            </button>

        `;

    }


    // MOBILE LEGENDS

    else if (game === "Mobile Legends") {

        packages = `

            <button class="package"
                onclick="selectPackage(this, 86, 12000)">
                <strong>86 Diamonds</strong>
                <span>12 000 сум</span>
            </button>

            <button class="package"
                onclick="selectPackage(this, 172, 23000)">
                <strong>172 Diamonds</strong>
                <span>23 000 сум</span>
            </button>

            <button class="package"
                onclick="selectPackage(this, 257, 34000)">
                <strong>257 Diamonds</strong>
                <span>34 000 сум</span>
            </button>

            <button class="package"
                onclick="selectPackage(this, 706, 85000)">
                <strong>706 Diamonds</strong>
                <span>85 000 сум</span>
            </button>

        `;

    }


    // FREE FIRE

    else if (game === "Free Fire") {

        packages = `

            <button class="package"
                onclick="selectPackage(this, 100, 12000)">
                <strong>100 Diamonds</strong>
                <span>12 000 сум</span>
            </button>

            <button class="package"
                onclick="selectPackage(this, 310, 35000)">
                <strong>310 Diamonds</strong>
                <span>35 000 сум</span>
            </button>

            <button class="package"
                onclick="selectPackage(this, 520, 55000)">
                <strong>520 Diamonds</strong>
                <span>55 000 сум</span>
            </button>

            <button class="package"
                onclick="selectPackage(this, 1060, 105000)">
                <strong>1060 Diamonds</strong>
                <span>105 000 сум</span>
            </button>

        `;

    }


    // BRAWL STARS

    else if (game === "Brawl Stars") {

        packages = `

            <button class="package"
                onclick="selectPackage(this, 30, 12000)">
                <strong>30 Gems</strong>
                <span>12 000 сум</span>
            </button>

            <button class="package"
                onclick="selectPackage(this, 80, 30000)">
                <strong>80 Gems</strong>
                <span>30 000 сум</span>
            </button>

            <button class="package"
                onclick="selectPackage(this, 170, 60000)">
                <strong>170 Gems</strong>
                <span>60 000 сум</span>
            </button>

            <button class="package"
                onclick="selectPackage(this, 360, 120000)">
                <strong>360 Gems</strong>
                <span>120 000 сум</span>
            </button>

        `;

    }


    document.querySelector(".packages").innerHTML = packages;


    selectedAmount = 0;
    selectedPrice = 0;

    document.getElementById("summaryPackage").textContent = "—";
    document.getElementById("summaryPrice").textContent = "0 сум";


    document.getElementById("orderSection").scrollIntoView({
        behavior: "smooth"
    });

}


// ================================
// ВЫБОР ПАКЕТА
// ================================

function selectPackage(button, amount, price) {

    selectedAmount = amount;
    selectedPrice = price;

    document.getElementById("summaryPackage").textContent =
        amount;

    document.getElementById("summaryPrice").textContent =
        price.toLocaleString("ru-RU") + " сум";


    document.querySelectorAll(".package").forEach(item => {
        item.classList.remove("selected");
    });

    button.classList.add("selected");

}


// ================================
// СОЗДАНИЕ И ОТПРАВКА ЗАКАЗА
// ================================

function createOrder() {

    const playerId =
        document.getElementById("playerId").value.trim();


    if (!selectedGame) {

        showMessage("Сначала выберите игру.");

        return;
    }


    if (!selectedAmount) {

        showMessage("Выберите пакет.");

        return;
    }


    if (!playerId) {

        showMessage("Введите ID игрока.");

        document.getElementById("playerId").focus();

        return;
    }


    // Создаём заказ

    const order = {

        game: selectedGame,

        amount: selectedAmount,

        price: selectedPrice,

        player_id: playerId,

        telegram_id: user?.id || null,

        telegram_username: user?.username || null

    };


    console.log("BUY PAY ORDER:", order);


    const message =

        `Игра: ${selectedGame}\n` +

        `Пакет: ${selectedAmount}\n` +

        `ID игрока: ${playerId}\n` +

        `Сумма: ${selectedPrice.toLocaleString("ru-RU")} сум`;


    // Проверяем Telegram

    if (tg && tg.initData) {

        tg.showPopup({

            title: "Подтверждение заказа",

            message: message,

            buttons: [

                {
                    id: "confirm",
                    type: "default",
                    text: "Подтвердить"
                },

                {
                    id: "cancel",
                    type: "cancel",
                    text: "Отмена"
                }

            ]

        }, function(buttonId) {


            if (buttonId === "confirm") {

                // Отправляем заказ боту

                tg.sendData(
                    JSON.stringify(order)
                );

            }

        });


    } else {

        alert(
            "Откройте BuyPay через Telegram."
        );

    }

}


// ================================
// СООБЩЕНИЯ
// ================================

function showMessage(message) {

    if (tg && tg.initData) {

        tg.showAlert(message);

    } else {

        alert(message);

    }

}


// ================================
// ЗАКАЗЫ
// ================================

function showOrders() {

    showMessage(
        "Раздел «Заказы» пока находится в разработке."
    );

}


// ================================
// ПОМОЩЬ
// ================================

function showHelp() {

    showMessage(
        "Если у вас возникли проблемы с заказом, обратитесь в поддержку BuyPay."
    );

}

