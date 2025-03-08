"use client";
import { ModalTypeEnum } from "@/store/modalStore";
import GlobalModal from "@/components/shared/GlobalModal";
import SingleInputDateRangePicker from "../shared/SingleInputDateRangePicker";
import { ITicket } from "@/interfaces/ITicket";
import { DictionaryType } from "@/lib/i18n";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { IPartenaire } from "@/interfaces/IPartenaire";
import { InputField } from "../ui";
import { FileText, Loader } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import PrintablePartenaire from "./printable/PrintablePartenaire";
import { GlobalTable, TableHeader } from "@/components/shared/GlobalTable";
import { Condition } from "../utils";
import http from "@/lib/http";
import { IProduct } from "@/interfaces/IProduct";

interface calculationData {
    tickets: ITicket[];
    product: IProduct | null;
    total_poids_net: number;
}

interface ModalPartenaireDetailsProps {
    lang: "fr" | "en" | "ar";
    partenaire: IPartenaire | null;
    isOpen: boolean;
    onClose: () => void;
    translation: DictionaryType;
}

const ModalPartenaireDetails = ({
    partenaire,
    isOpen,
    onClose,
    translation,
    lang,
}: ModalPartenaireDetailsProps) => {
    const [dateRange, setDateRange] = useState<{
        start: Date | null;
        end: Date | null;
    }>({ start: null, end: null });
    const [remise, setRemise] = useState(0);
    const [pricePerKg, setPricePerKg] = useState(0);
    const [calculationData, setCalculationData] =
        useState<calculationData | null>({
            tickets: [],
            product: null,
            total_poids_net: 0,
        });
    const [hasCalculated, setHasCalculated] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);

    const resetData = () => {
        setDateRange({ start: null, end: null });
        setRemise(0);
        setPricePerKg(0);
        setCalculationData({
            tickets: [],
            product: null,
            total_poids_net: 0,
        });
        setHasCalculated(false);
    };

    const handleCalculate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!partenaire) return;

        setIsCalculating(true);

        try {
            const response = await http(
                `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/partenaires/${partenaire.id
                }/tickets?start_date=${dateRange.start?.toISOString()}&end_date=${dateRange.end?.toISOString()}`,
                {
                    method: "GET",
                }
            );

            const data = (await response.json()) as calculationData;
            setCalculationData(data);
            if (data.product) setHasCalculated(true);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        } finally {
            setIsCalculating(false);
        }
    };

    const contentRef = useRef<HTMLDivElement>(null);

    const totalValue = useMemo(
        () => (calculationData?.total_poids_net ?? 0) * pricePerKg,
        [calculationData?.total_poids_net, pricePerKg]
    );

    const netTotal = useMemo(() => {
        const discountAmount = (totalValue * remise) / 100;
        return totalValue - discountAmount;
    }, [totalValue, remise]);

    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: `Partenaire-${partenaire?.matricule || "details"}`,
    });

    if (!partenaire) return null;

    const ticketHeaders: TableHeader<{
        id: number;
        created_at: string;
        netWeight: string;
    }>[] = [
            {
                key: "created_at",
                label: translation.partenaireModal?.common?.date || "Date",
            },
            {
                key: "netWeight",
                label: translation.partenaireModal?.common?.netWeight || "Net Weight",
            },
        ];

    const ticketRows = calculationData?.tickets?.map((ticket, index) => ({
        id: index,
        created_at: new Date(ticket.created_at).toLocaleDateString(),
        netWeight: `${(ticket.poids_brut - ticket.poids_tare).toFixed(2)} kg`,
    }));

    const skeletonRows = Array(5).fill(0).map((_, index) => ({
        id: index,
        created_at: "",
        netWeight: "",
    }));

    return (
        partenaire && (
            <GlobalModal
                open={isOpen}
                onClose={() => {
                    resetData();
                    onClose();
                }}
                title={partenaire?.name}
                cancelButtonText={translation.partenaireModal?.common?.cancel}
                contentClassName="2xl:min-w-[70%] 2xl:max-w-[70%]"
            >
                <div className="space-y-6 p-4">
                    {/* Header Section */}
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <span className="font-medium mb-3 text-gray-700">
                                {translation.partenaire?.form.matricule}
                            </span>
                            <span className="text-xl text-primary font-bold">
                                {partenaire.matricule}
                            </span>
                        </div>

                    </div>

                    {/* Date Range Picker */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="w-full flex gap-4 items-center">
                            <div className="flex-1">
                                <SingleInputDateRangePicker
                                    value={dateRange}
                                    onChange={setDateRange}
                                    translation={translation}
                                />
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={handleCalculate}
                                    disabled={isCalculating}
                                    type="button"
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
                                >
                                    {isCalculating && <Loader size={18} className="animate-spin" />}
                                    {isCalculating
                                        ? translation.partenaireModal?.common?.calculating || "Calculating..."
                                        : hasCalculated
                                            ? translation.partenaireModal?.common?.recalculate
                                            : translation.partenaireModal?.common?.calculate}
                                </button>
                                <button
                                    onClick={() => handlePrint()}
                                    type="button"
                                    className="px-4 py-2 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-lg flex items-center gap-1"
                                >
                                    <FileText size={20} />
                                    <span>{translation.shared.printable}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Section */}
                    <Condition
                        if={
                            calculationData?.product && calculationData?.tickets?.length > 0
                        }
                        render={
                            <div className="flex gap-2">
                                <div className="bg-primary/5 p-3 rounded-lg border w-1/3">
                                    <h3 className="font-medium mb-1 text-gray-700">
                                        {translation.partenaireModal?.common?.product}
                                    </h3>
                                    <div className="px-4 py-2.5 border border-primary text-primary rounded-lg">
                                        <span className="font-semibold">
                                            {calculationData?.product?.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Price Inputs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border w-full">
                                    <InputField
                                        id="pricePerKg"
                                        label={translation.partenaireModal?.common?.pricePerKg}
                                        type="number"
                                        value={pricePerKg}
                                        onChange={(e) => setPricePerKg(Number(e.target.value))}
                                    />
                                    <InputField
                                        id="discount"
                                        label={translation.partenaireModal?.common?.discount}
                                        type="number"
                                        value={remise}
                                        suffix="%"
                                        onChange={(e) => setRemise(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        }
                    />

                    <div className="bg-white p-4 rounded-lg border">
                        <h3 className="font-medium mb-3 text-gray-700">
                            {translation.partenaireModal?.common?.tickets}
                            <span className="ml-2 text-sm text-gray-500">
                                ({!isCalculating ? calculationData?.tickets?.length ?? 0 : "..."})
                            </span>
                        </h3>

                        <GlobalTable
                            headers={ticketHeaders}
                            rows={isCalculating ? skeletonRows : (ticketRows ?? [])}
                            totalRows={isCalculating ? 5 : (calculationData?.tickets?.length ?? 0)}
                            isLoading={isCalculating}
                            className="shadow-lg rounded-lg overflow-hidden"
                            noDataMessage={
                                translation.partenaireModal?.common?.noTicketsFound
                            }
                        />
                    </div>

                    {/* Totals Section */}
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <div className="space-y-2">
                            <div className="flex justify-between py-2">
                                <span>{translation.partenaireModal?.common?.totalWeight}</span>
                                <span className="font-medium">
                                    {isCalculating ?
                                        "..." :
                                        `${Number(calculationData?.total_poids_net || 0).toFixed(2)} KG`}
                                </span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span>{translation.partenaireModal?.common?.totalValue}</span>
                                <span className="font-medium">
                                    {isCalculating ? "..." : totalValue.toFixed(2)} {translation.shared.currency}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span>{translation.partenaireModal?.common?.discount}</span>
                                <span className="font-medium">
                                    {isCalculating ? "..." : remise.toFixed(2)} %
                                </span>
                            </div>
                            <div className="flex justify-between py-3 mt-2 bg-gray-50 rounded-lg p-2">
                                <span className="font-semibold text-lg">
                                    {translation.partenaireModal?.common?.netTotal}
                                </span>
                                <span className="font-bold text-lg text-primary">
                                    {isCalculating ? "..." : netTotal.toFixed(2)} {translation.shared.currency}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hidden Printable Content */}
                <div style={{ display: "none" }}>
                    <PrintablePartenaire
                        ref={contentRef}
                        partenaire={partenaire}
                        translation={translation}
                        lang={lang}
                        startDate={dateRange.start}
                        endDate={dateRange.end}
                        tickets={calculationData?.tickets}
                        totals={{
                            totalWeight: calculationData?.total_poids_net || 0,
                            totalValue,
                            discount: remise,
                            netTotal,
                            pricePerKg
                        }}
                    />
                </div>
            </GlobalModal>
        )
    );
};

export default ModalPartenaireDetails;