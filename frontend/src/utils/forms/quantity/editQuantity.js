export default () => {
  const numberInput = document.querySelector('.edit-quantity');

  if (numberInput) {
    numberInput.addEventListener('input', () => {
      let { value } = numberInput;
      value = value.replace(/[^0-9]/g, '');
      numberInput.value = value;
    });
  }
};
