import viewEvent from './event';

export default (events) => (`
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center mb-16">
  ${events.map((event) => viewEvent(event)).join('')}
</div>
`);
