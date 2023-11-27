# 리액트 프로젝트의 구조

이전 프로젝트에서는 프로젝트 구조에 대해서 깊이 생각하지 않게 작성하였다.
단순히 라우터와, 재사용하는 컴포넌트들로 나누었고, util 함수만 따로 구별해놓는 것으로 그쳤다. 하지만 리빌드프로젝트를 위해서 프로젝트 구조를 어떻게 구성하는 것이 좋을까에 대한 정리를 하고자 한다.

<hr>

**가장 중요한 점**

프로젝트를 시작하는 단계에서는 프로젝트 구조를 정하는 것이 의미가 없음. 차라리 하나의 폴더에 다 작성하고, 프로젝트가 충분히 커졌을때 파일을 옮기는 방식으로 진행하는 것이 보다 효율적임!

프로젝트가 진행됨에 따라 개발자는 작성한 코드들에 대한 생각을 가지게 되므로, 그때 구조를 고민하는 것이 좋음.

<br>


[참고] (https://ko.legacy.reactjs.org/docs/faq-structure.html)


**파일의 기능이나 라우트(경로)에 의한 분류**

```text
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

- 기능의 정의는 보편화시킬 수 없고, 개발자가 얼마나 기능을 세분화시킬 것인가에 따라 달라지 수 있다. 
- 사용자 의견을 통해 사용자들이 중요하게 생각하는 서비스의 구성요소(부분)을 고려하여 청사진을 그릴 수 있다.

<br><br>
**파일유형에 따른 분류**
```text
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

- 비슷한 파일끼리 묶어주는 방법.
- 비슷한 파일이라는 의미는 애플리케이션 내 역할에 따라

<hr>

**주의사항**

- 파일경로가 너무 깊어지는 것을 피해야 함. JS 는 프로젝트 구조가 너무 깊어지는 문제점이 발생할 수 있음. IMPORT 를 통해 컴포넌트가 업데이트될떄, 성능상 문제가 발생할 수 있음.

- 아주 특별한 이유가 있지 않으면, 3~4 정도의 깊이를 한계선으로 권장함.

