# 마켓 플레이스

## 마켓 홈

- 검색기능 : 서버로부터 데이터를 가져옴.
- 필터기능 : 가져온 데이터로부터 필터.
- 무한스크롤기능 : 유튜브처럼 페이지 끝으로 스크롤하면 다음 마켓정보가 나옴.

## 마켓 홈 수정

- 전체, 나눔, 판매 분류 탭을 둚 - url 다름.
- 검색기능은 분류탭 안에서 검색됨.

======

사용된 Hook

useMatch : 현재 url 과 정확히 매치되는가
useQuery : api 사용시 fetch 를 통해 서버에서 가져온 데이터가 이미 존재하는 것이라면, 원래 있던 데이터를 가져옴.