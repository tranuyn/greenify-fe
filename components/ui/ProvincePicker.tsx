import { useState } from 'react';

import { useProvinces } from '@/hooks/queries/useLocation';
import { DropdownPicker } from './DropdownPicker';

type Props = {
  value: string;
  onChange: (provinceName: string) => void;
  label: string;
};

export default function ProvincePicker({ value, onChange, label }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: provinces = [], isLoading } = useProvinces();

  return (
    <DropdownPicker
      label={label}
      value={value}
      options={provinces}
      isLoading={isLoading}
      isOpen={isOpen}
      onToggle={() => setIsOpen((prev) => !prev)}
      onSelect={(opt) => {
        onChange(opt.name);
        setIsOpen(false);
      }}
    />
  );
}
