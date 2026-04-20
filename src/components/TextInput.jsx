export default function TextInput({ value, onChange, className = '', ...props }) {
  return (
    <input
      type="text"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded border border-transparent bg-transparent px-2 py-1 hover:border-slate-300 focus:border-slate-400 focus:bg-white focus:outline-none ${className}`}
      {...props}
    />
  )
}
