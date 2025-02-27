"use client";

import { forwardRef } from "react";
import { Locale } from "@/i18n-config";
import { IFacture } from "@/interfaces/IFacture";
import { DictionaryType } from "@/lib/i18n";
import { formatCurrency, formatDate } from "@/components/utils/formatters";

// Types
interface PrintableFactureProps {
  facture: IFacture | null;
  translation: DictionaryType;
  lang: Locale;
}

interface OrderTotals {
  subtotal: number;
  discount: number;
  totalAfterDiscount: number;
  taxAmount: number;
  total: number;
}

// Utility functions
const calculateOrderTotals = (facture: IFacture): OrderTotals => {
  const subtotal = facture.products.reduce(
    (acc, product) => acc + product.sale_price * (product.stock || 1),
    0
  );

  const discount =
    facture.remise_type === "PERCENT"
      ? subtotal * (facture.remise / 100)
      : facture.remise;

  const totalAfterDiscount = subtotal - discount;
  const taxAmount = totalAfterDiscount * (facture.tva / 100);

  return {
    subtotal,
    discount,
    totalAfterDiscount,
    taxAmount,
    total: totalAfterDiscount + taxAmount,
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
      <span className="text-sm">
        {translation.sidebar.factures_table.print.reference}
        {facture.reference}
      </span>
      <span className="text-sm">
        {translation.sidebar.factures_table.print.date}
        {formatDate(facture.facture_date, lang)}
      </span>
    </div>
    <div className="text-right text-sm">
      {translation.sidebar.factures_table.print.due_date}
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
      <p className="mb-1">{client?.full_name}</p>
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
      <tr className="bfacture-b-2 bfacture-gray-300">
        <th className="text-left py-2 px-3">
          {translation.sidebar.factures_table.print.product}
        </th>
        <th className="text-right py-2 px-3">
          {translation.sidebar.factures_table.print.quantity}
        </th>
        <th className="text-right py-2 px-3">
          {translation.sidebar.factures_table.print.unit_price}
        </th>
        <th className="text-right py-2 px-3">
          {translation.sidebar.factures_table.print.total}
        </th>
      </tr>
    </thead>
    <tbody>
      {facture.products.map((product, index) => (
        <tr key={index} className="bfacture-b bfacture-gray-200">
          <td className="py-2 px-3">{product.name}</td>
          <td className="text-right py-2 px-3">{product.stock || 1}</td>
          <td className="text-right py-2 px-3">
            {formatCurrency(product.sale_price, lang)}
          </td>
          <td className="text-right py-2 px-3">
            {formatCurrency(product.sale_price * (product.stock || 1), lang)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const TotalsSection = ({
  totals,
  translation,
  lang,
}: {
  totals: OrderTotals;
  translation: DictionaryType;
  lang: Locale;
}) => (
  <section className="ml-auto w-72 mt-7">
    <div className="flex justify-between mb-2">
      <span>{translation.sidebar.factures_table.print.subtotal}:</span>
      <span>{formatCurrency(totals.subtotal, lang)}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span>{translation.sidebar.factures_table.print.discount}:</span>
      <span>-{formatCurrency(totals.discount, lang)}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span>{translation.sidebar.factures_table.print.tax}:</span>
      <span>{formatCurrency(totals.taxAmount, lang)}</span>
    </div>
    <div className="flex justify-between bfacture-t-2 bfacture-gray-300 pt-2 font-semibold">
      <span>{translation.sidebar.factures_table.print.total}:</span>
      <span>{formatCurrency(totals.total, lang)}</span>
    </div>
  </section>
);

const Footer = ({ translation }: { translation: DictionaryType }) => (
  <footer className="mt-8 text-center text-sm">
    <p className="mb-2">{translation.sidebar.factures_table.print.terms}</p>
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
      bfacture-collapse: collapse;
    }
    th, td {
      bfacture: 1px solid #000;
      padding: 8px;
    }
    .bfacture-b-2 {
      bfacture-bottom-width: 2px;
    }
    .bfacture-gray-300 {
      bfacture-color: #000;
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
    const totals = calculateOrderTotals(facture);

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
        <TotalsSection totals={totals} translation={translation} lang={lang} />
        <Footer translation={translation} />
      </div>
    );
  }
);

PrintableFacture.displayName = "PrintableOrder";

export default PrintableFacture;
