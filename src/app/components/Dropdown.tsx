export interface DropdownOption {
  readonly value: string,
  readonly text: string,
};

type DropdownProps = {
  readonly label: string,
  readonly value: string,
  readonly opts: [DropdownOptions],
  onChange: () => void,
};

export default function Dropdown({ label, value, opts, onChange }: DropdownProps) {
  return (
    <div className="flex flex-col gap-y-[2px]">
      <p className="text-xs text-dark font-bold">{ label }</p>
      <select className="px-2 py-2 rounded-xl bg-grey"
        value={ value }
        onChange={ (e) => onChange(e.target.value) }
      >
        { opts.map((opt, i) => {
          return (
            <option
              key={ i }
              value={ opt.value }
            >
              { opt.text }
            </option>
          );
        })}
      </select>
    </div>
  )
}
