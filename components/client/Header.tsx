"use client";

import { DictionaryType } from "@/lib/i18n";
import { Button } from "../ui/button";
import CreateClientForm from "./CreateClientForm";
import { Locale } from "@/i18n-config";
import { useState } from "react";
import useModalStore from "@/store/modalStore";
import SearchInput from '@/components/ui/SearchInput';

interface HeaderProps {
  translation: DictionaryType;
  lang: Locale;
}

const Header: React.FC<HeaderProps> = ({ translation, lang }) => {
  const { openModal } = useModalStore();

  const handleSearch = (value: string) => {
    console.log('Search query:', value);
  };

  return (
    <>
      <div className="flex flex-col gap-4 mb-4">
        <h2 className="text-2xl text-foreground font-bold">
          {translation.sidebar.users_table.customer_management}
        </h2>
        <div className="flex justify-between items-center">
          <SearchInput
            placeholder={translation.sidebar.users_table.search_placeholder}
            onSearchChange={handleSearch}
            className="w-full"
          />
          <Button onClick={() => openModal("create")}>
            {translation.sidebar.users_table.create_new_client}
          </Button>
        </div>

      </div>

      <CreateClientForm lang={lang} translation={translation} />
    </>
  );
};

export default Header;