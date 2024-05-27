export default (customFieldsNumber) => (`<div class="flex flex-col space-y-2 mt-2">
<label for=${customFieldsNumber} class="text-gray-600" contenteditable="true">Custom Field n°${customFieldsNumber}</label>
<div class="flex align-middle align-content-center">
<input type="text" id=${customFieldsNumber}
class="border border-gray-300 h-11 block w-full px-4 py-3 rounded-l-md"
placeholder="Enter value"
title="clear" data-clear
>

<a
    class="h-11 w-10 input-button cursor-pointer rounded-r-md bg-transparent border-gray-300 border-t border-b border-r"
    title="clear" data-clear
    id="remove-${customFieldsNumber}"
>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mt-2 ml-1" viewBox="0 0 20 20" fill="#ef4444">
        <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"/>
    </svg>
</a>
</div>
</div>`);
