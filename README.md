# Pawtenial Frontend

기존 진행했던 Pawtenial Frontend 프로젝트를 리빌드한 프로젝트입니다.

React 에 대한 추가학습을 진행하고, 기존 프로젝트에 적용하여 유지보수나 성능측면에서 더 유리할 수 있도록 작성하였습니다.

변경점에 대하여 markdown 로 정리하여 복습에도 활용할 수 있도록 사용하였습니다.

<hr>

큰 변경점

- form validation 변화 -> useForm 사용
- API 에 대한 구조 -> Server 에서 단순한 string 데이터를 주는 거싱 아니라, 정해진 response 객체를 전달.
- 세션 유지관련 -> 클라이언트 코드에서 제거, 서버에 전부 위임