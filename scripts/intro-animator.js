let elementFactory = {
  intro: {
    mainTitle: document.querySelector("#intro-main-title"),
    dot: document.querySelector("#intro-dot"),
    subTitle: {
      top: document.querySelector("#intro-sub-title-top"),
      bottom: document.querySelector("#intro-sub-title-bottom"),
    },
  },
};

class IntroAnimator {
  constructor() {}

  dotAppear(delay = 0) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        elementFactory.intro.mainTitle.classList.add("hidden-by-scale-down");
        elementFactory.intro.dot.classList.remove("hidden-by-scale-down");

        elementFactory.intro.dot.addEventListener("transitionend", function () {
          resolve();
        });
      }, delay);
    });
  }

  dotDisappear(delay = 0) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        elementFactory.intro.dot.classList.add("hidden-by-scale-down");

        elementFactory.intro.dot.addEventListener("transitionend", function () {
          resolve();
        });
      }, delay);
    });
  }

  subTitle(mode = "in", delay = 0) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (mode === "in") {
          elementFactory.intro.subTitle.top.classList.remove(
            "hidden-by-slide-right"
          );
          elementFactory.intro.subTitle.bottom.classList.remove(
            "hidden-by-slide-left"
          );
        } else if (mode === "out") {
          elementFactory.intro.subTitle.top.classList.add(
            "hidden-by-slide-right"
          );
          elementFactory.intro.subTitle.bottom.classList.add(
            "hidden-by-slide-left"
          );
        }

        elementFactory.intro.subTitle.bottom.addEventListener(
          "transitionend",
          function () {
            resolve();
          }
        );
      }, delay);
    });
  }

  newMessage(message, on, off, delay = 0, isCenterBox = false, isBlend = true) {
    let messageOn, messageOut, masked, animTarget;

    return new Promise(function (resolve, reject) {
      let messageBox;

      if (!isCenterBox) {
        messageBox = document.querySelector("#intro-message-box");
      } else {
        messageBox = document.querySelector("#intro-message-box-centered");
      }

      messageOn = true;
      messageOut = off;

      let el = document.createElement("div");

      if (isBlend) {
        messageBox.classList.add("blend-mo");
      }

      let inner = document.createElement("div");

      let animTargetTemp = [];

      if (on.indexOf("masked") !== -1 || off.indexOf("masked") !== -1) {
        masked = true;

        el.setAttribute("id", "message-mask-wrap");

        let mask = document.createElement("div");
        mask.setAttribute("id", "message-in-mask");
        mask.classList.add(`hidden-by-${on}`);
        animTarget = mask;

        inner.setAttribute("id", "message-out-mask");

        let text = document.createElement("div");
        text.setAttribute("id", "message-text");

        if (on.indexOf("fade-seq") !== -1 || off.indexOf("fade-seq") !== -1) {
          for (let i = 0; i < message.length; i++) {
            let seq = document.createElement("div");
            seq.classList.add("fade-sequence");
            seq.textContent = message[i];
            seq.setAttribute("style", `transition-delay: ${i * 0.3}s;`);

            if (on.indexOf("fade-seq") !== -1) {
              seq.classList.add("hidden-by-fade");
              animTarget.push(seq);
            } else {
              animTarget = mask;
            }

            text.appendChild(seq);
          }
        } else {
          text.textContent = message;
        }

        inner.appendChild(text);
        mask.appendChild(inner);
        el.appendChild(mask);
      } else if (
        on.indexOf("fade-seq") !== -1 ||
        off.indexOf("fade-seq") !== -1
      ) {
        animTarget = [];

        for (let i = 0; i < message.length - 1; i++) {
          let seq = document.createElement("div");
          seq.classList.add("fade-sequence");
          seq.textContent = message[i];
          seq.setAttribute(
            "style",
            `transition-delay: ${i * message[message.length - 1]}s;`
          );

          if (on.indexOf("fade-seq") !== -1) {
            seq.classList.add("hidden-by-fade");
            animTarget.push(seq);
          } else {
            animTargetTemp.push(seq);
          }

          el.appendChild(seq);
        }

        if (on.indexOf("fade-seq") === -1) {
          animTarget = el;
        }

        el.classList.add(`hidden-by-${on}`);
      } else {
        el.classList.add(`hidden-by-${on}`);
        el.textContent = message;
        animTarget = el;
      }

      let animArray = [];

      if (on.indexOf("fade") !== -1 || off.indexOf("fade") !== -1) {
        animArray.push({ style: "opacity: 1", transition: "opacity 1.25s" });
      }

      let styleCode = "";
      let transitionCode = "";

      for (let i = 0; i < animArray.length; i++) {
        styleCode += `${animArray[i].style}; `;

        if (i === animArray.length - 1) {
          transitionCode += `${animArray[i].transition}`;
        } else {
          transitionCode += `${animArray[i].transition} ,`;
        }
      }

      let finalStyleCode = `${styleCode} transition: ${transitionCode};`;

      if (on.indexOf("fade-seq") === -1) {
        animTarget.setAttribute("style", finalStyleCode);
      }

      messageBox.appendChild(el);

      setTimeout(function () {
        if (on.indexOf("fade-seq") !== -1) {
          for (let i = 0; i < animTarget.length; i++) {
            animTarget[i].classList.remove("hidden-by-fade");

            if (i === animTarget.length - 1) {
              animTarget[i].addEventListener("transitionend", function () {
                if (off.indexOf("fade-seq") === -1) {
                  if (
                    on.indexOf("masked") !== -1 ||
                    off.indexOf("masked") !== -1
                  ) {
                    animTarget = inner;
                  } else if (off.indexOf("fade") !== -1) {
                    for (let i = 0; i < animTarget.length; i++) {
                      animTarget[i].setAttribute(
                        "style",
                        "transition: opacity: 1.25s; transition-delay: 0;"
                      );
                    }
                  }
                }

                resolve({
                  target: animTarget,
                  off: messageOut,
                  el: messageBox.getAttribute("id"),
                });
              });
            }
          }
        } else {
          animTarget.classList.remove(`hidden-by-${on}`);

          animTarget.addEventListener("transitionend", function () {
            if (off.indexOf("fade-seq") !== -1) {
              animTarget = animTargetTemp;
            } else if (
              on.indexOf("masked") !== -1 ||
              off.indexOf("masked") !== -1
            ) {
              animTarget = inner;
            }

            resolve({
              target: animTarget,
              off: messageOut,
              el: messageBox.getAttribute("id"),
            });
          });
        }
      }, delay);
    });
  }

  outMessage(animData, delay = 0) {
    console.log(`out = ${animData.off}`);

    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (
          animData.off.indexOf("fade-seq") !== -1 ||
          (animData.off.indexOf("fade") !== -1 &&
            Array.isArray(animData.target))
        ) {
          console.log(animData.target);
          for (let i = 0; i < animData.target.length; i++) {
            animData.target[i].classList.add("hidden-by-fade");

            if (i === animData.target.length - 1) {
              animData.target[i].addEventListener("transitionend", function () {
                let messageBox = document.querySelector(`#${animData.el}`);

                messageBox.innerHTML = "";

                resolve();
              });
            }
          }
        } else {
          animData.target.classList.add(`hidden-by-${animData.off}`);

          animData.target.addEventListener("transitionend", function () {
            console.log(animData.el);
            let messageBox = document.querySelector(`#${animData.el}`);

            messageBox.innerHTML = "";

            resolve();
          });
        }
      }, delay);
    });
  }

  moveDot(direction, delay = 0, lastDirection = null) {
    return new Promise(function (resolve, reject) {
      let against;

      if (direction === "left") {
        against = "right";
      } else {
        against = "left";
      }

      setTimeout(function () {
        if (direction !== "center") {
          if (
            elementFactory.intro.dot.classList.value.indexOf(
              `move-to-${against}`
            )
          ) {
            elementFactory.intro.dot.classList.remove(`move-to-${against}`);
          }

          elementFactory.intro.dot.classList.add(`move-to-${direction}`);
        } else {
          elementFactory.intro.dot.classList.remove(`move-to-${lastDirection}`);
        }

        elementFactory.intro.dot.addEventListener("transitionend", function () {
          resolve();
        });
      }, delay);
    });
  }

  earthIn(delay = 0) {
    let earth = document.querySelector("#earth");

    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        earth.classList.remove("hidden-by-slide-right");

        earth.addEventListener("transitionend", function () {
          resolve();
        });
      }, delay);
    });
  }

  earthSizeDown(delay = 0) {
    let earth = document.querySelector("#earth");

    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        earth.classList.add("size-down");

        earth.addEventListener("transitionend", function () {
          resolve();
        });
      }, delay);
    });
  }

  earthDisappear(delay = 0) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        let earth = document.querySelector("#earth");
        earth.classList.add("hidden-by-fade");

        earth.addEventListener("transitionend", function () {
          resolve();
        });
      });
    });
  }

  beatDot(delay = 0) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        let glitch = document.querySelector("#glitch-wrap");
        glitch.classList.remove("no-display");

        resolve();
      }, delay);
    });
  }

  beatDone(delay = 0) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        let glitch = document.querySelector("#glitch-wrap");
        glitch.classList.add("hidden-by-fade");
        glitch.addEventListener("transitionend", function () {
          glitch.classList.add("no-display");

          resolve();
        });
      }, delay);
    });
  }

  connection(delay = 0) {
    setTimeout(function () {
      let connect = document.querySelector("#connect");

      connect.classList.remove("no-display");
      connect.classList.add("shrink");
    }, delay);
  }

  cutConnection(delay = 0) {
    setTimeout(function () {
      let connect = document.querySelector("#connect");

      connect.classList.add("hidden");
    }, delay);
  }

  networkOn(delay = 0) {
    setTimeout(function () {
      let network = document.querySelector("#network-wrap");

      network.classList.remove("no-display");
    }, delay);
  }

  networkOff(delay = 0) {
    setTimeout(function () {
      let network = document.querySelector("#network");
      network.classList.add("hidden-by-fade");
      network.addEventListener("transitionend", function () {
        network.setAttribute("style", "display: none;");
      });
    }, delay);
  }

  trafficLight(color, delay = 0) {
    setTimeout(function () {
      if (document.querySelector(".light-on") != null) {
        let recentLight = document.querySelector(".light-on");
        recentLight.classList.remove("light-on");
      }

      setTimeout(function () {
        if (color !== "off") {
          let targetLight = document.querySelector(`#${color}-light`);

          targetLight.classList.add("light-on");
        }
      }, 500);
    }, delay);
  }

  bigLightOn(delay = 0) {
    setTimeout(function () {
      let bigLight = document.querySelector("#target-wrap");

      bigLight.classList.remove("no-display");
    }, delay);
  }

  targetOn(delay = 0) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        let targetEach = document.querySelectorAll(".target-each");

        for (let i = 0; i < targetEach.length; i++) {
          targetEach[i].classList.remove("no-display");

          if (targetEach[i].getAttribute("id") === "target-edge") {
            targetEach[i].addEventListener("transitionend", function () {
              if (
                !document
                  .querySelector("#target-wrap")
                  .classList.contains("expand")
              ) {
                let targetText = document.querySelector("#target-text");

                targetText.classList.remove("no-display");

                targetText.addEventListener("transitionend", function () {
                  resolve();
                });
              }
            });
          }
        }
      }, delay);
    });
  }

  targetOff(delay = 0) {
    setTimeout(function () {
      let targetWrap = document.querySelector("#target-wrap");
      let targetEachs = document.querySelectorAll("#target-wrap .target-each");
      let targetText = document.querySelector("#target-text");

      let max = 1.5;
      for (let i = 0; i < targetEachs.length; i++) {
        let el = targetEachs[i];
        let old = el.getAttribute("style");
        el.setAttribute("style", old.replace(/(\d[.]\ds)/g, `${max}s`));
        console.log(el.getAttribute("style"));
        max = max - 0.25;
      }

      targetWrap.classList.add("expand");
      targetText.classList.add("no-display");
    }, delay);
  }

  timelineOn(delay = 0) {
    setTimeout(function () {
      let timelineWrap = document.querySelector("#timeline-wrap");

      timelineWrap.classList.remove("no-display");
    }, delay);
  }

  timelineToTheEnd(delay = 0) {
    setTimeout(function () {
      let timelineWrap = document.querySelector("#timeline-wrap");

      timelineWrap.classList.add("to-the-end");
    }, delay);
  }

  timelineOff(delay = 0) {
    setTimeout(function () {
      let timelineWrap = document.querySelector("#timeline-wrap");

      timelineWrap.classList.add("hidden");
    }, delay);
  }

  crossLineOn(delay = 0) {
    setTimeout(function () {
      let crossLine = document.querySelector("#cross-line-wrap");

      crossLine.classList.remove("no-display");
    }, delay);
  }

  crossLineOff(delay = 0) {
    setTimeout(function () {
      let crossLine = document.querySelector("#cross-line-wrap");

      crossLine.classList.add("hidden");
      crossLine.addEventListener("transitionend", function () {
        let pureBlackDot = document.querySelector("#pure-black-dot");

        pureBlackDot.classList.add("no-display");
      });
    }, delay);
  }

  lastDot(delay = 0) {
    setTimeout(function () {
      let targetWrap = document.querySelector("#intro-background-converser");

      targetWrap.classList.remove("no-display");
    }, delay);
  }

  introToMain(delay = 0, secDelay = delay) {
    setTimeout(function () {
      let intro = document.querySelector("#intro");

      intro.setAttribute("style", "display: none");

      setTimeout(function () {
        let welcomeMessage = document.querySelector("#welcome-message");
        let mainTitle = document.querySelector("#main-title");

        welcomeMessage.classList.add("no-display");
        mainTitle.classList.remove("no-display");
      }, secDelay);
    }, delay);
  }
}
