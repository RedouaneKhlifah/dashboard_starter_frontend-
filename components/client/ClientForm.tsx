"use client";
import { DictionaryType } from "@/lib/i18n";
import CreateClientForm from "./CreateClientForm";
import { IClientForm } from "@/interfaces";
import { useState } from "react";
import { PartialClientForm } from "@/interfaces/IClient";
import http from "@/lib/http";

interface ClientFormProps {
    translation: DictionaryType;
    lang: "fr" | "en" | "ar";
}

const ClientForm: React.FC<ClientFormProps> = ({ translation, lang }) => {
    const [errors, setErrors] = useState<PartialClientForm>({});

    const handleSubmit = async (data: IClientForm): Promise<boolean> => {
        try {
            const response = await http(
                process.env.NEXT_PUBLIC_API_BASE_PATH + "/api/clients",
                {
                    method: "POST",
                    lang,
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                setErrors({
                    general: error.message,
                });
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error during client creation:", error);
            setErrors({
                general: "An unexpected error occurred.",
            });
            return false;
        }
    };

    return (
        <CreateClientForm
            translation={translation}
            errors={errors}
            setErrors={setErrors}
            onSubmit={handleSubmit}
        />
    );
};

export default ClientForm;