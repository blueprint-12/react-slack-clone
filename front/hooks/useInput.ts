import { useCallback, useState, SetStateAction, Dispatch } from 'react';

type Handler = (e: React.ChangeEvent<HTMLInputElement>) => void;
// 리턴타입을 명시하지않으니 가져다 쓸 때 OR(유니언 타입)으로 명시되길래 명시
type ReturnTypes<T> = [T, Handler, Dispatch<SetStateAction<T>>];

const useInput = <T = any>(initialData: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initialData);
  const handler: Handler = useCallback((e) => setValue(e.target.value as unknown as T), []);
  // 커스텀 훅 사용하여 가져올 때 위치중요
  return [value, handler, setValue];
};

export default useInput;
