
import React, { useState, useMemo } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.jsx';
import { cn } from '@/lib/utils.js';

const DEEPL_LANGUAGES = [
  { code: 'auto', name: 'Detect language' },
  { code: 'BG', name: 'Bulgarian' },
  { code: 'CS', name: 'Czech' },
  { code: 'DA', name: 'Danish' },
  { code: 'DE', name: 'German' },
  { code: 'EL', name: 'Greek' },
  { code: 'EN', name: 'English' },
  { code: 'ES', name: 'Spanish' },
  { code: 'ET', name: 'Estonian' },
  { code: 'FI', name: 'Finnish' },
  { code: 'FR', name: 'French' },
  { code: 'HU', name: 'Hungarian' },
  { code: 'ID', name: 'Indonesian' },
  { code: 'IT', name: 'Italian' },
  { code: 'JA', name: 'Japanese' },
  { code: 'KO', name: 'Korean' },
  { code: 'LT', name: 'Lithuanian' },
  { code: 'LV', name: 'Latvian' },
  { code: 'NB', name: 'Norwegian (Bokmål)' },
  { code: 'NL', name: 'Dutch' },
  { code: 'PL', name: 'Polish' },
  { code: 'PT', name: 'Portuguese' },
  { code: 'RO', name: 'Romanian' },
  { code: 'RU', name: 'Russian' },
  { code: 'SK', name: 'Slovak' },
  { code: 'SL', name: 'Slovenian' },
  { code: 'SV', name: 'Swedish' },
  { code: 'TR', name: 'Turkish' },
  { code: 'UK', name: 'Ukrainian' },
  { code: 'ZH', name: 'Chinese' },
];

export default function LanguageSelector({ value, onChange, showAutoDetect = false, label }) {
  const [open, setOpen] = useState(false);

  const availableLanguages = useMemo(() => {
    return showAutoDetect ? DEEPL_LANGUAGES : DEEPL_LANGUAGES.filter(lang => lang.code !== 'auto');
  }, [showAutoDetect]);

  const selectedLanguage = availableLanguages.find(lang => lang.code === value);

  return (
    <div className="flex flex-col gap-1.5 w-full sm:w-[240px]">
      {label && <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-card hover:bg-accent/50 transition-colors"
          >
            {selectedLanguage ? selectedLanguage.name : 'Select language'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search language..." />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {availableLanguages.map((language) => (
                  <CommandItem
                    key={language.code}
                    value={language.name}
                    onSelect={() => {
                      onChange(language.code);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === language.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {language.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
