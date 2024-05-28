import logo from '../assets/logo.png';
import eventSvg from '../assets/events.svg';
import worldSvg from '../assets/world.svg';
import eventsEdits from '../assets/homepage-bento/events-edits.webp';
import eventsModels from '../assets/homepage-bento/events-models.webp';
import peopleInvitations from '../assets/homepage-bento/people-invitations.webp';
import safety from '../assets/homepage-bento/safety.webp';

export default (isLogged) => (`
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
    <div class="container mx-auto flex flex-wrap pt-4">
      <h2 class="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
        What we offer.
      </h2>
      <div class="w-full mb-4">
        <div class="h-1 mx-auto  bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-500 via-transparent to-purple-400 w-64 opacity-25 my-0 py-0 rounded-t"></div>
      </div>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8 w-full p-6">
      <div
          class="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
          <img src=${safety} loading="lazy" alt="Safe Events" class="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

          <div
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
          </div>

          <span class="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">Safe Events</span>
      </div>
      <div
          class="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:col-span-2 md:h-80">
          <img src=${eventsModels} loading="lazy" alt="Event Models" class="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

          <div
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
          </div>

          <span class="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">Events Models</span>
      </div>
      <div
          class="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:col-span-2 md:h-80">
          <img src=${peopleInvitations} loading="lazy" alt="People Invitations" class="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

          <div
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
          </div>

          <span class="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">People Invitations</span>
      </div>
      <div
          class="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
          <img src=${eventsEdits} loading="lazy" alt="Events Edits" class="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

          <div
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
          </div>

          <span class="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">Events Edits</span>
      </div>
  </div>
    </div>
  </section>
  <section class="container mx-auto text-center pt-8 pb-6 mb-12">
    <h2 class="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-700 opacity-90">
      Come Check Out!
    </h2>
    <div class="w-full mb-4">
      <div class="h-1 mx-auto bg-white w-1/6 opacity-25 my-0 py-0 rounded-t"></div>
    </div>
    ${!isLogged ? `<h3 class="my-4 text-3xl text-gray-700 opacity-80 leading-tight">
    Register and you're good to go!
  </h3>
  <button onclick="window.location.href='/register'" class="mx-auto lg:mx-0 bg-white text-gray-700 opacity-75 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
    Register
  </button>` : `<h3 class="my-4 text-3xl text-gray-700 opacity-80 leading-tight">
  Create your first event!
</h3>
<button onclick="window.location.href='/models'" class="mx-auto lg:mx-0 bg-white text-gray-700 opacity-75 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
  Create
</button>`}
    
  </section>
  <footer>
    <div class="container mx-auto max-sm:px-8">
      <div class="w-full flex flex-col md:flex-row py-6">
        <div class="flex-1 mb-6 text-black">
          <a href="/">
          <img src=${logo} class="h-8 fill-current inline"/>
          </a>
        </div>
        <div class="flex-1">
          <p class="uppercase text-gray-500 md:mb-6">Social</p>
          <ul class="list-reset mb-6">
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="https://www.instagram.com/ecole_coda/" target="_blank" class="no-underline hover:underline text-gray-800 hover:text-pink-500">Instagram</a>
            </li>
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="https://www.linkedin.com/in/raphael-raclot/" target="_blank" class="no-underline hover:underline text-gray-800 hover:text-pink-500">Linkedin</a>
            </li>
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="https://x.com/I_Haruki_I" target="_blank" class="no-underline hover:underline text-gray-800 hover:text-pink-500">Twitter</a>
            </li>
          </ul>
        </div>
        <div class="flex-1">
          <p class="uppercase text-gray-500 md:mb-6">Company</p>
          <ul class="list-reset mb-6">
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="https://portfolio-raphael-raxuis.vercel.app/" target="_blank" class="no-underline hover:underline text-gray-800 hover:text-pink-500">Official Blog</a>
            </li>
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="https://portfolio-raphael-raxuis.vercel.app/about" target="_blank" class="no-underline hover:underline text-gray-800 hover:text-pink-500">About Us</a>
            </li>
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
              <a href="https://portfolio-raphael-raxuis.vercel.app/contact" target="_blank" class="no-underline hover:underline text-gray-800 hover:text-pink-500">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
  </section>
</div>
`);
