interface ITransaction {
  id: number;
  reason: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  note: string;
  created_at: string;
}

export type { ITransaction };
