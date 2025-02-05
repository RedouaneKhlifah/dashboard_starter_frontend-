import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { UsersTableClient } from "@/components/client/UsersTableClient";
import ClientForm from "@/components/client/ClientForm";

interface Props {
    params: {
        lang: Locale;
    };
}

export default async function UsersPage({ params }: Props) {
    const translation = await getDictionary(params.lang);
    const users = [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            phone: "+1 234 567 890",
            city: "New York",
            country: "United States",
        },
    ];

    return (
        <DashboardLayout lang={params.lang} translation={translation}>
            <div className="p-6">
                <ClientForm lang={params.lang} translation={translation}/>
                <UsersTableClient 
                    users={users} 
                    translation={translation.sidebar.users_table}
                />
            </div>
        </DashboardLayout>
    );
}