import viewModel from './model';

export default (models) => (`
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
  ${models.map((model) => viewModel(model)).join('')}
</div>
`);
