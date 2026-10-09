# 생산 및 배포

ofa.js로 개발한 프로젝트는 정적 서버에 바로 배포하여 사용할 수 있습니다.

## 개발 환경

공식 [ofa Studio](https://core.noneos.com/?redirect=studio)를 사용하여 개발할 수 있으며, 이는 원클릭 프로젝트 생성 및 미리보기를 제공합니다.

당신은 또한 정적 서버를 직접 구축할 수 있습니다:

* Nginx 또는 Apache와 같은 정적 서버 소프트웨어 사용
* Node.js의 [http-server](https://www.npmjs.com/package/http-server) 모듈 사용
* 직접 편집기의 정적 서버 플러그인을 사용하여 미리보기

## 생산 환경

### 프로젝트 내보내기

만약 [ofa Studio](https://core.noneos.com/?redirect=studio)로 구축한 프로젝트를 사용 중이라면, 도구에 내장된 내보내기 기능을 바로 사용하면 됩니다.

수동으로 구축한 프로젝트라면, 프로젝트 폴더를 정적 서버에 직접 배포하면 됩니다. 개발 환경의 모드를 동일하게 유지하세요.

### 압축 난독화

프로덕션 환경에서는 일반적으로 압축 및 난독화 도구를 사용하여 파일 크기를 줄이고 로딩 속도를 높여야 합니다. [Terser CLI](https://terser.org/docs/cli-usage/)를 사용하여 압축 및 난독화를 수행할 수 있습니다.

명령줄 도구를 사용하고 싶지 않다면, [ofa build](https://builder.ofajs.com/)를 사용하여 온라인으로 파일 압축 및 난독화를 할 수 있습니다. 이 도구는 현재 베타 버전이며, 추후 ofa Studio에 통합될 예정입니다.

