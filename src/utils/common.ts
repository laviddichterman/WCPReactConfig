import type {Dispatch, SetStateAction} from 'react';

export type ValSetVal<T> = { value: T, setValue: Dispatch<SetStateAction<T>> };
