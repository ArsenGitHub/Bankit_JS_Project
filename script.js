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
        '2020-07-12T10:51:36.790Z',
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
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
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

// Хранит текущий аккаунт
let currentAccount;

// Хранит текущую валюту
let currentCurrency = 'RUB';

// Хранит состояние сортировки переводов(при клике на сортировку => true)
let sortState = false;

// Функция будет отображать снятие и поступление средств на счет и будет принимать данные из массива
const displayMovements = function (movements, sort = false) {
    const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

    containerMovements.innerHTML = '';

    movs.forEach(function (mov, index) {
        const operation = mov > 0 ? 'deposit' : 'withdrawal';
        const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${operation}">${
            index + 1
        } ${operation}</div>
          <div class="movements__value">${mov.toFixed(
              2
          )} ${currentCurrency}</div>
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
    labelBalance.textContent = `${currentAccount.balance.toFixed(
        2
    )} ${currentCurrency}`;
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

    labelSumIn.textContent = `${depositsSum.toFixed(2)} ${currentCurrency}`;
    labelSumOut.textContent = `${Math.abs(withdrawalSum).toFixed(
        2
    )} ${currentCurrency}`;
    labelSumInterest.textContent = `${interestSum.toFixed(
        2
    )} ${currentCurrency}`;
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
        currentAccount.movements.push(transferAmount * -1);
        recipient.movements.push(transferAmount);
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
        currentAccount.movements.push(loanAmount);
        inputLoanAmount.value = '';

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

// Метод рассчета корня числа
console.log(Math.sqrt(25)); //5
console.log(25 ** (1 / 2)); //5
console.log(8 ** (1 / 3)); //2

// Метод выявления наибольшего  и наименьшего числа, приводит строки в числа(type coercion)
console.log(Math.max(10, 20, -10, 24, 9, '30')); //30
console.log(Math.max(10, '20px', -10, 24, 9, '30')); //NaN

console.log(Math.min(10, 20, -10, 24, 9, '30')); //-10

// Метод Math.random() возвращает псевдослучайное число с плавающей запятой из диапазона [0, 1)
// Метод Math.trunc() обрезает(не округляет) число до целых
console.log(Math.random()); // 0.0000214...
console.log(Math.trunc(Math.random())); // 0
console.log(Math.trunc(Math.random() * 5)); // 0 до 4

// Функция для выбора диапазона(мин и макс) выводимого рандомного целого числа
const minMaxInt = (min, max) =>
    Math.trunc(Math.random() * (max - min) + 1) + min;
// (max - min) - необходим, чтобы потом прибавить min, т.к. если рандом выдаст 0, то функция выдаст min,  если не 0, то -min + min взаимоуничтожатся
// А +1 нужен, т.к trunc "обрезает" все десятичные числа, т.е. всегда итоговое число будет меньше на 1

// МЕТОДЫ ОКРУГЛЕНИЯ ЦЕЛЫХ ЧИСЕЛ
// Метод Math.round() Округление до целых чисел(приводит строки в числа(type coercion))
console.log(Math.trunc(23.3)); //23 ---просто обрезает

console.log(Math.round(23.5)); //24
console.log(Math.round(23.4)); //23

// Метод Math.ceil() Округление до целых чисел В БОЛЛЬШУЮ СТОРОНУ(приводит строки в числа(type coercion))
console.log(Math.ceil(23.5)); //24
console.log(Math.ceil(23.4)); //24

// Метод Math.floor() Округление до целых чисел В МЕНЬШУЮ СТОРОНУ(приводит строки в числа(type coercion))
console.log(Math.floor(23.5)); //23
console.log(Math.floor(23.4)); //23
console.log(Math.floor('23.4')); //23

// Отличия Math.floor() и Math.trunc()
console.log(Math.floor(-5.5)); //-6 -- т.к. округляет в МЕНЬШУЮ СТОРОНУ
console.log(Math.trunc(-5.5)); //-5 - т.к. просто обрезает

// МЕТОДЫ ОКРУГЛЕНИЯ ДЕСЯТИЧНЫХ ЧИСЕЛ
// Св-во .toFixed('кол-во чисел после запятой'), возвращает СТРОКУ
console.log((2.753).toFixed(0)); // "3"
console.log((2.453).toFixed(0)); // "2"
console.log((2.753).toFixed(1)); // "2.8"
console.log((2.753).toFixed(3)); // "2.753"
console.log(+(2.753).toFixed(4)); // 2.7530 -- уже число, т.к. "+"
