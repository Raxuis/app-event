import viewColumn from './eventMoreTableCol';

export default (eventGuests) => {
  const guestsArray = Array.isArray(eventGuests) ? eventGuests : [eventGuests];

  return `
    ${guestsArray.map((eventGuest) => viewColumn(eventGuest)).join('')}
  `;
};
