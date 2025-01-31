import { Locale } from "@/i18n-config";
import Footer from "@/components/shared/footer";
import DashboardLayout from "@/components/layout/dashboard-layout";

interface Props {
  params: {
    lang: Locale;
  };
}

export default async function HowItWorksPage({ params }: Props) {
  return (
    <DashboardLayout params={params}>
      <div className="min-h-screen">fack this css shit</div>
    </DashboardLayout>
  );
}
