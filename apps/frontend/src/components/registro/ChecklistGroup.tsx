import ChecklistItem from "./ChecklistItem";

interface ChecklistOption {
  id: string;
  label: string;
}

interface ChecklistGroupProps {
  title?: string;
  options: ChecklistOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const ChecklistGroup = ({
  title,
  options,
  selected,
  onChange,
}: ChecklistGroupProps) => {

  const handleChange = (id: string, checked: boolean) => {
    let updated: string[];

    if (checked) {
      updated = [...selected, id];
    } else {
      updated = selected.filter((item) => item !== id);
    }

    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {title && <h3 className="text-md font-semibold">{title}</h3>}

      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <ChecklistItem
            key={option.id}
            label={option.label}
            checked={selected.includes(option.id)}
            onChange={(checked) => handleChange(option.id, checked)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChecklistGroup;