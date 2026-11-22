# 리스트 렌더링

ofa.js에서 `o-fill` 컴포넌트는 강력한 리스트 렌더링 기능을 제공하여 배열 데이터를 여러 개의 유사한 요소로 효율적으로 렌더링할 수 있습니다. 이는 두 가지 주요 사용 방식을 지원합니다: 직접 렌더링과 템플릿 렌더링.

## o-fill 컴포넌트 소개

`o-fill`는 ofa.js에서 목록 렌더링을 위한 핵심 컴포넌트로, 배열 타입의 `value` 속성을 받아 배열의 각 항목에 대해 해당하는 DOM 요소를 생성합니다. 렌더링 과정에서 ofa.js는 배열의 변화를 자동으로 추적하며 효율적으로 DOM을 업데이트합니다.

### 주요 특징:

- **효율적인 업데이트**: 키 값을 통해 배열 변경 사항을 추적하여 변경이 필요한 부분만 업데이트합니다
- **인덱스 접근**: `$index`를 통해 현재 항목의 인덱스에 접근합니다
- **데이터 접근**: `$data`를 통해 현재 항목의 데이터에 접근합니다
- **호스트 접근**: `$host`를 통해 현재 컴포넌트 인스턴스에 접근하여 컴포넌트 메서드를 호출하거나 컴포넌트 데이터에 접근할 수 있습니다
- **상위 항목 접근**: 중첩된 `o-fill`에서 `$parent`를 통해 상위 항목의 데이터에 접근합니다
- **템플릿 재사용**: 명명된 템플릿을 사용하여 복잡한 목록 렌더링을 지원합니다

## 직접 렌더링

직접 렌더링은 가장 간단한 사용 방식으로, 템플릿 내용을 `o-fill` 태그 내부에 직접 작성합니다. 배열이 변경되면 `o-fill`은 각 데이터 항목에 해당하는 요소를 자동으로 생성합니다.

<o-playground name="o-fill - 직접 렌더링" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        ul { list-style: none; padding: 0; }
        li { padding: 8px; margin: 5px 0; background: #7e7e7e; border-radius: 4px; }
      </style>
      <h3>과일 목록</h3>
      <button on:click="addItem">과일 추가</button>
      <button on:click="removeItem">마지막 제거</button>
      <ul>
        <o-fill :value="fruits">
          <li> {{$index + 1}}. {{$data.name}} - 가격: ¥{{$data.price}} <button on:click="$host.removeItem($index)">삭제</button></li>
        </o-fill>
      </ul>
      <script>
        export default async () => ({
          data: { 
            fruits: [
              { name: "🍎 사과", price: 5 },
              { name: "🍊 오렌지", price: 6 },
              { name: "🍌 바나나", price: 3 }
            ],
            fruitIndex: 0,
          },
          proto: {
            addItem() {
              const fruitNames = ["🍇 포도", "🍓 딸기", "🥝 키위", "🍑 복숭아", "🥭 망고"];
              const name = fruitNames[this.fruitIndex % fruitNames.length];
              this.fruits.push({ 
                name: name, 
                price: Math.floor(Math.random() * 10) + 1 
              });
              this.fruitIndex++;
            },
            removeItem(index) {
              if (index >= 0 && index < this.fruits.length) {
                this.fruits.splice(index, 1);
                return;
              }
              this.fruits.length && this.fruits.pop();
            }
          }
        });
      </script>
    </template>
  </code>
</o-playground>

이 예제에서 우리는 볼 수 있습니다:- `$index`는 현재 항목의 인덱스를 나타냅니다(0부터 시작)
- `$data`는 현재 항목의 데이터 객체를 나타냅니다
- `$host`는 현재 컴포넌트 인스턴스를 나타내며, 컴포넌트 메서드를 호출하거나 컴포넌트 데이터에 접근하는 데 사용할 수 있습니다
- 배열이 변경되면 목록이 자동으로 업데이트됩니다

## 템플릿 렌더링

더 복잡한 목록 항목 구조를 위해 명명된 템플릿 방식을 사용할 수 있습니다. 템플릿을 `template` 태그에 정의한 후, `o-fill`에서 `name` 속성을 통해 참조합니다.

<o-playground name="o-fill - 템플릿 렌더링" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 10px; }
        .product-card { border: 1px solid #747474; border-radius: 8px; padding: 12px; margin: 10px 0; }
        .product-name { font-weight: bold; font-size: 1.1em; }
        .product-price { color: #832c22; font-weight: bold; }
        .product-desc { color: #929292; font-size: 0.9em; margin-top: 5px; }
      </style>
      <h3>상품 목록</h3>
      <button on:click="addProduct">상품 추가</button>
      <div class="products-container">
        <o-fill :value="products" name="product-template"></o-fill>
      </div>
      <template name="product-template">
        <div class="product-card">
          <div class="product-name">{{$data.name}}</div>
          <div class="product-price">¥{{$data.price}}</div>
          <div class="product-desc">{{$data.description}}</div>
          <small>일련번호: {{$index + 1}}</small>
        </div>
      </template>
      <script>
        export default async () => ({
          data: {
            products: [
              { name: "MacBook Pro", price: 12999, description: "전문 작업에 적합한 고성능 노트북" },
              { name: "iPhone 15", price: 5999, description: "최신형 스마트폰, 뛰어난 카메라 성능" },
              { name: "AirPods Pro", price: 1999, description: "무선 노이즈 캔슬링 이어폰, 우수한 음질" }
            ],
            productIndex: 0,
          },
          proto: {
            addProduct() {
              const productNames = ["iPad Air", "Apple Watch", "Magic Mouse", "Pro Display"];
              const productDescs = ["얇고 가벼운 태블릿", "스마트워치, 건강 모니터링", "인체공학적 디자인 마우스", "전문가용 모니터"];
              const name = productNames[this.productIndex % productNames.length];
              const desc = productDescs[this.productIndex % productDescs.length];
              this.products.push({
                name: name,
                price: Math.floor(Math.random() * 5000) + 1000,
                description: desc
              });
              this.productIndex++;
            }
          }
        });
      </script>
    </template>
  </code>
</o-playground>

## 중첩 리스트 렌더링

`o-fill`는 중첩 사용을 지원하며, 트리 메뉴, 분류 목록 등과 같은 복잡한 계층적 데이터 구조를 처리할 수 있습니다.

<o-playground name="o-fill - 중첩 목록 렌더링" style="--editor-height: 800px">
  <code>
    <template page>
      <style>
        :host {
          display: block;
          border: 1px solid red;
          padding: 10px;
        }
        .category {
          border-left: 3px solid #3498db;
          padding-left: 15px;
          margin: 10px 0;
        }
        .subcategory {
          border-left: 2px solid #9b59b6;
          padding-left: 15px;
          margin: 8px 0;
        }
        .item {
          padding: 5px 0;
          margin: 5px 0;
          color: #2c3e50;
        }
        h4 {
          margin: 10px 0 5px 0;
          color: #34495e;
        }
      </style>
      <h3>상품 분류 네비게이션</h3>
      <div class="navigation">
        <o-fill :value="categories" name="category-template"></o-fill>
      </div>
      <template name="category-template">
        <div class="category">
          <h4> {{$data.name}} </h4>
          <o-fill :value="$data.subcategories" name="subcategory-template"></o-fill>
        </div>
      </template>
      <template name="subcategory-template">
        <div class="subcategory">
          <strong>{{$data.name}}</strong>
          <o-fill :value="$data.items">
            <div class="item"> • {{$data}} </div>
          </o-fill>
        </div>
      </template>
      <script>
        export default async () => {
          return {
            data: {
              categories: [
                {
                  name: "전자제품",
                  subcategories: [
                    {
                      name: "휴대폰",
                      items: ["iPhone", "Android 휴대폰", "피처폰"]
                    },
                    {
                      name: "컴퓨터",
                      items: ["노트북", "데스크탑", "태블릿"]
                    }
                  ]
                },
                {
                  name: "가정용품",
                  subcategories: [
                    {
                      name: "주방용품",
                      items: ["냄비", "식기", "소형 가전"]
                    },
                    {
                      name: "침실용품",
                      items: ["침구", "옷장", "장식"]
                    }
                  ]
                },
                {
                  name: "의류 액세서리",
                  subcategories: [
                    {
                      name: "남성복",
                      items: ["티셔츠", "셔츠", "외투"]
                    },
                    {
                      name: "여성복",
                      items: ["원피스", "바지", "액세서리"]
                    }
                  ]
                }
              ]
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

위의 예제는 기본적인 중첩 목록 렌더링을 보여줍니다. 중첩된 `o-fill`에서 부모 항목의 데이터에 접근해야 하는 경우 `$parent`를 사용할 수 있습니다.

### $parent를 사용하여 상위 데이터 접근하기

> **버전 요구 사항**: `$parent` 기능은 ofa.js v4.7.0 이상 버전을 지원해야 합니다.

중첩된 `o-fill`에서 `$parent`를 사용하여 상위 항목의 데이터에 접근할 수 있습니다. `$parent`를 활성화하려면 중첩된 `o-fill`에 `:_$parent="$data"` 속성을 추가해야 합니다.

**중요 규칙:**- 첫 번째 계층 `o-fill`은 `_$parent`가 필요 없으며, `$host`를 사용하여 컴포넌트 데이터에 접근합니다
- 중첩된 `o-fill`(두 번째 계층부터)은 `:_$parent="$data"`를 사용하여 상위 데이터를 전달합니다
- `_$parent`는 `$data`만 허용하여 데이터 흐름을 명확하게 합니다

### $parent 사용 예시

아래 예시는 중첩된 `o-fill`에서 `$parent`를 사용하여 부모 항목의 데이터에 접근하는 방법을 보여줍니다:

<o-playground name="o-fill - $parent 사용 예제" style="--editor-height: 600px">
  <code>
    <template page>
      <style>
        :host { display: block; padding: 20px; }
        .category { background: #e3f2fd; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .item { background: #fff; padding: 8px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #2196f3; }
      </style>
      <h3>카테고리 목록</h3>
      <o-fill :value="categories">
        <div class="category">
          <h4>카테고리: {{$data.name}}</h4>
          <o-fill :value="$data.items" :_$parent="$data">
            <div class="item">
              <div>상품: {{$data}}</div>
              <div>소속 카테고리: {{$parent.name}}</div>
            </div>
          </o-fill>
        </div>
      </o-fill>
      <script>
        export default async () => {
          return {
            data: {
              categories: [
                {
                  name: "과일",
                  items: ["사과", "바나나", "오렌지"]
                },
                {
                  name: "채소",
                  items: ["토마토", "오이", "가지"]
                }
              ]
            }
          };
        };
      </script>
    </template>
  </code>
</o-playground>

이 간단한 예시에서:- **첫 번째 계층 o-fill**：카테고리 배열을 순회하며, `$data.name`은 카테고리 이름입니다.
- **중첩 o-fill**：`:_$parent="$data"`를 사용하여 상위 카테고리 데이터를 전달합니다.
- **$parent 접근**：중첩 계층에서 `$parent.name`을 통해 상위 카테고리 이름에 접근합니다.

## 성능 최적화 및 키 값 관리

빈번하게 업데이트되는 목록의 경우 `fill-key` 속성으로 고유 식별자를 지정하여 렌더링 성능을 향상시킬 수 있습니다.

```html
<!-- 사용자 정의 키-값을 사용하여 성능 향상 -->
<o-fill :value="items" fill-key="id">
  <div>{{$data.name}}</div>
</o-fill>
```

위의 예에서 `fill-key="id"`는 ofa.js에게 각 항목 데이터의 `id` 속성을 고유 식별자로 사용하도록 지시합니다. 이렇게 하면 배열 순서가 변경되어도 해당 요소를 올바르게 식별하고 업데이트할 수 있습니다.

## 리스트 렌더링 모범 사례

1. **이벤트 처리**: 리스트 항목에서 이벤트를 사용할 때 `$host`는 현재 컴포넌트 인스턴스를 가리키고, `$data`는 현재 항목 데이터를 가리킵니다.
2. **적절한 렌더링 방식 선택**: 간단한 리스트는 직접 렌더링을 사용하고, 복잡한 구조는 템플릿 렌더링을 사용합니다.
3. **성능 고려**: 대용량 리스트나 자주 업데이트되는 리스트의 경우 `fill-key`를 사용하여 키 값을 지정합니다.
4. **데이터 구조**: 배열의 각 항목이 유효한 데이터 객체인지 확인합니다.
5. **깊은 중첩 피하기**: 중첩을 지원하지만 과도한 중첩 단계는 피해야 합니다.
6. **$parent 올바르게 사용하기**:
   - 중첩된 `o-fill` 안에서만 `$parent`를 사용합니다.
   - `_$parent="$data"`를 반드시 사용하여 `$parent`를 활성화합니다.
   - 첫 번째 계층의 `o-fill`은 `$host`를 사용해 컴포넌트 데이터에 접근하고, `$parent`를 사용하지 않습니다.
   - `_$parent`는 `$data`만 허용하며, 다른 값을 전달하지 마십시오.

## 변수 사용 요약

`o-fill`에서 다양한 변수는 각기 다른 용도와 사용 시나리오를 가지고 있습니다:

| 변수 | 용도 | 사용 시나리오 | 예시 |
|------|------|----------|------|
| `$host` | 컴포넌트 인스턴스의 데이터와 메서드에 액세스 | 첫 번째 레이어 `o-fill` | `{{$host.totalAmount}}` |
| `$data` | 현재 반복 항목의 데이터 | 모든 레이어의 `o-fill` | `{{$data.name}}` |
| `$index` | 현재 항목의 인덱스 | 모든 레이어의 `o-fill` | `{{$index + 1}}` |
| `$parent` | 부모 항목의 데이터 | 중첩된 `o-fill`（두 번째 레이어부터） | `{{$parent.orderName}}` |### 데이터 액세스 계층 예시

```
컴포넌트 data (totalAmount, orders)
  │
  └─ 첫 번째 레이어 o-fill: :value="orders"
      │  $host를 사용하여 컴포넌트 데이터에 접근: {{$host.totalAmount}}
      │  $data를 사용하여 현재 주문에 접근: {{$data.orderName}}
      │
      └─ 두 번째 레이어 o-fill: :value="$data.items" :_$parent="$data"
          │  $parent는 첫 번째 레이어의 주문 데이터를 가리킴
          │  $data는 items의 각 항목
          │  접근 가능: {{$parent.orderName}}, {{$data.name}}
```

이러한 변수를 올바르게 사용하면 복잡한 중첩 목록 렌더링 시나리오를 쉽게 처리할 수 있습니다.