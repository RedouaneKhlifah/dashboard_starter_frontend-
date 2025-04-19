import { Dispatch, SetStateAction } from "react";
import { Button } from "@material-tailwind/react";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { IFactureForm } from "@/dto/facture/factureForm";
import { DictionaryType } from "@/lib/i18n";
import { IService } from "@/interfaces/IService";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
import CreateService from "../createService";
import { MailWarning, X } from "lucide-react";
import InputField from "@/components/ui/InputField";
import { handleChange } from "@/components/utils/formHandlers";
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

    modalType === ModalTypeEnum.UPDATE;
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



  const handleRemoveService = (e: React.FormEvent, serviceId: number) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter(
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
      label: translation.sidebar.service_table.headers.prix,
      width: "130px",
      renderCell: (value: number, row: any) => (
        <InputField
          type="number"
          value={value}
          onChange={(e) => {}}
          min={0}
          id={"prix"}
          suffix={translation.shared.currency}
          label={""}
          disabled={true}
        />
      ),
    }
  ];

  if (modalType == ModalTypeEnum.CREATE) {
    tableHeaders.push({
      key: "action",
      label: translation.order.form.articles.actions,
      width: "130px",
      renderCell: (_value: any, row: any) => (
        <button
          onClick={(e) => handleRemoveService(e, row.service_id)}
          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          {translation.order.form.articles.remove}
        </button>
      ),
    });
  }

  return (
    <div className="space-y-4">
      {errors.services ? (
        <div className="flex items-center gap-2 text-sm">
          <MailWarning className="text-primary" />
          <span className="text-primary">{errors.services}</span>
        </div>
      ) : (
        ""
      )}
      <GlobalTable
        headers={tableHeaders}
        rows={formData.services || []}
        className="mt-4 max-h-60 overflow-x-hidden overflow-y-auto"
        classHead="z-10"
        totalRows={0}
        setCurrentPage={() => {}}
        currentPage={0}
      />
      <div className="flex justify-between items-center border-t-2 border-dashed border-gray-200">
        <div className="flex justify-center items-center mt-2">
          {modalType === ModalTypeEnum.CREATE && (
            <button
              type="button"
              onClick={() => openSecondModal(ModalTypeEnum.CREATE)}
              className="px-3.5 py-2 text-sm font-medium bg-blue-300 text-white  hover:bg-blue-400 rounded-md transition-colors shadow-sm hover:shadow-md"
            >
              {translation.order.form.articles.add_service}
            </button>
          )}
        </div>

        {(formData.services || []).length > 0 && (
          <div className=" pt-3">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-3">
                <div className="flex flex-col justify-center items-center gap-1 border-r-2 border-dashed border-gray-200 h-full px-2">
                  <span className="text-gray-500">
                    {translation.order.form.Total_Items}
                  </span>
                  {/* <span className="text-xl font-semibold text-gray-700">
                    {formData.services.length}
                  </span> */}
                </div>
                <div className="flex flex-col justify-center items-center gap-1">
                  <span className="text-gray-600">
                    {translation.order.form.Total_Amount}
                  </span>
               
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <CreateService
        translation={translation}
        selectedServiceIds={formData.services?.map((a) => a.service_id) || []}
        onSelect={handleAddServices}
        isSecondOpen={secondModalType === "create"}
      />
    </div>
  );
};

export default ServicesTab;