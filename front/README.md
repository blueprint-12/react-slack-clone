# 설치 패키지

> 패키지 매니저: yarn  
> (D) : dev dependency

- react
- react-dom v6
- react-router-dom v6 (react-router과 react-router-dom은 v6부터 types를 따로 설치할 필요x)
- typescript
- eslint (D)
- prettier eslint-plugin-prettier eslint-config-prettier (D)

## webpack 설정시 추가 패키지

```bash
yarn add -D webpack-dev-server
```

## 세팅 파일 만들기

> 내용은 주로 한번 만들어놓고 세팅값을 재활용해서 쓴다.

1. .eslintrc
2. .prettierrc
3. tsconfig.json (TS사용시)
4. webpack.config.ts
