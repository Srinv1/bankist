'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

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
    '2024-09-07T17:01:17.194Z',
    '2024-09-10T23:36:17.929Z',
    '2024-09-12T10:51:36.790Z',
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

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed < 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const mon = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${mon}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatcurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatcurr(mov, acc.locale, acc.currency);

    new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(mov);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatcurr(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatcurr(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatcurr(Math.abs(out), acc.locale, acc.currency);
  `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatcurr(interest, acc.locale, acc.currency);

  `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    // in each call, print available time
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    // when 0 seconds ,stop timer and log out

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to Get Started';
      containerApp.style.opacity = 0;
    }

    // Decrese is
    time--;
  };

  // set time for 5 minutes

  let time = 120;

  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // const now = new Date();
    // const date = `${now.getDate()}`.padStart(2, 0);
    // const mon = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const Min = `${now.getMinutes()}`.padStart(2, 0);
    // `${date}/${mon}/${year} ${hour}:${Min}`;

    // Experementing api
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add the correct date

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // reset timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(Number(inputLoanAmount.value));

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 3000);
  }
  // reset timer
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// numbers

// console.log(23 === 23.0);

// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3); /*flase because of js error*/

// // conversion
// // both will change into number beacsue js takes + to convert string into numbers
// console.log(Number('23'));
// console.log(+'23');

// // parsing

// console.log(Number.parseInt('30px')); /* it changes into number*/
// console.log(
//   Number.parseInt('px30')
// ); /* but it doeasnt because of of start in the string*/

// // parse float

// console.log(
//   Number.parseFloat('2.5rem')
// ); /* float takes every number even with decimal but int takes the first number*/
// console.log(Number.parseInt('2.5rem'));
// console.log(parseInt('2.5rem')); /* same valuve in abovr*/

// // check if its NAN

// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20x'));

// // check if its number

// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20x'));

// maths numbers

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// // cubic
// console.log(8 ** (1 / 3));

// // min & max
// console.log(Math.max(5, 3, 2, 55));
// console.log(Math.min(5, 3, '2', 55));
// // it doesnt work
// console.log(Math.min(5, 3, '2px', 55));

// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// // random

// console.log(Math.floor(Math.random() * 6) + 1);
// // console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min) + 1) + min;
// // console.log(randomInt(5, 10));

// // rounding integers

// console.log(Math.trunc(23.3));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// console.log(Math.floor(23.3));
// // -negatives floor works way better then trunc
// console.log(Math.floor(-23.3));
// console.log(Math.trunc(-23.3));

// // roundinf decimals to fixed only returns in strings
// console.log((2.73).toFixed(0));
// console.log((2.73).toFixed(3));
// console.log((2.736).toFixed(2));
// console.log(+(2.736).toFixed(2));

// reminders
// // its remindrz of divsion
// console.log(5 % 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(6));
// console.log(isEven(914));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });

// // numeric seprator

// const diameter = 239_000_000;
// console.log(diameter);

// // cant use ._ inbetween or first or last
// const pi = 3.14_15;
// // cant use _ with strings same with parsefloat
// console.log(Number('23_000'));

// Bg int

// largest num js can handle

// both are same value
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);

// // with bigint we can use high numbers

// console.log(322323234234242343423434n);
// console.log(Bigint(322323234234242343423434));

// // we cant use bigint with regular num
// // so we have to make the other num also to bigint
// console.log(23 + 2323234324234324234324234234n);

// // it shows true
// console.log(20n > 15);
// // doest work but if we use == it chnges into true because of coercion
// console.log(20n === 20);
// // both are true
// console.log(20n == 20);
// console.log(20n == '20');

// // doesnt work
// Math.sqrt(16n);

// // div
// // this will cut the decimal part
// console.log(10n / 3n);

// console.log(10 / 3);

// create a date

/*
const now = new Date();

console.log(now);

console.log(new Date());

// string type date

console.log(new Date('december 24 2020'));

console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2020, 10, 11, 12, 11, 10));
// this auto coorect

console.log(new Date(2020, 10, 31));
// start of the unix date and time
console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));
*/

//  work with dates

// const future = new Date(2023, 10, 11, 15, 11);

// console.log(future);
// console.log(future.getDate());
// console.log(future.getFullYear());
// console.log(future.getDay());
// console.log(future.setFullYear(2040));
// console.log(future);

// const future = new Date(2024, 8, 19, 15, 23);
// console.log(future);

// const day1 = calcDaysPassed(
//   new Date(2024, 8, 9, 15, 23),
//   new Date(2024, 8, 19, 15, 23)
// );
// console.log(day1);

// // intl

// const now = 32224571.23;

// const options = {
//   // style: 'unit',
//   // unit: 'mile-per-hour',
//   // style: 'unit',
//   // unit: 'celsius',
//   // style: 'percent',
//   // completely ignore the unit
//   // unit: 'celsius',
//   style: 'currency',
//   // this also completely igonre
//   unit: 'celsius',
//   currency: 'EUR',
// };

// console.log('US :', Intl.NumberFormat('en-us', options).format(now));
// console.log('germany :', Intl.NumberFormat('de-DE', options).format(now));
// console.log(
//   navigator.language,
//   Intl.NumberFormat(navigator.language, options).format(now)
// );

// set timerout

// setTimeout(() => console.log('heres is your pizza🍕'), 3000);

// a method using set timeout as function***

// setTimeout(
//   (ing1, ing2) => console.log(`heres is your pizza with ${ing1} and ${ing2}🍕`),
//   3000,
//   'olive',
//   'spinach'
// );

// we just have spread the varible insde timer it will work in above

// const ingredients = ['olive', 'spinach'];
// setTimeout(
//   (ing1, ing2) => console.log(`heres is your pizza with ${ing1} and ${ing2}🍕`),
//   3000,
//   ...ingredients
// );

// const ingredients = ['olive', 'spinach'];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`heres is your pizza with ${ing1} and ${ing2}🍕`),
//   3000,
//   ...ingredients
// );

// // we can stop the timee execution and the timer have to be in a var

// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// // setinterval

// setInterval(function () {
//   const now = new Date();
//   const Hour = now.getHours();
//   const Minutes = now.getMinutes();
//   const sec = now.getSeconds();

//   console.log(`${Hour}:${Minutes}:${sec} `);
// }, 1000);
