import { useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// ! emit: 서버로 데이터 보내기
// ! on: 서버에서 데이터 받기(이벤트리스너) => 서버에서 클라이언트로 보내는 이벤트(클라이언트는 on으로 받음)

const backURL = 'http://localhost:3095';
// ? 동시에 여러 워크스페이스에 들어갔을 때를 위해서 sockets[workspace] 형식을 사용

//TODO: 타입스크립트에서 빈객체나 빈배열은 타입핑을 해줘야 한다.
const sockets: { [key: string]: Socket } = {};
//TODO: 훅을 가져다 쓸 때, 에러가 난다면 리턴값의 타입도 정의
const useSocket = (workspace?: string): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      //TODO: 연결끊고나서 객체지워버리기(관리할 필요없음)
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }

  sockets[workspace] = io(`/ws-${workspace}`);
  sockets[workspace].on('connect', () => {
    console.log('socket상태: ', sockets[workspace].connected);
  });
  sockets[workspace].emit('hello', 'world');
  sockets[workspace].on('message', (data) => {
    console.log(data);
  });
  sockets[workspace].on('data', (data) => console.log(data));
  sockets[workspace].on('onlineList', (data) => {
    console.log(data);
  });

  return [sockets[workspace], disconnect];
};

export default useSocket;
