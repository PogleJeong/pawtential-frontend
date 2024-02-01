CONTENT
======


이전 프로젝트에서는 오직 바닐라 자바스크립트만을 이용해서 FORM 에 작성된 데이터에 대한 Validation 을 진행하였다. 

이전 방식은 데이터검증을 위해서 많은 조건문이 사용되었기 때문에 많은 행의 코드가 작성되었다. 

또한 데이터 검증을 통과하지 못할때 마다. Event Listener를 통해 검증을 통과하지 못한 Input value 값을 표시하였기에 코드작성이 많아졌기에 가시성이 떨어지는 문제를 해결하기 위해서 useForm 을 활용하였다. 

# 리빌드 

대표적인 form validation 라이브러리인 react-hook-form 을 사용하였다.

유저가 회원가입을 하는 것과 같이, 하나의 객체 데이터를 form 으로 작성할 시, useForm 만을 사용하여 form validation 을 할 수 있다.

하지만 여러개의 객체 데이터를 form validation 을 하기에는 useForm 으로는 한계가 있다.

그래서 같은 라이브러리 내 useFieldArray 를 사용하였다. API 공식페이지에 예제가 잘 나와있다.

# 참고

[useForm]()

validate 옵션은 작성한 순서대로 validate 한다.

```js
<input id="regi__birth"
    {...register("birth", {
        required: "생년월일을 입력해주세요",
        maxLength: {
            value: 8,
            message: "생년월일은 8글자 이어야합니다.",
        },
        validate: {
            equalLength: value => value.length === 8 || "생년월일은 8자리입니다.",
            onlyNumber: value => !isNaN(value) || "오직 숫자만 입력해야합니다.",
            isPrevious: (value) => {
                let birthday = new Date();
                birthday.setFullYear(parseInt(value.substring(0, 4)));
                birthday.setMonth(parseInt(value.substring(4, 6)));
                birthday.setDate(parseInt(value.substring(6)));

                return Date.now() - birthday.getTime() > 0 || "현재보다 이후의 시간입니다."
            }
        }
    })}
    maxLength="8"
/>
```

## form validation - useFieldArray 사용시

form 에 전달할 객체정보가 단일이 아니라 여러개일때 발생한 문제

### errors message 표시에 대해

현재 프로젝트에서는 여러마리의 반려동물정보를 넘기기 위해 useFieldArray 를 통해 여러 반려동물의 정보입력항목을 추가하고 삭제하였다. 이때 고민한 문제에 대해 정리한다.

#### errors 항목에 대해

```js
errors {
    pet:[  // array 형태
        image: {
            type: 'required',
            message: '반려동물의 대표이미지를 선택해주세요',
            ref: ...
        },
        name: {
            type: 'pattern',
            message: '10글자 이내 한글만 가능합니다',
        }
    ]
}
```

주의사항

1. 첫 랜더링시 errors 에는 pet 이 존재하지만, pet 은 빈값이므로 index에 접근할수없다. 따라서 error 메세지를 보내는 컴포넌트는 해당 errors.pet 의 index 로 접근하려하면 에러가 발생한다. 이럴때는 "?." 연산자를 사용한다. index가 존재하는가? 에 대한 판별을 해준다.
단 index에 대한 "?." 연산자는 다음과 같이 사용한다

```js
{errors.pet?.[index].name && <small>{errors.pet[index].name.message}</small>}
{errors.pet?.[index].introduce && <small>{errors.pet[index].introduce.message}</small>}
```

## getValue 에 대해

getValue 는 register 에 등록된 값을 가져온다. 이를 활용하기 위해선 언제 register 에 input value 가 등록되는지를 알아야한다.

register 에 등록되는 때를 설정하기 위해서는 useForm 이 언제 validation 을 진행하는가에 따라 달려있다.

```js
 const {
        register,
        handleSubmit,
        formState: { errors },
        getValues, // 현재 register 에 등록된 input value 값 가져오기
    } = useForm({
        mode: "onSubmit"
    });

 <form onSubmit={handleSubmit(submitForm)}>
<h2>REGISTER LIST</h2>
<ul>
    <li>
        <label htmlFor="regi__profile">Profile 설정하기</label>
        <input type="file" id="regi__profile" 
            {...register("profile")}
        />
        {getValues("profile") && <span>설정하지 않으면 기본이미지가 설정됩니다.</span>}
    </li>
    <li>
        <label htmlFor="regi__id">ID</label>
        <input id="regi__id"
            {...register("id", {
                required: "ID 를 입력해주세요",
                pattern: /^[a-z0-9_-]{6,20}$/,
                validate: {
                    check: () => isCheckId || "ID 중복을 확인해주세요"
                }
            })}
        />
        <button type="button" onClick={checkId}>중복확인</button>
        {errors?.id && <small>{errors.id.message}</small>}
    </li>
```

useForm 에서 mode: "onSubmit" 을 설정하면, form 제출 이후 input value 들이 register 에 등록되어서 validation 을 진행한다.

## defaultValues 에 대해서

useForm 사용시 기본적으로 form input 들에 들어갈 기본값들을 설정한다. 공식 리액트 문서에서는 기본값들을 설정하는 것을 권장하고 있다. 따라서 특별한 기본값을 주지 않더라고 빈값을 명시해두는 것이 좋다.

useState(""), useRef(null) 처럼 기본값을 설정하는 것이다.