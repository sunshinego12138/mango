type Merge<T, U> = {
  [K in keyof T | keyof U]: K extends keyof T
    ? K extends keyof U
      ? T[K] | U[K] // 如果两个类型都有该属性，则合并为联合类型
      : T[K] // 否则保持 T 中的类型
    : K extends keyof U
    ? U[K] // 否则保持 U 中的类型
    : never // 这行其实不会被执行
}

// 示例类型
type A = {
  name: string
  age: number
}

type B = {
  age: string // 与 A 中的 age 属性冲突
  gender: boolean
}

// 合并类型
type C = Merge<A, B>

// C 的类型为
// {
//   name: string;
//   age: string | number; // 合并后的属性
//   gender: boolean;
// }
