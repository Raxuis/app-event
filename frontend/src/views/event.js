export default (event) => {
  const currentDate = new Date();

  const eventTime = new Date(event.created_at);

  const timeDifference = currentDate - eventTime;

  const daysElapsed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return `
      <div tabindex="0" class="focus:outline-none mx-2 w-72 xl:mb-0 mb-8 items-center mt-16 shadow-md">
          <div>
              <img alt="person capturing an image" src=${event.image} tabindex="0" class="focus:outline-none w-full h-44" />
          </div>
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
                  <div class="flex items-center justify-between">
                      <h2 tabindex="0" class="focus:outline-none text-lg font-semibold">${event.name}</h2>
                      <p tabindex="0" class="focus:outline-none text-xs text-gray-600 pr-10">${daysElapsed === 0 ? 'Today' : `${daysElapsed} days ago`}</p>
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
              </div>
          </div>
      </div>
  `;
};
