/* eslint-disable no-console */
import toastr from 'toastr';
import toastrOptions from './options';

const availableStatus = ['success', 'error', 'info', 'warning'];
export default function renderToastr(status, title, content) {
  if (!availableStatus.includes(status)) {
    console.error('Toastr does not support status :', status);
    return;
  }
  toastr.options = toastrOptions;
  toastr[status](`${content}`, `${title}`);
}
