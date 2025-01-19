export function isClass(value: any): boolean {
  return typeof value === 'function' && value.prototype && value.prototype.constructor === value
}

export function isFunction(value: any): boolean {
  return typeof value === 'function'
}

export function isString(value: any): boolean {
  return typeof value === 'string'
}

export function isNumber(value: any): boolean {
  return typeof value === 'number'
}

export function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null
}

export function isBoolean(value: any): boolean {
  return typeof value === 'boolean'
}

export function isUndefined(value: any): boolean {
  return typeof value === 'undefined'
}

export function isNull(value: any): boolean {
  return typeof value === 'object' && value === null
}

export function isArray(value: any): boolean {
  return Array.isArray(value)
}

export function isSymbol(value: any): boolean {
  return typeof value === 'symbol'
}

export function isDate(value: any): boolean {
  return value instanceof Date
}

export function isRegExp(value: any): boolean {
  return value instanceof RegExp
}

export function isArguments(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Arguments]'
}

export function isBuffer(value: any): boolean {
  return Buffer.isBuffer(value)
}
