import React, {
  useState,
  useEffect,
  useCallback,
  FormEvent,
  useMemo,
} from "react";
import { debounce } from "lodash";
import SearchInput from "@/components/ui/SearchInput";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { DictionaryType } from "@/lib/i18n";
import { IService } from "@/interfaces/IService";
import http from "@/lib/http";
import GlobalModal from "../shared/GlobalModal";
import useModalStore from "@/store/modalStore";

interface CreateServiceProps {
  translation: DictionaryType;
  selectedServiceIds?: number[];
  onSelect: (Services: IService[]) => void;
  isSecondOpen: boolean;
}

const CreateService: React.FC<CreateServiceProps> = ({
  translation,
  selectedServiceIds = [],
  onSelect,
  isSecondOpen,
}) => {
  const { closeSecondModal } = useModalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [availableServices, setAvailableServices] = useState<IService[]>([]);
  const [selectedServicesData, setSelectedServicesData] = useState<IService[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedServices, setSelectedServices] = useState<Set<number>>(
    new Set(selectedServiceIds)
  );

  useEffect(() => {
    if (isSecondOpen) {
      setSelectedServices(new Set(selectedServiceIds));
    }
  }, [isSecondOpen, selectedServiceIds]);

  useEffect(() => {
    const debouncedSearch = debounce(async (query: string) => {
      setLoading(true);
      try {
        const url = `${
          process.env.NEXT_PUBLIC_API_BASE_PATH
        }/api/services?search=${encodeURIComponent(query)}&page=1`;
        const response = await http(url);

        if (!response.ok)
          throw new Error(translation.common.errors.fetch_error);

        const data = await response.json();
        setAvailableServices(data.data || []);
        setError("");
      } catch (err) {
        setError(translation.common.errors.fetch_error);
      } finally {
        setLoading(false);
      }
    }, 500);

    if (isSecondOpen) {
      debouncedSearch(searchQuery);
    }
    return () => debouncedSearch.cancel();
  }, [searchQuery, translation, isSecondOpen]);

  const displayedServices = useMemo(() => {
    const ServicesMap = new Map<number, IService>();

    availableServices.forEach((Service) => {
      ServicesMap.set(Service.id, Service);
    });

    selectedServicesData.forEach((Service) => {
      if (!ServicesMap.has(Service.id)) {
        ServicesMap.set(Service.id, Service);
      }
    });

    return Array.from(ServicesMap.values());
  }, [availableServices, selectedServicesData]);

  const toggleSelection = useCallback(
    (ServiceId: number, Service: IService) => {
      setSelectedServices((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(ServiceId)) {
          newSet.delete(ServiceId);
        } else {
          newSet.add(ServiceId);
          setSelectedServicesData((prevData) => {
            if (!prevData.some((p) => p.id === ServiceId)) {
              return [...prevData, Service];
            }
            return prevData;
          });
        }
        return newSet;
      });
    },
    []
  );

  const handleSelect = useCallback(
    (e: FormEvent<Element>) => {
      e.preventDefault();
      e.stopPropagation();

      const selected = displayedServices.filter((Service: { id: number }) =>
        selectedServices.has(Service.id)
      );

      onSelect(selected);
      closeSecondModal();
      setSearchQuery("");
      setSelectedServices(new Set());
      setSelectedServicesData([]);
    },
    [displayedServices, selectedServices, onSelect, closeSecondModal]
  );

  const handleClose = useCallback(() => {
    closeSecondModal();
    setSearchQuery("");
    setSelectedServices(new Set(selectedServiceIds));
    setSelectedServicesData([]);
  }, [closeSecondModal, selectedServiceIds]);

  return (
    <GlobalModal
      open={isSecondOpen}
      onClose={handleClose}
      title={translation.order.select_Services}
      submitButtonText={translation.common.select}
      cancelButtonText={translation.common.cancel}
      onSubmit={handleSelect}
      contentClassName="2xl:min-w-[50%]"
      backdrop={false}
      dismiss={false}
    >
      <div className="space-y-4">
        <SearchInput
          placeholder={translation.order.form.Service_search}
          value={searchQuery}
          className="w-full"
          aria-label={translation.order.form.Service_search}
          setSearch={setSearchQuery}
        />

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <GlobalTable<IService>
          headers={[
            {
              key: "name",
              label: translation.order.form.articles.name,
            },
            {
              key: "unit",
              renderCell(value, row) {
                return `${value}`;
              },
              label: translation.order.form.articles.unit,
            },
            {
              key: "selected" as keyof IService,
              label: translation.order.form.articles.select,
              renderCell: (_, row: IService) => (
                <input
                  type="checkbox"
                  id={`select-${row.id}`}
                  checked={selectedServices.has(row.id)}
                  onChange={() => toggleSelection(row.id, row)}
                  className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  aria-label={`Select ${row.name}`}
                />
              ),
            },
          ]}
          rows={displayedServices}
          className="mt-4 max-h-60 overflow-auto"
          classHead="z-10"
          totalRows={0}
          setCurrentPage={() => {}}
          currentPage={0}
          isLoading={loading}
        />
      </div>
    </GlobalModal>
  );
};

export default React.memo(CreateService);
