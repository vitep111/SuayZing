import { formatMoney, formatPercent } from '../../utils/format'

const Banner = ({ tone = 'warn', title, detail }) => {
  const toneClass =
    tone === 'bad'
      ? 'border-rose-200 bg-rose-50 text-rose-900'
      : 'border-amber-200 bg-amber-50 text-amber-900'
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${toneClass}`}>
      <div className="font-semibold">{title}</div>
      {detail && <div className="mt-0.5 text-xs opacity-90">{detail}</div>}
    </div>
  )
}

export default function SmartAlerts({ model }) {
  const { services, pnlMonthly, kpis, startup } = model
  const alerts = []

  const thinServices = services.filter(
    (s) => s.revenue > 0 && s.grossMargin < 0.4,
  )
  if (thinServices.length > 0) {
    alerts.push({
      key: 'thin-services',
      tone: 'warn',
      title: `${thinServices.length} service${thinServices.length > 1 ? 's' : ''} with gross margin below 40%`,
      detail: thinServices
        .map((s) => `${s.name} ${formatPercent(s.grossMargin)}`)
        .join(' · '),
    })
  }

  if (pnlMonthly.revenue > 0 && pnlMonthly.netMargin < 0.1) {
    alerts.push({
      key: 'net-margin',
      tone: 'warn',
      title: `Net margin is ${formatPercent(pnlMonthly.netMargin)} — below 10% benchmark`,
      detail: 'Raise prices, cut fixed costs, or improve service mix to widen the bottom line.',
    })
  }

  if (kpis.paybackMonths != null && kpis.paybackMonths > 24) {
    alerts.push({
      key: 'payback',
      tone: 'warn',
      title: `Payback period is ${kpis.paybackMonths.toFixed(1)} months (> 24)`,
      detail: 'Investors typically look for payback under two years.',
    })
  }

  if (startup.total > startup.capital && startup.total > 0) {
    alerts.push({
      key: 'capital',
      tone: 'bad',
      title: `Startup cost exceeds available capital by ${formatMoney(startup.shortfall)} THB`,
      detail: `Total startup ${formatMoney(startup.total)} THB vs capital ${formatMoney(startup.capital)} THB.`,
    })
  }

  if (alerts.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {alerts.map((a) => (
        <Banner key={a.key} tone={a.tone} title={a.title} detail={a.detail} />
      ))}
    </div>
  )
}
