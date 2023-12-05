# 이전 프로젝트

라이브러리를 사용하지 않고 일일히 form 에 대한 validation 을 작성하였다.

하지만 직접 validation 을 작성할 경우 너무 코드가 길어지고 지저분해진다. 

# 리빌드 

대표적인 form validation 라이브러리인 react-hook-form 을 사용하였다.

유저가 회원가입을 하는 것과 같이, 하나의 객체 데이터를 form 으로 작성할 시, useForm 만을 사용하여 form validation 을 할 수 있다.

하지만 여러개의 객체 데이터를 form validation 을 하기에는 useForm 으로는 한계가 있다.

그래서 같은 라이브러리 내 useFieldArray 를 사용하였다. API 공식페이지에 예제가 잘 나와있다.

