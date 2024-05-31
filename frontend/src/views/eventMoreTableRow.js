import viewColumn from './eventMoreTableCol';

export default (eventGuests, eventInfos) => {
  const guestsArray = Array.isArray(eventGuests) ? eventGuests : [eventGuests];

  return `
    ${guestsArray.map((eventGuest) => viewColumn(eventGuest, eventInfos)).join('')}
  `;
};
