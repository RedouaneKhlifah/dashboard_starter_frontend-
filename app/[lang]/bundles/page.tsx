import { Locale } from "@/i18n-config";
import Footer from "@/components/shared/footer";
import DashboardLayout from "@/components/layout/dashboard-layout";

interface Props {
  params: {
    lang: Locale;
  };
}

export default async function BundlesPage({ params }: Props) {
  return (
    <DashboardLayout params={params}>
      <div className="min-h-screen">Bundles simples</div>
    </DashboardLayout>
  );
}
