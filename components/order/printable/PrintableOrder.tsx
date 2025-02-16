"use client";

import { forwardRef } from "react";
import { IDevis } from "@/interfaces/IDevis";
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { formatCurrency, formatDate } from "@/components/utils/formatters";

interface PrintableOrderProps {
  order: IDevis;
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

const calculateOrderTotals = (order: IDevis): OrderTotals => {
  const subtotal = order.products.reduce(
    (acc, product) => acc + (product.sale_price * (product.stock || 1)),
    0
  );
  const discount = order.remise_type === "PERCENT" 
    ? subtotal * (order.remise / 100) 
    : order.remise;
  const totalAfterDiscount = subtotal - discount;
  const taxAmount = totalAfterDiscount * (order.tva / 100);
  
  return {
    subtotal,
    discount,
    totalAfterDiscount,
    taxAmount,
    total: totalAfterDiscount + taxAmount
  };
};

const CompanyHeader = ({ translation }: { translation: DictionaryType }) => (
  <div className="print-header text-center mb-8">
    <h1 className="text-2xl font-bold mb-2">
      {translation.sidebar.orders_table.print.company_name}
    </h1>
    <p className="text-sm mb-1">
      {translation.sidebar.orders_table.print.company_address}
    </p>
    <p className="text-sm">
      {translation.sidebar.orders_table.print.company_contact}
    </p>
  </div>
);

const DocumentInfo = ({ 
  order, 
  translation, 
  lang 
}: { 
  order: IDevis; 
  translation: DictionaryType; 
  lang: Locale; 
}) => (
  <div className="print-document-info mb-6">
    <h2 className="text-xl font-semibold mb-3">
      {translation.sidebar.orders_table.print.order_title}
    </h2>
    <div className="flex justify-between mb-2">
      <span className="text-sm">
        {translation.sidebar.orders_table.print.reference}: {order.reference}
      </span>
      <span className="text-sm">
        {translation.sidebar.orders_table.print.date}:{order.devis_date}
      </span>
    </div>
    <div className="text-right text-sm">
      {translation.sidebar.orders_table.print.due_date}: {order.expiration_date}
    </div>
  </div>
);

const ClientInfo = ({ 
  client, 
  translation 
}: { 
  client: IDevis['client']; 
  translation: DictionaryType; 
}) => (
  <div className="print-client-info mb-6">
    <h3 className="font-medium mb-2">
      {translation.sidebar.orders_table.print.bill_to}
    </h3>
    <div className="text-sm">
      <p className="mb-1">{client.full_name}</p>
      <p className="mb-1">{client.address}</p>
      <p>{client.email}</p>
    </div>
  </div>
);

const ProductsTable = ({ 
  order, 
  translation,
  lang 
}: { 
  order: IDevis; 
  translation: DictionaryType;
  lang: Locale;
}) => (
  <table className="print-table w-full mb-6">
    <thead>
      <tr className="border-b-2 border-gray-300">
        <th className="text-left py-2 px-3">
          {translation.sidebar.orders_table.print.product}
        </th>
        <th className="text-right py-2 px-3">
          {translation.sidebar.orders_table.print.quantity}
        </th>
        <th className="text-right py-2 px-3">
          {translation.sidebar.orders_table.print.unit_price}
        </th>
        <th className="text-right py-2 px-3">
          {translation.sidebar.orders_table.print.total}
        </th>
      </tr>
    </thead>
    <tbody>
      {order.products.map((product, index) => (
        <tr key={index} className="border-b border-gray-200">
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
  lang 
}: { 
  totals: OrderTotals; 
  translation: DictionaryType;
  lang: Locale;
}) => ( 
  <div className="print-totals ml-auto w-72 !mt-7">
    <div className="flex justify-between mb-2">
      <span>{translation.sidebar.orders_table.print.subtotal}:</span>
      <span>{formatCurrency(totals.subtotal, lang)}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span>{translation.sidebar.orders_table.print.discount}:</span>
      <span>-{formatCurrency(totals.discount, lang)}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span>{translation.sidebar.orders_table.print.tax}:</span>
      <span>{formatCurrency(totals.taxAmount, lang)}</span>
    </div>
    <div className="flex justify-between border-t-2 border-gray-300 pt-2 font-semibold">
      <span>{translation.sidebar.orders_table.print.total}:</span>
      <span>{formatCurrency(totals.total, lang)}</span>
    </div>
  </div>
);

const Footer = ({ translation }: { translation: DictionaryType }) => (
  <div className="print-footer mt-8 text-center text-sm">
    <p className="mb-2">{translation.sidebar.orders_table.print.terms}</p>
    <p>{translation.sidebar.orders_table.print.thank_you}</p>
  </div>
);

const PrintableOrder = forwardRef<HTMLDivElement, PrintableOrderProps>(
  ({ order, translation, lang }, ref) => {
    const textDirection = lang === 'ar' ? 'rtl' : 'ltr';
    const totals = calculateOrderTotals(order);

    return (
      <div 
        ref={ref} 
        className="print-container p-8 max-w-4xl mx-auto"
        dir={textDirection}
      >
        <style>{`
          @media print {
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-container {
              padding: 0;
              max-width: none;
            }
          }
        `}</style>

        <CompanyHeader translation={translation} />
        <DocumentInfo order={order} translation={translation} lang={lang} />
        <ClientInfo client={order.client} translation={translation} />
        <ProductsTable order={order} translation={translation} lang={lang} />
        <TotalsSection totals={totals} translation={translation} lang={lang} />
        <Footer translation={translation} />
      </div>
    );
  }
);

PrintableOrder.displayName = "PrintableOrder";

export default PrintableOrder;