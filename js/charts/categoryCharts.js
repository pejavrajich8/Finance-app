import {Chart, registerables} from 'chart.js';
Chart.register(...registerables);

let chartInstance = null;

// Fixed colors for the categories you requested (keys are lowercased for case-insensitive lookup).
const FIXED_CATEGORY_COLORS = {
    groceries: '#60a5fa',    // blue
    utilities: '#34d399',    // green
    entertainment: '#ef4444', // red
    rent: '#f97316',         // orange
};

// Return a pinned color for known categories (case-insensitive), otherwise gray.
function getColorForCategory(cat) {
    const name = String(cat || '').trim();
    if (!name) return '#9ca3af'; // gray fallback for falsy
    const key = name.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(FIXED_CATEGORY_COLORS, key)) {
        return FIXED_CATEGORY_COLORS[key];
    }
    // All other categories use a neutral gray so colors don't change.
    return '#9ca3af';
}

// Helper to get all transactions from various store implementations

function getTransactions(store) {
    if (!store) return [];
    if (typeof store.all === 'function') return store.all();
    if (typeof store.getAll === 'function') return store.getAll();
    return store._data ?? store.transactions ?? [];
}


// Renders a doughnut chart of expenses by category
export function renderCategoryChart(store) {
    const canvas = document.getElementById('category-chart-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const txs = getTransactions(store);
    console.log('All transactions:', txs);
    

    // Aggregate expenses by category
    const totals = new Map();
    txs.forEach(t => {
        console.log('Processing transaction:', t);
        const type = (t.type || '').toLowerCase();
        console.log('Transaction type:', type);
        if (type !== 'expense') return;
        const amount = Number(t.amount ?? t.value ?? 0) || 0;
        const cat = (t.category || 'Uncategorized').trim() || 'Uncategorized';
        console.log('Adding to category:', cat, 'amount:', amount);
        totals.set(cat, (totals.get(cat) || 0) + amount);
    });


    // Log the category totals
    console.log('Category totals:', Object.fromEntries(totals));
    const labels = Array.from(totals.keys());
    const data = Array.from(totals.values());
    console.log('Chart labels:', labels);
    console.log('Chart data:', data);

    // Destroy previous chart if exists
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    const parent = canvas.parentElement;
    parent?.querySelectorAll('.chart-empty').forEach(e => e.remove());

    if (data.length === 0) {
        const msg = document.createElement('div');
        msg.className = 'chart-empty text-center text-gray-500';
        msg.textContent = 'No expense data to display.';
        parent?.appendChild(msg);
        return;
    }

        // Create new chart with deterministic colors per category
        chartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                        labels,
                        datasets: [{
                                data,
                                backgroundColor: labels.map(label => getColorForCategory(label))
                        }]
                },
            options: {
            plugins: { legend: { position: 'bottom' }, tooltip: { mode: 'index' } },
            maintainAspectRatio: false
        }
    });
}

// Example usage:
// const store = new TransactionsStore();
// renderCategoryChart(store);