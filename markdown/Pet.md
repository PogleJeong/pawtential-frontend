# PET 관련 변경사항

## 1. 반려동물 등록

반려동물 등록시 useForm 을 사용한 form validation 작성. 더 많은 validation 작성

form validation 시 유효성 검사를 통과하지 못하면, alert 를 띄웠으나. 이제는 input 작성 후 떠날때 유효성 검사 메세지 생성

- 기존에는 정규식검사가 없었으나, 생성(10 자 이내 한글)
- 반려동물 생일 -> 반려동물 나이로 변경 :  사용자입장에서 정확한 반려동물의 생일까지 입력하라는 것은 좋지 않은 것 
- 성별 선택히 radio -> select 로 변경

## 2. 대표이미지 미리보기

input 에 대한 validation 등은 useForm 을 사용하였으나, input type=file 에 onChange 발생시(파일업로드) 위의 img 태그를 통하여 업로드한 이미지를 볼 수 있도록 함

- useRef 와 useForm 의 getValues 를 사용하여 img src 변경


```js
const imageRef = useRef([]);
return(
    /// fields.map((item, index)) 사용 :: fields (useForm)
    <img alt="대표이미지" ref={element => imageRef.current[index] = element} />
)
```

input type="file" 의 변경에 따라 img 태그의 src를 변경함.
input type="file" 에 onChange 이벤트추가
onChange 에서 해당하는 img 태그의 src 에 추가.


# 에러사항 적어놓기

여러블럭의 양식을 제출하는 기능을 만들면서 많은 시행착오를 거쳤다.

사용한 라이브러리는 다음과 같다.

## form validation : react-hook-form

이전 프로젝트에서는 오직 바닐라 자바스크립트만을 이용해서 FORM 에 작성된 데이터에 대한 Validation 을 진행하였다. 

이전 방식은 데이터검증을 위해서 많은 조건문이 사용되었기 때문에 많은 행의 코드가 작성되었다. 

또한 데이터 검증을 통과하지 못할때 마다. Event Listener를 통해 검증을 통과하지 못한 Input value 값을 표시하였기에 코드작성이 많아졌기에 가시성이 떨어지는 문제를 해결하기 위해서 useForm 을 활용하였다.



