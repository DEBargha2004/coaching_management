export type ArrayElementType<T> = T extends (infer U)[] ? U : never

export type ArrayElementTypeAsConst<T extends readonly unknown[]> = T[number]
