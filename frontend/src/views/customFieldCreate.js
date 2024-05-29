export default (customFieldsNumber) => (`
<div class="flex flex-col space-y-2 mt-2 border border-gray-300 px-4 py-3 rounded-md outline-[#333]">
    <div class="flex justify-between w-full">
        <div class="flex gap-10">
            <div class="flex flex-col">
                <label class="text-sm mb-2 block">Custom Field Name</label>
                <div class="relative flex items-center">
                    <input name="name-${customFieldsNumber}" type="text" required class="name-${customFieldsNumber} w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]" placeholder="Enter name" />
                </div>
            </div>
            <div class="flex flex-col">
                <label class="text-sm mb-2 block">Custom Field Value</label>
                <div class="relative flex items-center">
                    <input name="value-${customFieldsNumber}" type="text" required class="value-${customFieldsNumber} w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]" placeholder="Enter value" />
                </div>
            </div>
        </div>
        <div>
            <a
                class="remove-${customFieldsNumber.id} h-11 w-10 input-button cursor-pointer rounded-r-md bg-transparent"
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
</div>
`);
