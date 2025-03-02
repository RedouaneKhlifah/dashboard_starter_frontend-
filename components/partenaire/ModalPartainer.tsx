"use client";
import { ModalTypeEnum } from "@/store/modalStore";
import GlobalModal from "@/components/shared/GlobalModal";
import SingleInputDateRangePicker from "../shared/SingleInputDateRangePicker";
import { ITicket } from "@/interfaces/ITicket";
import { DictionaryType } from "@/lib/i18n";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { IPartenaire } from "@/interfaces/IPartenaire";
import { InputField } from "../ui";
import { FileText } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import PrintableOrder from "../facture/printable/PrintableOrder";
import PrintablePartenaire from "./printable/PrintablePartenaire";
import { GlobalTable } from "@/components/shared/GlobalTable"; // Import GlobalTable

interface ModalPartenaireDetailsProps {
    partenaire: IPartenaire | null;
    isOpen: boolean;
    onClose: () => void;
    translation: DictionaryType;
    lang: Locale;
}

const ModalPartenaireDetails = ({
    partenaire,
    isOpen,
    onClose,
    translation,
    lang
}: ModalPartenaireDetailsProps) => {
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null
    });
    const [appliedDateRange, setAppliedDateRange] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null
    });
    const [remise, setRemise] = useState(0);
    const [pricePerKg, setPricePerKg] = useState(0);
    const [selectedPartenaireForPrint, setSelectedPartenaireForPrint] =
        useState<IPartenaire | null>(null);


        

    useEffect(() => {
        if (partenaire && partenaire.products) {
            setPricePerKg(partenaire.products.sale_price || 0);
        }
        setRemise(0);
        setDateRange({ start: null, end: null });
        setAppliedDateRange({ start: null, end: null });
    }, [partenaire]);

    const handleCalculate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setAppliedDateRange(dateRange);
      };

    const contentRef = useRef<HTMLDivElement>(null);
    const filteredTickets = useMemo(() => {
        if (!partenaire?.tickets) return [];
        let tickets = partenaire.tickets;
        if (appliedDateRange.start && appliedDateRange.end) {
            tickets = tickets.filter(ticket => {
                const ticketDate = new Date(ticket.created_at);
                return ticketDate >= appliedDateRange.start! && ticketDate <= appliedDateRange.end!;
            });
        }
        return tickets;
    }, [partenaire?.tickets, appliedDateRange]);

    const totalPoids = useMemo(() =>
        filteredTickets.reduce((sum, ticket) => sum + (ticket.poids_brut - ticket.poids_tare), 0),
        [filteredTickets]
    );
    const totalValue = useMemo(() => totalPoids * pricePerKg, [totalPoids, pricePerKg]);
    const netTotal = useMemo(() => totalValue - remise, [totalValue, remise]);

    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: `Partenaire-${partenaire?.matricule || "details"}`,
        onAfterPrint: () => setSelectedPartenaireForPrint(null),
    });

    const handlePrintRequest = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (partenaire) {
            setSelectedPartenaireForPrint({
                ...partenaire,
                tickets: filteredTickets
            });
        }
    }, [partenaire, filteredTickets]);

    useEffect(() => {
        if (selectedPartenaireForPrint) handlePrint();
    }, [selectedPartenaireForPrint]);

    if (!partenaire) return null;


    const ticketHeaders = [
        { key: "created_at", label: translation.partenaireModal?.common?.date || "Date" },
        { key: "netWeight", label: translation.partenaireModal?.common?.netWeight || "Net Weight" },
    ];


    const ticketRows = filteredTickets.map(ticket => ({
        created_at: new Date(ticket.created_at).toLocaleDateString(),
        netWeight: `${(ticket.poids_brut - ticket.poids_tare).toFixed(2)} kg`
    }));

    return (
        <GlobalModal
            open={isOpen}
            onClose={onClose}
            title={partenaire.name}
            cancelButtonText={translation.partenaireModal?.common?.cancel}
            contentClassName="2xl:min-w-[70%] 2xl:max-w-[70%]"
        >
            <div className="space-y-6 p-4">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <span className="font-medium mb-3 text-gray-700">
                            {translation.partenaire?.form.matricule || "Matricule"}
                        </span>
                        <span className="text-xl text-primary font-bold">{partenaire.matricule}</span>
                    </div>
                    <div>
                        <button
                            onClick={handlePrintRequest}
                            type="button"
                            className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-lg flex items-center gap-1"
                        >
                            <FileText size={20} />   <span className="text-primary">{translation.shared.printable}</span>
                        </button>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="w-full flex gap-4 items-center">
                        <div className="flex-1">
                            <SingleInputDateRangePicker
                                value={dateRange}
                                onChange={(newRange) => setDateRange(newRange)}
                            />
                        </div>
                        <button
                            onClick={handleCalculate}
                            type="button"
                            className="px-4 py-2 bg-primary text-white rounded-lg transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-primary/30"
                        >
                            {translation.partenaireModal?.common?.apply || "Calculate"}
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="bg-primary/5 p-3 rounded-lg border w-1/3">
                        <h3 className="font-medium mb-1 text-gray-700">
                            {translation.partenaireModal?.common?.product || "Product"}
                        </h3>
                        {partenaire.products ? (
                            <div className="px-4 py-2.5 border border-primary text-primary rounded-lg">
                                <span className="font-semibold">{partenaire.products.name}</span>
                            </div>
                        ) : (
                            <span className="text-gray-500 italic">
                                {translation.partenaireModal?.common?.noProduct || "No product available"}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border w-full">
                        <div>
                            <InputField
                                id="pricePerKg"
                                label={translation.partenaireModal?.common?.pricePerKg || "Price per Kg"}
                                type="number"
                                value={pricePerKg}
                                onChange={(e) => setPricePerKg(Number(e.target.value))}
                                required
                            />
                        </div>
                        <div>
                            <InputField
                                id="discount"
                                label={translation.partenaireModal?.common?.discount || "Discount"}
                                type="number"
                                value={remise}
                                onChange={(e) => setRemise(Number(e.target.value))}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium mb-3 text-gray-700">
                        {translation.partenaireModal?.common?.tickets || "Tickets"}
                        {filteredTickets.length > 0 &&
                            <span className="ml-2 text-sm text-gray-500">({filteredTickets.length})</span>
                        }
                    </h3>

                    {filteredTickets.length > 0 ? (
                        <GlobalTable
                            headers={ticketHeaders}
                            rows={ticketRows}
                            totalRows={filteredTickets.length}
                            isLoading={false}
                            className="shadow-lg rounded-lg overflow-hidden"
                            noDataMessage={translation.partenaireModal?.common?.noTicketsFound || "No tickets found for the selected period"}
                        />
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                            {translation.partenaireModal?.common?.noTicketsFound || "No tickets found for the selected period"}
                        </div>
                    )}
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="space-y-2">
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">{translation.partenaireModal?.common?.totalWeight || "Total Weight"}</span>
                            <span className="font-medium">{totalPoids.toFixed(2)} kg</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">{translation.partenaireModal?.common?.totalValue || "Total Value"}</span>
                            <span className="font-medium">{totalValue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">{translation.partenaireModal?.common?.discount || "Discount"}</span>
                            <span className="font-medium">{remise.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-3 mt-2 bg-gray-50 rounded-lg p-2">
                            <span className="font-semibold text-lg">{translation.partenaireModal?.common?.netTotal || "Net Total"}</span>
                            <span className="font-bold text-lg text-primary">{netTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: "none" }}>
                <PrintablePartenaire
                    ref={contentRef}
                    partenaire={selectedPartenaireForPrint}
                    translation={translation}
                    lang={lang}
                    startDate={appliedDateRange.start}
                    endDate={appliedDateRange.end}
                    tickets={filteredTickets}
                    totals={{
                        totalWeight: totalPoids,
                        totalValue,
                        discount: remise,
                        netTotal
                    }}
                />
            </div>
        </GlobalModal>
    );
};

export default ModalPartenaireDetails;