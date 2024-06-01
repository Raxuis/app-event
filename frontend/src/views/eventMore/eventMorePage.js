import viewRow from './eventMoreTable/eventMoreTableRow';
import viewRowCustom from '../customField/customFieldTableRow';

export default (event) => {
  let eventSize = event.size;
  const eventGuests = event.guests;
  eventGuests.forEach((guest) => {
    if (guest.guest_status === 'confirmed') {
      eventSize -= 1;
    }
  });
  return (`
<div class="flex flex-wrap -mx-3 mb-5 w-full">
  <div class="w-full px-3 mb-6 mx-auto">
    <div class="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
      <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
        <div class="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
          <h3 class="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
            <span class="mr-3 font-semibold text-dark">Event n°${event.event_id} infos</span>
            <span class="mt-1 font-medium text-secondary-dark text-lg/normal">${event.event_name} | ${event.description}</span>
          </h3>
          <h3 class="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
            <span class="mr-3 font-semibold text-dark">${eventSize} ${eventSize <= 1 ? 'place left' : 'places left'} </span>
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
                ${viewRow(event.guests, event)}
                ${viewRowCustom(event.custom_fields)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    <div class="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
      <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
        <div class="p-6 flex flex-col">
        <h3 class="flex items-center m-2 ml-0 font-medium text-2xl/tight text-black gap-2">
        Resources.
      </h3>
      <div class="w-full flex justify-between max-sm:flex-col">
        <a class="allocate-resources flex items-center m-2 ml-0 font-medium text-lg/tight cursor-pointer text-black underline-offset-4 hover:underline gap-2">
        Allocate resource.
        <lord-icon 
          class="size-6"
          src="https://cdn.lordicon.com/iawrhwdo.json"
          trigger="hover"
          state="morph-coins">
        </lord-icon>
      </a>
      ${event.event_resources.length > 0 ? `<a class="check-resources flex items-center m-2 ml-0 font-medium text-lg/tight cursor-pointer text-black underline-offset-4 hover:underline gap-2">
      Check resources.
      <lord-icon 
      class="size-6"
      src="https://cdn.lordicon.com/wyqtxzeh.json"
      trigger="hover">
    </lord-icon>
    </a>` : `<h3 class="flex items-center m-2 ml-0 font-medium text-lg/tight text-black cursor-default gap-2"> 
    You have no resource allocate resources first.
    <lord-icon
    src="https://cdn.lordicon.com/nkfxhqqr.json"
    trigger="hover"
    state="morph-destroyed"
    class="size-6">
</lord-icon>
</h3>
`}
      
      </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
`);
};
