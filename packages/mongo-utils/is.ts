export function isClass(value: any): boolean {
  return typeof value === 'function' && value.prototype && value.prototype.constructor === value
}
