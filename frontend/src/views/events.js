import viewEvent from './event';

export default (events, userId) => (`
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
  ${events.map((event) => viewEvent(event, userId)).join('')}
</div>
`);
