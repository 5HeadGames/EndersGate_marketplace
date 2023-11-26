import clsx from "clsx";
import Script from "next/script";
import React from "react";
import AnimatedPackCard from "./AnimatedPackCard";
import { ScriptVideo } from "./ScriptVideo";

export const PackOpeningMobile: React.FC<any> = ({
  cards,
  setNoAudio,
  arrayPacks,
  animating,
  endPackOpening,
  openPack,
  cardsPack,
  isLoading,
  video,
  videoPlaying,
  setVideoPlaying,
  cardToOpen,
  setCardToOpen,
  startFlashing,
  setStartFlashing,
  startFlashingPack,
  setStartFlashingPack,
  packAnimation,
  show,
}) => {
  // const [hovering, setHovering] = React.useState(false);
  const vidRef4 = React.useRef<any>(null);
  const [player, setPlayer] = React.useState(null);

  React.useEffect(() => {
    if (video) {
      handlePlayVideo();
    }
  }, [video, videoPlaying, player]);

  const handlePlayVideo = () => {
    player?.play();
    vidRef4?.current?.play();
    setTimeout(() => {
      player?.pause();
      endPackOpening();
    }, 4000);
  };

  React.useEffect(() => {
    if (arrayPacks) {
      const array = new Array(arrayPacks.length).fill(false);
      if (array) {
        setCardToOpen(array);
      }
    }
  }, [arrayPacks]);

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

  return (
    <div
      className={clsx(
        "w-screen h-screen relative overflow-hidden md:hidden flex flex-col h-screen",
      )}
      style={{ backgroundColor: "#1e1a29" }}
    >
      <div className="flex flex-col h-1/4 relative">
        <img
          src="./videos/packVideos/backMobileFrameTop.png"
          alt=""
          className="z-20 absolute top-0 left-0 w-full h-full flex"
        />
        <div
          className={clsx(
            "flex gap-10 justify-center items-center mt-2 sm:h-8 h-6 left-0 right-0 m-auto text-center z-50",
          )}
        >
          <img
            className={clsx("titlePacks", "h-full cursor-pointer z-50")}
            // onClick={() => {
            //   setCardPack(0);
            // }}
            src="./videos/packVideos/mypacks.png"
          />
          <img
            className={clsx("titlePacks", "h-full cursor-pointer z-50")}
            onClick={() => {
              show();
            }}
            src="./videos/packVideos/historyDesktop.png"
          />
        </div>
        <div
          className={clsx(
            "w-full h-full flex md:items-center md:justify-center relative z-40",
          )}
        >
          {/* {cardPack === 0 ? ( */}
          {arrayPacks ? (
            <>
              <div
                className={clsx(
                  "flex gap-4 items-center z-40 justify-start relative containerPacks w-full overflow-x-scroll mx-6 sm:px-5 px-5 sm:pb-6 pb-2",
                )}
              >
                {arrayPacks.map((pack: any, index: number) => {
                  return (
                    <img
                      key={index}
                      src={`./videos/packVideos/${pack.id}.png`}
                      className={clsx(
                        animating
                          ? cardToOpen[index] && "packMobileDisappear"
                          : "",
                        "cursor-pointer pack z-40",
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
            </>
          ) : (
            <>
              <div className="flex items-center justify-center w-full">
                <h2 className="textEmptyPacks">You don't have packs to open</h2>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="absolute left-0 right-0 mx-auto z-0 flex items-center justify-center w-full  bgPackContainer">
        <img
          src="./assets/bgPackNoOpen.png"
          className={clsx("bgPackImage z-0")}
          alt=""
        />
      </div>
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

      <div className="w-full h-3/4 relative">
        <img
          src="./videos/packVideos/mobilePackFrame.png"
          alt=""
          className="z-40 absolute top-0 left-0 w-full h-full flex"
        />
        <div
          className={clsx(
            { ["hidden"]: videoPlaying !== 3 },
            "absolute bottom-0 right-0 mx-12 mb-6 z-[10000] cursor-pointer titleNext text-yellow-400",
          )}
          onClick={() => {
            setStartFlashingPack(true);
            setTimeout(() => {
              setVideoPlaying(-1);
              setNoAudio(false);
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
                : "absolute z-40 flex h-full top-0 bottom-0 left-0 m-auto sm:px-14 px-10",
            )}
            style={{ maxWidth: "100vw" }}
          >
            <div
              className={clsx(
                "z-50  flex overflow-scroll items-center md:justify-center z-0 md:gap-10 gap-6 w-full  px-10",
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
          </div>
        )}
        {video && (
          <>
            <ScriptVideo setPlayer={setPlayer} packAnimation={packAnimation} />
            <div className="w-full h-full md:block hidden">
              <div
                id="animation"
                className={clsx(
                  { hidden: videoPlaying !== 1 },
                  "h-full videoDesktop videoPack z-10",
                )}
              ></div>
              <video
                ref={vidRef4}
                className={clsx(
                  { "!hidden": videoPlaying === -1 },
                  "h-full videoDesktop videoPack z-0",
                )}
                // controls
                // muted={videoPlaying !== 3}
                src="./videos/packVideos/Comp.mp4"
              ></video>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
