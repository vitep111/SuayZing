export const formatNumber = (n, opts = {}) => {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    ...opts,
  }).format(n)
}

export const formatMoney = (n) => formatNumber(n)

export const formatPercent = (fraction, digits = 1) => {
  if (fraction === null || fraction === undefined || Number.isNaN(fraction)) return '—'
  return `${(fraction * 100).toFixed(digits)}%`
}

export const parseNumber = (str) => {
  if (typeof str === 'number') return str
  if (typeof str !== 'string') return NaN
  const cleaned = str.replace(/,/g, '').trim()
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return 0
  const n = Number(cleaned)
  return n
}
