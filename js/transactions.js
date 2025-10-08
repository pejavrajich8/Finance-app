document.addEventListener("DOMContentLoaded", () => {
  const trans = document.getElementById("trans");
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
        </main>`;   
    }
});

export default trans;