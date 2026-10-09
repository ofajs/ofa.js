# 페이지 전환 애니메이션

`pageAnime` 구성 항목은 페이지 전환 시의 전환 애니메이션 효과를 제어하여 사용자 경험을 향상시키는 데 사용됩니다.

## 기본 구성

`app-config.js`에서 페이지 전환 애니메이션을 설정합니다:

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

## 애니메이션 상태

페이지 전환 애니메이션에는 세 가지 상태가 포함됩니다:

| 상태 | 설명 | 트리거 시점 |
|------|------|----------|
| `current` | 현재 페이지 애니메이션 종료 후 스타일 | 페이지 전환 완료 후 |
| `next` | 새 페이지 진입 시 시작 스타일 | 새 페이지 진입 시작 시 |
| `previous` | 이전 페이지 이탈 시 목표 스타일 | 이전 페이지 이탈 시작 시 |### 상태 상세

**current（현재 상태）**- 페이지 전환이 완료된 후의 최종 스타일
- 일반적으로 페이지의 정상 표시 상태
- 예: `opacity: 1, transform: "translate(0, 0)"`

**next（다음 페이지 상태）**- 새 페이지 진입 시의 초기 스타일
- 새 페이지가 어디에서 진입을 시작할지 정의하는 데 사용
- 예: `opacity: 0, transform: "translate(30px, 0)"` 는 오른쪽에서 진입함을 나타냅니다

**previous（이전 페이지 상태）**- 이전 페이지가 떠날 때의 대상 스타일
- 이전 페이지가 어디로 가는지 정의하는 데 사용
- 예: `opacity: 0, transform: "translate(-30px, 0)"`는 왼쪽으로 떠나는 것을 나타냄

## 내장 애니메이션 효과

### 좌우 스와이프 (기본값)

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

효과 설명:- 새 페이지가 오른쪽에서 슬라이드 인(초기 위치는 오른쪽 30px, 투명도 0)
- 이전 페이지가 왼쪽으로 슬라이드 아웃(최종 위치는 왼쪽 -30px, 투명도 0)
- 마지막으로 두 페이지 모두 정상 위치로 돌아옴(투명도 1, 위치 0)

### 페이드 인/아웃

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
  },
  next: {
    opacity: 0,
  },
  previous: {
    opacity: 0,
  },
};
```

효과 설명:- 새 페이지가 투명에서 가시로 전환됩니다
- 기존 페이지가 가시에서 투명으로 전환됩니다
- 간결하고 우아한 앱 스타일에 적합

### 위아래 스와이프

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  next: {
    opacity: 0,
    transform: "translate(0, 30px)",
  },
  previous: {
    opacity: 0,
    transform: "translate(0, -30px)",
  },
};
```

효과 설명:- 새 페이지가 아래에서 슬라이드 인
- 기존 페이지가 위로 슬라이드 아웃
- 세로 스크롤 스타일의 앱에 적합

### 확대/축소 효과

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "scale(1)",
  },
  next: {
    opacity: 0,
    transform: "scale(0.8)",
  },
  previous: {
    opacity: 0,
    transform: "scale(1.2)",
  },
};
```

효과 설명:- 새 페이지가 작은 크기에서 정상 크기로 확대됩니다
- 기존 페이지는 정상 크기에서 확대되어 사라집니다
- 카드 스타일이나 모달 스타일의 애플리케이션에 적합합니다

### 뒤집기 효과

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "rotateY(0deg)",
  },
  next: {
    opacity: 0,
    transform: "rotateY(-90deg)",
  },
  previous: {
    opacity: 0,
    transform: "rotateY(90deg)",
  },
};
```

효과 설명:- 새 페이지가 왼쪽에서 뒤집혀 들어옵니다
- 기존 페이지는 오른쪽으로 뒤집혀 나갑니다
- 3D 효과가 필요한 앱에 적합

## 사용자 정의 애니메이션

### 여러 속성 결합

여러 CSS 속성을 조합하여 복잡한 애니메이션을 만들 수 있습니다:

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0) scale(1)",
  },
  next: {
    opacity: 0,
    transform: "translate(50px, 50px) scale(0.9)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-50px, -50px) scale(1.1)",
  },
};
```

### 다른 이징 함수 사용하기

```javascript
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 0)",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, 0)",
  },
};
```

## 지원되는 CSS 속성

`pageAnime`는 모든 CSS 애니메이션 가능 속성을 지원합니다:

### 자주 사용하는 속성

- `opacity` - 투명도 (0-1)
- `transform` - 변형
  - `translate(x, y)` - 이동
  - `scale(n)` - 확대/축소
  - `rotate(deg)` - 회전
  - `rotateX/Y(deg)` - 3D 회전
- `width` / `height` - 너비/높이
- `margin` / `padding` - 바깥 여백/안쪽 여백
- `background-color` - 배경색
- `border-radius` - 모서리 둥글기

### 주의사항

1. **성능 최적화**: `transform`과 `opacity`를 우선 사용하세요. 이들은 가장 좋은 성능을 제공합니다.
2. **레이아웃 스레싱 방지**: 레이아웃 재배치를 유발하는 속성(`width`, `height`, `margin` 등)의 사용을 피하세요.
3. **트랜지션 시간**: ofa.js는 자동으로 트랜지션 효과를 추가하며, 기본값은 300ms입니다.

## 전체 예시

<o-playground name="페이지 전환 애니메이션 예제" style="--editor-height: 500px">
  <code path="demo.html" preview>
    <template>
      <o-app src="./app-config.js"></o-app>
    </template>
  </code>
  <code path="app-config.js">
    // 앱 홈 페이지 주소
    export const home = "./home.html";
    // 페이지 전환 애니메이션 설정
    export const pageAnime = {
      current: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
      next: {
        opacity: 0,
        transform: "translate(30px, 0)",
      },
      previous: {
        opacity: 0,
        transform: "translate(-30px, 0)",
      },
    };
  </code>
  <code path="home.html" active>
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <p>{{val}}</p>
      <a href="./about.html" olink>Go to About</a>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
  <code path="about.html">
    <template page>
      <style>
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      <div style="padding: 8px;"> <button on:click="back()">Back</button> </div>
      <p> About <a href="https://ofajs.com" target="_blank">ofa.js</a></p>
      <script>
        export default async () => {
          return {
            data: {
              val: "Hello ofa.js App Demo",
            },
          };
        };
      </script>
    </template>
  </code>
</o-playground>

## 모범 사례

### 1. 애니메이션을 간결하게 유지

지나치게 복잡한 애니메이션은 피하고, 간결한 애니메이션 효과가 더 좋습니다:

```javascript
// ✅ 권장: 간결하고 효과적
export const pageAnime = {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};

// ❌ 비추천: 지나치게 복잡함
export const pageAnime = {
  current: {
    opacity: 1,
    transform: "translate(0, 0) rotate(0deg) scale(1)",
    borderRadius: "0",
  },
  next: {
    opacity: 0,
    transform: "translate(30px, 30px) rotate(45deg) scale(0.5)",
    borderRadius: "50%",
  },
  previous: {
    opacity: 0,
    transform: "translate(-30px, -30px) rotate(-45deg) scale(1.5)",
    borderRadius: "100%",
  },
};
```

### 2. 사용자 경험 고려

- 애니메이션 시간이 너무 길지 않게 합니다(200-400ms 권장)
- 사용자에게 어지러움을 유발하는 애니메이션은 피합니다
- 애니메이션이 부드럽고 끊김 없이 진행되도록 합니다

### 3. 다양한 기기 대응

저사양 기기에서는 애니메이션을 비활성화하거나 단순화하는 것을 고려할 수 있습니다:

```javascript
// 기기 성능 감지
const isLowEndDevice = navigator.hardwareConcurrency < 4;

export const pageAnime = isLowEndDevice ? {
  current: { opacity: 1 },
  next: { opacity: 0 },
  previous: { opacity: 0 },
} : {
  current: { opacity: 1, transform: "translate(0, 0)" },
  next: { opacity: 0, transform: "translate(30px, 0)" },
  previous: { opacity: 0, transform: "translate(-30px, 0)" },
};
```