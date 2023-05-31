# slack front

## 이슈 관련 정보

1. [2023-05-22] React.lazy() 활용시 Suspense 컴포넌트 fallback이 없으면 error

   - 18버전 이전에는 부분 지원, 18버전부터는 제대로 지원
   - lazy로 로드하는 컴포넌트 자체가 비동기적으로 로드하는 것이므로 Link to 같은 라우팅 컴포넌트를 사용할 때 fallback이 필요하다.
   - [Suspense with router React v18 docs](https://react.dev/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

2. [2023-05-23] 페이지 라우팅 (Link 컴포넌트)시 fallback으로 걸어둔 loading을 아예 안보이게 할 순 없을까?

   - 라우팅하는 과정에서 네트워크 탭으로 Slow 3G를 걸었을 때,fallback 컴포넌트가 보이는 게 UI적으로 별로이다.

## 설치 패키지

> 패키지 매니저: yarn  
> (D) : dev dependency

- react
- react-dom v6
- react-router-dom v6 (react-router과 react-router-dom은 v6부터 types를 따로 설치할 필요x)
- typescript
- eslint (D)
- prettier eslint-plugin-prettier eslint-config-prettier (D)
- axios (http 클라이언트)

### redux 사용하지 않는 이유

- 리덕스를 사용하면 비동기 코드를 컴포넌트랑 완전분리할 수 있다는 장점이 있다.(리덕스 사가 혹은 thunk를 통해서 가능)
  - 하지만, 굳이 비동기 코드를 컴포넌트랑 구별하지 않아도 되는 경우가 있음(한 컴포넌트 내에서만 사용하는 비동기 처리 코드 => 재활용이 필요x)
  - 리덕스를 사용하면 한 곳에서 컴포넌트과 분리된 로직과 스테이트를 관리하고 작성할 수 있지만 코드의 양이 방대해짐 필요에 따라서만 사용하면 된다.

### SWR 사용(redux대신의 전역상태관리툴)

- next.js 팀에서 만듦 => Next와 호환성 good(Next말고도 React에서도 잘 돌아감)
- 규모가 크지않고 초기단계에 도입했을 때, 어렵지않고 사용하기 편하다.
- optimistic UI 제공(uxui면과 dx면에서도 좋음)
  - 클라이언트에서 ui를 변경하고 이후에 서버에 요청을하고 해당 값을 변경하는데 이 과정에서 서버 통신에서 에러가 뜨면 다시 클라이언트 ui를 rollback하는 기능역시 제공한다.
  - 간단히 말하면 먼저 성공했을 시를 가정해서 ui를 업데이트하고 나중에 서버에서 실제 요청의 성공여부를 따지는 것, 실패할거라 생각하고 먼저 서버에 요청을 보내고 성공 시, 클라이언트에 반영하는 것을 pessimistic(비관적) UI이다.
  - e.g) 좋아요 버튼에 적용하기 좋을 듯

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

## CSS

- 이모션(emotion)

사용이유: 어차피 js로 다 만들기 때문에 css in js로 처리
styled-components도 있지만 이모션과 문법이 거의 비슷하고 emotion의 세팅이 좀 더 간단하다. 또한, SSR도 이모션이 더 능함

```bash
yarn add @emotion/react @emotion/styled
```

<b>이모션에서 babel 설정하기</b>

예를 들어, 이모션으로 만든 컴포넌트 Form 내부에 Input이라는 컴포넌트가 들어간다고 했을 때,이런 식으로 기능이 돌아가게 하려면 플러그인을 추가 설치해줘야 한다.

이모션으로 생성된 컴포넌트 명은 결국 해싱된 class명으로 바뀐다.
이 클래스명을 babel에 미리 알려주는 역할을 하여 위의 기능과 최적화를 가능하게 한다.

Allows an emotion component to be used as a CSS selector.

```javascript
export const Form = styled.from`
  margin: 0 auto;

  & ${Input} {
    //Form 컴포안의 Input 컴포에만 적용할 CSS
  }
`;
```

```bash
yarn add -D @emotion/babel-plugin
```

> CRA로 리액트 어플리케이션을 구성했다면 Babel macro를 사용하면 된다. -공식 홈페이지 참고-

이후, webpack config로 가서 env>development > plugins에 추가해준다.

- 보통 플러그인은 배열형태로 넣고, 두번째인자로 옵션 객체를 넘긴다. 공식문서보면 된다. [링크](https://emotion.sh/docs/@emotion/babel-plugin)

```javascript
  env: {
            development: {
              plugins: [['@emotion', { 옵션 }], require.resolve('react-refresh/babel')],
            },
          },
```

- webpack.config 대신 babelrc에 추가해주는 방법도 있다. ✅

```javascript
{
  "plugins": ["@emotion"]
}
```

with options (sourceMap만 사용)

```javascript
{
  "plugins": [
    [
      "@emotion",
      {
        // sourceMap is on by default but source maps are dead code eliminated in production
        "sourceMap": true
        // "autoLabel": "dev-only",
        // "labelFormat": "[local]",
        // "cssPropOptimization": true
      }
    ]
  ]
}

```
