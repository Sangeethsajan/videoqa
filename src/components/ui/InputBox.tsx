import { Input } from "@/components/ui/input";

interface InputBoxProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const InputBox: React.FC<InputBoxProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full"
    />
  </div>
);
