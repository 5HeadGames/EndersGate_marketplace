/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingOutlined } from "@ant-design/icons";
import { videoPath } from "@shared/utils/videos";
import clsx from "clsx";
import Script from "next/script";
import React from "react";
import AnimatedPackCard from "./AnimatedPackCard";
import { ScriptVideo } from "./ScriptVideo";

export const PackOpening = ({
  cards,
  setNoAudio,
  arrayPacks,
  updateBalance,
  animating,
  openPack,
  cardsPack,
  isLoading,
  videoPlaying,
  setVideoPlaying,
  cardToOpen,
  startFlashing,
  setStartFlashing,
  startFlashingPack,
  setStartFlashingPack,
  video,
  packAnimation,
  endPackOpening,
  show,
  openingPack,
}: any) => {
  const vidRef4 = React.useRef<any>(null);
  const [spine, setSpine] = React.useState(null);
  // const [player, setPlayer] = React.useState(null);
  const [player0, setPlayer0] = React.useState(null);
  const [player1, setPlayer1] = React.useState(null);
  const [player2, setPlayer2] = React.useState(null);
  const [player3, setPlayer3] = React.useState(null);

  React.useEffect(() => {
    const audio: any = document.getElementsByClassName("videoPack");
    if (audio) {
      for (const element of audio) {
        element.volume = 0.3;
      }
    }
  }, [video]);

  React.useEffect(() => {
    if (startFlashing === true) {
      setTimeout(() => {
        setStartFlashing(false);
      }, 4000);
    }
  }, [startFlashing]);

  React.useEffect(() => {
    if (startFlashingPack === true) {
      setTimeout(() => {
        setStartFlashingPack(false);
      }, 2000);
    }
  }, [startFlashingPack]);

  const getPlayerSelected = (packAnimation: any) => {
    switch (packAnimation) {
      case 0:
        return player0;
      case 1:
        return player1;
      case 2:
        return player2;
      case 3:
        return player3;
      default:
    }
  };

  const handlePlayVideo = () => {
    const player = getPlayerSelected(packAnimation);
    console.log("play");
    player?.play();
    vidRef4?.current?.play();
    setTimeout(() => {
      endPackOpening();
    }, 3650);
    setTimeout(() => {
      player?.pause();
    }, 5450);
  };

  React.useEffect(() => {
    if (spine) {
      for (let i = 0; i < 4; i++) {
        new spine.SpinePlayer(`animation-${i}`, {
          jsonUrl: `/animations/Json/${videoPath(i)}.json`,
          atlasUrl: `/animations/Json/${videoPath(i)}.atlas`,
          viewport: {
            x: -0,
            y: -1080,
            width: 1920,
            height: 1080,
            padLeft: "0%",
            padRight: "0%",
            padTop: "0%",
            padBottom: "0%",
          },
          showControls: true,
          backgroundColor: "#2d1541",
          // eslint-disable-next-line no-loop-func
          success: function (player) {
            switch (i) {
              case 0:
                setPlayer0(player);
                break;
              case 1:
                setPlayer1(player);
                break;
              case 2:
                setPlayer2(player);
                break;
              case 3:
                setPlayer3(player);
                break;
              default:
            }
          },
          error: function (player, reason) {
            alert(reason);
          },
        });
      }
    }
  }, [spine]);

  React.useEffect(() => {
    const player = getPlayerSelected(packAnimation);
    if (
      video &&
      videoPlaying === 1 &&
      player.assetManager.isLoadingComplete()
    ) {
      handlePlayVideo();
    }
  }, [video, videoPlaying, player0, player1, player2, player3]);

  return (
    <div
      className={clsx(
        "w-full h-[calc(100vh-55px)] relative overflow-hidden md:block hidden",
      )}
      style={{ backgroundColor: "#111" }}
    >
      <ScriptVideo setSpine={setSpine} />
      <div
        className={clsx(
          { hidden: video },
          "md:absolute flex md:gap-40 gap-10 justify-center items-center md:top-10 md:mt-0 mt-6 md:h-12 h-8 left-0 right-0 m-auto text-center",
        )}
      >
        <img
          className={clsx("titlePacks", "h-full cursor-pointer z-50")}
          // onClick={() => {
          //   setCardPack(0);
          // }}
          src="./videos/packVideos/mypacks.png"
          alt="my packs title"
        />
        <img
          className={clsx("titlePacks", "h-full cursor-pointer z-50")}
          onClick={() => {
            show();
          }}
          src="./videos/packVideos/historyDesktop.png"
          alt="history title"
        />
      </div>
      <div className="absolute left-0 right-0 mx-auto z-0 flex items-center justify-center w-full  bgPackContainer">
        {!video && (
          <img
            src="./videos/bgPackNoOpen.png"
            className={clsx("bgPackImage z-0")}
            alt=""
          />
        )}
      </div>
      <div className="absolute top-0 left-0 right-0 mx-auto flex items-center justify-center w-full h-full bgPackContainer">
        {!video && (
          <img
            src="./videos/packVideos/borderDesktop.png"
            className={clsx("w-full h-full z-40 hidden md:block")}
            alt=""
          />
        )}
      </div>
      <div
        className={clsx(
          "w-full h-[calc(100vh-55px)] flex md:items-center md:justify-center relative",
        )}
      >
        <>
          <div
            className={clsx(
              { "!hidden": !video },
              "w-full h-full md:block hidden",
            )}
          >
            {new Array(4).fill(false).map((item, i) => {
              return (
                <div
                  id={`animation-${i}`}
                  className={clsx(
                    {
                      hidden:
                        packAnimation !== i || videoPlaying === -1 || !video,
                    },
                    { "z-[100000]": videoPlaying !== 3 },
                    "h-full w-full top-0 left-0 absolute",
                  )}
                ></div>
              );
            })}
            <video
              ref={vidRef4}
              className={clsx(
                { "!hidden": videoPlaying === -1 || !video },
                { relative: videoPlaying === 3 },
                "h-full z-0",
              )}
              src="./videos/packVideos/Comp.mp4"
            ></video>
          </div>
          <div
            className={clsx(
              {
                hidden:
                  !video ||
                  getPlayerSelected(
                    packAnimation,
                  )?.assetManager?.isLoadingComplete(),
              },
              "absolute top-0 bottom-0 left-0 right-0 m-auto flex items-center justify-center z-50",
            )}
          >
            <LoadingOutlined className="text-4xl text-white" />
          </div>
          {video ? (
            <></>
          ) : arrayPacks && arrayPacks.length !== 0 ? (
            <>
              <div
                className={clsx(
                  "flex items-center justify-start relative containerPacks maxWscreen",
                )}
              >
                <div
                  id="container"
                  className={clsx(
                    !animating ? "overflow-x-scroll w-full" : "overflow-hidden",
                    "flex gap-10 items-center z-40 justify-start md:mx-10 md:px-6 p-8 md:h-screen h-40",
                  )}
                  onWheel={(e) => {
                    e.preventDefault();
                    let container = document.getElementById("container");
                    let containerScrollPosition =
                      document?.getElementById("container")?.scrollLeft;
                    container?.scrollTo({
                      top: 0,
                      left: (containerScrollPosition ?? 0) + e.deltaY,
                    });
                  }}
                >
                  {arrayPacks.map((pack: any, index: number) => {
                    return (
                      <img
                        key={"pack" + pack.id + index}
                        src={`./videos/packVideos/${pack.id}.png`}
                        className={clsx(
                          animating
                            ? cardToOpen[index]
                              ? `animating-${index + 1} animatingCardToOpen-${
                                  index + 1
                                }`
                              : `animating-${index + 1}`
                            : "",
                          `cursor-pointer pack z-40`,
                        )}
                        onClick={
                          !animating && !isLoading
                            ? () => openPack(index, pack.id)
                            : undefined
                        }
                        alt=""
                      />
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center">
                <h2 className="text-red-600 font-bold text-2xl">
                  You don't have packs to open
                </h2>
              </div>
            </>
          )}

          <div
            className={clsx("absolute w-full h-full blurContainer", {
              ["hidden"]: !startFlashing,
            })}
          ></div>

          <div
            className={clsx("absolute w-full h-full blurContainerPack", {
              ["hidden"]: !startFlashingPack,
            })}
          ></div>

          <div
            className={clsx(
              { hidden: videoPlaying !== 3 || !video },
              "absolute bottom-0 right-0 m-10 mb-20 z-[10000] cursor-pointer titleNext text-yellow-400 font-bold",
            )}
            onClick={() => {
              setStartFlashingPack(true);
              setTimeout(() => {
                setVideoPlaying(-1);
                setNoAudio(false);
                updateBalance();
              }, 1100);
            }}
          >
            NEXT
          </div>
          {video && (
            <div
              className={clsx(
                videoPlaying !== 3
                  ? ["hidden"]
                  : "absolute top-0 bottom-0 left-0 right-0 m-auto flex overflow-x-auto items-center md:justify-center z-[200] md:gap-10 gap-6 w-full h-screen px-10",
              )}
            >
              {cardsPack.map((id: number, index: number) => {
                return (
                  <React.Fragment key={index + "card"}>
                    <AnimatedPackCard
                      cardFront={cards[id]?.properties?.image?.value}
                      cardType={cards[id]?.typeCard}
                      cardId={id}
                      className={`card-${index + 1}`}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </>
      </div>
    </div>
  );
};
