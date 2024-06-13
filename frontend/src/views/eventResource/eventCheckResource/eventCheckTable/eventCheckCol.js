export default (resource) => {
  const {
    resource_id: id,
    event_resource_id: eventResourceId,
    resource_name: name,
    resource_type: type,
    resource_cost: cost,
    resource_quantity: quantity,
    resource_status: status
  } = resource;
  return (`
<tr class="border-b border-dashed last:border-b-0 row-${eventResourceId}">
  <td class="text-start">
    <span class="font-semibold text-light-inverse text-md/normal">${name[0].toUpperCase() + name.slice(1)}</span>
  </td>
  <td class="text-center">
    <span class="text-center align-baseline inline-flex px-2 py-1 mr-auto items-center font-semibold text-base/none rounded-lg">${type[0].toUpperCase() + type.slice(1)}</span>
  </td>
  <td class="p-3 text-center">
    <span class="font-semibold text-light-inverse text-md/normal">$${cost}</span>
  </td>
  <td class="flex justify-center items-center gap-3">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-minus h-6 w-5 cursor-pointer decrement-${eventResourceId}"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /></svg>
    <span class="font-semibold text-light-inverse text-md/normal select-none">${quantity}</span>
    <svg  xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-plus size-5 cursor-pointer increment-${eventResourceId}"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
  </td>
  <td class="text-center">
    <span class="font-semibold text-light-inverse text-md/normal select-none">${status === 'available'
      ? `<span class="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none text-success bg-success-light rounded-lg select-none">${status}</span>` : `<span class="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none text-danger bg-danger-light rounded-lg select-none">${status}</span>`
    }</span>
  </td>
  <td class="flex justify-center items-center gap-4 p-3">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil size-6 opacity-40 duration-500 cursor-pointer hover:text-blue-500 hover:opacity-100 edit-${id}"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash size-6 opacity-40 duration-500 cursor-pointer hover:text-red-500 hover:opacity-100 delete-${id}"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
  </td>
</tr>
`);
};
