export class Transaction {
  constructor({ id, type, category, amount, date, notes, createdAt }) {
    this.id = id;
    this.type = type; // 'income' | 'expense'
    this.category = category;
    this.amount = amount;
    this.date = date; // 'YYYY-MM-DD'
    this.notes = notes || '';
    this.createdAt = createdAt || new Date().toISOString();
  }

    static fromRaw(raw) {
        const id = (crypto.randomUUID?.() ?? String(Date.now())).toString();
        const type = raw.type === 'expense' ? 'expense' : 'income';
        const category = String(raw.category || '').trim();
        const ammount = Math.max(0, Number(raw.amount) || 0);
        const date = /^\d{4}-\d{2}-\d{2}$/.test(raw.date) ? raw.date : new Date().toISOString().slice(0, 10);
        const notes = String(raw.notes || '').trim();
        return new Transaction({ id, type, category, amount: ammount, date, notes });
    }

}

export default class TransactionsStore {
    constructor(storageKey = 'finance_app_transactions') {
        this.key = storageKey;
        
    }
    _read() {
        const json = localStorage.getItem(this.key);
        return json ? JSON.parse(json) : [];
    }

    _write(list) {
        localStorage.setItem(this.key, JSON.stringify(list));
    }

    all() {
        return this._read();
    }

    add(txOrRaw) {
        const tx = txOrRaw instanceof Transaction ? txOrRaw : Transaction.fromRaw(txOrRaw);
        const list = this._read();
        list.push(tx);
        this._write(list);
        return tx;
    }

    remove(id) {
        const list = this._read().filter(t => t.id !== id);
        this._write(list);
        return list.length < this._read().length;
    }

      clear() {
    this._write([]);
  }

  summary() {
    const list = this._read();
    let income = 0, expenses = 0;
    for (const t of list) {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') income += amt;
      else expenses += amt;
    }
    return { income, expenses, balance: income - expenses };
  }

};