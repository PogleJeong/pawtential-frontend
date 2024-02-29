회원가입 기능
======

# view 

- RegisterUser.js : 회원정보 가입
- ChoiceToRegisterPet.js : 반려동물정보 기입 or 홈페이지
- RegisterPet.js : 반려동물정보 기입(선택)
- Home.js 홈페이지

# RegisterUser.js

## form 

회원정보 폼.

- profile : 회원 프로필 (선택)
- id : 회원 ID, 중복확인
- password : 회원 Password
- password confirm : 회원 Password 재확인.
- email : 이메일, 중복확인
- username : 회원이름
- nickname : 회원닉네임
- birth : 생년월일 8자리
- sex : 성별, male / female

useNavigate 를 통해 다음 view 에 state 정보 전달

# ChoiceToRegisterPet.js

회원정보 등록 이후 추가로 반려동물 추가 할지 안할지 확인하는 페이지
URL 정보에서 state 값이 존재해야 해당 페이지 이동가능. 
state 값이 존재하지 않으면 RegisterUser.js 로 이동.

- 지금 등록 : 반려동물정보 입력 페이지로 이동
- 나중에 등록 : 로그인 페이지로 이동.


# RegisterPet.js

## form

반려동물 정보 폼.

URL 정보에서 state 값이 존재해야 해당 페이지 이동가능. 
state 값이 존재하지 않으면 RegisterUser.js 로 이동.

적어도 하나 이상의 반려동물 정보 입력 (복수가능)

- 




