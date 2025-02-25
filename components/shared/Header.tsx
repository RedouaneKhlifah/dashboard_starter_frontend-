// Imports
"use client";

// Types & Store
import React, { SetStateAction, Dispatch } from "react";
import { Locale } from "@/i18n-config";
import { DictionaryType } from "@/lib/i18n";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";

// Components & Utils
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/SearchInput";
import CreateClientForm from "@/components/client/CreateClientForm";
import { cn } from "@/lib/utils";

// Props Interface
interface HeaderProps<T = unknown> {
  title: string;
  searchPlaceholder?: string;
  buttonText?: string;
  showSearch?: boolean;
  setSearchQuery?: Dispatch<SetStateAction<string>>;
  showButton?: boolean;
  className?: string;
  children?: React.ReactNode;
  translation?: DictionaryType;
  lang?: Locale;
}

// Header Component
const Header = <T,>({
  title,
  searchPlaceholder = "Search...",
  buttonText = "Add New",
  showSearch = false,
  setSearchQuery,
  showButton = true,
  className = "",
  translation,
  lang,
}: HeaderProps<T>) => {
  const { openModal } = useModalStore();

  return (
    <div className={`flex flex-col gap-4 mb-4 ${className}`}>
      <h2 className="text-2xl text-foreground font-bold">{title}</h2>
      <div
        className={cn(
          `flex items-center gap-4 ${
            showSearch ? "justify-between" : "justify-end"
          }`
        )}
      >
        {showSearch && setSearchQuery && (
          <SearchInput
            placeholder={searchPlaceholder}
            setSearch={setSearchQuery}
            className="w-full"
          />
        )}
        {showButton && (
          <Button
            onClick={() => openModal(ModalTypeEnum.CREATE)}
            className="whitespace-nowrap text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            {buttonText}
          </Button>
        )}
      </div>
      {translation && lang && (
        <CreateClientForm lang={lang} translation={translation} />
      )}
    </div>
  );
};

export default Header;
