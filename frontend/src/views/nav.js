import favicon from '../assets/favicon.png';

export default () => (`
<nav class="bg-gray-50">
<div class="max-w-6xl mx-auto px-4">
  <div class="flex justify-between">

    <div class="flex space-x-4">
      <div>
        <a href="/" class="flex items-center py-5 px-2 text-gray-700 hover:text-gray-900">
        <img class="h-6 w-6 mr-1" src=${favicon}>
          <span class="font-bold">App-Event</span>
        </a>
      </div>

      <div class="hidden md:flex items-center space-x-1">
        <a href="/models" class="py-5 px-3 text-gray-700 hover:text-gray-900">Models</a>
      </div>
    </div>

    <div class="hidden md:flex items-center space-x-1">
      <a href="/login" class="py-5 px-3">Login</a>
      <a href="/register" class="py-2 px-3 bg-primary hover:opacity-80 text-white rounded transition duration-300">Register</a>
    </div>

    <div class="md:hidden flex items-center">
      <button class="mobile-menu-button">
        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

  </div>
</div>
<div class="mobile-menu hidden md:hidden">
  <a href="/dashboard" class="block py-2 px-4 text-sm hover:bg-gray-200">Dashboard</a>
</div>
</nav>
`);
