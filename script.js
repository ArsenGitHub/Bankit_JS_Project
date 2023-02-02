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

// При работе с данными со страницы, ВСЕГДА лучше создавать функцию, которая НАПРЯМУЮ со страницы ПОЛУЧАЕТ ДАННЫЕ и НЕ СОЗДАВАТЬ переменную в глобальном контексте выполненения(ПРИВАТНОСТЬ ДАННЫХ)

// Функция будет отображать снятие и поступление средств на счет и будет принимать данные из массива
const displayMovements = function (movements) {
    // Посредством св-ва innerHTML(возвращает html дочерних элементов) удаляем изначальную верстку блока "movements", т.к. она нужна чисто как шаблон
    containerMovements.innerHTML = '';
    movements.forEach(function (mov, index) {
        // Создаем тернарный оператор(ternary operator) , который будет определять, снятие это или пополнение счета, нужны в двух местах, чтобы менять класс html и выводить текст
        const operation = mov > 0 ? 'deposit' : 'withdrawal';

        // Для того, чтобы создать такую же структуру html как в верстке, копируем ее с верстки и вставляем в шаблонную строку(template literal). Верстка здесь воспринимается просто как текст, поэтому
        const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${operation}">${
            index + 1
        } ${operation}</div>
          <div class="movements__value">${mov}</div>
      </div>
      `;
        // containerMovements - переменная, которая содержит(querySelector) родительский блок "movements", куда добавляется верстка методом insertAdjacentHTML()
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

displayMovements(account1.movements);

const createUserInitial = function (accs) {
    // Применяем метод forEach, т.к. не нужно создавать и возвращать новый массив, а мы просто хотим слегка модифицировать уже сущ-ий
    accs.forEach(function (account) {
        // Получаем обьекты account1, account2... и к каждому добваляем новое св-во account.userNameInitial,  account.owner-получаем св-во owner из обьекта(Имя Фамилия)
        account.userNameInitial = account.owner
            .toLowerCase() //меняем регистр
            .split(' ') //засовываем все в массив, знач-я [имя, фамилия]
            .map((name) => name[0]) //возвр-ем новый массив, знач-я [и, ф]
            .join(''); //обьединяем знач-я массива в одну общую строку "иф"
    });
};

createUserInitial(accounts);
