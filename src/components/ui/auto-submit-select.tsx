"use client";

export function AutoSubmitSelect({
  name,
  defaultValue,
  options,
  className,
}: {
  name: string;
  defaultValue: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      onChange={(event) => {
        event.currentTarget.form?.requestSubmit();
      }}
      className={className}
    >
      {options.map((option) => (
        <option key={`${name}-${option.value}`} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}
