import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;
let intervalId;

const inputElement = document.querySelector('.input-timer');
const btnElement = document.querySelector('.btn-timer');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

btnElement.addEventListener('click', handleTimerStart);
notActivStart(btnElement);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    userSelectedDate = selectedDate;

    if (intervalId) {
      clearInterval(intervalId);
      resetTimerDisplay();
    }

    if (validateDate(selectedDate)) {
      isActivStart(btnElement);
    } else {
      notActivStart(btnElement);
    }
  },
};

flatpickr('#datetime-picker', options);

function validateDate(userDate) {
  const now = new Date();
  if (userDate < now) {
    iziToast.show({
      message: 'Please choose a date in the future',
      position: 'topRight',
      messageColor: 'white',
      backgroundColor: 'red',
      close: true,
    });
    return false;
  }
  return true;
}

function handleTimerStart() {
  if (!userSelectedDate) return;

  notActivInput(inputElement);
  notActivStart(btnElement);

  let diffMs = userSelectedDate - new Date();
  renderTimer(diffMs);

  intervalId = setInterval(() => {
    diffMs -= 1000;
    renderTimer(diffMs);

    if (diffMs <= 0) {
      clearInterval(intervalId);
      resetTimerDisplay();
      isActivInput(inputElement);
      notActivStart(btnElement);
    }
  }, 1000);
}

function renderTimer(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

function resetTimerDisplay() {
  daysElement.textContent = '00';
  hoursElement.textContent = '00';
  minutesElement.textContent = '00';
  secondsElement.textContent = '00';
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function isActivStart(btn) {
  btn.classList.add('isactiv-btn-timer');
  btn.style.pointerEvents = 'auto';
}

function notActivStart(btn) {
  btn.classList.remove('isactiv-btn-timer');
  btn.style.pointerEvents = 'none';
}

function isActivInput(input) {
  input.disabled = false;
  input.classList.remove('notactiv-input-timer');
}

function notActivInput(input) {
  input.disabled = true;
  input.classList.add('notactiv-input-timer');
}
