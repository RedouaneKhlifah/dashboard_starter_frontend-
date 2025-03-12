"use client";

import { forwardRef } from "react";
import { Locale } from "@/i18n-config";
import { IEmployee } from "@/interfaces/IEmployee";
import { DictionaryType } from "@/lib/i18n";
import { PaymentHistory } from "../HistoryModal";

interface PrintablePayslipProps {
  employee: IEmployee | null;
  selectedHistory: PaymentHistory | undefined;
  translation: DictionaryType;
  lang: Locale;
}

const DocumentHeader = ({
  translation,
  lang,
  employee,
}: {
  translation: DictionaryType;
  lang: Locale;
  employee: IEmployee;
}) => (
  <div className="flex gap-1 border-b-2 pb-2 mb-4 w-full">
    <div className="flex flex-col w-full h-full">
      <div className="border p-3">
        <div className="border-b text-center">
          <h2 className="font-bold text-lg">{translation.payslip.employer}</h2>
        </div>

        <div className="mt-2">
          <p className="font-bold">ZR CDU</p>
          <p>{translation.payslip.company_activity}</p>
          <p>{translation.payslip.company_address}</p>
          <p>{translation.payslip.city}</p>
        </div>
      </div>
      <div className="border w-full px-3 py-1">
        <p>{translation.payslip.registration_number}: 2228022</p>
      </div>
    </div>
    <div className="flex flex-col w-full h-full">
      <div className="border px-3 pt-3 pb-[60px]">
        <div className="border-b  text-center">
          <h2 className="font-bold text-lg">
            {translation.payslip.PayslipName}
          </h2>
        </div>

        <div className="mt-2">
          <p className="font-bold">{employee.full_name}</p>
          <p>{employee.address}</p>
          <p>{employee.city}</p>
        </div>
      </div>
      <div className="border w-full px-3 py-1">
        <p>
          {translation.payslip.employee_id}: {employee.cnss_number}
        </p>
      </div>
    </div>
  </div>
);

const EmployeeInfoTable = ({
  translation,
  employee,
}: {
  translation: DictionaryType;
  employee: IEmployee;
}) => (
  <table className="w-full border-collapse mb-4">
    <thead>
      <tr>
        <th className="border p-2">{translation.payslip.registration_num}</th>
        <th className="border p-2">{translation.payslip.hire_date}</th>
        <th className="border p-2">{translation.payslip.birth_date}</th>
        <th className="border p-2">{translation.payslip.id_number}</th>
      </tr>
    </thead>
    <tbody>
      <tr className="text-center">
        <td className="border p-2">{employee.matricule}</td>
        <td className="border p-2">{employee.date_of_engagement}</td>
        <td className="border p-2">{employee.birth_date}</td>
        <td className="border p-2">{employee.national_id}</td>
      </tr>
    </tbody>
  </table>
);

const PaymentPeriodRow = ({
  translation,
  selectedHistory,
}: {
  translation: DictionaryType;
  selectedHistory: PaymentHistory;
}) => (
  <table className="w-full border-collapse mb-4">
    <thead>
      <tr>
        <th className="border p-2">{translation.payslip.base_salary}</th>
        <th className="border p-2">{translation.payslip.pay_period}</th>
      </tr>
    </thead>
    <tbody>
      <tr className="text-center">
        <td className="border p-2">
          {selectedHistory.total_gain} {translation.shared.currency}
        </td>
        <td className="border p-2">
          <span className="mx-2">{selectedHistory.start_date}</span>
          <span className="mx-2">{selectedHistory.end_date}</span>
        </td>
      </tr>
    </tbody>
  </table>
);

const PayDetailsTable = ({
  translation,
  historyOfPay,
  employee,
}: {
  translation: DictionaryType;
  historyOfPay: PaymentHistory;
  employee: IEmployee;
}) => (
  <table className="w-full border-collapse mb-4">
    <thead>
      <tr>
        <th className="border p-2">{translation.payslip.category}</th>
        <th className="border p-2">{translation.payslip.amount}</th>
        <th className="border p-2">{translation.payslip.base}</th>
        <th className="border p-2">{translation.payslip.rate}</th>
        <th className="border p-2">{translation.payslip.earnings}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border p-2">{translation.payslip.normal_hours}</td>
        <td className="border p-2"></td>
        <td className="border p-2 text-right">
          <div className="flex items-center gap-1">
            {historyOfPay.total_ton}
            <span className="text-sm">{translation.shared.ton_unit}</span>
          </div>
        </td>
        <td className="border p-2 text-right">
          <div className="flex items-center gap-1">
            {employee.price_per_ton}
            <span className="text-sm">{translation.shared.currency}</span>
          </div>
        </td>
        <td className="border p-2 text-right">
          <div className="flex items-center gap-1">
            {historyOfPay.total_gain}
            <span className="text-sm">{translation.shared.currency}</span>
          </div>
        </td>
      </tr>

      <tr className="font-bold">
        <td className="border p-2" colSpan={3}>
          {translation.payslip.total}
        </td>
        <td className="border p-2 text-center" colSpan={2}>
          {historyOfPay.total_gain} {translation.shared.currency}
        </td>
      </tr>
    </tbody>
  </table>
);

const SignatureArea = ({ translation }: { translation: DictionaryType }) => (
  <div className="mt-8">
    <p>{translation.payslip.signature}</p>
    <div className="h-16"></div>
  </div>
);

// Print styles
const printStyles = `
@media print {
    @page {
        size: A4;
        margin: 10mm;
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
    .flex {
        display: flex;
    }
    .w-1/2 {
        width: 50%;
    }
    .w-1/3 {
        width: 33.333333%;
    }
    .w-2/3 {
        width: 66.666667%;
    }
    .border {
        border: 1px solid #000;
    }
    .border-t {
        border-top: 1px solid #000;
    }
    .border-b {
        border-bottom: 1px solid #000;
    }
}`;

// Main component
const PrintablePayslip = forwardRef<HTMLDivElement, PrintablePayslipProps>(
  ({ employee, translation, lang, selectedHistory }, ref) => {
    if (!employee && !selectedHistory) {
      return <div ref={ref}>No employee data available</div>;
    }

    const textDirection = lang === "ar" ? "rtl" : "ltr";

    return (
      <div
        ref={ref}
        className="p-8 max-w-4xl mx-auto bg-white"
        dir={textDirection}
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <style>{printStyles}</style>
        <DocumentHeader
          translation={translation}
          lang={lang}
          employee={employee as IEmployee}
        />

        <EmployeeInfoTable
          translation={translation}
          employee={employee as IEmployee}
        />

        <PaymentPeriodRow
          translation={translation}
          selectedHistory={selectedHistory as PaymentHistory}
        />

        <PayDetailsTable
          translation={translation}
          historyOfPay={selectedHistory as PaymentHistory}
          employee={employee as IEmployee}
        />
        <div className="w-full flex justify-end pr-4">
          <SignatureArea translation={translation} />
        </div>
      </div>
    );
  }
);

PrintablePayslip.displayName = "PrintablePayslip";

export default PrintablePayslip;
