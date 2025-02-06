import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { UsersTableClient } from "@/components/client/UsersTableClient";
import Header from "@/components/client/Header";
import { IClient } from "@/interfaces/IClient";

interface Props {
  params: {
    lang: Locale;
  };
}

export default async function UsersPage({ params }: Props) {
  const translation = await getDictionary(params.lang);
  const users: IClient[] = [
    {
      id: 1,
      full_name: "John Doe",
      email: "john@example.com",
      phone: "+1 234 567 890",
      city: "New York",
      country: "United States",
      address: "1234 Elm St",
      first_name: "John",
      last_name: "Doe",
    },
  ];

  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <div className="p-6">
        <Header translation={translation} lang={params.lang} />
        <UsersTableClient
          users={users}
          translation={translation}
          lang={params.lang}
        />
      </div>
    </DashboardLayout>
  );
}
