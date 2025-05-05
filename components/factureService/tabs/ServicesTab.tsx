import { Dispatch, SetStateAction } from "react";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { IFactureForm } from "@/dto/facture/factureForm";
import { DictionaryType } from "@/lib/i18n";
import { IService } from "@/interfaces/IService";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
import CreateService from "../createService";
import { MailWarning } from "lucide-react";
import InputField from "@/components/ui/InputField";
import { FactureFormErrors } from "@/validation/factureValidators/factureValidator";

interface ServicesTabProps {
  formData: IFactureForm;
  setFormData: Dispatch<SetStateAction<IFactureForm>>;
  translation: DictionaryType;
  errors: FactureFormErrors;
  setErrors: Dispatch<SetStateAction<FactureFormErrors>>;
}

const ServicesTab = ({
  formData,
  setFormData,
  translation,
  errors,
  setErrors,
}: ServicesTabProps) => {
  const { openSecondModal, secondModalType, modalType } = useModalStore();

  const handleAddServices = (selectedServices: IService[]) => {
    const newServices = selectedServices.map((service) => ({
      service_id: service.id,
      designation: service.designation,
      prix: service.prix,
      quantity: 1,
      total: service.prix * 1,
    }));

    setFormData((prev) => ({
      ...prev,
      services: [
        ...(prev.services || []),
        ...newServices.filter(
          (ns) => !prev.services?.some((s) => s.service_id === ns.service_id)
        ),
      ],
    }));
    setErrors({});
  };

  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    serviceId: number
  ) => {
    const value = Number(e.target.value);
    setFormData((prev) => ({
      ...prev,
      services: prev?.services?.map((service) => {
        if (service.service_id === serviceId) {
          return {
            ...service,
            quantity: value,
            total: value * (service?.prix ?? 0),
          };
        }
        return service;
      }),
    }));
  };

  const handleRemoveService = (e: React.FormEvent, serviceId: number) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      services: prev?.services?.filter(
        (service) => service.service_id !== serviceId
      ),
    }));
  };

  const tableHeaders = [
    {
      key: "designation",
      label: translation.sidebar.service_table.headers.designation,
    },
    {
      key: "prix",
      label: translation.order.form.articles.unit_price,
      width: "130px",
      renderCell: (value: number) => (
        <InputField
          id={"prix"}
          type="number"
          value={value}
          onChange={(e) => {}}
          min={0}
          suffix={translation.shared.currency}
          disabled={true}
          label={""}
        />
      ),
    },
    {
      key: "quantity",
      label: translation.order.form.articles.quantity,
      width: "120px",
      renderCell: (value: number, row: any) => (
        <InputField
          id={"quantity"}
          type="number"
          value={value}
          onChange={(e) => handleQuantityChange(e, row.service_id)}
          min={1}
          label={""}
          disabled={modalType === ModalTypeEnum.UPDATE}
        />
      ),
    },
    {
      key: "total",
      label: translation.order.form.articles.total,
      renderCell: (_: any, row: any) => (
        <span className="font-medium">
          {(row.quantity * row.prix).toFixed(2)}
        </span>
      ),
    },
  ];

  if (modalType === ModalTypeEnum.CREATE) {
    tableHeaders.push({
      key: "action",
      label: translation.order.form.articles.actions,
      renderCell: (_: any, row: any) => (
        <button
          onClick={(e) => handleRemoveService(e, row.service_id)}
          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
        >
          {translation.order.form.articles.remove}
        </button>
      ),
    });
  }

  return (
    <div className="space-y-4">
      {errors.services && (
        <div className="flex items-center gap-2 text-sm">
          <MailWarning className="text-primary" />
          <span className="text-primary">{errors.services}</span>
        </div>
      )}

      <GlobalTable
        headers={tableHeaders}
        rows={formData.services || []}
        className="mt-4 max-h-60 overflow-x-hidden overflow-y-auto"
        classHead="z-10"
        totalRows={0}
      />

      <div className="flex justify-between items-center border-t-2 border-dashed border-gray-200">
        <div className="flex justify-center items-center mt-2">
          {modalType === ModalTypeEnum.CREATE && (
            <button
              type="button"
              onClick={() => openSecondModal(ModalTypeEnum.CREATE)}
              className="px-3.5 py-2 text-sm font-medium bg-blue-300 text-white hover:bg-blue-400 rounded-md"
            >
              {translation.order.form.articles.add_service}
            </button>
          )}
        </div>

        {(formData.services || []).length > 0 && (
          <div className="pt-3">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-3">
                <div className="flex flex-col justify-center items-center gap-1 border-r-2 border-dashed border-gray-200 px-2">
                  <span className="text-gray-500">
                    {translation.order.form.Total_Items}
                  </span>
                  <span className="text-xl font-semibold text-gray-700">
                    {formData?.services?.length || 0}
                  </span>
                </div>
                <div className="flex flex-col justify-center items-center gap-1">
                  <span className="text-gray-600">
                    {translation.order.form.Total_Amount}
                  </span>
                  <span className="text-xl font-semibold text-gray-900">
                    {(
                      formData.services?.reduce(
                        (sum, service) =>
                          sum + (service?.quantity || 0) * (service?.prix || 0),
                        0
                      ) || 0
                    ).toFixed(2)}{" "}
                    {translation.shared.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateService
        translation={translation}
        selectedServiceIds={formData.services?.map((s) => s.service_id) || []}
        onSelect={handleAddServices}
        isSecondOpen={secondModalType === "create"}
      />
    </div>
  );
};

export default ServicesTab;
