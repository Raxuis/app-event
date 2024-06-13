import favicon from '../../assets/favicon.png';

export default (userId) => (`
<nav class="bg-gray-50 z-10 py-1 sticky top-0 nav">
<div class="max-w-6xl mx-auto px-4">
  <div class="flex justify-between">

    <div class="flex space-x-4">
      <div>
        <a href="/" class="flex items-center py-5 px-2 space-x-2">
        <img class="size-6" src=${favicon} alt="app-event favicon">
          <span class="font-bold text-gray-700 hover:text-electric-violet-900 duration-300">App-Event</span>
        </a>
      </div>
      ${userId !== null ? `
      <div class="hidden md:flex items-center space-x-1">
        <a href="/event-creation" class="py-5 px-3 text-gray-700 hover:text-gray-900">Create an Event</a>
        <a href="/my-events" class="py-5 px-3 text-gray-700 hover:text-gray-900">My Events</a>
      </div>
      ` : ''}
    </div>
    <div class="hidden md:flex items-center space-x-1">
    ${userId === null ? `
      <a href="/login" class="py-5 px-3">Login</a>
      <a href="/register" class="bg-electric-violet-600 text-white items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:bg-electric-violet-500 h-9 px-4 py-2 hidden max-w-52 overflow-hidden whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-electric-violet-500 hover:ring-offset-1">Register</a>
      ` : `
    <a href="/logout" class="py-5 px-3 text-gray-700 hover:text-gray-900 mr-2">Log Out</a>
      <lord-icon onclick="window.location.href='/account'" src="https://cdn.lordicon.com/bgebyztw.json" trigger="hover" stroke="bold" state="hover-looking-around" colors="primary:#000,secondary:#000" class="size-6 cursor-pointer"></lord-icon>`}
    </div>

    <div class="md:hidden flex items-center space-x-1">
      <button class="mobile-menu-button">
        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

  </div>
</div>
<div class="mobile-menu hidden md:hidden">
${userId === null ? `
<a href="/login" class="block py-2 px-4 text-sm hover:bg-gray-200">Login</a>
<a href="/register" class="block py-2 px-4 text-sm hover:bg-gray-200">Register</a>
` : `
<a href="/logout" class="block py-2 px-4 text-sm hover:bg-gray-200">Log Out</a>
<a href="/account" class="block py-2 px-4 text-sm hover:bg-gray-200">My Account</a>
`}
  <a href="/event-creation" class="block py-2 px-4 text-sm hover:bg-gray-200">Create an Event</a>
  <a href="/my-events" class="block py-2 px-4 text-sm hover:bg-gray-200">My Events</a>
</div>
</nav>
`);
