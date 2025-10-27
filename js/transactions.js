import TransactionsStore from "./store/transactions.js";

// Module-scoped elements and state so other functions can access modal helpers
let trans = null;
let total = null;
let modal = null;
let modalTitle = null;
let modalBody = null;
let modalClose = null;
let modalEdit = null;
let modalDelete = null;
let activeTxId = null;

function openModal(tx) {
  if (!modal) return;
  activeTxId = tx.id;
  modalTitle.textContent = `Transaction on ${tx.date}`;
  modalBody.innerHTML = `
    <p><strong>Description:</strong> ${tx.notes || 'N/A'}</p>
    <p><strong>Category:</strong> ${tx.category || 'N/A'}</p>
    <p><strong>Amount:</strong> $${Number(tx.amount).toFixed(2)}</p>
    <p><strong>Type:</strong> ${tx.type}</p>
  `;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
  activeTxId = null;
}

document.addEventListener("DOMContentLoaded", () => {


  total = document.getElementById("total");
  if (total) { 
      total.innerHTML = `
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
            <p id="remaining-balance" class="mt-2 text-3xl font-semibold text-blue-700">$0.00</p>
          </div>
        </section>
    </main>`;
      
      // Update the summary with actual data
      updateSummary();
  }

  trans = document.getElementById("trans");
    if (trans) {
        trans.innerHTML = `
        <main id="transactions" class="container mx-auto p-4 space-y-6">
          <section>
            <h2 class="text-xl font-semibold mb-4">Transaction History</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full w-full table-auto bg-white border border-gray-200">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="py-2 px-4 border-b text-left whitespace-nowrap">Date</th>
                    <th class="py-2 px-4 border-b text-left">Description</th>
                    <th class="py-2 px-4 border-b text-left whitespace-nowrap">Category</th>
                    <th class="py-2 px-4 border-b text-right whitespace-nowrap">Amount</th>
                    <th class="py-2 px-4 border-b text-left whitespace-nowrap">Type</th>
                  </tr>
                </thead>
                <tbody id="transaction-list">
                  <!-- Transactions will be dynamically inserted here -->
                </tbody>
              </table>
            </div>
          </section>
        </main>
  <!-- Modal for the transaction details -->
  <div id="transaction-modal" class="fixed inset-0 z-50 hidden items-center justify-center">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50" aria-hidden="true" data-backdrop="true"></div>

          <div class="relative bg-white rounded-lg shadow-lg w-full max-w-md p-4">
            <header class="flex justify-between items-center mb-4">
              <h3 id="modal-title" class="text-lg font-semibold">Transaction</h3>
              <button id="modal-close" aria-label="Close" class="hover:text-blue-600">&times;</button>
            </header>
            <div id="modal-body" class="space-y-2">
              <!-- populated dynamically -->
            </div>
            <footer class="mt-4 flex justify-end gap-2">
              <button id="modal-edit" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded">Edit</button>
              <button id="modal-delete" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded">Delete</button>
            </footer>
          </div>
        </div>
        
        <!-- Edit Transaction modal -->
        <div id="transaction-edit-modal" class="fixed inset-0 z-50 hidden items-center justify-center">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50" aria-hidden="true" data-backdrop="true"></div>

          <!-- Dialog -->
          <div class="relative bg-white w-full max-w-md mx-4 rounded-lg shadow-lg" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
            <div class="flex items-center justify-between border-b p-4">
              <h3 id="edit-modal-title" class="text-lg font-semibold">Edit Transaction</h3>
              <button type="button" id="edit-modal-close" class="p-2 rounded hover:bg-gray-100" aria-label="Close">
                <span class="material-icons">close</span>
              </button>
            </div>

            <form id="edit-transaction-form" class="p-4 space-y-4" novalidate>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Type</label>
                <div class="flex gap-4">
                  <label class="flex items-center">
                    <input type="radio" id="edit-type-income" name="edit-type" value="income" class="mr-2">
                    Income
                  </label>
                  <label class="flex items-center">
                    <input type="radio" id="edit-type-expense" name="edit-type" value="expense" class="mr-2">
                    Expense
                  </label>
                </div>
              </div>

              <div>
                <label for="edit-category" class="block text-sm text-gray-600 mb-1">Category</label>
                <select id="edit-category" name="category" class="w-full border rounded p-2" required>
                  <option value="salary">Salary</option>
                  <option value="groceries">Groceries</option>
                  <option value="utilities">Utilities</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="rent">Rent</option>
                  <option value="food & dining">Food & Dining</option>
                  <option value="transportation">Transportation</option>
                  <option value="health & medical">Health & Medical</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label for="edit-amount" class="block text-sm text-gray-600 mb-1">Amount</label>
                  <input id="edit-amount" name="amount" type="number" step="0.01" min="0" class="w-full border rounded p-2" required />
                </div>
                <div>
                  <label for="edit-date" class="block text-sm text-gray-600 mb-1">Date</label>
                  <input id="edit-date" name="date" type="date" class="w-full border rounded p-2" required />
                </div>
              </div>

              <div>
                <label for="edit-notes" class="block text-sm text-gray-600 mb-1">Notes</label>
                <textarea id="edit-notes" name="notes" class="w-full border rounded p-2" rows="3" placeholder="Optional"></textarea>
              </div>

              <div class="flex justify-end gap-2 pt-2">
                <button type="button" id="edit-cancel" class="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
        
         `;   
    }

  // initialize modal elements and bind events
  modal = document.getElementById('transaction-modal');
  modalTitle = document.getElementById('modal-title');
  modalBody = document.getElementById('modal-body');
  modalClose = document.getElementById('modal-close');
  modalEdit = document.getElementById('modal-edit');
  modalDelete = document.getElementById('modal-delete');

  modalClose?.addEventListener('click', closeModal);
  // close when clicking backdrop (explicit backdrop element)
  modal?.addEventListener('click', (e) => {
    const target = /** @type {HTMLElement} */ (e.target);
    if (target?.dataset?.backdrop === 'true') closeModal();
  });

  // Edit: emit an event others can listen to
  modalEdit?.addEventListener('click', () => {
  if (!activeTxId) return;
  // Cache the id before closing the modal (which clears activeTxId)
  const id = activeTxId;
  const store = new TransactionsStore();
  const tx = store.all().find(t => t.id === id);
  closeModal();
  window.dispatchEvent(new CustomEvent('edit-transaction', { detail: { id, transaction: tx } }));
  });


  // Delete: remove from store and refresh
  modalDelete?.addEventListener('click', () => {
    if (!activeTxId) return;
    if (confirm('Are you sure you want to delete this transaction?')) {
      const store = new TransactionsStore();
      store.remove(activeTxId);
      displayTransactions();
      closeModal();
    }
  });

  // Edit modal elements and events

  const editModal = document.getElementById('transaction-edit-modal');
  const editModalClose = document.getElementById('edit-modal-close');
  const editCancel = document.getElementById('edit-cancel');
  const editForm = document.getElementById('edit-transaction-form');
  const editDate = document.getElementById('edit-date');
  const editNotes = document.getElementById('edit-notes');
  const editCategory = document.getElementById('edit-category');
  const editAmount = document.getElementById('edit-amount');
  const editTypeIncome = document.getElementById('edit-type-income');
  const editTypeExpense = document.getElementById('edit-type-expense');

  function openEditModal(tx) {
    if (!editModal) return;
    editDate.value = tx.date;
    editNotes.value = tx.notes || '';
    editCategory.value = tx.category || '';
    editAmount.value = tx.amount;
    if (tx.type === 'income') {
      editTypeIncome.checked = true;
    } else {
      editTypeExpense.checked = true;
    }
    editModal.classList.remove('hidden');
    editModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeEditModal() {
    if (!editModal) return;
    editModal.classList.add('hidden');
    editModal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  editModalClose?.addEventListener('click', closeEditModal);
  editCancel?.addEventListener('click', closeEditModal);
  // close when clicking backdrop (explicit backdrop element)
  editModal?.addEventListener('click', (e) => {
    const target = /** @type {HTMLElement} */ (e.target);
    if (target?.dataset?.backdrop === 'true') closeEditModal();
  });

  // Listen for edit requests
  window.addEventListener('edit-transaction', (e) => {
    const { id, transaction } = e.detail;
    if (transaction) {
      activeTxId = id;
      openEditModal(transaction);
    }
  });

  // Handle form submission
  editForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeTxId) return alert('No active transaction to edit.');
    const updatedTx = {
      date: editDate.value,
      notes: editNotes.value.trim(),
      category: editCategory.value.trim(),
      amount: Math.max(0, Number(editAmount.value) || 0),
      type: editTypeIncome.checked ? 'income' : 'expense',
    };
    const store = new TransactionsStore();
    const success = store.update(activeTxId, updatedTx);
    if (success) {
      displayTransactions();
      closeEditModal();
    } else {
      alert('Failed to update transaction. Please try again.');
    }
  });

  // Initial display
  displayTransactions();

});

// Function to update the summary cards with actual data
function updateSummary() {
  const store = new TransactionsStore();
  const transactions = store.all();
  
  let totalIncome = 0;
  let totalExpenses = 0;
  
  transactions.forEach(tx => {
    if (tx.type === 'income') {
      totalIncome += Number(tx.amount);
    } else if (tx.type === 'expense') {
      totalExpenses += Number(tx.amount);
    }
  });
  
  const balance = totalIncome - totalExpenses;
  
  const incomeEl = document.getElementById('total-income');
  const expensesEl = document.getElementById('total-expenses');
  const balanceEl = document.getElementById('remaining-balance');
  
  if (incomeEl) incomeEl.textContent = `$${totalIncome.toFixed(2)}`;
  if (expensesEl) expensesEl.textContent = `$${totalExpenses.toFixed(2)}`;
  if (balanceEl) {
    balanceEl.textContent = `$${balance.toFixed(2)}`;
    // Update color based on balance
    if (balance >= 0) {
      balanceEl.className = 'mt-2 text-3xl font-semibold text-blue-700';
    } else {
      balanceEl.className = 'mt-2 text-3xl font-semibold text-red-600';
    }
  }
}

// Functions to manage transactions display and actions
export function displayTransactions() {
  const store = new TransactionsStore();
  const transactions = store.all();
  const tbody = document.getElementById('transaction-list');
  if (tbody) {
      tbody.innerHTML = '';
      transactions.forEach(tx => {
          const tr = document.createElement('tr');
          tr.className = 'hover:bg-gray-50 cursor-pointer';
          tr.dataset.id = tx.id;
          
          tr.innerHTML = `
              <td class="py-2 px-4 border-b">${tx.date}</td>
              <td class="py-2 px-4 border-b">${tx.notes || 'N/A'}</td>
              <td class="py-2 px-4 border-b">${tx.category}</td>
              <td class="py-2 px-4 border-b text-right ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                  ${tx.type === 'income' ? '+' : '-'}$${tx.amount.toFixed(2)}
              </td>
              <td class="p-3 border-b capitalize">${tx.type}</td>
          `;
        
          // open modal on row click
          tr.addEventListener('click', () => openModal(tx));

          tbody.appendChild(tr);
      });
  }
  
  // Update summary whenever transactions are displayed
  updateSummary();
}



export const editTransaction = (id, updatedTransaction) => {
  const store = new TransactionsStore();
  const success = store.update(id, updatedTransaction);
  if (success) displayTransactions();
  return success;
};

export const removeTransaction = (id) => {
  const store = new TransactionsStore();
  const success = store.remove(id);
  if (success) displayTransactions();
  return success;
};

export const clearTransactions = () => {
  const store = new TransactionsStore();
  store.clear();
  displayTransactions();
};


