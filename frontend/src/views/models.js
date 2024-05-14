export default (model) => (`
<div class="max-w-6xl mx-auto grid grid-cols-3 px-4">
<div class="items-center mt-20">
    <div class="relative flex w-80 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div class="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-500 via-transparent to-purple-400">
      ${model.image ? (`<img src=${model.image} alt=${model.type} class='size-full object-cover' />`) : ''}
      </div>
      <div class="p-6">
        <h5 class="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
        ${model.type[0].toUpperCase() + model.type.slice(1)}
        </h5>
        <p class="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
        ${model.size} places
        </p>
      </div>
      <div class="p-6 pt-0">
        <button data-ripple-light="true" type="button" class="duration-500 select-none rounded-lg bg-primary py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
          Read More
        </button>
      </div>
    </div>
  </div>
</div
`);
