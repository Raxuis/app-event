/* eslint-disable no-nested-ternary */
import gradient from '../../assets/gradient.jpeg';

export default (event, userId, specificGuests = null) => {
  const {
    event_id: eventId,
    event_name: eventName,
    description: eventDescription,
    size: eventSize,
    type: eventType,
    place: eventPlace,
    time: eventTime,
    image: eventImage,
    author_id: authorId,
    author_firstname: authorFirstname,
    author_lastname: authorLastName,
    custom_fields: customFields,
    created_at: createdAt
  } = event;

  const currentDate = new Date();
  const eventTimeDate = new Date(createdAt);

  const timeDifference = currentDate - eventTimeDate;
  const hoursElapsed = Math.floor(timeDifference / (1000 * 60 * 60));
  const daysElapsed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  let timeString;
  if (daysElapsed === 0) {
    if (hoursElapsed === 0) {
      timeString = 'Just now';
    } else {
      timeString = `${hoursElapsed}h ago`;
    }
  } else if (daysElapsed === 1) {
    timeString = '1 day ago';
  } else {
    timeString = `${daysElapsed} days ago`;
  }

  const renderGuestStatus = () => {
    if (specificGuests !== null) {
      return specificGuests.map((guest) => {
        if (guest.guest_status === 'registered') {
          return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accept-${eventId} cursor-pointer size-6 lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cancel-${eventId} cursor-pointer size-6 lucide lucide-ban"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
          `;
        } if (guest.guest_status === 'canceled') {
          return '<span class="text-center align-baseline inline-flex py-1.5 px-6 rounded-full mr-auto items-center font-semibold text-[.95rem] leading-none text-danger bg-danger-light">Canceled</span>';
        }
        return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="decline-${eventId} cursor-pointer size-6 lucide lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cancel-${eventId} cursor-pointer size-6 lucide lucide-ban"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
          `;
      }).join('');
    }
    return '';
  };

  return `
    <div tabindex="0" class="focus:outline-none mx-2 w-full sm:w-80 lg:w-72 xl:w-80 mb-8 flex flex-col shadow-md relative mt-16 card-${eventId}">
      <div class="relative w-full h-44">
        ${userId === authorId ? `
          <button class="delete-${eventId} cursor-pointer absolute right-1 top-1 inline-flex items-center px-4 py-2 text-danger bg-danger-light hover:bg-danger hover:text-white duration-300 text-sm font-medium rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        ` : ''}
        <img alt="${eventName}" src="${eventImage || gradient}" tabindex="0" class="focus:outline-none w-full h-full object-cover" />
        <button class="export-pdf-${eventId} cursor-pointer absolute right-1 bottom-1 inline-flex items-center p-2 text-white bg-blue-chill-700 hover:bg-danger duration-300 text-sm font-medium rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-pdf"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" /><path d="M17 18h2" /><path d="M20 15h-3v6" /><path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z" /></svg>
        </button>
        <button class="export-csv-${eventId} cursor-pointer absolute left-1 bottom-1 inline-flex items-center p-2 text-white bg-blue-chill-700 hover:bg-danger duration-300 text-sm font-medium rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-csv"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path d="M7 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0" /><path d="M10 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75" /><path d="M16 15l2 6l2 -6" /></svg>
        </button>
      </div>
      <div class="bg-white flex flex-col flex-1 justify-between">
        <div class="flex items-center justify-between px-4 pt-4">
        <div class="flex gap-2">
          ${userId !== authorId ? `
            <div class="flex gap-2 items-center">
              ${renderGuestStatus()}
            </div>
          ` : ''}
          <div class="bg-yellow-200 text-yellow-700 py-1.5 px-6 rounded-full hover:bg-yellow-300 duration-300 cursor-default">
            <p tabindex="0" class="focus:outline-none text-xs">By ${userId === authorId ? 'Yourself' : `${authorFirstname[0]}.${authorLastName}`}</p>
          </div>
          </div>
          <div class="relative inline-block text-left dropdown">
            <span class="rounded-md shadow-sm">
              <button class="inline-flex justify-center w-full px-2 py-1 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800" 
                type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
                <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share-2 size-4 mt-0.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg></span>
                <svg class="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              </button>
            </span>
            <div class="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
              <div class="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
                <div class="px-4 py-3">
                  <p class="text-sm leading-5">Share to Social Medias</p>
                </div>
                <div class="py-1 shareon" data-url=${`http://localhost:${process.env.FRONTEND_PORT}/my-events?eventId=${eventId}`}>
                  <button tabindex="1" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left twitter" role="menuitem" data-hashtags=${`useful,awesome,brilliant,${eventType}`}>Twitter / X</button>
                  <span role="menuitem" tabindex="-1" class="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 cursor-not-allowed opacity-50" aria-disabled="true">TikTok (soon)</span>
                  <button tabindex="2" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left whatsapp" role="menuitem" data-text="Join my event!">WhatsApp</button>
                  <button tabindex="2" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left copy-url" role="menuitem">Copy URL</button>
                </div>
              </div>
            </div>
          </div>        
        </div>
        <div class="p-4 flex flex-col flex-1">
          <div class="flex items-center flex-wrap">
            <h2 tabindex="0" class="flex-1 focus:outline-none text-lg font-semibold">${eventName}</h2>
            <p tabindex="0" class="focus:outline-none text-xs text-gray-600">${timeString}</p>
          </div>
          <p tabindex="0" class="focus:outline-none text-xs text-gray-600 mt-2">${eventDescription}</p>
          <div class="flex flex-wrap mt-4 gap-2">
            <div>
              <p tabindex="0" class="focus:outline-none text-xs text-gray-600 px-2 bg-gray-200 hover:bg-indigo-700 hover:text-white duration-500 py-1 cursor-default">${eventSize} places</p>
            </div>
            <div>
              <p tabindex="0" class="focus:outline-none text-xs text-gray-600 px-2 bg-gray-200 hover:bg-indigo-700 hover:text-white duration-500 py-1 cursor-default">${eventType[0].toUpperCase() + eventType.slice(1)}</p>
            </div>
            ${customFields.map((field) => `
              <div>
                <p tabindex="0" class="focus:outline-none text-xs text-gray-600 px-2 bg-gray-200 hover:bg-blue-chill-500 hover:text-white duration-500 py-1 cursor-default">${field.field_name} : ${field.field_value}</p>
              </div>
            `).join('')}
          </div>
          <div class="mt-2">
            <h2 tabindex="0" class="focus:outline-none text-indigo-700 text-xs font-semibold">${eventPlace}</h2>
          </div>
          <div>
            <h3 tabindex="0" class="focus:outline-none text-indigo-700 text-sm font-semibold">${eventTime}</h3>
          </div>
          <div class="flex justify-between items-center mt-auto">
          ${userId === authorId ? `
            <button data-ripple-light="true" type="button" class="mt-2 ${`edit-${eventId}`} duration-500 select-none rounded-lg bg-electric-violet-600 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Edit</button>
            ` : ''}
              <button data-ripple-light="true" type="button" class="mt-2 ${`read-more-${eventId}`} duration-500 select-none rounded-lg bg-electric-violet-600 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Read More</button>
          </div>
        </div>
      </div>
    </div>
  `;
};
