"use client";

import { forwardRef } from "react";
import { Locale } from "@/i18n-config";
import { IFacture } from "@/interfaces/IFacture";
import { DictionaryType } from "@/lib/i18n";
import { formatCurrency, formatDate } from "@/components/utils/formatters";
import Logo from "@/public/logo_Zroudi.svg";
import Image from "next/image";
// Types
interface PrintableFactureProps {
  facture: IFacture | null;
  translation: DictionaryType;
  lang: Locale;
}

interface OrderTotals {
  subtotal: string;
  discount: string;
  taxAmount: string;
  total: string;
}

// Utility functions
// const calculateOrderTotals = (facture: IFacture): OrderTotals => {
//   const subtotal = facture.products.reduce(
//     (acc, product) => acc + product.sale_price * (product.stock || 1),
//     0
//   );

//   const discount =
//     facture.remise_type === "PERCENT"
//       ? subtotal * (facture.remise / 100)
//       : facture.remise;

//   const totalAfterDiscount = subtotal - discount;
//   const taxAmount = totalAfterDiscount * (facture.tva / 100);

//   return {
//     subtotal,
//     discount,
//     totalAfterDiscount,
//     taxAmount,
//     total: totalAfterDiscount + taxAmount,
//   };
// };

const calculateOrderTotals = (
  order: IFacture,
  translation: DictionaryType
): OrderTotals => {
  const baseSubtotal =
    order.products?.reduce(
      (sum, product) =>
        sum +
        (Number(product.price_unitaire) || 0) * (Number(product.quantity) || 0),
      0
    ) || 0;

  const tvaAmount = (baseSubtotal * (order.tva || 0)) / 100;
  const totalTTC = baseSubtotal + tvaAmount;

  const discountAmount =
    order.remise_type === "PERCENT"
      ? (baseSubtotal * (order.remise || 0)) / 100 // Apply discount on subtotal (HT)
      : order.remise || 0;

  const finalTotal = Math.max(totalTTC - discountAmount, 0);
  console.log(
    "order.remise_type ",
    order.remise +
      " " +
      (order.remise_type === "PERCENT" ? "%" : translation.shared.currency)
  );

  return {
    taxAmount:
      tvaAmount +
      " " +
      (order.remise_type === "PERCENT" ? "%" : translation.shared.currency),
    discount:
      order.remise +
      " " +
      (order.remise_type === "PERCENT" ? "%" : translation.shared.currency),
    subtotal: baseSubtotal + " " + translation.shared.currency,
    total: finalTotal + " " + translation.shared.currency,
  };
};

// Subcomponents
const CompanyHeader = ({ translation }: { translation: DictionaryType }) => (
  <header className="text-center mb-8">
    <h1 className="text-2xl font-bold mb-2">
      {translation.sidebar.factures_table.print.company_name}
    </h1>
    <p className="text-sm mb-1">
      {translation.sidebar.factures_table.print.company_address}
    </p>
    <p className="text-sm">
      {translation.sidebar.factures_table.print.company_contact}
    </p>
  </header>
);

const DocumentInfo = ({
  facture,
  translation,
  lang,
}: {
  facture: IFacture;
  translation: DictionaryType;
  lang: Locale;
}) => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-3">
      {translation.sidebar.factures_table.print.invoice_title}
    </h2>
    <div className="flex justify-between mb-2">
      <div className="flex gap-1">
        <span className="text-sm">
          {translation.sidebar.factures_table.print.reference}:
        </span>
        <span className="text-sm">{facture.reference}</span>
      </div>
      <span className="text-sm">
        {translation.sidebar.factures_table.print.date}:{" "}
        {formatDate(facture.facture_date, lang)}
      </span>
    </div>
    <div className="text-right text-sm">
      {translation.sidebar.factures_table.print.due_date}:{" "}
      {formatDate(facture.expiration_date, lang)}
    </div>
  </section>
);

const ClientInfo = ({
  client,
  translation,
}: {
  client: IFacture["client"];
  translation: DictionaryType;
}) => (
  <section className="mb-6">
    <h3 className="font-medium mb-2">
      {translation.sidebar.factures_table.print.bill_to}
    </h3>
    <div className="text-sm">
      <p className="mb-1">{client?.company}</p>
      <p className="mb-1">{client.address}</p>
      <p>{client.email}</p>
    </div>
  </section>
);

const ProductsTable = ({
  facture,
  translation,
  lang,
}: {
  facture: IFacture;
  translation: DictionaryType;
  lang: Locale;
}) => (
  <table className="w-full mb-6">
    <thead>
      <tr className="border-b-2 border-gray-300">
        <th className="text-left py-2 px-3">
          {translation.sidebar.factures_table.print.product}
        </th>
        <th className="text-right py-2 px-3">
          {translation.sidebar.factures_table.print.quantity} (ton)
        </th>
        <th className="text-right py-2 px-3">
          {translation.sidebar.factures_table.print.unit_price} (MAD/kg)
        </th>
        <th className="text-right py-2 px-3">
          {translation.sidebar.factures_table.print.total}
        </th>
      </tr>
    </thead>
    <tbody>
      {facture.products.map((product, index) => {
        const quantityInTons = (product.quantity || 0) / 1000;
        const pricePerKg = product.price_unitaire || 0;
        const total = product.quantity * pricePerKg;

        return (
          <tr key={index} className="border-b border-gray-200">
            <td className="py-2 px-3">{product.name}</td>
            <td className="text-right py-2 px-3">
              {parseFloat(quantityInTons.toFixed(3))}{" "}
              {translation.shared.ton_unit}
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

const TotalsSection = ({
  totals,
  translation,
  facture,
}: {
  totals: OrderTotals;
  translation: DictionaryType;
  facture: IFacture;
  lang: Locale;
}) => (
  <section className="ml-auto w-72 mt-7">
    <div className="flex justify-between mb-2">
      <span>{translation.sidebar.factures_table.print.subtotal}:</span>
      <span>{totals.subtotal}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span>{translation.sidebar.factures_table.print.discount}:</span>
      <span>-{totals.discount}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span>{translation.sidebar.factures_table.print.tax}:</span>
      <span>{facture.tva} %</span>
    </div>
    <div className="flex justify-between border-t-2 border-gray-300 pt-2 font-semibold">
      <span>{translation.sidebar.factures_table.print.total}:</span>
      <span>{totals.total}</span>
    </div>
  </section>
);

const Footer = ({ translation }: { translation: DictionaryType }) => (
  <footer className="mt-8 text-center text-sm">
    <p>{translation.sidebar.factures_table.print.thank_you}</p>
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
const PrintableFacture = forwardRef<HTMLDivElement, PrintableFactureProps>(
  ({ facture, translation, lang }, ref) => {
    if (!facture) {
      return <div ref={ref}>No facture data available</div>;
    }

    const textDirection = lang === "ar" ? "rtl" : "ltr";
    const totals = calculateOrderTotals(facture, translation);

    return (
      <div
        ref={ref}
        className="p-8 max-w-4xl mx-auto"
        dir={textDirection}
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <style>{printStyles}</style>
        <CompanyHeader translation={translation} />
        <DocumentInfo facture={facture} translation={translation} lang={lang} />
        <ClientInfo client={facture.client} translation={translation} />
        <ProductsTable
          facture={facture}
          translation={translation}
          lang={lang}
        />
        <TotalsSection
          totals={totals}
          facture={facture}
          translation={translation}
          lang={lang}
        />
        <Footer translation={translation} />
      </div>
    );
  }
);

PrintableFacture.displayName = "PrintableOrder";

export default PrintableFacture;
