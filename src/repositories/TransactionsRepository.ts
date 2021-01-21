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
    /**
     *    const onlyIncome = [];
    const onlyOutcome = [];

    for (const transaction of this.transactions) {
      if (transaction.type === 'income') onlyIncome.push(transaction);
      else onlyOutcome.push(transaction);
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
     *
     */

    const { income, outcome } = this.transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += transaction.value;
            break;
          case 'outcome':
            accumulator.outcome += transaction.value;
            break;
          default:
            break;
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Transaction type is invalid');
    }

    if (type === 'outcome' && value > this.getBalance().total) {
      throw new Error('Not enought founds.');
    }

    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
