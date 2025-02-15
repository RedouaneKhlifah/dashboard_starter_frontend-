"use client";
import { Dispatch, SetStateAction, useState, useEffect, useMemo } from "react";
import GlobalModal from "@/components/shared/GlobalModal";
import InputField from "@/components/ui/InputField";
import { DictionaryType } from "@/lib/i18n";
import { handleChange, hasNoErrors } from "@/components/utils/formHandlers";
import { OrderValidation } from "@/validation";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
import { DevisRelationShipData, IOrderForm } from "@/dto/order/orderForm";
import SearchAutocomplete from "@/components/ui/SearchAutocomplete";
import { OrderFormErrors } from "@/validation/orderValidators/orderValidator";
import {
  Fingerprint,
  UserSearch,
  Calculator,
  FileText,
  ShoppingCart,
} from "lucide-react";
import { GlobalTable } from "@/components/shared/GlobalTable";
import CreateProduct from "./createProduct";
import { Button } from "@material-tailwind/react";
import { addMonths } from "@/utils/Date";
import clsx from "clsx";
import { Select, Option } from "@material-tailwind/react";
import { IProduct } from "@/interfaces/IProduct";
import http from "@/lib/http";

interface OrderFormProps {
  initialFormData: IOrderForm;
  translation: DictionaryType;
  errors: OrderFormErrors;
  setErrors: Dispatch<SetStateAction<OrderFormErrors>>;
  onSubmit: (formData: IOrderForm) => Promise<boolean>;
  isOpen: boolean;
}

type TabName = "client" | "products" | "summary" | "notes";

interface Tab {
  name: TabName;
  index: number;
}

const tabs: Tab[] = [
  { name: "client", index: 0 },
  { name: "products", index: 1 },
  { name: "summary", index: 2 },
  { name: "notes", index: 3 },
];

const OrderForm = ({
  initialFormData,
  translation,
  errors,
  setErrors,
  onSubmit,
  isOpen,
}: OrderFormProps) => {
  const {
    modalType,
    closeModal,
    openSecondModal,
    secondModalType,
    isSecondOpen,
  } = useModalStore();
  const [formData, setFormData] = useState<IOrderForm>(initialFormData);
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const API_ENDPOINTS = {
    clients: `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/clients`,
  };

  const fetchAutocompleteData = async (endpoint: string, query: string) => {
    const response = await http(`${endpoint}?search=${query}&page=1`);
    return response.json();
  };

  const { validateOrderForm } = OrderValidation;

  const submitButtonText = useMemo(() => {
    return activeTab.name === "notes"
      ? modalType === "create"
        ? translation.sidebar.orders_table.create_new_order
        : translation.sidebar.orders_table.update_order
      : translation.Order.common.continue;
  }, [activeTab.name, modalType, translation]);

  const calculateTotals = () => {
    const sous_total =
      formData.products?.reduce(
        (sum, product) => sum + product.price_unitaire * product.quantity,
        0
      ) || 0;

    const remiseAmount =
      formData.remise_type === "PERCENT"
        ? sous_total * (formData.remise / 100)
        : formData.remise || 0;

    const sous_total_after_remise = sous_total - remiseAmount;
    const tva = sous_total_after_remise * 0.2;
    const total = sous_total_after_remise + tva;

    setFormData((prev) => ({
      ...prev,
      subtotal: Number(sous_total.toFixed(2)),
      vat: Number(tva.toFixed(2)),
      total: Number(total.toFixed(2)),
    }));
  };

  const fetchClients = async (query: string) => {
    const data = await fetchAutocompleteData(API_ENDPOINTS.clients, query);
    return (data.data);
  };

  useEffect(() => {
    calculateTotals();
  }, [formData.products]);

  const validateCurrentTab = (tabName: TabName): OrderFormErrors => {
    const newErrors: OrderFormErrors = {};

    switch (tabName) {
      case "client":
        // if (!formData.client_id)
        //   newErrors.client_id = translation.Order.client_required;
        if (!formData.reference?.trim())
          newErrors.reference = translation.Order.reference_required;
        if (!formData.devis_date)
          newErrors.devis_date = translation.Order.devis_date_required;
        if (!formData.expiration_date)
          newErrors.expiration_date =
            translation.Order.expiration_date_required;
        break;
      // case "products":
      //   if (!formData.products?.length) {
      //     newErrors.articles = translation.Order.product_required;
      //   }
      //   break;
    }
    return newErrors;
  };

  const handleTabChange = (targetTab: Tab) => {
    if (targetTab.index > activeTab.index) {
      const currentTabErrors = validateCurrentTab(activeTab.name);
      setErrors(currentTabErrors);
      if (hasNoErrors(currentTabErrors)) {
        setActiveTab(targetTab);
      }
    } else {
      setActiveTab(targetTab);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab.name !== "notes") {
      const nextTab = tabs.find((t) => t.index === activeTab.index + 1);
      if (nextTab) handleTabChange(nextTab);
    } else {
      const newErrors = validateOrderForm(formData, translation);
      setErrors(newErrors);
      if (hasNoErrors(newErrors)) {
        const success = await onSubmit(formData);
        if (success) {
          closeModal();
          setFormData(initialFormData);
          setErrors({});
        }
      }
    }
  };

  const handleAddProducts = (selectedProducts: IProduct[]) => {
    const newProducts = selectedProducts.map((product) => ({
      product_id: product.id,
      price_unitaire: product.cost_price,
      quantity: 1
    }));
  
    setFormData(prev => ({
      ...prev,
      products: [
        ...prev.products,
        ...newProducts.filter(np => 
          !prev.products.some(p => p.product_id === np.product_id)
        )
      ]
    }));
  };

  return (
    <>
      <GlobalModal
        open={isOpen}
        onClose={() => {
          closeModal();
          setFormData(initialFormData);
          setActiveTab(tabs[0]);
          setErrors({});
        }}
        title={
          modalType === "create"
            ? translation.sidebar.orders_table.create_new_order
            : translation.sidebar.orders_table.update_order
        }
        submitButtonText={submitButtonText}
        cancelButtonText={translation.Order.common.cancel}
        onSubmit={handleSubmit}
        contentClassName="2xl:min-w-[60%]"
        dismiss={!isSecondOpen}
      >
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                  ${activeTab.name === tab.name
                      ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                    }`}
                >
                  {tab.name === "client" && <UserSearch className="w-4 h-4" />}
                  {tab.name === "products" && (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                  {tab.name === "summary" && <Calculator className="w-4 h-4" />}
                  {tab.name === "notes" && <FileText className="w-4 h-4" />}
                  {translation.Order.tabs[tab.name]}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg min-h-[300px]">
            {activeTab.name === "client" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <SearchAutocomplete
                    id="client"
                    label={translation.Order.form.client}
                    onSearch={fetchClients}
                    value={formData.client}
                    onChange={(client) => setFormData((prev) => ({ ...prev, client: client as DevisRelationShipData }))}
                    placeholder={translation.Ticket.form.client_search}
                    icon={<UserSearch className="w-5 h-5 text-gray-400" />}
                    error={errors.client}
                    required
                  />
                  <InputField
                    id="reference"
                    label={translation.Order.form.reference}
                    value={formData.reference}
                    onChange={(e) => handleChange(e, setFormData, setErrors)}
                    icon={<Fingerprint className="w-5 h-5 text-gray-400" />}
                    error={errors.reference}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    id="devis_date"
                    type="date"
                    label={translation.Order.form.devis_date}
                    onChange={(e) => handleChange(e, setFormData, setErrors)}
                    value={formData.devis_date}
                    error={errors.devis_date}
                    // disabled
                  />
                  <InputField
                    id="expiration_date"
                    type="date"
                    label={translation.Order.form.expiration_date}
                    value={formData.expiration_date}
                    onChange={(e) => handleChange(e, setFormData, setErrors)}
                    error={errors.expiration_date}
                    required
                  />
                </div>
              </div>
            )}
            {activeTab.name === "products" && (
              <div className="space-y-4">
                <GlobalTable
                  headers={[
                    {
                      key: "name",
                      label: translation.Order.form.articles.name,
                    },
                    {
                      key: "unit",
                      label: translation.Order.form.articles.unit,
                    },
                    {
                      key: "unit_price",
                      label: translation.Order.form.articles.unit_price,
                    },
                    {
                      key: "quantity",
                      label: translation.Order.form.articles.quantity,
                    },
                    {
                      key: "total",
                      label: translation.Order.form.articles.total,
                    },
                    {
                      key: "action",
                      label: translation.Order.form.articles.actions,
                      renderCell: (value: boolean, row: any) => (
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => {
                            const updatedArticles = formData.products?.map(
                              (article) => article.product_id === row.id
                                ? { ...article, selected: e.target.checked }
                                : article
                            );
                            setFormData({
                              ...formData,
                              products: updatedArticles,
                            });
                          }}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                      ),
                    },
                  ]}
                  rows={formData.products || []}
                  className="mt-4" totalRows={0} setCurrentPage={function (value: SetStateAction<number>): void {
                    throw new Error("Function not implemented.");
                  }} currentPage={0} />
                <Button
                  onClick={() => openSecondModal(ModalTypeEnum.CREATE)}
                  className="bg-black text-primary"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {translation.Order.form.add_article}
                </Button>
              </div>
            )}
            {activeTab.name === "summary" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    id="tva"
                    type="number"
                    label={translation.Order.form.vat}
                    value={formData.tva?.toString() || ""}
                    onChange={(e) => handleChange(e, setFormData, setErrors)}
                  />
                  <div className="relative">
                    <InputField
                      id="remise.value"
                      type="number"
                      label={translation.Order.form.remise.value}
                      value={formData.remise?.toString() || "0"}
                      onChange={(e) => handleChange(e, setFormData, setErrors)}
                      className="pr-24"
                    />
                    <div className="absolute right-1 top-[30px]">
                      <div className="absolute left-[8px] top-[11px] h-5 border-l-2"></div>
                      <Select
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        id="remise.type"
                        // value={formData.remise?.type || "percentage"}
                        onChange={(e) => handleChange(e, setFormData, setErrors)}
                        className="min-w-[80px] border-0 shadow-none text-current"
                        containerProps={{
                          className: "min-w-[80px]"
                        }}
                        labelProps={{
                          className: "hidden"
                        }}
                      >
                        <Option value="percentage">%</Option>
                        <Option className="text-sm" value="fixed">
                          {translation.Order.form.remise.fixed}
                        </Option>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    id="sous_total"
                    type="number"
                    label={translation.Order.form.subtotal}
                    value={formData.subtotal?.toString() || ""}
                    onChange={(e) => handleChange(e, setFormData, setErrors)}
                    disabled
                  />
                  <InputField
                    id="total"
                    type="number"
                    label={translation.Order.form.total}
                    value={formData.total?.toString() || ""}
                    onChange={(e) => handleChange(e, setFormData, setErrors)}
                    disabled
                  />
                </div>
              </div>
            )}
            {activeTab.name === "notes" && (
              <div className="space-y-4">
                <InputField
                  id="note"
                  label={translation.Order.form.note}
                  value={formData.note}
                  onChange={(e) => handleChange(e, setFormData, setErrors)}
                  error={errors.note}
                  textarea
                  rows={4}
                />
              </div>
            )}
          </div>
        </div>
      </GlobalModal>
      <CreateProduct
        translation={translation}
        selectedProductIds={formData.products?.map((a) => a.product_id) || []}
        onSelect={handleAddProducts}
        isSecondOpen={secondModalType === "create"}

      // initialFormData={initialFormData}
      // onSubmit={onSubmit}
      />
    </>
  );
};

export default OrderForm;
