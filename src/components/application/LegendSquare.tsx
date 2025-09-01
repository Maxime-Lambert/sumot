interface LegendSquareProps {
  label: string;
  className: string;
}

export default function LegendSquare({ label, className }: LegendSquareProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded border border-cell-border-default ${className}`}
      />
      <span className="text-xs mt-2 text-center">{label}</span>
    </div>
  );
}
