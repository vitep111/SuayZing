import { useAppState } from '../state/AppStateContext'
import { computeModel } from '../state/calculations'
import { formatMoney, formatPercent } from '../utils/format'
import Card from './Card'
import NumberInput from './NumberInput'

const ROWS = [
  { key: 'revenue', label: 'Revenue', fmt: formatMoney },
  { key: 'cogs', label: 'COGS', fmt: formatMoney },
  { key: 'grossProfit', label: 'Gross Profit', fmt: formatMoney, strong: true },
  { key: 'fixedCosts', label: 'OPEX', fmt: formatMoney },
  { key: 'ebitda', label: 'EBITDA', fmt: formatMoney, strong: true },
  { key: 'tax', label: 'Tax', fmt: formatMoney },
  { key: 'netProfit', label: 'Net Profit', fmt: formatMoney, strong: true },
  { key: 'netMargin', label: 'Net Margin %', fmt: formatPercent },
]

function GrowthInput({ year, value, onChange }) {
  return (
    <div className="mt-1 flex items-center justify-end gap-1 text-[11px] font-normal normal-case tracking-normal text-slate-500">
      <span>{year} YoY</span>
      <div className="w-14 rounded border border-slate-300 bg-white px-1 py-0.5">
        <NumberInput
          value={value * 100}
          onChange={(v) => onChange(v / 100)}
          fractionDigits={1}
          align="center"
          className="px-0 py-0 text-xs"
        />
      </div>
      <span>%</span>
    </div>
  )
}

export default function ProjectionTable() {
  const { state, dispatch } = useAppState()
  const { pnlAnnual } = computeModel(state)
  const { year1, year2, year3 } = pnlAnnual

  const setGrowth = (year, value) =>
    dispatch({ type: 'SET', path: ['growthRates', year], value })

  return (
    <Card
      id="projection"
      title="3-year projection"
      subtitle="Year-over-year growth is editable inline under Year 2 and Year 3. Numbers reflect the active scenario."
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2 text-left font-medium">Metric</th>
              <th className="px-3 py-2 text-right font-medium">
                <div>Year 1</div>
                <div className="mt-1 text-[11px] font-normal normal-case tracking-normal text-slate-400">
                  base year
                </div>
              </th>
              <th className="px-3 py-2 text-right font-medium">
                <div>Year 2</div>
                <GrowthInput
                  year="Y2"
                  value={state.growthRates.year2}
                  onChange={(v) => setGrowth('year2', v)}
                />
              </th>
              <th className="px-3 py-2 text-right font-medium">
                <div>Year 3</div>
                <GrowthInput
                  year="Y3"
                  value={state.growthRates.year3}
                  onChange={(v) => setGrowth('year3', v)}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr
                key={r.key}
                className={`${i < ROWS.length - 1 ? 'border-b border-slate-100' : ''} ${
                  r.strong ? 'font-semibold text-slate-900' : 'text-slate-700'
                }`}
              >
                <td className="px-3 py-2">{r.label}</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {r.fmt(year1[r.key])}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {r.fmt(year2[r.key])}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {r.fmt(year3[r.key])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
