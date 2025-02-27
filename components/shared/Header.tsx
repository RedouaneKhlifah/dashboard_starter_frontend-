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
  title?: string;
  searchPlaceholder?: string;
  buttonText?: string;
  execlButtonText?: string;
  showSearch?: boolean;
  setSearchQuery?: Dispatch<SetStateAction<string>>;
  showButton?: boolean;
  execlButton?: boolean;
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
  execlButtonText = "Export",
  showSearch = false,
  setSearchQuery,
  showButton = true,
  execlButton = false,
  className = "",
  translation,
  lang,
}: HeaderProps<T>) => {
  const { openModal } = useModalStore();

  return (
    <div className={`flex flex-col gap-4 mb-4 ${className}`}>
      {title && <h2 className="text-2xl text-foreground font-bold">{title}</h2>}
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
        <div className={`${true ? "flex gap-4" : ""}`}>
          {showButton && (
            <Button
              onClick={() => openModal(ModalTypeEnum.CREATE)}
              className="whitespace-nowrap text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {buttonText}
            </Button>
          )}
          {execlButton && (
            <Button
              onClick={() => openModal(ModalTypeEnum.UPLOAD)}
              className="whitespace-nowrap bg-primary hover:bg-primary/90 text-white"
            >
              {execlButtonText}
            </Button>
          )}
        </div>
      </div>
      {translation && lang && (
        <CreateClientForm lang={lang} translation={translation} />
      )}
    </div>
  );
};

export default Header;
