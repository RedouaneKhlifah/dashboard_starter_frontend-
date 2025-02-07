"use client";

import { DictionaryType } from "@/lib/i18n";
import { Button } from "../ui/button";
import CreateClientForm from "./CreatePartenaireForm";
import { Locale } from "@/i18n-config";
import { useState } from "react";
import useModalStore from "@/store/modalStore";

interface HeaderProps {
  translation: DictionaryType;
  lang: Locale;
}
const Header: React.FC<HeaderProps> = ({ translation, lang }) => {
  const { openModal } = useModalStore();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-foreground font-bold">
          {translation.sidebar.partenaires_table.partner_management}
        </h2>
        <Button onClick={() => openModal("create")}>
          {translation.sidebar.partenaires_table.create_new_partner}
        </Button>
      </div>
      <CreateClientForm lang={lang} translation={translation} />
    </>
  );
};

export default Header;
