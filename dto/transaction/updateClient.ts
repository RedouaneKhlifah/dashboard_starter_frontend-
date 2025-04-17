import { ITransactionForm } from "./transactionForm";

interface IUpdateTransaction extends ITransactionForm {
  id: number;
}

export type { IUpdateTransaction };
