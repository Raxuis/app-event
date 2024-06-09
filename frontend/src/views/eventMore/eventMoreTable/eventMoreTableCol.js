/* eslint-disable no-nested-ternary */
export default (eventGuest, eventInfos) => {
  const {
    author_id: authorId
  } = eventInfos;
  const {
    guest_id: guestId,
    guest_firstname: guestFirstname,
    guest_lastname: guestLastname,
    guest_email: guestEmail,
    guest_status: guestStatus
  } = eventGuest;
  const date = eventGuest.confirmed_at
    ? new Date(eventGuest.confirmed_at).toLocaleDateString()
    : eventGuest.canceled_at
      ? new Date(eventGuest.canceled_at).toLocaleDateString()
      : new Date(eventGuest.registered_at).toLocaleDateString();
  return (`
<tr class="border-b border-dashed last:border-b-0">
  <td class="p-3 pr-0 text-start">
    <span class="font-semibold text-light-inverse text-md/normal inline-flex items-center gap-2">${guestId === authorId ? '<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke="#a70d3b"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-crown size-6 mb-0.5"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" /></svg>' : ''}${guestFirstname} ${guestLastname}</span>
  </td>
  <td class="p-3 pr-0 text-center">
  <span class="text-center align-baseline inline-flex px-2 py-1 mr-auto items-center font-semibold text-base/none text-slate-500 rounded-lg">${guestEmail}</span>
  </td>
  <td class="p-3 text-center">
  ${guestStatus === 'confirmed'
      ? `<span class="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none text-success bg-success-light rounded-lg">${guestStatus}</span>` : guestStatus === 'canceled' ? `<span class="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none text-danger bg-danger-light rounded-lg">${guestStatus}</span>`
        : `<span class="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none text-electric-violet-600 bg-primary-light rounded-lg">${guestStatus}</span>`
    }
  </td>
  <td class="pr-0 text-center">
    <span class="font-semibold text-light-inverse text-md/normal">${date}</span>
  </td>
</tr>
`);
};
