export default function passwordVerif(password, passwordConfirmation, page = '') {
  const passwordSpan = document.querySelector(`.password${page}-span`);
  const confirmationSpan = document.querySelector(`.confirmation${page}-span`);
  password.addEventListener('input', (e) => {
    if (e.target.value.length < 8) {
      passwordSpan.innerHTML = 'Password must be at least 8 characters';
    } else {
      passwordSpan.innerHTML = '';
    }
  });
  passwordConfirmation.addEventListener('input', (e) => {
    if (e.target.value.length < 8) {
      confirmationSpan.innerHTML = 'Password must be at least 8 characters';
    } else if (password.value !== passwordConfirmation.value) {
      passwordSpan.innerHTML = "Password don't match";
      confirmationSpan.innerHTML = "Password don't match";
    } else {
      passwordSpan.innerHTML = '';
      confirmationSpan.innerHTML = '';
    }
  });
}
