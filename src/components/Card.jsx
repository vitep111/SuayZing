export default function Card({ id, title, subtitle, action, children }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className="px-5 py-4">{children}</div>
    </section>
  )
}
