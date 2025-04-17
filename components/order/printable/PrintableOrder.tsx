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

const convertToFrenchWords = (number: number) => {
  const parts = number.toString().split(".");
  const integerPart = parseInt(parts[0]);
  const decimalPart = parts.length > 1 ? parseInt(parts[1]) : 0;

  const units = [
    "",
    "un",
    "deux",
    "trois",
    "quatre",
    "cinq",
    "six",
    "sept",
    "huit",
    "neuf",
    "dix",
    "onze",
    "douze",
    "treize",
    "quatorze",
    "quinze",
    "seize",
    "dix-sept",
    "dix-huit",
    "dix-neuf",
  ];
  const tens = [
    "",
    "dix",
    "vingt",
    "trente",
    "quarante",
    "cinquante",
    "soixante",
    "soixante-dix",
    "quatre-vingt",
    "quatre-vingt-dix",
  ];

  const convertLessThanOneThousand = (num: number) => {
    if (num === 0) return "";

    if (num < 20) {
      return units[num];
    }

    const ten = Math.floor(num / 10);
    const unit = num % 10;

    if (ten === 7 || ten === 9) {
      return tens[ten - 1] + "-" + units[unit + 10];
    } else if (ten !== 8 && unit === 1) {
      return tens[ten] + "-et-" + units[unit];
    } else if (ten === 8 && unit === 0) {
      return tens[ten] + "s";
    } else {
      return tens[ten] + (unit > 0 ? "-" + units[unit] : "");
    }
  };

  const handleHundreds = (num: number) => {
    if (num < 100) {
      return convertLessThanOneThousand(num);
    }

    const hundred = Math.floor(num / 100);
    const remainder = num % 100;

    if (hundred === 1) {
      return (
        "cent" +
        (remainder > 0 ? " " + convertLessThanOneThousand(remainder) : "")
      );
    } else {
      return (
        units[hundred] +
        " cent" +
        (hundred > 1 && remainder === 0 ? "s" : "") +
        (remainder > 0 ? " " + convertLessThanOneThousand(remainder) : "")
      );
    }
  };

  const convertInteger = (num: number): string => {
    if (num === 0) return "zéro";

    if (num < 1000) {
      return handleHundreds(num);
    }

    if (num < 1000000) {
      const thousand = Math.floor(num / 1000);
      const remainder = num % 1000;

      if (thousand === 1) {
        return "mille" + (remainder > 0 ? " " + handleHundreds(remainder) : "");
      } else {
        return (
          handleHundreds(thousand) +
          " mille" +
          (remainder > 0 ? " " + handleHundreds(remainder) : "")
        );
      }
    }

    if (num < 1000000000) {
      const million = Math.floor(num / 1000000);
      const remainder = num % 1000000;

      if (million === 1) {
        return (
          "un million" + (remainder > 0 ? " " + convertInteger(remainder) : "")
        );
      } else {
        return (
          handleHundreds(million) +
          " millions" +
          (remainder > 0 ? " " + convertInteger(remainder) : "")
        );
      }
    }

    return "nombre trop grand";
  };

  let result = convertInteger(integerPart);

  if (decimalPart > 0) {
    const decimalStr = parts[1];
    const centimes = decimalPart.toString().padStart(2, "0").substring(0, 2);

    if (parseInt(centimes) === 1) {
      result += " et un centime";
    } else {
      result += " et " + convertInteger(parseInt(centimes)) + " centimes";
    }
  }

  return result;
};

const convertNumberToWords = (amount: string | number, currency: string) => {
  if (!amount && amount !== 0) return "";

  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  const words = convertToFrenchWords(numericAmount);

  return words.charAt(0).toUpperCase() + words.slice(1) + " " + currency;
};

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
    <span className="text-sm">BCN °: {order.bcn}</span>
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
      <p className="mb-1">{client?.company}</p>
      <p className="mb-1">{client.address}</p>
      <p>Tél: {client.phone}</p>
      <p>ICE: {client.ice}</p>
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
        <th className="text-left py-2 px-3 text-nowrap">
          {translation.sidebar.orders_table.print.quantity}
        </th>
        <th className="text-left py-2 px-3 text-nowrap">
          {translation.sidebar.orders_table.print.unit_price} (MAD/{order.is_in_tone ? translation.shared.ton_unit : translation.shared.kg_unit})
        </th>
        <th className="text-left py-2 px-3">
          {translation.sidebar.orders_table.print.total} HT
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
            {order.is_in_tone ? parseFloat(quantityInTons.toFixed(3)) : parseFloat(product.quantity.toFixed(3))}{" "}{order.is_in_tone ? translation.shared.ton_unit : translation.shared.kg_unit}
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
  const subtotalValue = parseFloat(summary.subtotal.split(" ")[0]);

  const tvaAmount = (subtotalValue * (order.tva || 0)) / 100;

  return (
    <section className="ml-auto w-72 mt-7">
      <div className="flex justify-between mb-2">
        <span>{translation.sidebar.orders_table.print.subtotal}: HT</span>
        <span>{summary.subtotal}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>
          {translation.sidebar.orders_table.print.tax}: {order.tva} %
        </span>
        <span>
          {tvaAmount.toFixed(2)} {translation.shared.currency}
        </span>
      </div>
      <div className="flex justify-between border-t-2 border-gray-300 pt-2 font-semibold">
        <span>{translation.sidebar.orders_table.print.total}: TTC</span>
        <span>{parseFloat(summary.total.split(" ")[0]).toFixed(3)} {translation.shared.currency}</span>
      </div>
    </section>
  );
};

const Notes = ({
  translation,
  order,
}: {
  translation: DictionaryType;
  order: IOrder;
  lang: Locale;
}) => {
  return (
    <section className="mt-4 border p-2 bg-gray-50 rounded">
      <h3 className="font-semibold mb-2">
        {translation.sidebar.factures_table.print.notes}
      </h3>
      <p className="text-sm">{order.note}</p>
    </section>
  );
};
const TotalInWords = ({
  summary,
  translation,
}: {
  translation: DictionaryType;
  summary: orderSummary;
  order: IOrder;
  lang: Locale;
}) => {
  const totalValue = parseFloat(summary.total.split(" ")[0]);
  const totalInWords = convertNumberToWords(
    totalValue,
    translation.shared.currency
  );
  return (
    <section className="mt-4 border p-2 bg-white rounded">
      <span className="text-xs">
        montant total en lettres (écrit en lettres alphabétiques):
      </span>
      <p className="text-sm">
        <span className="italic font-semibold">{totalInWords}</span>
      </p>
    </section>
  );
};
// const Footer = ({ translation }: { translation: DictionaryType }) => (
//   <footer className="mt-8 text-center text-sm">
//     <p>{translation.sidebar.orders_table.print.thank_you}</p>
//   </footer>
// );

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
        className="p-8 max-w-4xl mx-auto mt-32"
        dir={textDirection}
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <style>{printStyles}</style>
        <DocumentInfo order={order} translation={translation} lang={lang} />
        <ClientInfo client={order.client} translation={translation} />
        <ProductsTable order={order} translation={translation} lang={lang} />
        <SummarySection
          summary={summary}
          order={order}
          translation={translation}
          lang={lang}
        />
        <TotalInWords
          summary={summary}
          order={order}
          translation={translation}
          lang={lang}
        />
        {order.note && (
          <Notes order={order} translation={translation} lang={lang} />
        )}
        {/* <div className="absolute bottom-20 translate-x-1/2 right-1/2">
          <Footer translation={translation} />
        </div> */}
      </div>
    );
  }
);

Printableorder.displayName = "Printableorder";

export default Printableorder;
