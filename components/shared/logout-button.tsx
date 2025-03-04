// components/logout-button.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import http from "@/lib/http";
import Cookies from "js-cookie";
import useToast from "@/hooks/useToast";
import { Locale } from "@/i18n-config";
import { LogOut } from "lucide-react";
import { DictionaryType } from "@/lib/i18n";

interface LogoutButtonProps {
    lang: Locale;
    isOpen: boolean;
    translation: DictionaryType;

}

const LogoutButton: React.FC<LogoutButtonProps> = ({ lang, isOpen, translation }) => {
    const router = useRouter();
    const { error: toastError, success: toastSuccess } = useToast();

    const handleLogout = async () => {
        try {
            Cookies.remove("auth_token");
            toastSuccess("You have been logged out successfully.");
            router.push(`/${lang}/sign-in`);
        } catch (error) {
            toastError("Failed to logout. Please try again.");
        }
    };

    return (
        <Button className="w-3/4" onClick={handleLogout} variant="outline">
            {isOpen && <span className="mx-2">{translation.shared.logout}</span>} <LogOut color="red" size={16} />
        </Button>
    );
};

export default LogoutButton;