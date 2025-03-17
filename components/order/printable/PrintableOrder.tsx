"use client";

import { forwardRef } from "react";
import { Locale } from "@/i18n-config";
import { IOrder } from "@/interfaces/IOrder";
import { DictionaryType } from "@/lib/i18n";
import { formatCurrency, formatDate } from "@/components/utils/formatters";
import Logo from "@/public/logo_Zroudi.svg";
import Image from "next/image";

// Types
interface PrintableorderProps {
  order: IOrder | null;
  translation: DictionaryType;
  lang: Locale;
}

interface orderSummary {
  subtotal: string;
  remise: number;
  remise_type: string;
  total: string;
  tva: string;
}

// Utility functions
const calculateorderSummary = (
  order: IOrder,
  translation: DictionaryType
): orderSummary => {
  const baseSubtotal =
    order.products?.reduce(
      (sum, product) =>
        sum + (product.price_unitaire || 0) * (product.quantity || 0),
      0
    ) || 0;

  const tvaAmount = (baseSubtotal * (order.tva || 0)) / 100;
  const totalTTC = baseSubtotal + tvaAmount;

  const discountAmount =
    order.remise_type === "PERCENT"
      ? (baseSubtotal * (order.remise || 0)) / 100 // Apply discount on subtotal (HT)
      : order.remise || 0;

  const finalTotal = Math.max(totalTTC - discountAmount, 0);
  return {
    tva: tvaAmount + " %",
    remise: order.remise,
    remise_type:
      order.remise_type === "PERCENT" ? "%" : translation.shared.currency,
    subtotal: baseSubtotal + " " + translation.shared.currency,
    total: finalTotal + " " + translation.shared.currency,
  };
};

// Subcomponents
const CompanyHeader = ({ translation }: { translation: DictionaryType }) => (
  <header className="text-center mb-8">
    <h1 className="text-2xl font-bold mb-2">
      {translation.sidebar.orders_table.print.company_name}
    </h1>
    <p className="text-sm mb-1">
      {translation.sidebar.orders_table.print.company_address}
    </p>
    <p className="text-sm">
      {translation.sidebar.orders_table.print.company_contact}
    </p>
  </header>
);

const DocumentInfo = ({
  order,
  translation,
  lang,
}: {
  order: IOrder;
  translation: DictionaryType;
  lang: Locale;
}) => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-3">
      {translation.sidebar.orders_table.print.order_title}
    </h2>
    <div className="flex justify-between mb-2">
      <span className="text-sm">
        {translation.sidebar.orders_table.print.reference}: {order.reference}
      </span>
      <span className="text-sm">
        {translation.sidebar.orders_table.print.date}:{" "}
        {formatDate(order.order_date, lang)}
      </span>
    </div>
    <div className="text-right text-sm">
      {translation.sidebar.orders_table.print.due_date}:{" "}
      {formatDate(order.expiration_date, lang)}
    </div>
  </section>
);

const ClientInfo = ({
  client,
  translation,
}: {
  client: IOrder["client"];
  translation: DictionaryType;
}) => (
  <section className="mb-6">
    <h3 className="font-medium mb-2">
      {translation.sidebar.orders_table.print.bill_to}
    </h3>
    <div className="text-sm">
      <p className="mb-1">{client?.full_name}</p>
      <p className="mb-1">{client.address}</p>
      <p>{client.email}</p>
    </div>
  </section>
);

const ProductsTable = ({
  order,
  translation,
  lang,
}: {
  order: IOrder;
  translation: DictionaryType;
  lang: Locale;
}) => (
  <table className="w-full mb-6">
     <thead>
      <tr className="border-b-2 border-gray-300">
        <th className="text-left py-2 px-3">
          {translation.sidebar.orders_table.print.product}
        </th>
        <th className="text-right py-2 px-3">
          {translation.sidebar.orders_table.print.quantity} (ton)
        </th>
        <th className="text-right py-2 px-3">
          {translation.sidebar.orders_table.print.unit_price} (MAD/kg)
        </th>
        <th className="text-right py-2 px-3">
          {translation.sidebar.orders_table.print.total}
        </th>
      </tr>
    </thead>
    <tbody>
      {order.products.map((product, index) => {
        const quantityInTons = (product.quantity || 0) / 1000;
        const pricePerKg = product.price_unitaire || 0;
        const total = product.quantity * pricePerKg;

        return (
          <tr key={index} className="border-b border-gray-200">
            <td className="py-2 px-3">{product.name}</td>
            <td className="text-right py-2 px-3">
              {quantityInTons.toFixed(3)} {translation.shared.ton_unit}
            </td>
            <td className="text-right py-2 px-3">
              {formatCurrency(pricePerKg, lang)}
            </td>
            <td className="text-right py-2 px-3">
              {formatCurrency(total, lang)}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

const SummarySection = ({
  order,
  summary,
  translation,
  lang,
}: {
  order: IOrder;
  summary: orderSummary;
  translation: DictionaryType;
  lang: Locale;
}) => {
  const {} = summary;

  return (
    <section className="ml-auto w-72 mt-7">
      <div className="flex justify-between mb-2">
        <span>{translation.sidebar.orders_table.print.subtotal}:</span>
        <span>{summary.subtotal}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>{translation.sidebar.orders_table.print.discount}:</span>
        <span>
          {summary.remise} {summary.remise_type}
        </span>
      </div>
      <div className="flex justify-between mb-2">
        <span>{translation.sidebar.orders_table.print.tax}:</span>
        <span>{order.tva} %</span>
      </div>
      <div className="flex justify-between border-t-2 border-gray-300 pt-2 font-semibold">
        <span>{translation.sidebar.orders_table.print.total}:</span>
        <span>{summary.total}</span>
      </div>
    </section>
  );
};

const Footer = ({ translation }: { translation: DictionaryType }) => (
  <footer className="mt-8 text-center text-sm">
    <p>{translation.sidebar.orders_table.print.thank_you}</p>
  </footer>
);

// Print styles
const printStyles = `
  @media print {
    @page {
      size: A4;
      margin: 20mm;
    }
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      font-family: Arial, sans-serif;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #000;
      padding: 8px;
    }
    .border-b-2 {
      border-bottom-width: 2px;
    }
    .border-gray-300 {
      border-color: #000;
    }
  }

`;
// Main component
const Printableorder = forwardRef<HTMLDivElement, PrintableorderProps>(
  ({ order, translation, lang }, ref) => {
    if (!order) {
      return <div ref={ref}>No order data available</div>;
    }

    const summary = calculateorderSummary(order, translation);
    const textDirection = lang === "ar" ? "rtl" : "ltr";

    return (
      <div
        ref={ref}
        className="p-8 max-w-4xl mx-auto"
        dir={textDirection}
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <style>{printStyles}</style>
        <CompanyHeader translation={translation} />
        <DocumentInfo order={order} translation={translation} lang={lang} />
        <ClientInfo client={order.client} translation={translation} />
        <ProductsTable order={order} translation={translation} lang={lang} />
        <SummarySection
          summary={summary}
          order={order}
          translation={translation}
          lang={lang}
        />
        <div className="absolute bottom-20 translate-x-1/2 right-1/2"><Footer translation={translation} /></div>
        
      </div>
    );
  }
);

Printableorder.displayName = "Printableorder";

export default Printableorder;
