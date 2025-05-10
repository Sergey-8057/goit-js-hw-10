import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const formElem = document.querySelector('.form');

formElem.addEventListener('submit', onSubmit);

function createPromise(delay, shouldResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

function onSubmit(event) {
  event.preventDefault();

  const delayInput = document.querySelector('input[name="delay"]');
  const delay = Number(delayInput.value);

  const fieldsetInput = document.querySelector('input[name="state"]:checked');
  const isActive = fieldsetInput.value === 'fulfilled';

  const promise = createPromise(delay, isActive);

  promise
    .then(delay => {
      iziToast.show({
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
        messageColor: 'white',
        backgroundColor: 'green',
        close: true,
      });
    })
    .catch(delay => {
      iziToast.show({
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
        messageColor: 'white',
        backgroundColor: 'red',
        close: true,
      });
    });

  event.target.reset();
}
