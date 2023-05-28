import axios from 'axios';

const fetcher = (url: string) => {
  return axios.get(url, { withCredentials: true }).then((res) => {
    console.log('200 res from fetcher', res.data);
    return res.data;
  });
};

// ? 성공 시, res.data가 useSWR의 첫번째인자인 data로 들어간다.

export default fetcher;
