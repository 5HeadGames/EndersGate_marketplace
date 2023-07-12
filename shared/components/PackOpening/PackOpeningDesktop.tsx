import clsx from "clsx";
import React from "react";
import AnimatedPackCard from "./AnimatedPackCard";

export const PackOpening: React.FC<any> = ({
  cards,
  refAudioLoop,
  setNoAudio,
  arrayPacks,
  packContract,
  updateBalance,
  account,
  animating,
  endPackOpening,
  openPack,
  cardsPack,
  isLoading,
  videoPlaying,
  backgroundSound,
  setBackgroundSound,
  setVideoPlaying,
  cardToOpen,
  startFlashing,
  setStartFlashing,
  startFlashingPack,
  setStartFlashingPack,
  video,
  packAnimation,
  show,
}) => {
  const vidRef1 = React.useRef<any>(null);
  const vidRef2 = React.useRef<any>(null);
  const vidRef3 = React.useRef<any>(null);
  const vidRef4 = React.useRef<any>(null);

  React.useEffect(() => {
    const audio: any = document.getElementsByClassName("videoPack");
    if (audio) {
      for (let it = 0; it < audio.length; it++) {
        audio[it].volume = 0.3;
      }
    }
  }, [video]);

  React.useEffect(() => {
    if (startFlashing == true) {
      setTimeout(() => {
        setStartFlashing(false);
      }, 4000);
    }
  }, [startFlashing]);

  React.useEffect(() => {
    if (startFlashingPack == true) {
      setTimeout(() => {
        setStartFlashingPack(false);
      }, 2000);
    }
  }, [startFlashingPack]);

  const handlePlayVideo = () => {
    vidRef1?.current?.play();

    vidRef2?.current?.play();

    vidRef3?.current?.play();

    vidRef4?.current?.play();
  };

  React.useEffect(() => {
    // if (videoPlaying !== 3) {
    handlePlayVideo();
  }, [video, videoPlaying]);

  return (
    <div
      className={clsx(
        "w-full min-h-screen relative overflow-hidden md:block hidden",
      )}
      style={{ backgroundColor: "#111" }}
    >
      <div
        className={clsx(
          { ["hidden"]: video },
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
          "w-full min-h-screen flex md:items-center md:justify-center relative",
        )}
      >
        {/* {cardPack === 0 ? ( */}
        <>
          {video ? (
            <>
              <div className="w-full h-full md:block hidden">
                <video
                  ref={vidRef4}
                  className={clsx(
                    { ["hidden"]: videoPlaying !== 3 },
                    "h-full videoDesktop videoPack",
                  )}
                  // controls
                  // muted={videoPlaying !== 3}
                  src="./videos/packVideos/Comp.mp4"
                ></video>
              </div>
            </>
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
                    var container = document.getElementById("container");
                    var containerScrollPosition =
                      document?.getElementById("container")?.scrollLeft;
                    container?.scrollTo({
                      top: 0,
                      left:
                        (containerScrollPosition !== undefined
                          ? containerScrollPosition
                          : 0) + e.deltaY,
                      // behaviour: 'smooth' //if you want smooth scrolling
                    });
                  }}
                >
                  {arrayPacks.map((pack: any, index: number) => {
                    return (
                      <img
                        key={index}
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
              { ["hidden"]: videoPlaying !== 3 },
              "absolute bottom-0 right-0 m-10 cursor-pointer titleNext font-bold",
            )}
            onClick={() => {
              setStartFlashingPack(true);
              setTimeout(() => {
                setVideoPlaying(-1);
                setNoAudio(false);
                updateBalance();
                // console.log(vidRef1?.current);
                // if (vidRef1 && vidRef2 && vidRef3 && vidRef4) {
                //   vidRef1.current.currentTime = 0;
                //   vidRef2.current.currentTime = 0;
                //   vidRef3.current.currentTime = 0;
                //   vidRef4.current.currentTime = 0;
                // }
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
                  : "absolute top-0 bottom-0 left-0 right-0 m-auto flex overflow-x-auto items-center md:justify-center z-0 md:gap-10 gap-6 w-full h-screen px-10",
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
        {/*) : (
          // <div
          //   className={clsx(
          //     "flex gap-10 items-center justify-start relative containerPacks w-full overflow-scroll h-screen px-10"
          //   )}
          // >
          //   {new Array(5 * (5 - packAvailable)).fill(false).map((a, index) => {
          //     return (
          //       <img
          //         key={index}
          //         src="./videos/eclipso_front.png"
          //         className={clsx("cursor-pointer xl:w-60 w-32")}
          //         alt=""
          //       />
          //     );
          //   })}
          // </div>
        )*/}
      </div>
    </div>
  );
};
