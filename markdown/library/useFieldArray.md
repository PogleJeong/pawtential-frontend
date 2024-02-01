CONTENT
======

# 배경

대표적인 form validation 라이브러리인 react-hook-form 을 사용하였다.

form 내의 input value 에 대하여 validation 하는데 useForm 은 훌륭하였다.

하지만 useForm 만으로는 반려동물 등록 기능을 완성하는데 문제가 있다.

form 내에 한마리의 반려동물 정보만 작성하여 백엔드로 전달하는 것은 쉽지만, 한 form 태그 내에서 다른 반려동물의 정보를 추가, 삭제하는 등의 복수개의 반려동물 정보를 넘기는데는 많은 코드가 필요하다.


이러한 여러 객체정보의 추가와 삭제를 쉽게 도와주는 API 를 같은 오픈소스에서 제공하고 있다.

# useFieldArray

useFieldArray 는 useForm 과 같이 사용해야한다.

useFieldArray 의 핵심인 fields 가 useForm 에서 지정한 defaultValues 속성에 영향을 받기 때문이다.

## fields

fields 는