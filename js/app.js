import header from '../components/header.js';
import footer from '../components/footer.js';




document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (app) {
    app.innerHTML = `
      <main id="dashboard" class="container mx-auto p-4 space-y-6">
        <!-- Summary Cards -->
        <section id="summary" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-lg border p-4 bg-white shadow">
            <div class="flex items-center justify-between">
              <h2 class="text-sm text-gray-500">Total Income</h2>
              <span class="material-icons text-green-500">trending_up</span>
            </div>
            <p id="total-income" class="mt-2 text-3xl font-semibold text-green-600">$0.00</p>
          </div>

          <div class="rounded-lg border p-4 bg-white shadow">
            <div class="flex items-center justify-between">
              <h2 class="text-sm text-gray-500">Total Expenses</h2>
              <span class="material-icons text-red-500">trending_down</span>
            </div>
            <p id="total-expenses" class="mt-2 text-3xl font-semibold text-red-600">$0.00</p>
          </div>

          <div class="rounded-lg border p-4 bg-white shadow">
            <div class="flex items-center justify-between">
              <h2 class="text-sm text-gray-500">Remaining Balance</h2>
              <span class="material-icons text-indigo-500">account_balance_wallet</span>
            </div>
            <p id="remaining-balance" class="mt-2 text-3xl font-semibold text-indigo-700">$0.00</p>
          </div>
        </section>

        <!-- Actions -->
        <section id="actions" class="flex flex-wrap items-center gap-3">
          <a href="#add-transaction" class="inline-flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            <span class="material-icons">add_circle</span>
            Add Transaction
          </a>
          <a href="#transactions" class="inline-flex items-center gap-2 px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
            <span class="material-icons">history</span>
            Transaction History
          </a>
        </section>
      </main>
    `;
  }
});
