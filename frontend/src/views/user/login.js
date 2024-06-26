import loginSvg from '../../assets/account/login.svg';

export default () => (`
<div class="text-[#333] flex max-w-sm:flex-col items-center justify-center">
  <div class="min-h-screen flex flex-col items-center justify-center">
    <div class="grid md:grid-cols-2 items-center gap-4 max-w-7xl w-full">
      <div class="border border-gray-300 rounded-md p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
        <form class="space-y-6 login-form">
          <div class="mb-10">
            <h3 class="text-3xl font-extrabold">Sign in</h3>
            <p class="text-sm mt-4">Sign in to your account and explore a world of possibilities. Your journey begins here.</p>
          </div>
          <div>
            <label class="text-sm mb-2 block">Email</label>
            <div class="relative flex items-center">
              <input name="email" type="text" required class="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]" placeholder="Enter email" />
              <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="size-[18px] absolute right-4 hover:stroke-black-800 hover:fill-black-800 duration-300" viewBox="0 0 24 24">
                <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
              </svg>
            </div>
          </div>
          <div>
            <label class="text-sm mb-2 block">Password</label>
            <div class="relative flex items-center">
              <input name="password" type="password" required class="password-login w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]" placeholder="Enter password"  />
              <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="size-[18px] absolute right-4 cursor-pointer password-toggler-login hover:stroke-black-800 hover:fill-black-800 duration-300" viewBox="0 0 128 128">
                <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
              </svg>
            </div>
          </div>
          <div class="!mt-10">
            <button type="button" class="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white duration-300 bg-[#333] hover:bg-black-900 focus:outline-none login-button">
              Log in
            </button>
            <div class="error-message-login w-full text-red-500 pt-2"></div>
          </div>
          <p class="text-sm !mt-10 text-center">Don't have an account? <a href="/register" class="text-blue-600 hover:underline ml-1 whitespace-nowrap" title="register">Sign Up here</a></p>
        </form>
      </div>
      <div class="lg:h-[400px] md:h-[300px] max-sm:h-[200px]">
        <img src="${loginSvg}" class="w-full h-full object-contain" alt="a girl login on her mobile phone" />
      </div>
    </div>
  </div>
</div>
`);
