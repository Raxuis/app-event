import viewRow from './eventMoreTableRow';

export default (event) => (`
<div class="flex flex-wrap -mx-3 mb-5">
  <div class="w-full max-w-full px-3 mb-6  mx-auto">
    <div class="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
      <div class="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
        <div class="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
          <h3 class="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
            <span class="mr-3 font-semibold text-dark">Event n°${event.event_id} infos</span>
            <span class="mt-1 font-medium text-secondary-dark text-lg/normal">${event.event_name} | ${event.description}</span>
          </h3>
        </div>
        <div class="flex-auto block py-8 pt-6 px-9">
          <div class="overflow-x-auto">
            <table class="w-full my-0 align-middle text-dark border-neutral-200">
              <thead class="align-bottom">
                <tr class="font-semibold text-[0.95rem] text-secondary-dark">
                  <th class="pb-3 text-start min-w-[50px]">PROFILE PICTURE</th>
                  <th class="pb-3 text-center min-w-[100px]">OWNER</th>
                  <th class="pb-3 text-center min-w-[100px]">EMAIL</th>
                  <th class="pb-3 pr-12 text-end min-w-[175px]">STATUS</th>
                  <th class="pb-3 pr-12 text-end min-w-[100px]">WHEN?</th>
                </tr>
              </thead>
              <tbody>
                ${viewRow(event.guests)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
`);
