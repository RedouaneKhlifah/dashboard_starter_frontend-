// Imports
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";
import httpServer from "@/lib/httpServer";

// Components
import DashboardLayout from "@/components/layout/dashboard-layout";
import { TransactionTable } from "@/components/transaction/TransactionTable";

// Types
import { ITransaction } from "@/interfaces/ITransaction";

// Props Interface
interface Props {
  params: {
    lang: Locale;
  };
}

// UsersPage Component
export default async function TransactionPage({ params }: Props) {
  const translation = await getDictionary(params.lang);
  let records: ITransaction[] = [];
  let totalRecords: number = 0;
  let balance: number = 0;

  const res = await fetchTransactions(params.lang);
  if (res.ok) {
    const response = await res.json();
    records = response.transactions.data;
    balance = response.balance as number;
    totalRecords = response.transactions.total as number;
  }

  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <div className="p-4">
        <TransactionTable
          initialBalance={balance}
          records={records}
          totalRecords={totalRecords}
          translation={translation}
          lang={params.lang}
        />
      </div>
    </DashboardLayout>
  );
}

// Fetch Transactions Function
const fetchTransactions = async (lang: Locale) => {
  return await httpServer(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/transactions`,
    {
      method: "GET",
      lang: lang,
    }
  );
};
