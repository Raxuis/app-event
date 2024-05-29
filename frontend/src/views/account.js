export default (userInfos) => (`
<div class="text-[#333] flex max-w-sm:flex-col items-center justify-center">
<div class="h-full flex flex-col items-center justify-center pt-6 sm:pt-20 px-4">
          <div class="border border-gray-300 rounded-md p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
            <form class="space-y-6 account-form">
              <div class="mb-10">
              <h3 class="text-3xl font-extrabold">Edit your account</h3>
                <p class="text-sm mt-4">Update your account details to keep your profile up-to-date. Ensure your informations are accurate.</p>
              </div>
              <div class="flex flex-col space-y-2">
                <label for="email" class="text-gray-600">Email<span class="text-red-500 pl-3 email-account-span"></span></label>
                <input type="text" name="email" id="email" class="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]  email-account-input" placeholder="Enter email" value="${userInfos.email}" />
              </div>
              <div class="flex max-sm:flex-col max-sm:space-y-6 justify-between">
              <div class="flex flex-col">
                <label class="text-sm mb-2 block">Firstname</label>
                <div class="relative flex items-center">
                  <input name="firstname" type="text" required class="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]" placeholder="Enter firstname" value="${userInfos.firstname}" />
                  </div>
                </div>
              <div class="flex flex-col">
                <label class="text-sm mb-2 block">Lastname</label>
                <div class="relative flex items-center">
                  <input name="lastname" type="text" required class="w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]" placeholder="Enter lastname" value="${userInfos.lastname}" />
                </div>
                </div>
              </div>
              <div>
                <label class="text-sm mb-2 block">New Password<span class="text-red-500 pl-3 password-account-span"></span></label>
                <div class="relative flex items-center">
                  <input name="password" type="password" required class="new-account-password w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]" placeholder="Enter password" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4 cursor-pointer password-account-toggler" viewBox="0 0 128 128">
                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>
              <div>
              <label class="text-sm mb-2 block">Confirmation Password<span class="text-red-500 pl-3 confirmation-account-span"></span></label>
              <div class="relative flex items-center">
                <input name="password-confirmation" type="password" required class="new-password-account-confirmation w-full text-sm border border-gray-300 px-4 py-3 rounded-md outline-[#333]" placeholder="Enter confirmation password"/>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4 cursor-pointer confirmation-password-account-toggler" viewBox="0 0 128 128">
                  <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                </svg>
              </div>
            </div>
              <div class="!mt-10">
              <button type="submit" class="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-primary hover:opacity-90 focus:outline-none">
              Edit
            </button>
              <div class="error-account-message w-full text-red-500 pt-2"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
`);
