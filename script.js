'use strict';

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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
          <div class="movements__value">${mov} ${currentCurrency}</div>
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
    labelBalance.textContent = `${currentAccount.balance} ${currentCurrency}`;
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

    labelSumIn.textContent = `${depositsSum} ${currentCurrency}`;
    labelSumOut.textContent = `${Math.abs(withdrawalSum)} ${currentCurrency}`;
    labelSumInterest.textContent = `${interestSum} ${currentCurrency}`;
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

    const transferAmount = Number(inputTransferAmount.value);
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
    const pin = Number(inputClosePin.value);
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

    const loanAmount = Number(inputLoanAmount.value);
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
