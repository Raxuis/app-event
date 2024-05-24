export default () => (`
<div id="add-event" class="select-none group cursor-pointer text-gray-700 grid grid-flow-col auto-cols-max justify-center bg-clip-border border-2 border-violet-300 border-dashed rounded-lg bg-slate-400 bg-opacity-15 hover:bg-violet-300 hover:bg-opacity-30 duration-300 mt-24 p-8">
<p class="flex justify-center items-center">Build your own event <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 ml-1 lucide lucide-chevron-right group-hover:translate-x-1 duration-300"><path d="m9 18 6-6-6-6"/></svg></p>
</div>
<div id="dialog" class="fixed left-0 top-0 bg-black bg-opacity-50 w-screen h-screen justify-center items-center opacity-0 hidden transition-opacity duration-500">
  <div class="bg-white rounded shadow-md p-8 w-full sm:w-3/4 md:w-1/2 lg:w-[35%] xl:w-1/4 max-sm:mx-2 flex overflow-hidden flex-col">
  <form class="flex flex-col space-y-4" id="form-dialog">
    <div>
    <h1 class="text-2xl font-bold mb-4">Create your event</h1>
    <p class="text-gray-600 mb-4">Fill in the form below to create your event</p>
      <div class="flex flex-col space-y-2">
        <label for="name" class="text-gray-600">Name</label>
        <input type="text" name="name" id="name" class="w-full border border-gray-300 px-4 py-3 rounded-md outline-[#333]" placeholder="Enter name" />
      </div>
      <div class="flex flex-col space-y-2 pt-2">
        <label for="description" class="text-gray-600">Description</label>
        <input type="text" name="description" id="description" class="w-full border border-gray-300 px-4 py-3 rounded-md outline-[#333]" placeholder="Enter description" />
      </div>
      <div class="flex flex-col space-y-2 pt-2">
        <label for="place" class="text-gray-600">Place</label>
        <input type="text" name="place" id="place" class="w-full border border-gray-300 px-4 py-3 rounded-md outline-[#333]" placeholder="Enter place" />
      </div>
      <div class="flex flex-col space-y-2 pt-2">
        <label for="image-url" class="text-gray-600">Image url (optional)</label>
        <input type="text" name="image-url" id="image-url" class="w-full border border-gray-300 px-4 py-3 rounded-md outline-[#333]" placeholder="Enter image url" />
      </div>
      <div class="flex flex-col space-y-2 pt-2">
      <label for="group-name" class="text-gray-600">Group Name</label>
      <input type="text" name="group-name" id="group-name" class="w-full border border-gray-300 px-4 py-3 rounded-md outline-[#333]" placeholder="Enter group name" />
      </div>
      <div class="flex flex-col space-y-2 pt-2">
      <label for="guests" class="text-gray-600">Guests</label>
      <select id="select1" name="user-ids" class="w-full border border-gray-300 p-1 rounded-md outline-[#333] flex justify-center"  data-test="select1"></select>
      </div>
      <div class="flex flex-col space-y-2 pt-2">
        <label for="quantity-input" class="text-gray-600">Places number</label>
        <div class="relative flex items-center w-full">
            <button type="button" id="decrement-button" data-input-counter-decrement="quantity" class="bg-primary border border-gray-300 rounded-s-lg p-3 h-11">
                <svg class="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                </svg>
            </button>
            <input type="text" id="quantity-input" name="quantity" data-input-counter aria-describedby="helper-text-explanation" class="border border-gray-300 h-11 text-center block w-full px-4 py-3" placeholder="999" required />
            <button type="button" id="increment-button" data-input-counter-increment="quantity" class="bg-primary border border-gray-300 rounded-e-lg p-3 h-11">
                <svg class="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
            </button>
        </div>
        
        <div
        x-data
        x-init="flatpickr($refs.datetimewidget, {wrap: true, enableTime: true, dateFormat: 'M j, Y h:i K', minDate:${Date.now()}});"
        x-ref="datetimewidget"
        class="flatpickr container mx-auto col-span-6 sm:col-span-6 mt-5"
    >
        <label for="datetime" class="flex-grow  block font-medium text-sm text-gray-700 mb-1 pt-2">Date and Time</label>
        <div class="flex align-middle align-content-center">
            <input
                x-ref="datetime"
                type="text"
                id="datetime"
                name="time"
                data-input
                placeholder="Select.."
                class="border border-gray-300 h-11 text-center block w-full px-4 py-3 rounded-l-md"
    
            >
            
            <a
                class="h-11 w-10 input-button cursor-pointer rounded-r-md bg-transparent border-gray-300 border-t border-b border-r"
                title="clear" data-clear
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mt-2 ml-1" viewBox="0 0 20 20" fill="#ef4444">
                    <path fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"/>
                </svg>
            </a>
        </div>
    
    </div>
        <p id="error-text" class="text-red-500 text-md pt-2"></p>
      </div>
        <div class="flex flex-col space-y-2">
          <div class="w-full flex justify-center gap-20 pt-4">
            <button class="py-2.5 px-6 rounded-lg text-sm font-medium bg-red-500 text-white" id="cancel-dialog">Cancel</button>
            <button class="py-2.5 px-6 rounded-lg text-sm font-medium text-white bg-primary" id="submit-dialog">Create</button>
          </div>
        </div>
      </div>
    </form>
    </div>
  </div>
</div>
`);
