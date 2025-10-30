import { type Dispatch, type SetStateAction } from 'react';

export type ValSetVal<T> = { value: T; setValue: Dispatch<SetStateAction<T>> };
export type ValField<T, field extends string> = { [K in field]: T; };
export type ValSetField<T, field extends string> = { [K in `set${Capitalize<field>}`]: Dispatch<SetStateAction<T>>; };
export type ValSetValNamed<T, field extends string> = ValField<T, field> & ValSetField<T, field>;

export function useIndexedState<S>(x: [S[], Dispatch<SetStateAction<S[]>>]) {
  return [x[0], (i: number) => (v: S) => {
    const cpy = x[0].slice();
    cpy[i] = v;
    x[1](cpy)
  }] as const;
};