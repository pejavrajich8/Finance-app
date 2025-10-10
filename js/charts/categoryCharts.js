import {Chart, registerables} from 'chart.js';
Chart.register(...registerables);

let chartInstance = null;

function getTransactions(store) {
    if (!store) return [];
    if (typeof store.all === 'function') return store.all();
    if (typeof store.getAll === 'function') return store.getAll();
    return store._data ?? store.transactions ?? [];
}

export function renderCategoryChart(store) {
    const canvas = document.getElementById('category-chart-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const txs = getTransactions(store);
    console.log('All transactions:', txs);
    
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

    console.log('Category totals:', Object.fromEntries(totals));
    const labels = Array.from(totals.keys());
    const data = Array.from(totals.values());
    console.log('Chart labels:', labels);
    console.log('Chart data:', data);

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
     
    const colors = [
        '#60a5fa', '#f97316', '#34d399', '#fbbf24', '#a78bfa',
        '#f87171', '#38bdf8', '#f472b6', '#22c55e', '#e879f9'
    ];
    
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: labels.map((_, i) => colors[i % colors.length])
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