export default (customFields) => {
  if (customFields.length < 2) {
    return `${customFields.map((custom_field) => `
      <td class="pt-4">
        <div class="relative inline-block rounded-2xl font-semibold text-[0.95rem] text-secondary-dark">
        <span class="text-center inline-flex py-1.5 px-3 sm:px-6 rounded-lg items-center font-semibold sm:text-[.95rem] leading-none bg-cerise-red-100 text-cerise-red-600 cursor-default">
          ${custom_field.field_name.toUpperCase()} : ${custom_field.field_value.toUpperCase()}
          </span>
        </div>
      </td>`).join('')}`;
  }

  return `
    <td colspan="5" class="pt-4">
      <div class="flex justify-between max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:space-y-2">
        <div class="w-1/2 text-left font-semibold text-[0.95rem] flex max-sm:justify-center">
        <span class="text-center inline-flex py-1.5 px-6 rounded-lg items-center font-semibold text-[.95rem] leading-none bg-cerise-red-100 text-cerise-red-600 cursor-default">
          ${customFields[0].field_name.toUpperCase()} : ${customFields[0].field_value.toUpperCase()}
          </span>
        </div>
        <div class="w-1/2 text-right font-semibold text-[0.95rem]">
        <span class="text-center inline-flex py-1.5 px-6 rounded-lg items-center font-semibold text-[.95rem] leading-none bg-cerise-red-100 text-cerise-red-600 cursor-default">
          ${customFields[1].field_name.toUpperCase()} : ${customFields[1].field_value.toUpperCase()}
        </span>
        </div>
      </div>
    </td>`;
};
