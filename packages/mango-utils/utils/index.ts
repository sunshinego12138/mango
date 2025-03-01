/**
 * 从对象中排除指定的键，并返回一个新的对象。
 * @param obj - 原始对象。
 * @param keys - 需要排除的键的数组。
 * @returns 新的对象，不包含指定的键。
 */
export const omit = <T, TKeys extends keyof T>(obj: T, keys: TKeys[]): Omit<T, TKeys> => {
  if (!obj) return {} as Omit<T, TKeys>
  if (!keys || keys.length === 0) return obj as Omit<T, TKeys>
  return keys.reduce(
    (acc, key) => {
      delete acc[key]
      return acc
    },
    { ...obj },
  )
}
