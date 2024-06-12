import viewEvent from './event';

export default (events, userId, specificGuestsMap) => (`
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 my-16 max-sm:px-2 max-lg:place-items-center">
  ${events.map((event) => viewEvent(event, userId, specificGuestsMap[event.event_id] || [])).join('')}
</div>
`);
