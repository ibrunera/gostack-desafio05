import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const onlyIncome = [];
    const onlyOutcome = [];
    for (const x of this.transactions) {
      if (x.type === 'income') onlyIncome.push(x);
      else onlyOutcome.push(x);
    }

    const income = onlyIncome.reduce(
      (previousValue, currentValue) => previousValue + currentValue.value,
      0,
    );
    const outcome = onlyOutcome.reduce(
      (previousValue, currentValue) => previousValue + currentValue.value,
      0,
    );

    const total = income - outcome;

    const balance = { income, outcome, total };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    if (type === 'outcome' && value > this.getBalance().total) {
      throw Error('Not enought founds.');
    }

    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
