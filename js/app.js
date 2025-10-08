import header from '../components/header.js';
import footer from '../components/footer.js';
import { bindModalEvents } from './modal.js';





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
          <a href="#add-transaction" id="open-add-modal" aria-controls="transaction-modal" class="inline-flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            <span class="material-icons">add_circle</span>
            Add Transaction
          </a>
          <a href="#transactions" id="transactionbtn" class="inline-flex items-center gap-2 px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
            <span class="material-icons">history</span>
            Transaction History
          </a>
        </section>

        <!-- Modal: Add Transaction -->
        <div id="transaction-modal" class="fixed inset-0 z-50 hidden items-center justify-center">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50" aria-hidden="true"></div>

          <!-- Dialog -->
          <div class="relative bg-white w-full max-w-md mx-4 rounded-lg shadow-lg" role="dialog" aria-modal="true" aria-labelledby="transaction-modal-title">
            <div class="flex items-center justify-between border-b p-4">
              <h3 id="transaction-modal-title" class="text-lg font-semibold">Add Transaction</h3>
              <button type="button" class="p-2 rounded hover:bg-gray-100" aria-label="Close" data-close="modal">
                <span class="material-icons">close</span>
              </button>
            </div>

            <form id="transaction-form" class="p-4 space-y-4" novalidate>
              <div>
                <label for="tx-type" class="block text-sm text-gray-600 mb-1">Type</label>
                <select id="tx-type" name="type" class="w-full border rounded p-2" required>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label for="tx-category" class="block text-sm text-gray-600 mb-1">Category</label>
                <input id="tx-category" name="category" type="text" class="w-full border rounded p-2" placeholder="e.g. Salary, Groceries" required />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label for="tx-amount" class="block text-sm text-gray-600 mb-1">Amount</label>
                  <input id="tx-amount" name="amount" type="number" step="0.01" min="0" class="w-full border rounded p-2" required />
                </div>
                <div>
                  <label for="tx-date" class="block text-sm text-gray-600 mb-1">Date</label>
                  <input id="tx-date" name="date" type="date" class="w-full border rounded p-2" required />
                </div>
              </div>

              <div>
                <label for="tx-notes" class="block text-sm text-gray-600 mb-1">Notes</label>
                <textarea id="tx-notes" name="notes" class="w-full border rounded p-2" rows="3" placeholder="Optional"></textarea>
              </div>

              <div class="flex justify-end gap-2 pt-2">
                <button type="button" class="px-4 py-2 rounded border" data-close="modal">Cancel</button>
                <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    `;

    // After rendering, wire events once
    const navigateToTransactions = () => {
      window.location.href = 'transactions.html';
    };
    document.getElementById('transactionbtn')?.addEventListener('click', navigateToTransactions);

    // Bind modal events
    bindModalEvents({
      modalId: 'transaction-modal',
      openSelector: '#open-add-modal',
    });
  }
});
