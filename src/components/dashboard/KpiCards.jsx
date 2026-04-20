import { formatMoney, formatPercent } from '../../utils/format'

function Card({ label, value, sub, tone = 'neutral' }) {
  const toneClass =
    tone === 'good'
      ? 'text-emerald-600'
      : tone === 'bad'
        ? 'text-rose-600'
        : 'text-slate-900'
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className={`mt-1 text-2xl font-bold tabular-nums ${toneClass}`}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  )
}

const toneFor = (n) => (n > 0 ? 'good' : n < 0 ? 'bad' : 'neutral')

const formatPayback = (months) => {
  if (months == null) return 'N/A'
  if (months < 1) return '< 1 mo'
  return `${months.toFixed(1)} mo`
}

const formatRoi = (pct) => {
  if (pct == null || Number.isNaN(pct)) return '—'
  return `${pct.toFixed(1)}%`
}

export default function KpiCards({ model }) {
  const { pnlMonthly, kpis } = model
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      <Card
        label="Monthly revenue"
        value={`${formatMoney(pnlMonthly.revenue)} THB`}
      />
      <Card
        label="Gross profit"
        value={`${formatMoney(pnlMonthly.grossProfit)} THB`}
        sub={`${formatPercent(pnlMonthly.grossMargin)} margin`}
        tone={toneFor(pnlMonthly.grossProfit)}
      />
      <Card
        label="Net profit"
        value={`${formatMoney(pnlMonthly.netProfit)} THB`}
        sub="monthly"
        tone={toneFor(pnlMonthly.netProfit)}
      />
      <Card
        label="Net margin"
        value={formatPercent(pnlMonthly.netMargin)}
        tone={toneFor(pnlMonthly.netMargin)}
      />
      <Card
        label="Payback period"
        value={formatPayback(kpis.paybackMonths)}
        sub="months to recover startup"
        tone={
          kpis.paybackMonths == null
            ? 'bad'
            : kpis.paybackMonths > 24
              ? 'bad'
              : 'good'
        }
      />
      <Card
        label="Annual ROI"
        value={formatRoi(kpis.annualRoiPct)}
        sub="year 1"
        tone={toneFor(kpis.annualRoiPct)}
      />
    </div>
  )
}
