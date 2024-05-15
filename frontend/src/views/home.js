import logo from '../assets/logo.png';
import eventSvg from '../assets/events.svg';
import worldSvg from '../assets/world.svg';

export default () => (`
<div class="container my-24 mx-auto md:px-6">
  <section class="mb-32">

    <div class="px-6 py-12 text-center md:px-12 lg:text-left">
      <div class="container mx-auto">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div class="mt-12 lg:mt-0">
            <h1 class="mb-12 text-5xl font-bold tracking-tight text-gray-700 md:text-6xl xl:text-7xl opacity-80">
              Are you ready <br /><span class="text-primary">to ease your event</span><br/>planning?
            </h1>
            <p class="text-lg text-[hsl(218,17%,28%)] opacity-75">
            Planning an event can be overwhelming. With App-Event, take the stress out of organizing any occasion, whether it's a corporate conference, a wedding celebration, or a casual get-together with friends.
            </p>
          </div>
          <div class="mb-12 lg:mb-0">
            <div class="embed-responsive embed-responsive-16by9 relative w-full overflow-hidden rounded-lg shadow-lg pt-[56.25%]">
              <iframe class="embed-responsive-item absolute top-0 right-0 bottom-0 left-0 h-full w-full"
                src="https://www.youtube.com/embed/i3hGMvzeAVI?si=Yo_DS618cZg5FUpo"
                allowfullscreen data-gtm-yt-inspected-2340190_699="true"referrerpolicy="strict-origin-when-cross-origin"></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  <section class="bg-white border-b py-8 mt-12 lg:mt-24">
    <div class="container max-w-5xl mx-auto m-8">
      <h2 class="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-700 opacity-85">
        Why App-Event?
      </h2>
      <div class="flex flex-wrap items-center justify-center">
        <div class="w-5/6 sm:w-1/2 p-6">
          <h3 class="text-3xl text-gray-700 font-bold leading-none mb-3 opacity-90">
            Event Planning on another level
          </h3>
          <p class="text-[hsl(218,17%,28%)] opacity-75 mb-8">
          Our team wanted to make App-Event the easiest way possible to allow every king of user to be able to use it!
          </p>
        </div>
        <div class="w-full sm:w-1/2 p-6">
        <img src=${eventSvg} class="w-full sm:h-64 mx-auto"/>
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-center flex-col-reverse sm:flex-row">
        <div class="w-full sm:w-1/2 p-6 mt-6">
        <img src=${worldSvg} class="w-5/6 sm:h-64 mx-auto" />
        </div>
        <div class="w-full sm:w-1/2 p-6 mt-6">
          <div class="align-middle">
            <h3 class="text-3xl text-gray-700 font-bold leading-none mb-3 opacity-90">
              Events around the World
            </h3>
            <p class="text-[hsl(218,17%,28%)] opacity-75 mb-8">
              Plan events from where you are currently situated to where you want them to be.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="bg-white border-b py-8">
    <div class="container mx-auto flex flex-wrap pt-4 pb-12">
      <h2 class="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
        Title
      </h2>
      <div class="w-full mb-4">
        <div class="h-1 mx-auto  bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-500 via-transparent to-purple-400 w-64 opacity-25 my-0 py-0 rounded-t"></div>
      </div>
      <div class="w-full md:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
        <div class="flex-1 bg-white rounded-t rounded-b-none overflow-hidden shadow">
          <a href="#" class="flex flex-wrap no-underline hover:no-underline">
            <p class="w-full text-gray-600 text-xs md:text-sm px-6">
              xGETTING STARTED
            </p>
            <div class="w-full font-bold text-xl text-gray-800 px-6">
              Lorem ipsum dolor sit amet.
            </div>
            <p class="text-gray-800 text-base px-6 mb-5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at ipsum eu nunc commodo posuere et sit amet ligula.
            </p>
          </a>
        </div>
        <div class="flex-none mt-auto bg-white rounded-b rounded-t-none overflow-hidden shadow p-6">
          <div class="flex items-center justify-center">
            <button class="mx-auto lg:mx-0  bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-500 via-transparent to-purple-400 text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
              Action
            </button>
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
        <div class="flex-1 bg-white rounded-t rounded-b-none overflow-hidden shadow">
          <a href="#" class="flex flex-wrap no-underline hover:no-underline">
            <p class="w-full text-gray-600 text-xs md:text-sm px-6">
              xGETTING STARTED
            </p>
            <div class="w-full font-bold text-xl text-gray-800 px-6">
              Lorem ipsum dolor sit amet.
            </div>
            <p class="text-gray-800 text-base px-6 mb-5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at ipsum eu nunc commodo posuere et sit amet ligula.
            </p>
          </a>
        </div>
        <div class="flex-none mt-auto bg-white rounded-b rounded-t-none overflow-hidden shadow p-6">
          <div class="flex items-center justify-center">
            <button class="mx-auto lg:mx-0  bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-500 via-transparent to-purple-400 text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
              Action
            </button>
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
        <div class="flex-1 bg-white rounded-t rounded-b-none overflow-hidden shadow">
          <a href="#" class="flex flex-wrap no-underline hover:no-underline">
            <p class="w-full text-gray-600 text-xs md:text-sm px-6">
              xGETTING STARTED
            </p>
            <div class="w-full font-bold text-xl text-gray-800 px-6">
              Lorem ipsum dolor sit amet.
            </div>
            <p class="text-gray-800 text-base px-6 mb-5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at ipsum eu nunc commodo posuere et sit amet ligula.
            </p>
          </a>
        </div>
        <div class="flex-none mt-auto bg-white rounded-b rounded-t-none overflow-hidden shadow p-6">
          <div class="flex items-center justify-center">
            <button class="mx-auto lg:mx-0  bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-500 via-transparent to-purple-400 text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
              Action
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="container mx-auto text-center py-6 mb-12">
    <h2 class="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-700 opacity-90">
      Come Check Out!
    </h2>
    <div class="w-full mb-4">
      <div class="h-1 mx-auto bg-white w-1/6 opacity-25 my-0 py-0 rounded-t"></div>
    </div>
    <h3 class="my-4 text-3xl text-gray-700 opacity-80 leading-tight">
      Main Hero Message to sell yourself!
    </h3>
    <button class="mx-auto lg:mx-0 bg-white text-gray-700 opacity-75 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
      Action!
    </button>
  </section>
  <footer class="bg-white">
    <div class="container mx-auto">
      <div class="w-full flex flex-col md:flex-row py-6">
        <div class="flex-1 mb-6 text-black">
          <a href="/">
          <img src=${logo} class="h-8 fill-current inline"/>
          </a>
        </div>
        <div class="flex-1">
          <p class="uppercase text-gray-500 md:mb-6">Links</p>
          <ul class="list-reset mb-6">
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="#" class="no-underline hover:underline text-gray-800 hover:text-pink-500">FAQ</a>
            </li>
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="#" class="no-underline hover:underline text-gray-800 hover:text-pink-500">Help</a>
            </li>
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="#" class="no-underline hover:underline text-gray-800 hover:text-pink-500">Support</a>
            </li>
          </ul>
        </div>
        <div class="flex-1">
          <p class="uppercase text-primary0 md:mb-6">Legal</p>
          <ul class="list-reset mb-6">
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="#" class="no-underline hover:underline text-gray-800 hover:text-pink-500">Terms</a>
            </li>
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="#" class="no-underline hover:underline text-gray-800 hover:text-pink-500">Privacy</a>
            </li>
          </ul>
        </div>
        <div class="flex-1">
          <p class="uppercase text-gray-500 md:mb-6">Social</p>
          <ul class="list-reset mb-6">
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="#" class="no-underline hover:underline text-gray-800 hover:text-pink-500">Facebook</a>
            </li>
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="#" class="no-underline hover:underline text-gray-800 hover:text-pink-500">Linkedin</a>
            </li>
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="#" class="no-underline hover:underline text-gray-800 hover:text-pink-500">Twitter</a>
            </li>
          </ul>
        </div>
        <div class="flex-1">
          <p class="uppercase text-gray-500 md:mb-6">Company</p>
          <ul class="list-reset mb-6">
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="#" class="no-underline hover:underline text-gray-800 hover:text-pink-500">Official Blog</a>
            </li>
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="#" class="no-underline hover:underline text-gray-800 hover:text-pink-500">About Us</a>
            </li>
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="#" class="no-underline hover:underline text-gray-800 hover:text-pink-500">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
  </section>
</div>
`);
