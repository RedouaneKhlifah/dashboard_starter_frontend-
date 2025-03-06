"use client";

import { forwardRef } from "react";
import { Locale } from "@/i18n-config";
import { IPartenaire } from "@/interfaces/IPartenaire";
import { DictionaryType } from "@/lib/i18n";
import { formatCurrency, formatDate } from "@/components/utils/formatters";
import { ITicket } from "@/interfaces/ITicket";

interface PrintablePartenaireProps {
  partenaire: IPartenaire | null;
  translation: DictionaryType;
  lang: Locale;
  startDate?: Date | null;
  endDate?: Date | null;
  tickets?: ITicket[] | undefined;
  totals?: {
    totalWeight: number;
    totalValue: number;
    discount: number;
    netTotal: number;
  };
}
const CompanyHeader = ({ translation }: { translation: DictionaryType }) => (
  <header className="text-center mb-8">
    <h1 className="text-2xl font-bold mb-2">
      {translation.sidebar.partenaires_table.print.company_name}
    </h1>
    <p className="text-sm mb-1">
      {translation.sidebar.partenaires_table.print.company_address}
    </p>
    <p className="text-sm">
      {translation.sidebar.partenaires_table.print.company_contact}
    </p>
  </header>
);

const PartenaireInfo = ({
  partenaire,
  translation,
}: {
  partenaire: IPartenaire;
  translation: DictionaryType;
}) => (
  <section className="mb-6">
    <h3 className="font-medium mb-2">
      {translation.sidebar.partenaires_table.print.partner_info}
    </h3>
    <div className="text-sm">
      <p className="mb-1">
        {translation.sidebar.partenaires_table.print.name}: {partenaire.name}
      </p>
      <p className="mb-1">
        {translation.sidebar.partenaires_table.print.matricule}:{" "}
        {partenaire.matricule}
      </p>

      {partenaire.products && (
        <p className="mb-1">
          {translation.sidebar.partenaires_table.print.product}:{" "}
          {partenaire.products.name}
        </p>
      )}
    </div>
  </section>
);

const DateRange = ({
  startDate,
  endDate,
  translation,
  lang,
}: {
  startDate?: Date | null;
  endDate?: Date | null;
  translation: DictionaryType;
  lang: Locale;
}) => (
  <div className="mb-4 text-right">
    <p className="text-sm">
      {translation.sidebar.partenaires_table.print.date_range}:{" "}
      {formatDate(startDate, lang)} - {formatDate(endDate, lang)}
    </p>
  </div>
);

const TicketsTable = ({
  tickets,
  translation,
  lang,
}: {
  tickets?: ITicket[];
  translation: DictionaryType;
  lang: Locale;
}) => {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="w-full mb-6 text-center py-4 text-gray-500">
        {translation.sidebar.partenaires_table.print.no_tickets}
      </div>
    );
  }

  return (
    <table className="w-full mb-6">
      <thead>
        <tr className="border-b-2 border-gray-300">
          <th className="text-left py-2 px-3">
            {translation.sidebar.partenaires_table.print.ticket_number ||
              "ticket number"}
          </th>
          <th className="text-center py-2 px-3">
            {translation.sidebar.partenaires_table.print.gross_weight ||
              "gross weight"}
          </th>
          <th className="text-center py-2 px-3">
            {translation.sidebar.partenaires_table.print.tare_weight ||
              "tare weight"}
          </th>
          <th className="text-center py-2 px-3">
            {translation.sidebar.partenaires_table.print.net_weight ||
              "net weight"}
          </th>
          <th className="text-center py-2 px-3">
            {translation.sidebar.partenaires_table.print.date}
          </th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id} className="border-b border-gray-200">
            <td className="py-2 px-3">#{ticket.id}</td>
            <td className="text-center py-2 px-3">{ticket.poids_brut} kg</td>
            <td className="text-center py-2 px-3">{ticket.poids_tare} kg</td>
            <td className="text-center py-2 px-3">
              {(ticket.poids_brut - ticket.poids_tare).toFixed(2)} kg
            </td>
            <td className="text-center py-2 px-3">
              {formatDate(ticket.created_at, lang)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const TotalsSection = ({
  totals,
  translation,
  lang,
}: {
  totals?: {
    totalWeight: number | undefined;
    totalValue: number | undefined;
    discount: number | undefined;
    netTotal: number | undefined;
  };
  translation: DictionaryType;
  lang: Locale;
}) => {
  if (!totals) {
    return null;
  }

  return (
    <section className="ml-auto w-72 mt-7">
      <div className="flex justify-between mb-2">
        <span>{translation.sidebar.partenaires_table.print.total_weight}:</span>
        <span>{(Number(totals?.totalWeight) || 0).toFixed(2)} kg</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>{translation.sidebar.partenaires_table.print.total_value}:</span>
        <span>{formatCurrency(totals.totalValue || 0, lang)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>{translation.sidebar.partenaires_table.print.discount}:</span>
        <span>- {totals?.discount} %</span>
      </div>
      <div className="flex justify-between border-t-2 border-gray-300 pt-2 font-semibold">
        <span>{translation.sidebar.partenaires_table.print.net_total}:</span>
        <span>{formatCurrency(totals?.netTotal || 0, lang)}</span>
      </div>
    </section>
  );
};

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

const PrintablePartenaire = forwardRef<
  HTMLDivElement,
  PrintablePartenaireProps
>(
  (
    { partenaire, translation, lang, startDate, endDate, tickets, totals },
    ref
  ) => {
    if (!partenaire) {
      return <div ref={ref}>No partner data available</div>;
    }

    const textDirection = lang === "ar" ? "rtl" : "ltr";
    const ticketsToShow = tickets || partenaire.tickets;

    return (
      <div
        ref={ref}
        className="p-8 max-w-4xl mx-auto"
        dir={textDirection}
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <style>{printStyles}</style>
        <CompanyHeader translation={translation} />
        <PartenaireInfo partenaire={partenaire} translation={translation} />
        <DateRange
          startDate={startDate}
          endDate={endDate}
          translation={translation}
          lang={lang}
        />
        <TicketsTable tickets={tickets} translation={translation} lang={lang} />
        <TotalsSection totals={totals} translation={translation} lang={lang} />
      </div>
    );
  }
);

PrintablePartenaire.displayName = "PrintablePartenaire";

export default PrintablePartenaire;
