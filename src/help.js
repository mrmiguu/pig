import './help.test'

export function pig(arr, buf) {
  buf = buf || 0

  if (!arr.length) return buf
  
  const [ r, ...tail ] = arr

  if (r === '1') return pig(tail)
  if (r === '-') return buf + pig(tail)
  return pig(tail, buf + Number(r))
}
