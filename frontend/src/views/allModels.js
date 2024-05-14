import viewModels from './models';

export default (models) => (`
<div class="max-w-6xl mx-auto grid grid-cols-3 px-4">
  ${models.map((model) => viewModels(model)).join('')}
</div>
`);
