document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById('header');
    if (header) {
        header.innerHTML = `
        <div class="wrapper p-4 bg-blue-400 w-full flex justify-between items-center">
          <h1 class="text-2xl">Finance App</h1>
          <nav class="mr-">
            <ul class="flex space-x-4">
              <li><a href="#dashboard" class="hover:text-white">Dashboard</a></li>
              <li><a href="#transactions" class="hover:text-white">Transactions</a></li>
              <li><a href="#settings" class="hover:text-white"><span class="material-icons">settings</span></a></li>
            </ul>
          </nav>
        </div>`;
    }
});

export default header;