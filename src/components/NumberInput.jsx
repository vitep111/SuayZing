import { useState } from 'react'
import { formatNumber, parseNumber } from '../utils/format'

// Text input that displays comma-separated numbers when idle and plain
// digits while focused. Emits numeric onChange on every keystroke so
// downstream calculations stay reactive.
export default function NumberInput({
  value,
  onChange,
  className = '',
  align = 'right',
  fractionDigits = 0,
  min,
  ...props
}) {
  const [focused, setFocused] = useState(false)
  const [draft, setDraft] = useState('')

  const formatted = formatNumber(value, {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits > 0 ? fractionDigits : 0,
  })
  const idleDisplay = value === 0 ? '0' : formatted
  const display = focused ? draft : idleDisplay

  const alignClass =
    align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'

  return (
    <input
      type="text"
      inputMode="decimal"
      value={display}
      onFocus={(e) => {
        setDraft(String(value ?? 0))
        setFocused(true)
        e.target.select()
      }}
      onBlur={() => setFocused(false)}
      onChange={(e) => {
        const raw = e.target.value
        setDraft(raw)
        const parsed = parseNumber(raw)
        if (Number.isNaN(parsed)) return
        if (min !== undefined && parsed < min) return
        onChange(parsed)
      }}
      className={`w-full rounded border border-transparent bg-transparent px-2 py-1 tabular-nums hover:border-slate-300 focus:border-slate-400 focus:bg-white focus:outline-none ${alignClass} ${className}`}
      {...props}
    />
  )
}
