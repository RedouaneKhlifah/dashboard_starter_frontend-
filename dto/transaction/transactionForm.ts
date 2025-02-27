export interface ITransactionForm {
  id?: number;
  reason: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  note: string;
}
