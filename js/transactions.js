import TransactionsStore from "./store/transactions.js";

// Module-scoped elements and state so other functions can access modal helpers
let trans = null;
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

  trans = document.getElementById("trans");
    if (trans) {
        trans.innerHTML = `
        <main id="transactions" class="container mx-auto p-4 space-y-6">
          <section>
            <h2 class="text-xl font-semibold mb-4">Transaction History</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="py-2 px-4 border-b">Date</th>
                    <th class="py-2 px-4 border-b">Description</th>
                    <th class="py-2 px-4 border-b">Category</th>
                    <th class="py-2 px-4 border-b">Amount</th>
                    <th class="py-2 px-4 border-b">Type</th>
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
  <div id="transaction-modal" class="hidden fixed inset-0 bg-black bg-opacity-40 z-50 items-center justify-center">
          <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
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
        <div id="transaction-edit-modal" class="hidden fixed inset-0 bg-black bg-opacity-40 z-50 items-center justify-center">
          <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <header class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Edit Transaction</h3>
              <button id="edit-modal-close" aria-label="Close" class="hover:text-blue-600">&times;</button>
            </header>
            <form id="edit-transaction-form" class="space-y-4">
              <div>
                <label for="edit-date" class="block text-sm font-medium text-gray-700">Date</label>
                <input id="edit-date" type="date" class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label for="edit-notes" class="block text-sm font-medium text-gray-700">Description</label>
                <input id="edit-notes" type="text" class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label for="edit-category" class="block text-sm font-medium text-gray-700">Category</label>
                <input id="edit-category" type="text" class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label for="edit-amount" class="block text-sm font-medium text-gray-700">Amount</label>
                <input id="edit-amount" type="number" step="0.01" class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Type</label>
                <div class="mt-1 flex gap-4">
                  <label class="inline-flex items-center"><input id="edit-type-income" type="radio" name="edit-type" value="income" class="mr-2"/>Income</label>
                  <label class="inline-flex items-center"><input id="edit-type-expense" type="radio" name="edit-type" value="expense" class="mr-2"/>Expense</label>
                </div>
              </div>
              <footer class="flex justify-end gap-2 pt-2">
                <button type="button" id="edit-cancel" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded">Save</button>
              </footer>
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
  // close when clicking backdrop
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
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
  // close when clicking backdrop
  editModal?.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
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
              <td class="py-2 px-4 border-b capitalize">${tx.type}</td>
          `;
          // open modal on row click
          tr.addEventListener('click', () => openModal(tx));

          tbody.appendChild(tr);
      });
  }
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


