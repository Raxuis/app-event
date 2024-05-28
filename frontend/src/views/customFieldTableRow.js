export default (customFields) => {
  if (customFields.length < 2) {
    return `${customFields.map((custom_field) => `
      <td class="pt-4 text-center">
        <div class="relative inline-block rounded-2xl font-semibold text-[0.95rem] text-secondary-dark">
          ${custom_field.field_name.toUpperCase()} : ${custom_field.field_value.toUpperCase()}
        </div>
      </td>`).join('')}`;
  }

  return `
    <td colspan="5" class="pt-4 text-center">
      <div class="flex justify-between">
        <div class="w-1/2 text-left font-semibold text-[0.95rem]">
        <span class="text-center align-baseline inline-flex py-1.5 px-6 rounded-lg items-center font-semibold text-[.95rem] leading-none bg-cerise-red-200 text-cerise-red-700 cursor-default">
          ${customFields[0].field_name.toUpperCase()} : ${customFields[0].field_value.toUpperCase()}
          </span>
        </div>
        <div class="w-1/2 text-right font-semibold text-[0.95rem]">
        <span class="text-center align-baseline inline-flex py-1.5 px-6 rounded-lg items-center font-semibold text-[.95rem] leading-none bg-cerise-red-200 text-cerise-red-700 cursor-default">
          ${customFields[1].field_name.toUpperCase()} : ${customFields[1].field_value.toUpperCase()}
        </span>
        </div>
      </div>
    </td>`;
};
