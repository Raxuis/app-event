/* eslint-disable no-nested-ternary */
import gradient from '../../assets/gradient.jpeg';

export default (event, userId, specificGuests) => {
  const currentDate = new Date();
  const eventTime = new Date(event.created_at);

  const timeDifference = currentDate - eventTime;

  const hoursElapsed = Math.floor(timeDifference / (1000 * 60 * 60));

  const daysElapsed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  const timeString = daysElapsed === 0 ? (hoursElapsed === 0 ? 'Just now' : `${hoursElapsed}h ago`) : (daysElapsed === 1 ? `${daysElapsed} day ago` : `${daysElapsed} days ago`);

  return `
    <div tabindex="0" class="focus:outline-none mx-2 w-full sm:w-80 lg:w-72 xl:w-80 mb-8 flex flex-col shadow-md relative mt-16 card-${event.event_id}">
      ${userId === event.author_id ? `
      <button class="delete-${event.event_id} cursor-pointer absolute right-1 top-1 inline-flex items-center px-4 py-2 text-danger bg-danger-light hover:bg-danger hover:text-white duration-300 text-sm font-medium rounded-md">
      <svg xmlns="http://www.w3.org/2000/svg" class="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      Delete
      </button>
      ` : ''}
      <img alt="${event.event_name}" src="${event.image ? event.image : gradient}" tabindex="0" class="focus:outline-none w-full h-44 object-cover" />
      <div class="bg-white flex flex-col flex-1 justify-between">
        <div class="flex items-center justify-between px-4 pt-4">
          ${userId !== event.author_id ? `
          <div class="flex gap-2">
          ${specificGuests.map((ele) => (ele.guest_status === 'registered'
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accept-${event.event_id} cursor-pointer size-6 lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cancel-${event.event_id} cursor-pointer size-6 lucide lucide-ban"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>`
    : ele.guest_status === 'canceled'
      ? '<span class="text-center align-baseline inline-flex py-1.5 px-6 rounded-full mr-auto items-center font-semibold text-[.95rem] leading-none text-danger bg-danger-light">Canceled</span>'
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="decline-${event.event_id} cursor-pointer size-6 lucide lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cancel-${event.event_id} cursor-pointer size-6 lucide lucide-ban"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>`)).join('')}
          </div>
          ` : ''}
          <div class="bg-yellow-200 text-yellow-700 py-1.5 px-6 rounded-full hover:bg-yellow-300 duration-300 cursor-default">
            <p tabindex="0" class="focus:outline-none text-xs">By ${userId === event.author_id ? 'Yourself' : `${event.author_lastname[0]}.${event.author_firstname}`}</p>
          </div>
        </div>
        <div class="p-4 flex flex-col flex-1">
          <div class="flex items-center">
            <h2 tabindex="0" class="flex-1 focus:outline-none text-lg font-semibold">${event.event_name}</h2>
            <p tabindex="0" class="focus:outline-none text-xs text-gray-600">${timeString}</p>
          </div>
          <p tabindex="0" class="focus:outline-none text-xs text-gray-600 mt-2">${event.description}</p>
          <div class="flex flex-wrap mt-4 gap-2">
            <div>
              <p tabindex="0" class="focus:outline-none text-xs text-gray-600 px-2 bg-gray-200 hover:bg-indigo-700 hover:text-white duration-500 py-1 cursor-default">${event.size} places</p>
            </div>
            <div>
              <p tabindex="0" class="focus:outline-none text-xs text-gray-600 px-2 bg-gray-200 hover:bg-indigo-700 hover:text-white duration-500 py-1 cursor-default">${event.type[0].toUpperCase() + event.type.slice(1)}</p>
            </div>
            ${event.custom_fields.map((field) => `
              <div>
                <p tabindex="0" class="focus:outline-none text-xs text-gray-600 px-2 bg-gray-200 hover:bg-blue-chill-500 hover:text-white duration-500 py-1 cursor-default">${field.custom_field_name} : ${field.custom_field_value}</p>
              </div>
            `).join('')}
            </div>
            <div class="mt-2">
              <h2 tabindex="0" class="focus:outline-none text-indigo-700 text-xs font-semibold">${event.place}</h2>
            </div>
            <div>
              <h3 tabindex="0" class="focus:outline-none text-indigo-700 text-sm font-semibold">${event.time}</h3>
            </div>
          ${userId === event.author_id ? `
          <div class="flex justify-between items-center mt-auto">
            <button data-ripple-light="true" type="button" class="mt-2 ${`edit-${event.event_id}`} duration-500 select-none rounded-lg bg-electric-violet-600 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Edit</button>
            <button data-ripple-light="true" type="button" class="mt-2 ${`read-more-${event.event_id}`} duration-500 select-none rounded-lg bg-electric-violet-600 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Read More</button>
          </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
};
