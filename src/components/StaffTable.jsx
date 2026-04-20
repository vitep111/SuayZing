import { useAppState } from '../state/AppStateContext'
import { computeStaffTotal } from '../state/calculations'
import { formatMoney } from '../utils/format'
import Card from './Card'
import NumberInput from './NumberInput'
import TextInput from './TextInput'

export default function StaffTable() {
  const { state, dispatch } = useAppState()
  const total = computeStaffTotal(state.staff)

  const update = (id, patch) => dispatch({ type: 'UPDATE_STAFF', id, patch })
  const remove = (id) => dispatch({ type: 'REMOVE_STAFF', id })
  const add = () => dispatch({ type: 'ADD_STAFF' })

  return (
    <Card
      id="staff"
      title="Staff"
      subtitle="Role × headcount × salary. Totals feed into fixed costs automatically."
      action={
        <button
          onClick={add}
          className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          + Add role
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-2 py-2 font-medium">Role</th>
              <th className="px-2 py-2 text-right font-medium">Headcount</th>
              <th className="px-2 py-2 text-right font-medium">Salary / head</th>
              <th className="px-2 py-2 text-right font-medium">Monthly cost</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {state.staff.length === 0 && (
              <tr>
                <td colSpan={5} className="px-2 py-6 text-center text-slate-400">
                  No roles yet. Click "Add role" to start.
                </td>
              </tr>
            )}
            {state.staff.map((r) => (
              <tr key={r.id} className="border-b border-slate-100">
                <td className="px-2 py-1">
                  <TextInput value={r.role} onChange={(v) => update(r.id, { role: v })} />
                </td>
                <td className="px-2 py-1">
                  <NumberInput
                    value={r.headcount}
                    onChange={(v) => update(r.id, { headcount: v })}
                    min={0}
                  />
                </td>
                <td className="px-2 py-1">
                  <NumberInput
                    value={r.salaryPerHead}
                    onChange={(v) => update(r.id, { salaryPerHead: v })}
                    min={0}
                  />
                </td>
                <td className="px-2 py-1 text-right tabular-nums text-slate-700">
                  {formatMoney(r.headcount * r.salaryPerHead)}
                </td>
                <td className="px-2 py-1 text-right">
                  <button
                    onClick={() => remove(r.id)}
                    className="rounded px-2 py-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Delete role"
                    title="Delete"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {state.staff.length > 0 && (
            <tfoot>
              <tr className="border-t border-slate-300 font-medium text-slate-900">
                <td className="px-2 py-2">Total</td>
                <td></td>
                <td></td>
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
