(function () {
  class TypewriterK {
    constructor(elementId) {
      this.textElement = document.getElementById(elementId);
      this.syllable = {
        initial: [
          "ㄱ",
          "ㄲ",
          "ㄴ",
          "ㄷ",
          "ㄸ",
          "ㄹ",
          "ㅁ",
          "ㅂ",
          "ㅃ",
          "ㅅ",
          "ㅆ",
          "ㅇ",
          "ㅈ",
          "ㅉ",
          "ㅊ",
          "ㅋ",
          "ㅌ",
          "ㅍ",
          "ㅎ",
        ],
        medial: [
          "ㅏ",
          "ㅐ",
          "ㅑ",
          "ㅒ",
          "ㅓ",
          "ㅔ",
          "ㅕ",
          "ㅖ",
          "ㅗ",
          "ㅘ",
          "ㅙ",
          "ㅚ",
          "ㅛ",
          "ㅜ",
          "ㅝ",
          "ㅞ",
          "ㅟ",
          "ㅠ",
          "ㅡ",
          "ㅢ",
          "ㅣ",
        ],
        final: [
          "",
          "ㄱ",
          "ㄲ",
          "ㄳ",
          "ㄴ",
          "ㄵ",
          "ㄶ",
          "ㄷ",
          "ㄹ",
          "ㄺ",
          "ㄻ",
          "ㄼ",
          "ㄽ",
          "ㄾ",
          "ㄿ",
          "ㅀ",
          "ㅁ",
          "ㅂ",
          "ㅄ",
          "ㅅ",
          "ㅆ",
          "ㅇ",
          "ㅈ",
          "ㅊ",
          "ㅋ",
          "ㅌ",
          "ㅍ",
          "ㅎ",
        ],
      };
    }

    decompoundMessage(message) {
      let decompoundedArray = [];
      let initial, medial, final;

      for (let i = 0; i < message.length; i++) {
        let letter = message[i];

        if (letter.charCodeAt(0) >= 0xac00 && letter.charCodeAt(0) <= 0xd7a3) {
          let temp = letter.charCodeAt(0) - 0xac00;

          final = temp % 28;
          medial = ((temp - final) / 28) % 21;
          initial = ((temp - final) / 28 - medial) / 21;

          decompoundedArray.push(this.syllable.initial[initial]);

          /*
          switch(parseInt(medial)){ 
            case 9 : 
              decompoundedArray.push('ㅗ');
              decompoundedArray.push('ㅏ');
              break; 
            case 10 : 
              decompoundedArray.push('ㅗ');
              decompoundedArray.push('ㅐ');
              break;
            case 11 : 
              decompoundedArray.push('ㅗ');
              decompoundedArray.push('ㅣ');
              break;
            case 14 : 
              decompoundedArray.push('ㅜ');
              decompoundedArray.push('ㅓ');
              break;
            case 15 : 
              decompoundedArray.push('ㅜ');
              decompoundedArray.push('ㅔ');
              break;
            case 16 : 
              decompoundedArray.push('ㅜ');
              decompoundedArray.push('ㅣ');
              break;
            case 19 : 
              decompoundedArray.push('ㅡ');
              decompoundedArray.push('ㅣ')
              break;  
            default : decompoundedArray.push(this.medial(medial));
          }
          */
          decompoundedArray.push(this.syllable.medial[medial]);

          if (final != 0x0000) {
            /*
            switch(parseInt(final)){ 
              case 3 : 
                decompoundedArray.push('ㄱ');
                decompoundedArray.push('ㅅ');
                break;
              case 5 : 
                decompoundedArray.push('ㄴ');
                decompoundedArray.push('ㅈ');
                break; 
              case 6 : 
                decompoundedArray.push('ㄴ');
                decompoundedArray.push('ㅎ');
                break;
              case 9 : 
                decompoundedArray.push('ㄹ');
                decompoundedArray.push('ㄱ');
                break; 
              case 10 : 
                decompoundedArray.push('ㄹ');
                decompoundedArray.push('ㅁ');
                break;
              case 11 : 
                decompoundedArray.push('ㄹ');
                decompoundedArray.push('ㅂ');
                break; 
              case 12 : 
                decompoundedArray.push('ㄹ');
                decompoundedArray.push('ㅅ');
                break;
              case 13 : 
                decompoundedArray.push('ㄹ');
                decompoundedArray.push('ㅌ');
                break;
              case 14 : 
                decompoundedArray.push('ㄹ');
                decompoundedArray.push('ㅍ');
                break;; 
              case 15 : 
                decompoundedArray.push('ㄹ');
                decompoundedArray.push('ㅎ');
                break;
              case 18 : 
                decompoundedArray.push('ㅂ');
                decompoundedArray.push('ㅅ');
                break;
              default : decompoundedArray.push(this.final(final)); 
            }
            */
            decompoundedArray.push(this.syllable.final[final]);
          }
        } else {
          decompoundedArray.push(letter);
        }
      }

      return decompoundedArray;
    }

    compoundPieces(pieces) {
      let letterCode = 0xac00;

      if (pieces.length === 2) {
        letterCode +=
          (this.syllable.initial.indexOf(pieces[0]) * 21 +
            this.syllable.medial.indexOf(pieces[1])) *
          28;
      } else {
        letterCode +=
          (this.syllable.initial.indexOf(pieces[0]) * 21 +
            this.syllable.medial.indexOf(pieces[1])) *
            28 +
          this.syllable.final.indexOf(pieces[2]);
      }

      return String.fromCharCode(letterCode);
    }

    backspace(textElement, speed = 130) {
      return new Promise(function (resolve, reject) {
        let text = textElement.textContent;
        let textLength = text.length;

        for (let i = 0; i < textLength; i++) {
          setTimeout(function () {
            let newTextLength = textLength - i;

            textElement.textContent = text.substr(0, newTextLength);

            if (i === textLength - 1) {
              resolve();
            }
          }, speed * i);
        }
      });
    }

    newType(message, speed = 85, bestBefore = 5000) {
      let helpBar = document.getElementById("help-bar");
      let newMessageBox = document.createElement("div");
      newMessageBox.classList.add("message-box");
      helpBar.appendChild(newMessageBox);

      let letterPiecesArray = this.decompoundMessage(message);

      let currentLetterPieces = [];
      let currentLetterIndex = 0;
      let typedString = "";
      let currentLetter = "";
      let isKorean = true;
      let isLastWordKorean = false;

      let comp = this.compoundPieces.bind(this);
      let backspace = this.backspace.bind(this);
      let syllable = this.syllable;

      for (let i = 0; i < letterPiecesArray.length; i++) {
        setTimeout(function () {
          const piece = letterPiecesArray[i];

          if (
            syllable.initial.indexOf(piece) >= 0 ||
            syllable.medial.indexOf(piece) >= 0 ||
            syllable.final.indexOf(piece) >= 0
          ) {
            isKorean = true;
          } else {
            isKorean = false;
          }

          if (isKorean) {
            currentLetterPieces.push(piece);

            if (currentLetterPieces.length === 1) {
              newMessageBox.textContent = `${typedString.concat(piece)}`;
            } else {
              currentLetter = comp(currentLetterPieces);

              newMessageBox.textContent = `${typedString.concat(
                currentLetter
              )}`;

              if (currentLetterPieces.length === 3) {
                typedString = typedString.concat(message[currentLetterIndex]);

                currentLetterPieces = [];

                if (currentLetter !== message[currentLetterIndex]) {
                  currentLetterPieces.push(piece);
                }

                currentLetterIndex++;
              }
            }
          } else {
            if (currentLetterPieces.length != 0) {
              currentLetter = comp(currentLetterPieces);
              typedString = typedString.concat(currentLetter).concat(piece);

              currentLetterIndex += 2;
              currentLetterPieces = [];
            } else {
              typedString = typedString.concat(piece);

              currentLetterIndex++;
            }

            newMessageBox.textContent = typedString;
          }

          if (i === letterPiecesArray.length - 1) {
            setTimeout(function () {
              backspace(newMessageBox).then(function () {
                helpBar.removeChild(newMessageBox);
              });
            }, bestBefore);
          }
        }, i * speed);
      }
    }
  }
})();

(function () {
  particlesJS.load(
    "network",
    "library/particles/particles.json",
    function () {}
  );

  let introAnim = new IntroAnimator();

  introAnim
    .dotAppear(2000)
    .then(function () {
      let prom = introAnim.subTitle("in", 1000);
      return prom;
    })
    .then(function () {
      let prom = introAnim.subTitle("out", 2000);
      return prom;
    })
    .then(function () {
      let prom = introAnim.newMessage(
        "우리는 때로 점에 대해 오해하곤 합니다.",
        "fade",
        "masked",
        1000,
        false,
        true
      );
      return prom;
    })
    .then(function (animData) {
      let dotProm = introAnim.moveDot("right", 500);
      let msgProm = introAnim.newMessage(
        "외로운 점 하나,",
        "masked",
        "masked-op",
        2300,
        true,
        true
      );
      introAnim.outMessage(animData, 2000);

      return Promise.all([dotProm, msgProm]);
    })
    .then(function (values) {
      introAnim.earthIn(2400);
      introAnim.moveDot("left", 500);
      let prom = introAnim.outMessage(values[1], 2300);

      return prom;
    })
    .then(function () {
      let prom = introAnim.newMessage(
        "작은 점 하나,",
        "masked-op",
        "masked",
        0,
        true,
        true
      );
      return prom;
    })
    .then(function (animData) {
      console.log(animData);
      let dotProm = introAnim.moveDot("center", 500, "left");
      let msgProm = introAnim.outMessage(animData, 2500);

      return Promise.all([dotProm, msgProm]);
    })
    .then(function () {
      let prom = introAnim.newMessage(
        "하지만 점은 사실,",
        "fade",
        "fade",
        1000,
        false,
        true
      );
      return prom;
    })
    .then(function (animData) {
      introAnim.dotDisappear(1300);
      introAnim.earthSizeDown(1000);
      let prom = introAnim.outMessage(animData, 5000);
      return prom;
    })
    .then(function () {
      let prom = introAnim.newMessage(
        "생각보다 거대한 존재입니다.",
        "fade",
        "fade",
        0,
        false,
        true
      );
      return prom;
    })
    .then(function (animData) {
      let prom = introAnim.outMessage(animData, 2000);
      return prom;
    })
    .then(function () {
      let prom = introAnim.newMessage(
        ["우주 속", "한 점인", "지구가", "거대하듯이,", 0.6],
        "fade",
        "fade-seq",
        0,
        false,
        true
      );
      return prom;
    })
    .then(function (animData) {
      let prom = introAnim.outMessage(animData, 2000);
      return prom;
    })
    .then(function () {
      let prom = introAnim.newMessage(
        ["점은", "무한한", "가능성입니다.", 0.6],
        "fade-seq",
        "fade-seq",
        0,
        false,
        true
      );
      return prom;
    })
    .then(function (animData) {
      let prom = introAnim.outMessage(animData, 3000);
      return prom;
    })
    .then(function () {
      let prom = introAnim.earthDisappear(1000);
      return prom;
    })
    .then(function () {
      introAnim.beatDot(2000);
      let prom = introAnim.newMessage(
        ["하늘을 달려", "소식을 전해주던", "북소리는", 2],
        "fade-seq",
        "fade-seq",
        2000,
        false,
        true
      );

      return prom;
    })
    .then(function (animData) {
      let prom = introAnim.outMessage(animData, 2500);
      introAnim.beatDone(7000);

      return prom;
    })
    .then(function () {
      introAnim.connection(2000);
      let prom = introAnim.newMessage(
        ["세상에", "퍼져 있던", "점과 점들을", "이어주고", 0.5],
        "fade-seq",
        "fade-seq",
        2000,
        false,
        true
      );

      return prom;
    })
    .then(function (animData) {
      introAnim.cutConnection(2000);
      let prom = introAnim.outMessage(animData, 3000);

      return prom;
    })
    .then(function () {
      let prom = introAnim.newMessage(
        ["세상을", "하나로", "연결해주었습니다.", 0.5],
        "fade-seq",
        "fade-seq",
        0,
        true,
        true
      );
      introAnim.networkOn(0);

      return prom;
    })
    .then(function (animData) {
      let prom = introAnim.outMessage(animData, 4000);
      introAnim.networkOff(6000);

      return prom;
    })
    .then(function () {
      let prom = introAnim.newMessage(
        ["점들은", "사람들의", "행복을", "지켜주고", 2],
        "fade-seq",
        "fade",
        2500,
        false,
        true
      );
      introAnim.trafficLight("red", 2000);
      introAnim.trafficLight("yellow", 4000);
      introAnim.trafficLight("green", 6000);

      return prom;
    })
    .then(function (animData) {
      let prom = introAnim.outMessage(animData, 2000);
      introAnim.trafficLight("off", 2000);

      console.log("done");
      return prom;
    })
    .then(function () {
      console.log("light on");
      introAnim.bigLightOn(0);
      let prom = introAnim.newMessage(
        "어둠을 밝혀주었으며",
        "masked",
        "masked",
        2000,
        true,
        true
      );

      return prom;
    })
    .then(function (animData) {
      let prom = introAnim.outMessage(animData, 2000);
      //introAnim.targetOn(2000);

      return prom;
    })
    .then(function () {
      console.log("target on");
      let prom = introAnim.targetOn(2000);

      return prom;
    })
    .then(function () {
      introAnim.targetOff(2000);
      introAnim.timelineOn(6000);
      let prom = introAnim.newMessage(
        "점은 모든 것의 시작이고,",
        "fade",
        "fade",
        8000,
        false,
        true
      );
      introAnim.timelineToTheEnd(10000);
      return prom;
    })
    .then(function (animData) {
      let prom = introAnim.outMessage(animData, 4000);

      return prom;
    })
    .then(function () {
      introAnim.timelineOff(2000);
      let prom = introAnim.newMessage(
        "모든 것의 끝입니다.",
        "fade",
        "fade",
        4000,
        false,
        true
      );

      return prom;
    })
    .then(function (animData) {
      introAnim.lastDot(2000);
      let prom = introAnim.outMessage(animData, 4000);

      return prom;
    })
    .then(function () {
      let prom = introAnim.newMessage(
        "점들은 모여 무엇인가를 해내고",
        "fade",
        "fade",
        2000,
        false,
        true
      );

      return prom;
    })
    .then(function (animData) {
      let prom = introAnim.outMessage(animData, 2000);

      return prom;
    })
    .then(function () {
      let prom = introAnim.newMessage(
        "세상을 발전시켰습니다",
        "fade",
        "fade",
        0,
        false,
        true
      );

      return prom;
    })
    .then(function (animData) {
      let prom = introAnim.outMessage(animData, 2000);

      return prom;
    })
    .then(function () {
      let prom = introAnim.newMessage(
        ["당신은,", "나는,", 2],
        "fade-seq",
        "fade",
        0,
        false,
        true
      );

      return prom;
    })
    .then(function (animData) {
      let prom = introAnim.outMessage(animData, 2000);

      return prom;
    })
    .then(function () {
      let prom = introAnim.newMessage(
        "점입니다",
        "fade",
        "fade",
        2000,
        false,
        true
      );

      return prom;
    })
    .then(function (animData) {
      let prom = introAnim.introToMain(4000, 4000);

      return prom;
    });
})();
