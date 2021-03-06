# DEV DIARY
1. 서론
- 개발 전부터 작성했어야 했는데 또 타자부터 치고 말았다. 그 결과 코드가 너무 엉망이 되어서 지금(20.09.15)부터라도 작성합니다.
- 사이트 : <http://3.35.136.71:3000/> (상시 열려있지는 않습니다.)
2. 개발 진행
   1. JENKINS 연동
      > 20.09.18
      - 연동 실패. JENKINS가 빌드할 때는 계정이 달라져서 전역으로 사용되는 PM2실행시키지 못하여 서버에 접속을 할 수 없었음.. 어떻게 해결하면 좋을까 => 접속 권한을 su ubuntu로 해볼까? 비밀번호 치라고 할 것 같음..
      > 20.09.19
        - 연동 성공! jenkins에게 sudo 권한을 줘서 빌드 스크립트를 sudo pm2 start로 짰다.
          - ```sudo su``` 로 root로 진입.
          - ```cd /etc/sudoers.d``` 로 이동
          - ```sudo nano jenkins``` 로 새 설정 파일 생성
          - ```jenkins ALL=(ALL) NOPASSWD: ALL``` 를 입력해주고 편집
          - ```chmod 0440 jenkins``` 로 파일의 권한을 변경
          - 참조 : <http://labs.ssen.name/Server/Jenkins/Jenkins%EC%97%90%EC%84%9C%20sudo%20%EA%B6%8C%ED%95%9C%EC%9D%84%20%EC%8B%A4%ED%96%89%EC%8B%9C%ED%82%A4%EA%B8%B0.html/>
   2. 방금 상대가 둔 돌은 깜박거리도록 함
      > 20.09.19
        - animation을 사용하여 깜박거리도록 하였다. blink-animation이라는 속성을 만들어서 해당 속성에 정의된 것을 반복하여 수행하도록 한 것으로 보인다. class로 설정하였고 내가 돌을 뒀을 때는 상대방이 둔 돌의 깜박임은 멈추고 내 돌은 상대방이 깜빡거리는 것으로 볼 수 있도록 했다.
        - td 자체를 visible->hidden->visible을 반복하도록 했다. 그 결과 한 칸의 테두리까지 사라지는 것을 확인했다. 이를 해결하려면 td는 테두리를 검정색으로 하고 td 내부에 돌을 두는 칸을 따로 만들어서 테두리는 검정색을 유지해야 겠다. => 차후에 수정하도록 한다. 우선은 디자인 보다는 기능 구현을 우선으로 한다.
   3. 화면 사이즈(디바이스 크기)에 따라서 게임판 사이즈 변동되도록 수정
      > 20.09.24
        - @media를 통해서 화면의 크기에 따라 다르게 되도록 수정함. 다만 아직 좀 어설픔. 화면 크기에 따라서 크기가 바뀌도록 디자인이 필요하다고 느낌.
        - css도 전부 다 리팩토링 해야 할 필요가 있음. 처음에 디자인을 짜지 않아서 점점 엉망이 되고 있음.
        - 크롬 개발자도구에서 모바일 환경으로 디버깅 해볼 수 있음. 참고
   4. 로그인 기능 및 기보 저장
      > 20.09.28
        - mongo db 연동(간략히 연동만 함)
      > 20.10.04
        - 로그인 기능을 추가하려고 했는데 우선 중간점검 진행하여 UI수정 중(디바이스 크기 고려X)
        - index.js와 game.js로 나누기 위해서 간략히 짬
        - toast ui의 마크다운 viewer를 사용해서 index.js에서 dev_diary.md를 보여주려고 대강 구현
3. 개발 계획
- ~~젠킨스 연동하여 AWS EC2에 자동배포~~
- ~~방금 상대가 둔 돌은 깜빡거리도록 함~~
  - ~~내가 말을 두고 난 다음에는 깜빡거림이 사라져야 함~~
- index.js와 game.js로 나눠서 index.js에서 create버튼을 누르거나 들어갈 방을 클릭하면 game.js로 이동
- 화면 사이즈(디바이스 크기)에 따라서 게임판의 사이즈가 유동적으로 변할 수 있도록 수정
- 사용자 정보 및 기보 저장
  - mongodb를 사용해서 사용자 정보를 저장</br>
  ``` {json}
  { 
    ID: 'dgsoul',
    PWD: 'dfdasdfe',
    NICKNAME: '오목지존',
    games: ['game1', 'game2', 'game3']
  }
  ```
  - mongodb를 사용해서 경기 저장</br>
  ``` {json}
  {
    ID: 'game1',
    PLAYER: ['a', 'b'],
    WINNER: 'a',
    ISNORMAL: true,
    ERR: '',
    NOTAION: [[0,1], [0,2], [0,3]],
    STARTTIME: '2020-09-10 09:20:00',
    ENDTIME: '2020-09-10 09:30:00'
  }
  ```
- 게임 끝나도 계속 상대가 둔 곳이 깜빡이는 문제 수정 필요
- 채팅창 추가
- 시간제한 추가
- 방 정보, 세션 정보 등을 redis에 저장하여 한 사람이 연결이 끊겨도 1분 정도 기다린 후 다시 접속하면 게임을 이어서 할 수 있도록 개발
  - redis에 기보도 저장해야 할 듯
  - 방에 들어갈 때 세션 정보를 가지고 들어가야겠다
- 로그인 기능
- 승패 이력 저장
- 기보 저장
- 기보 리플레이
- react로 리팩토링
