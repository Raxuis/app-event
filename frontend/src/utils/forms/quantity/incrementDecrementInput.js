export default function incrementDecrementInput() {
  const numberInput = document.querySelector('.quantity-input-custom');
  const incrementButton = document.querySelector('.increment-button-custom');
  const decrementButton = document.querySelector('.decrement-button-custom');
  numberInput.addEventListener('input', () => {
    let { value } = numberInput;
    value = value.replace(/\D/g, '');
    numberInput.value = value;
  });
  incrementButton.addEventListener('click', () => {
    const { value } = numberInput;
    let parsedValue = Number.isInteger(parseInt(value, 10)) ? parseInt(value, 10) : 0;
    parsedValue += 1;
    numberInput.value = parsedValue;
  });

  decrementButton.addEventListener('click', () => {
    const { value } = numberInput;
    let parsedValue = Number.isInteger(parseInt(value, 10)) ? parseInt(value, 10) : 0;
    parsedValue -= 1;
    numberInput.value = parsedValue >= 0 ? parsedValue : 0;
  });
}
