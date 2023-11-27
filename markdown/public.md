# Public folder

웹 서비스를 이용하는 클라이언트들이 접근할 수 있는 파일을 모아두는 폴더이다.

react project 를 처음 만들면 public 폴더안에 html, png, ico 등 클라이언트가 접근할 수 있다.

클라이언트들은 public 폴더 내 파일을 서버로부터 받고 src 에 들어있는 실제 리액트 코드들은 서버로부터 다운받아 index.html 에 랜더링 되는 것이다. 따라서 클라이언트들은 실제 리액트 코드들은 모른다. 단지 index.html 에 랜더링된 html 요소들을 볼 뿐이다.

<hr>

[참고자료] (https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json)

## manifest.json 의 역할

manifest.json은 웹 애플리케이션에 대한 메타데이터를 제공하여 웹 애플리케이션을 다운로드할 수 있도록 하는 파일이다. 파일 내에는 애플리케이션 이름, 버전 번호, 사용될 아이콘 및 애플리케이션에 대한 다른 세부 정보와 같은 정보를 포함한다.

```js
// 리액트 프로젝트를 시작할때의 manifest.json
{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}

```
### name

- 필수옵션
- 브라우저 유저인터페이스에서 식별자로 사용(검색키워드).
- 구글 크롬이나 마이크로소프트 엣지환경에서는 45 character 로 제한.

### short name

- 선택옵션
- name 의 길이가 길때 사용됨.
- 12 character 를 초과하지 않아야함. short name 이 지정되지 않으면 name 을 사용


### icons

- 선택옵션
- key:value 의 object 사용, Array 형태의 object 를 통해 여러 아이콘 설정가능
- src, type, size 를 통해 아이콘에 대한 자세한 정보 작성가능.

### start_url

- 선택옵션(권장)
- 웹 애플리케이션을 시작할때 로드되는 기본 URL을 의미
- 상대적인 URL 작성 가능 ex) "../startpoint.html"

### display

- 선택옵션, 기본값 "Browser"
- 개발자가 선호하는 display 결정
- 클라이언트에게 보여지는 UI 의 범위를 변경할 수 있음

브라우저 환경에 따라 호환되는 것이 다름. 해당옵션이 지원되지 않는 다면 fullscreen → standalone → minimal-ui → browser 순으로 자동으로 옵션이 변경됨. browser 가 기본값.

### theme_color

- 웹 애플리케이션의 기본 테마 색상을 지정
- OS 에 따라 테마색상에 차이가 발생할 수 있음.

### background_color

- CSS 등의 Stylesheet 가 로드되기 전의 애플리케이션 배경색을 지정.
- UX(사용자경험)을 높이기 위해 사용되는 옵션으로 페이지 전환 시에 유용하게 사용할 수 있음.