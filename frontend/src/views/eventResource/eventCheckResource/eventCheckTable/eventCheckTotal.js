export default (resources) => {
  if (Object.keys(resources).length === 0) {
    return null;
  }
  let totalCost = 0;
  if (resources.length === 1) {
    const { resource_cost: cost, resource_quantity: quantity } = resources[0];
    totalCost = cost * quantity;
  } else {
    resources.forEach((resource) => {
      const { resource_cost: cost, resource_quantity: quantity } = resource;
      totalCost += cost * quantity;
    });
  }
  return (`
      <td class="pt-4 text-start">
        <div class="relative inline-block rounded-2xl font-semibold text-[0.95rem] text-secondary-dark">
        <span class="text-center align-baseline inline-flex py-1.5 px-6 rounded-lg items-center font-semibold text-[.95rem] leading-none bg-blue-chill-100 text-blue-chill-600">
          Total cost : $${totalCost.toFixed(2)}
          </span >
        </div >
      </td >
  `);
};
