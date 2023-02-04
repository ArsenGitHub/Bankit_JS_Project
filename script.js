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

// Функция будет отображать снятие и поступление средств на счет и будет принимать данные из массива
const displayMovements = function (movements) {
    containerMovements.innerHTML = '';
    movements.forEach(function (mov, index) {
        const operation = mov > 0 ? 'deposit' : 'withdrawal';
        const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${operation}">${
            index + 1
        } ${operation}</div>
          <div class="movements__value">${mov} RUB</div>
      </div>
      `;

        // const containerMovements = document.querySelector('.movements');
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

displayMovements(account1.movements);

// Функция рассчитывает сумму всех транзакции и выводит это в балансе аккаунта
const calcDisplayBalance = function (movements) {
    const balance = movements.reduce((accum, value) => accum + value, 0);

    // const labelBalance = document.querySelector('.balance__value');
    labelBalance.textContent = `${balance} RUB`;
};

calcDisplayBalance(account1.movements);

// Функция рассчитывает суммарный депосит, снятие и процент "вклада" и выводит в отдельные окошки
const calcDisplaySummary = function (movements) {
    const depositsSum = movements
        .filter((money) => money > 0)
        .reduce((accum, deposit) => accum + deposit, 0);
    const withdrawalSum = movements
        .filter((money) => money < 0)
        .reduce((accum, withdrawal) => accum + withdrawal, 0);
    const interestSum = movements
        .filter((money) => money > 0)
        .map((deposit) => deposit * 0.012)
        .filter((interest) => interest >= 1)
        .reduce((accum, interest) => accum + interest, 0);

    // const labelSumIn = document.querySelector('.summary__value--in');
    // const labelSumOut = document.querySelector('.summary__value--out');
    labelSumIn.textContent = `${depositsSum} RUB`;
    labelSumOut.textContent = `${Math.abs(withdrawalSum)} RUB`;
    labelSumInterest.textContent = `${interestSum} RUB`;
};

calcDisplaySummary(account1.movements);

// Функция возвращает инициалы пользователя в обьекты account(
const createUserInitial = function (accs) {
    accs.forEach(function (account) {
        account.userNameInitial = account.owner
            .toLowerCase() //меняем регистр
            .split(' ') //засовываем все в массив, знач-я [имя, фамилия]
            .map((name) => name[0]) //возвр-ем новый массив, знач-я [и, ф]
            .join(''); //обьединяем знач-я массива в одну общую строку "иф"
    });
};

createUserInitial(accounts);
