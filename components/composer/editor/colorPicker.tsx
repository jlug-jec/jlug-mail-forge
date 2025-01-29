interface ColorPickerProps {
    label: string
    value: string
    onChange: (value: string) => void
  }
  
  export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
    return (
      <div>
        <p>{label}</p>
        <input
          type="color"
          className="block w-full h-10 p-1 rounded-md"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }