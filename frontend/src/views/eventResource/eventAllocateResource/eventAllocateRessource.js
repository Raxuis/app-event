import resourcesSvg from '../../../assets/resources/resources.svg';

export default () => (`
<div class="text-[#333] flex max-w-sm:flex-col items-center justify-center">
      <div class="sm:min-h-screen max-sm:mt-10 flex flex-col items-center justify-center px-4">
        <div class="grid md:grid-cols-2 items-center gap-4 max-w-7xl w-full">
          <div class="border border-gray-300 rounded-md p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto relative">
          <form class="space-y-6 form-allocate">
          <div class="mb-10">
          <h3 class="text-3xl font-extrabold">Allocate a ressource</h3>
            <p class="text-sm mt-4">Efficiently manage your resources with our easy-to-use allocation form. Whether you need to schedule equipment, or create one, we simplify the process.</p>
          </div>
          <div class="flex flex-col space-y-2">
            <label for="name" class="text-gray-600">Name<span class="text-red-500 pl-3 email-account-span"></span></label>
            <input type="text" name="name" id="name" class="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333] resource-name" placeholder="Enter name" />
          </div>
          <div class="flex max-sm:flex-col max-sm:space-y-6 justify-between gap-x-5">
          <div class="flex flex-col w-full sm:w-1/2">
            <label class="text-sm mb-2 block">Type</label>
            <div class="relative flex items-center">
              <select id="resource-type" name="type" placeholder="Choose a type" class="w-full text-sm border border-gray-300 rounded-md outline-[#333]" data-test="resource-type"></select>
            </div>
          </div>
          <div class="flex flex-col w-full sm:w-1/2">
            <label class="text-sm mb-2 block" for="cost">Cost</label>
            <div class="relative flex items-center justify-center">
              <input name="cost" type="text" required class="quantity-input-allocate text-sm w-full border border-gray-300 px-2 py-1.5 rounded-md outline-[#333]" placeholder="Enter cost" />
            </div>
            </div>
          </div>
          <div class="!mt-4 space-y-4">
          <a class="go-back-allocate cursor-pointer w-fit font-medium text-electric-violet-600 underline-offset-2 hover:underline focus:underline focus:outline-none">
            Go back
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5" aria-hidden="true" class="inline size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
        </a>
          <button type="submit" class="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-electric-violet-600 hover:opacity-90 focus:outline-none">
          Create
        </button>
          </div>
        </form>
          </div>
          <div class="lg:h-[400px] md:h-[300px] max-sm:mt-10 max-sm:hidden">
            <img src="${resourcesSvg}" class="w-full h-full object-cover" alt="a girl crafting a boy like a toy" />
          </div>
        </div>
      </div>
    </div>
`);
