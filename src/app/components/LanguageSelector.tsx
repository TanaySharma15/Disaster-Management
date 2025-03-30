"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface LanguageSelectorProps {
  onLanguageChange: (lang: string) => void;
}

export default function LanguageSelector({
  onLanguageChange,
}: LanguageSelectorProps) {
  const [language, setLanguage] = useState("en");

  const handleChange = (value: string) => {
    setLanguage(value);
    onLanguageChange(value);
  };

  return (
    <Select value={language} onValueChange={handleChange}>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Spanish</SelectItem>
        <SelectItem value="fr">French</SelectItem>
        <SelectItem value="de">German</SelectItem>
        <SelectItem value="it">Italian</SelectItem>
      </SelectContent>
    </Select>
  );
}
