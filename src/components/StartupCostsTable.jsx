import { useAppState } from '../state/AppStateContext'
import { computeStartup } from '../state/calculations'
import { STARTUP_CATEGORIES } from '../state/defaults'
import { formatMoney } from '../utils/format'
import Card from './Card'
import NumberInput from './NumberInput'
import TextInput from './TextInput'

function CategoryBlock({ category, items, total }) {
  const { dispatch } = useAppState()
  const update = (id, patch) =>
    dispatch({ type: 'UPDATE_STARTUP_ITEM', category: category.key, id, patch })
  const remove = (id) =>
    dispatch({ type: 'REMOVE_STARTUP_ITEM', category: category.key, id })
  const add = () => dispatch({ type: 'ADD_STARTUP_ITEM', category: category.key })

  return (
    <div className="rounded-lg border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{category.label}</h3>
          <p className="text-xs text-slate-500">Subtotal {formatMoney(total)} THB</p>
        </div>
        <button
          onClick={add}
          className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          + Add item
        </button>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={3} className="px-4 py-4 text-center text-xs text-slate-400">
                No items. Click "Add item" to start.
              </td>
            </tr>
          )}
          {items.map((it) => (
            <tr key={it.id} className="border-b border-slate-100 last:border-0">
              <td className="w-2/3 px-2 py-1">
                <TextInput value={it.name} onChange={(v) => update(it.id, { name: v })} />
              </td>
              <td className="px-2 py-1">
                <NumberInput
                  value={it.amount}
                  onChange={(v) => update(it.id, { amount: v })}
                  min={0}
                />
              </td>
              <td className="w-8 px-2 py-1 text-right">
                <button
                  onClick={() => remove(it.id)}
                  className="rounded px-2 py-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  aria-label="Delete item"
                  title="Delete"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function StartupCostsTable() {
  const { state } = useAppState()
  const startup = computeStartup(state)
  const diff = startup.capital - startup.total

  return (
    <Card
      id="startup"
      title="Startup costs"
      subtitle="One-off outlays by category. Grand total is compared against available capital below."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {STARTUP_CATEGORIES.map((cat) => (
          <CategoryBlock
            key={cat.key}
            category={cat}
            items={state.startupCosts[cat.key] ?? []}
            total={startup.byCategory[cat.key] ?? 0}
          />
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="text-slate-600">Total startup cost</span>
          <span className="tabular-nums font-semibold">{formatMoney(startup.total)} THB</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-200 py-2">
          <span className="text-slate-600">Available capital</span>
          <span className="tabular-nums">{formatMoney(startup.capital)} THB</span>
        </div>
        <div className="flex items-center justify-between pt-2 font-semibold">
          <span>{diff >= 0 ? 'Surplus' : 'Shortfall'}</span>
          <span
            className={`tabular-nums ${diff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
          >
            {formatMoney(Math.abs(diff))} THB
          </span>
        </div>
      </div>
    </Card>
  )
}
