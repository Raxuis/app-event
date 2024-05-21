import gradient from '../assets/gradient.jpeg';

export default (event, userId) => {
  const currentDate = new Date();
  const eventTime = new Date(event.created_at);

  const timeDifference = currentDate - eventTime;

  const hoursElapsed = Math.floor(timeDifference / (1000 * 60 * 60));

  const daysElapsed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // eslint-disable-next-line no-nested-ternary
  const timeString = daysElapsed === 0 ? (hoursElapsed === 0 ? 'Just now' : `${hoursElapsed}h ago`) : (daysElapsed === 1 ? `${daysElapsed} day ago` : `${daysElapsed} days ago`);

  return `
      <div tabindex="0" class="focus:outline-none mx-2 w-72 xl:mb-0 mb-8 items-center mt-16 shadow-md relative" id="card-${event.event_id}">
      ${parseInt(userId, 10) === event.user_id ? `
      <a id="delete-${event.event_id}" class="cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 lucide lucide-x absolute right-1 top-1"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </a>
      ` : ''}
          <img alt="${event.event_name}" src="${event.image ? event.image : gradient}" tabindex="0" class="focus:outline-none w-full h-44" />
          <div class="bg-white">
              <div class="flex items-center justify-between px-4 pt-4">
                  <div class="flex gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cursor-pointer size-6 lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cursor-pointer size-6 lucide lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  <div class="bg-yellow-200 py-1.5 px-6 rounded-full">
                      <p tabindex="0" class="focus:outline-none text-xs text-yellow-700">By ${event.lastname[0]}.${event.firstname}</p>
                  </div>
              </div>
              <div class="p-4">
                  <div class="flex items-center">
                      <h2 tabindex="0" class="flex-1 focus:outline-none text-lg font-semibold">${event.event_name}</h2>
                      <p tabindex="0" class="focus:outline-none text-xs text-gray-600">${timeString}</p>
                  </div>
                  <p tabindex="0" class="focus:outline-none text-xs text-gray-600 mt-2">${event.description}</p>
                  <div class="flex mt-4">
                      <div>
                          <p tabindex="0" class="focus:outline-none text-xs text-gray-600 px-2 bg-gray-200 py-1">${event.size} places</p>
                      </div>
                      <div class="pl-2">
                          <p tabindex="0" class="focus:outline-none text-xs text-gray-600 px-2 bg-gray-200 py-1">${event.type}</p>
                      </div>
                  </div>
                  <div class="flex flex-col justify-center py-4">
                      <h2 tabindex="0" class="focus:outline-none text-indigo-700 text-xs font-semibold">${event.place}</h2>
                      <h3 tabindex="0" class="focus:outline-none text-indigo-700 text-sm font-semibold">${event.time}</h3>
                  </div>
                  ${parseInt(userId, 10) === event.user_id ? `
                  <div class="flex justify-between items-center">
                  <button data-ripple-light="true" type="button" class="duration-500 select-none rounded-lg bg-primary py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Edit</button>
                  <button data-ripple-light="true" type="button" class="duration-500 select-none rounded-lg bg-primary py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Read More</button>
                  </div>
                  ` : ''}
              </div>
          </div>
      </div>
  `;
};
