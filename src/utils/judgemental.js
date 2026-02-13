export function isRule(value) {
  if (value !== '') {
    return value ? 'on' : 'off'
  } else {
    return value
  }
}
