"use client";
import { Dispatch, SetStateAction, useState } from "react";
import GlobalModal from "@/components/shared/GlobalModal";
import InputField from "@/components/ui/InputField";
import { Button } from "@/components/ui/button";
import { DictionaryType } from "@/lib/i18n";
import { handleChange } from "@/components/utils/formHandlers";
import { PartialClientForm, IClientForm } from "@/interfaces/IClient";
import { ClientValidation } from "@/validation";


interface CreateClientProps {
    translation: DictionaryType;
    errors: PartialClientForm;
    setErrors: Dispatch<SetStateAction<PartialClientForm>>;
    onSubmit: (formData: IClientForm) => Promise<boolean>;
}

const CreateClientForm = ({ translation, errors, setErrors, onSubmit }: CreateClientProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<IClientForm>({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        country: "",
        city: "",
    });

    const { validateClientForm } = ClientValidation;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateClientForm(formData, translation);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const success = await onSubmit(formData);
            if (success) {
                setIsOpen(false);
                setFormData({
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone: "",
                    address: "",
                    country: "",
                    city: "",
                });
                setErrors({});
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-foreground font-bold">
                    {translation.sidebar.users_table.customer_management}
                </h2>
                <Button onClick={() => setIsOpen(true)}>
                    {translation.sidebar.users_table.create_new_client}
                </Button>
            </div>

            <GlobalModal
                open={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setFormData({
                        first_name: "",
                        last_name: "",
                        email: "",
                        phone: "",
                        address: "",
                        country: "",
                        city: "",
                    });
                    setErrors({});
                }}
                title={translation.sidebar.users_table.create_new_client}
                submitButtonText={translation.client.common.create}
                cancelButtonText={translation.client.common.cancel}
                onSubmit={handleSubmit}
            >
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <InputField
                            id="first_name"
                            label={translation.client.form.first_name}
                            value={formData.first_name}
                            onChange={(e) => handleChange(e, setFormData, setErrors)}
                            error={errors.first_name}
                            required
                        />
                        <InputField
                            id="last_name"
                            label={translation.client.form.last_name}
                            value={formData.last_name}
                            onChange={(e) => handleChange(e, setFormData, setErrors)}
                            error={errors.last_name}
                            required
                        />
                    </div>

                    <InputField
                        id="email"
                        label={translation.client.form.email}
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange(e, setFormData, setErrors)}
                        error={errors.email}
                        required
                    />

                    <InputField
                        id="phone"
                        label={translation.client.form.phone}
                        value={formData.phone}
                        onChange={(e) => handleChange(e, setFormData, setErrors)}
                        error={errors.phone}
                        required
                    />

                    <InputField
                        id="address"
                        label={translation.client.form.address}
                        value={formData.address}
                        onChange={(e) => handleChange(e, setFormData, setErrors)}
                        error={errors.address}
                        required
                    />

                    <div className="flex gap-4">
                        <InputField
                            id="country"
                            label={translation.client.form.country}
                            value={formData.country}
                            onChange={(e) => handleChange(e, setFormData, setErrors)}
                            error={errors.country}
                            required
                        />
                        <InputField
                            id="city"
                            label={translation.client.form.city}
                            value={formData.city}
                            onChange={(e) => handleChange(e, setFormData, setErrors)}
                            error={errors.city}
                            required
                        />
                    </div>
                    {errors.general && (
                        <p className="text-red-500 text-sm">{errors.general}</p>
                    )}
                </div>
            </GlobalModal>
        </div>
    );
};

export default CreateClientForm;