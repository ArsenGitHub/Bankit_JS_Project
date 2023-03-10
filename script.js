'use strict';

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2023-03-09T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2023-01-10T14:43:26.374Z',
        '2023-03-03T18:49:59.371Z',
        '2023-03-08T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const loginForm = document.querySelector('.login');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Хранит текущий аккаунт, таймер
let currentAccount, timer;

// Хранит состояние сортировки переводов(при клике на сортировку => true)
let sortState = false;

// Функция для интеранационализации даты
const formatDate = function (yourDate, locale) {
    const date = yourDate ? new Date(yourDate) : new Date();
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const hour = `${date.getHours()}`.padStart(2, 0);
    const min = `${date.getMinutes()}`.padStart(2, 0);

    const options = {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    };

    const passedDays = Math.round((new Date() - date) / (1000 * 60 * 60 * 24));

    let dateTxt;

    if (passedDays === 0) {
        dateTxt = 'Today';
    } else if (passedDays === 1) {
        dateTxt = 'Yesterday';
    } else if (passedDays <= 7) {
        dateTxt = `${passedDays} days ago`;
    } else {
        dateTxt = new Intl.DateTimeFormat(locale).format(date);
    }

    return yourDate
        ? dateTxt
        : new Intl.DateTimeFormat(locale, options).format(date);
};

// Функция интернационализации чисел и валюты
const formatCurrency = function (money, locale, currency) {
    return Intl.NumberFormat(locale, {
        style: 'currency',
        currencyDisplay: 'symbol',
        currency: currency,
    }).format(money);
};

// Функция будет отображать снятие и поступление средств на счет и будет принимать данные из массива
const displayMovements = function (movements, sort = false) {
    const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

    containerMovements.innerHTML = '';

    // Текущее время
    labelDate.textContent = formatDate(0, currentAccount.locale);

    movs.forEach(function (mov, index) {
        const operation = mov > 0 ? 'deposit' : 'withdrawal';

        // Интернационализация даты переводов
        const formatedDate = formatDate(
            currentAccount.movementsDates[index],
            currentAccount.locale
        );

        // Интернационализация денег, курса чисел
        const formatedMoney = formatCurrency(
            mov,
            currentAccount.locale,
            currentAccount.currency
        );

        const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${operation}">${
            index + 1
        } ${operation}</div>
        <div class="movements__date">${formatedDate}</div>
          <div class="movements__value">${formatedMoney}</div>
      </div>
      `;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

// Функция рассчитывает сумму всех транзакции и выводит это в балансе аккаунта
const calcDisplayBalance = function (movements) {
    currentAccount.balance = movements.reduce(
        (accum, value) => accum + value,
        0
    );
    labelBalance.textContent = formatCurrency(
        currentAccount.balance,
        currentAccount.locale,
        currentAccount.currency
    );
};

// Функция рассчитывает суммарный депозит, снятие и процент "вклада" и выводит в отдельные окошки
const calcDisplaySummary = function (account) {
    const depositsSum = account.movements
        .filter((money) => money > 0)
        .reduce((accum, deposit) => accum + deposit, 0);
    const withdrawalSum = account.movements
        .filter((money) => money < 0)
        .reduce((accum, withdrawal) => accum + withdrawal, 0);
    const interestSum = account.movements
        .filter((money) => money > 0)
        .map((deposit) => (deposit * account.interestRate) / 100)
        .filter((interest) => interest >= 1)
        .reduce((accum, interest) => accum + interest, 0);

    labelSumIn.textContent = formatCurrency(
        depositsSum,
        currentAccount.locale,
        currentAccount.currency
    );

    labelSumOut.textContent = formatCurrency(
        Math.abs(withdrawalSum),
        currentAccount.locale,
        currentAccount.currency
    );

    labelSumInterest.textContent = formatCurrency(
        interestSum,
        currentAccount.locale,
        currentAccount.currency
    );
};

// Функция возвращает инициалы пользователя в обьекты account(
const createUserInitial = function (accs) {
    accs.forEach(function (account) {
        account.userNameInitial = account.owner
            .toLowerCase()
            .split(' ')
            .map((name) => name[0])
            .join('');
    });
};

// Функция для обновления интерфейса(новые переводы)
const updateUI = function (acc) {
    displayMovements(acc.movements);
    calcDisplayBalance(acc.movements);
    calcDisplaySummary(acc);
};

// Функция для выхода с аккаунта
const logout = function () {
    loginForm.style.opacity = 1;
    containerApp.style.opacity = '0';
    labelWelcome.textContent = `Log in to get started`;

    inputTransferTo.value =
        inputTransferAmount.value =
        inputLoginUsername.value =
        inputLoginPin.value =
        inputLoanAmount.value =
        inputCloseUsername.value =
        inputClosePin.value =
            '';
};

// Добавляем инициалы аккаунтов в обьекты аккаунтов
createUserInitial(accounts);

// Функция выхода с аккаунта по истечению времени
const logoutTimer = function () {
    let time = 1000 * 60 * 0.5;
    const tick = function () {
        if (time > 0) {
            time -= 1000;
            const startTime = new Date(time);
            const min = `${startTime.getMinutes()}`.padStart(2, 0);
            const sec = `${startTime.getSeconds()}`.padStart(2, 0);

            labelTimer.textContent = `${min}:${sec}`;
        } else {
            clearInterval(timer);
            logout();
        }
    };

    tick();
    const timer = setInterval(tick, 1000);

    return timer;
};

// Событие входа в аккаунт
btnLogin.addEventListener('click', function (e) {
    e.preventDefault();
    currentAccount = accounts.find(
        (account) =>
            account.userNameInitial === inputLoginUsername.value.toLowerCase()
    );
    if (inputLoginPin?.value === String(currentAccount?.pin)) {
        updateUI(currentAccount);

        labelWelcome.textContent = `Welcome back ${currentAccount.owner}`;
        containerApp.style.opacity = '1';
        loginForm.style.opacity = 0;

        // Функция выхода с аккаунта по истечению времени
        // Если timer уже сущ-т(таймер уже запущен), обнуляем и запускаем новый
        if (timer) clearInterval(timer);
        timer = logoutTimer();
    } else {
        alert('Wrong User name or password!');
    }
});

// Событие выхода c аккаунта
document.querySelector('.logo').addEventListener('click', function (e) {
    logout();
});

// Событие перевода денег на другой аккаунт
btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();

    const transferAmount = +inputTransferAmount.value;
    const recipient = accounts.find(
        (account) =>
            account.owner ===
            inputTransferTo.value
                .toLowerCase()
                .split(' ')
                .map((name) => name.replace(name[0], name[0].toUpperCase()))
                .join(' ')
    );

    if (
        recipient &&
        currentAccount.owner !== recipient.owner &&
        transferAmount <= currentAccount.balance &&
        transferAmount > 0
    ) {
        // Добавляем в массивы перевод
        currentAccount.movements.push(transferAmount * -1);
        recipient.movements.push(transferAmount);

        //Добавляем новые даты переводов
        currentAccount.movementsDates.push(new Date().toISOString());
        recipient.movementsDates.push(new Date().toISOString());

        // Обновляем счетчик времени
        clearInterval(timer);
        timer = logoutTimer();

        updateUI(currentAccount);
        inputTransferTo.value = inputTransferAmount.value = '';
    } else if (!recipient || currentAccount.owner === recipient?.owner) {
        alert('Wrong recipient');
    } else {
        inputTransferAmount.value = '';
        alert('Wrong amount of money');
    }
});

// Событие удаление аккаунта
btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    const user = inputCloseUsername.value.toLowerCase();
    const pin = +inputClosePin.value;
    const accountIndex = accounts.findIndex(
        (acc) => acc.userNameInitial === user
    );

    if (user === currentAccount.userNameInitial && pin === currentAccount.pin) {
        accounts.splice(accountIndex, 1);

        logout(); // выход с аккаунта
    } else if (user !== currentAccount.userNameInitial) {
        inputCloseUsername.value = '';
        alert('Wrong user name!');
    } else {
        inputClosePin.value = '';
        alert('Wrong password!');
    }
});

// Событие взятие кредита(loan) с багом
btnLoan.addEventListener('click', function (e) {
    e.preventDefault();

    const loanAmount = Math.floor(inputLoanAmount.value);
    const loanAgreement = currentAccount.movements.some(
        (money) => money >= loanAmount * 0.1
    );
    if (loanAmount > 0 && loanAgreement) {
        // Добавляем взятие кредита в переводы
        currentAccount.movements.push(loanAmount);
        // Добавляем новую дату переводы
        currentAccount.movementsDates.push(new Date().toISOString());
        inputLoanAmount.value = '';

        // Обновляем счетчик времени
        clearInterval(timer);
        timer = logoutTimer();

        updateUI(currentAccount);
    } else if (!loanAgreement) {
        inputLoanAmount.value = '';
        alert(
            `Too much, your max. limit of loan is: ${
                currentAccount.movements.reduce(
                    (accum, money) => (accum < money ? money : accum),
                    0
                ) * 10
            } ${currentCurrency}`
        );
    } else {
        alert('Wrong amount of loan');
    }
});

// Событие для реализации сортировки транзакции
btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    sortState = !sortState;
    displayMovements(currentAccount.movements, sortState);
});

// const labelTimer = document.querySelector('.timer');

// const logout = function () {
//     loginForm.style.opacity = 1;
//     containerApp.style.opacity = '0';
//     labelWelcome.textContent = `Log in to get started`;

//     inputTransferTo.value =
//         inputTransferAmount.value =
//         inputLoginUsername.value =
//         inputLoginPin.value =
//         inputLoanAmount.value =
//         inputCloseUsername.value =
//         inputClosePin.value =
//             '';
// };

console.log(new Date(1000 * 60 * 5));
