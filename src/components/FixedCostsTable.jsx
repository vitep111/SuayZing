import { useAppState } from '../state/AppStateContext'
import { formatMoney } from '../utils/format'
import Card from './Card'
import NumberInput from './NumberInput'
import TextInput from './TextInput'

export default function FixedCostsTable() {
  const { state, dispatch } = useAppState()

  const update = (id, patch) => dispatch({ type: 'UPDATE_FIXED_COST', id, patch })
  const remove = (id) => dispatch({ type: 'REMOVE_FIXED_COST', id })
  const add = () => dispatch({ type: 'ADD_FIXED_COST' })

  const total = state.fixedCosts.reduce((s, c) => s + c.amount, 0)

  return (
    <Card
      id="fixed-costs"
      title="Other fixed costs"
      subtitle="Rent, utilities, marketing, loan repayment, equipment lease, etc. Add any line item."
      action={
        <button
          onClick={add}
          className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          + Add cost
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-2 py-2 font-medium">Item</th>
              <th className="px-2 py-2 text-right font-medium">Monthly amount</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {state.fixedCosts.length === 0 && (
              <tr>
                <td colSpan={3} className="px-2 py-6 text-center text-slate-400">
                  No fixed-cost lines yet.
                </td>
              </tr>
            )}
            {state.fixedCosts.map((c) => (
              <tr key={c.id} className="border-b border-slate-100">
                <td className="px-2 py-1">
                  <TextInput value={c.name} onChange={(v) => update(c.id, { name: v })} />
                </td>
                <td className="px-2 py-1">
                  <NumberInput
                    value={c.amount}
                    onChange={(v) => update(c.id, { amount: v })}
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 text-right">
                  <button
                    onClick={() => remove(c.id)}
                    className="rounded px-2 py-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Delete cost"
                    title="Delete"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {state.fixedCosts.length > 0 && (
            <tfoot>
              <tr className="border-t border-slate-300 font-medium text-slate-900">
                <td className="px-2 py-2">Total</td>
                <td className="px-2 py-2 text-right tabular-nums">{formatMoney(total)}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </Card>
  )
}
