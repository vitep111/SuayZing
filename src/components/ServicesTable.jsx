import { useAppState } from '../state/AppStateContext'
import { computeModel } from '../state/calculations'
import { formatMoney, formatPercent } from '../utils/format'
import Card from './Card'
import NumberInput from './NumberInput'
import TextInput from './TextInput'

export default function ServicesTable() {
  const { state, dispatch } = useAppState()
  const { services, pnlMonthly } = computeModel(state)

  const update = (id, patch) => dispatch({ type: 'UPDATE_SERVICE', id, patch })
  const remove = (id) => dispatch({ type: 'REMOVE_SERVICE', id })
  const add = () => dispatch({ type: 'ADD_SERVICE' })

  return (
    <Card
      id="services"
      title="Services"
      subtitle="Revenue, COGS and monthly volume per service. Scenario multiplier applied to volume."
      action={
        <button
          onClick={add}
          className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          + Add service
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-2 py-2 font-medium">Service</th>
              <th className="px-2 py-2 text-right font-medium">Price / case</th>
              <th className="px-2 py-2 text-right font-medium">COGS / case</th>
              <th className="px-2 py-2 text-right font-medium">Volume / mo</th>
              <th className="px-2 py-2 text-right font-medium">Revenue / mo</th>
              <th className="px-2 py-2 text-right font-medium">GP / mo</th>
              <th className="px-2 py-2 text-right font-medium">GM %</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 && (
              <tr>
                <td colSpan={8} className="px-2 py-6 text-center text-slate-400">
                  No services yet. Click "Add service" to start.
                </td>
              </tr>
            )}
            {services.map((s) => (
              <tr key={s.id} className="border-b border-slate-100">
                <td className="px-2 py-1">
                  <TextInput
                    value={s.name}
                    onChange={(v) => update(s.id, { name: v })}
                  />
                </td>
                <td className="px-2 py-1">
                  <NumberInput
                    value={s.pricePerCase}
                    onChange={(v) => update(s.id, { pricePerCase: v })}
                    min={0}
                  />
                </td>
                <td className="px-2 py-1">
                  <NumberInput
                    value={s.cogsPerCase}
                    onChange={(v) => update(s.id, { cogsPerCase: v })}
                    min={0}
                  />
                </td>
                <td className="px-2 py-1">
                  <NumberInput
                    value={s.monthlyVolume}
                    onChange={(v) => update(s.id, { monthlyVolume: v })}
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 text-right tabular-nums text-slate-700">
                  {formatMoney(s.revenue)}
                </td>
                <td className="px-2 py-1 text-right tabular-nums text-slate-700">
                  {formatMoney(s.grossProfit)}
                </td>
                <td className="px-2 py-1 text-right tabular-nums text-slate-700">
                  {formatPercent(s.grossMargin)}
                </td>
                <td className="px-2 py-1 text-right">
                  <button
                    onClick={() => remove(s.id)}
                    className="rounded px-2 py-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Delete service"
                    title="Delete"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {services.length > 0 && (
            <tfoot>
              <tr className="border-t border-slate-300 font-medium text-slate-900">
                <td className="px-2 py-2">Total</td>
                <td></td>
                <td></td>
                <td className="px-2 py-2 text-right tabular-nums">
                  {formatMoney(pnlMonthly.totalCases)}
                </td>
                <td className="px-2 py-2 text-right tabular-nums">
                  {formatMoney(pnlMonthly.revenue)}
                </td>
                <td className="px-2 py-2 text-right tabular-nums">
                  {formatMoney(pnlMonthly.grossProfit)}
                </td>
                <td className="px-2 py-2 text-right tabular-nums">
                  {formatPercent(pnlMonthly.grossMargin)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </Card>
  )
}
