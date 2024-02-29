프로젝트 진행시 얻은 지식 정리
======

# 1. Object 에 동적할당되는 key 값 추가

본래 key 값 자체에 대한 동적할당이 불가했으나, ES6 2019 부터 가등하게 함.

{[key가 될 변수]: "value"} 처럼 사용됨.

```js
let object = {
    "abc1": "1",
    "abc2" : "2",
}

for(let i=3; i < 10; i++) {
    object.assign(`abc${i}`, i);
}

console.log(object);
```