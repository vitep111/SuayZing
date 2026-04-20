import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../Card'
import { formatMoney, formatPercent } from '../../utils/format'

const PALETTE = [
  '#0f172a',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#a855f7',
  '#ef4444',
  '#6366f1',
  '#14b8a6',
]

const moneyTick = (v) => {
  const abs = Math.abs(v)
  if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${(v / 1_000).toFixed(0)}k`
  return `${v}`
}

const moneyTooltip = (v) => `${formatMoney(v)} THB`

function EmptyState({ label = 'Enter values above to see this chart.' }) {
  return (
    <div className="flex h-60 items-center justify-center text-center text-xs text-slate-400">
      {label}
    </div>
  )
}

function ChartFrame({ children }) {
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

export default function DashboardCharts({ model, monthlySeries }) {
  const { services, pnlMonthly } = model

  const hasRevenue = pnlMonthly.revenue > 0
  const sortedByRevenue = [...services]
    .filter((s) => s.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
  const sortedByMargin = [...services]
    .filter((s) => s.revenue > 0)
    .sort((a, b) => b.grossMargin - a.grossMargin)

  const costStructureData = [
    { name: 'Fixed costs', value: pnlMonthly.fixedCosts },
    { name: 'Variable (COGS)', value: pnlMonthly.cogs },
  ]
  const hasCosts = pnlMonthly.fixedCosts + pnlMonthly.cogs > 0

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card
        title="Cash flow projection"
        subtitle="Cumulative cash balance, ramp-up applied"
      >
        <ChartFrame>
          <LineChart data={monthlySeries} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis tickFormatter={moneyTick} tick={{ fontSize: 11 }} stroke="#94a3b8" width={56} />
            <Tooltip
              formatter={(v) => moneyTooltip(v)}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Line
              type="monotone"
              dataKey="cumulativeCash"
              name="Cash balance"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ChartFrame>
      </Card>

      <Card title="Monthly profit track" subtitle="Net profit per month (Year 1)">
        <ChartFrame>
          <BarChart data={monthlySeries} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis tickFormatter={moneyTick} tick={{ fontSize: 11 }} stroke="#94a3b8" width={56} />
            <Tooltip
              formatter={(v) => moneyTooltip(v)}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Bar dataKey="netProfit" name="Net profit" radius={[4, 4, 0, 0]}>
              {monthlySeries.map((m, i) => (
                <Cell key={i} fill={m.netProfit >= 0 ? '#10b981' : '#f43f5e'} />
              ))}
            </Bar>
          </BarChart>
        </ChartFrame>
      </Card>

      <Card title="Revenue mix" subtitle="Share of monthly revenue by service">
        {hasRevenue ? (
          <ChartFrame>
            <PieChart>
              <Pie
                data={sortedByRevenue}
                dataKey="revenue"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
              >
                {sortedByRevenue.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) =>
                  `${moneyTooltip(v)} · ${formatPercent(v / pnlMonthly.revenue)}`
                }
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
            </PieChart>
          </ChartFrame>
        ) : (
          <EmptyState />
        )}
      </Card>

      <Card title="Cost structure" subtitle="Fixed vs variable, monthly">
        {hasCosts ? (
          <ChartFrame>
            <BarChart data={costStructureData} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tickFormatter={moneyTick} tick={{ fontSize: 11 }} stroke="#94a3b8" width={56} />
              <Tooltip
                formatter={(v) => moneyTooltip(v)}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                <Cell fill="#0f172a" />
                <Cell fill="#0ea5e9" />
              </Bar>
            </BarChart>
          </ChartFrame>
        ) : (
          <EmptyState />
        )}
      </Card>

      <Card title="Gross margin by service" subtitle="Higher is better">
        {sortedByMargin.length > 0 ? (
          <ChartFrame>
            <BarChart
              layout="vertical"
              data={sortedByMargin}
              margin={{ left: 8, right: 16, top: 8, bottom: 0 }}
            >
              <CartesianGrid stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 1]}
                tickFormatter={(v) => `${Math.round(v * 100)}%`}
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
                width={110}
              />
              <Tooltip
                formatter={(v) => formatPercent(v)}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="grossMargin" radius={[0, 4, 4, 0]}>
                {sortedByMargin.map((s, i) => (
                  <Cell key={i} fill={s.grossMargin >= 0.4 ? '#10b981' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ChartFrame>
        ) : (
          <EmptyState />
        )}
      </Card>

      <Card title="Revenue contribution" subtitle="THB per month by service">
        {sortedByRevenue.length > 0 ? (
          <ChartFrame>
            <BarChart
              layout="vertical"
              data={sortedByRevenue}
              margin={{ left: 8, right: 16, top: 8, bottom: 0 }}
            >
              <CartesianGrid stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={moneyTick}
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
                width={110}
              />
              <Tooltip
                formatter={(v) => moneyTooltip(v)}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {sortedByRevenue.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartFrame>
        ) : (
          <EmptyState />
        )}
      </Card>
    </div>
  )
}
