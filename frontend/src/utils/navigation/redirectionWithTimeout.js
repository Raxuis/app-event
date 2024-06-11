export default (route, duration) => {
  setTimeout(() => {
    window.location.href = route;
  }, duration);
};
