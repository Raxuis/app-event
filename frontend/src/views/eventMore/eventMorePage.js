import viewRow from './eventMoreTable/eventMoreTableRow';
import viewRowCustom from '../customField/customFieldTableRow';

export default (event, userId) => {
  const {
    event_id: eventId,
    event_name: eventName,
    description: eventDescription,
    size: eventSize,
    guests,
    author_id: authorId,
    custom_fields: customFields,
    event_resources: eventResources
  } = event;

  let eventSizeEditable = eventSize;
  guests.forEach((guest) => {
    if (guest.guest_status === 'confirmed') {
      eventSizeEditable -= 1;
    }
  });

  const renderResourceSection = () => {
    if (authorId !== userId) return '';

    return `
      <div class="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
        <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
          <div class="p-6 flex flex-col">
            <h3 class="flex items-center m-2 ml-0 font-medium text-2xl/tight text-black-900 gap-2">Resources</h3>
            <div class="w-full flex justify-between max-sm:flex-col max-sm:space-y-2">
              <a class="allocate-resources inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-electric-violet-200 h-9 px-4 py-2 gap-2 duration-300 cursor-pointer">
                Allocate resource
                <lord-icon class="size-5" src="https://cdn.lordicon.com/iawrhwdo.json" trigger="hover" state="morph-coins"></lord-icon>
              </a>
              ${eventResources.length > 0 ? `
                <a class="check-resources inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-electric-violet-200 h-9 px-4 py-2 gap-2 duration-300 cursor-pointer">
                  Check resources
                  <lord-icon class="size-5" src="https://cdn.lordicon.com/wyqtxzeh.json" trigger="hover"></lord-icon>
                </a>` : `
                <button disabled class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-electric-violet-200 h-9 px-4 py-2 duration-300">
                  You have no resource, please allocate one first.
                </button>`}
            </div>
          </div>
        </div>
      </div>`;
  };

  return (`
    <div class="flex flex-wrap -mx-3 mb-5 w-full *:cursor-default">
      <div class="w-full px-3 mb-6 mx-auto">
        <div class="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
          <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
            <div class="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
              <h3 class="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
                <span class="mr-3 font-semibold text-dark">Event n°${eventId} infos</span>
                <span class="mt-1 font-medium text-secondary-dark text-lg/normal">${eventName} | ${eventDescription}</span>
              </h3>
              <h3 class="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
                <span class="mr-3 font-semibold text-dark">${eventSizeEditable} ${eventSizeEditable <= 1 ? 'place left' : 'places left'}</span>
              </h3>
            </div>
            <div class="flex-auto block py-8 pt-6 px-9">
              <div class="overflow-x-auto">
                <table class="w-full my-0 align-middle text-dark border-neutral-200">
                  <thead class="align-bottom">
                    <tr class="font-semibold text-[0.95rem] text-secondary-dark">
                      <th class="pb-3 text-center">PARTICIPANT</th>
                      <th class="pb-3 text-center">EMAIL</th>
                      <th class="pb-3 text-center">STATUS</th>
                      <th class="pb-3 text-center">WHEN?</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${viewRow(guests, event)}
                    ${viewRowCustom(customFields)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        ${renderResourceSection()}
      </div>
    </div>
  `);
};
