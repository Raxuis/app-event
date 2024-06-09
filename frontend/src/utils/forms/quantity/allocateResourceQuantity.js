export default () => {
  const numberInput = document.querySelector('.quantity-input-allocate');
  if (numberInput) {
    numberInput.addEventListener('input', () => {
      let { value } = numberInput;
      value = value.replace(/[^0-9.]/g, '');
      if (value.split('.').length > 2) {
        value = value.replace(/\.+$/, '');
      }
      numberInput.value = value;
    });
  }
};
