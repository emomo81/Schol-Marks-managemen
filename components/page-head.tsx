export function PageHead({ title, sub, actions }: {
  title: string;
  sub?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-[22px] gap-6">
      <div>
        <h1 className="font-serif font-semibold text-[32px] tracking-tight m-0 text-ink">{title}</h1>
        {sub && <div className="text-ink-3 text-[13.5px] mt-1">{sub}</div>}
      </div>
      {actions && <div className="flex gap-2 items-center">{actions}</div>}
    </div>
  );
}
