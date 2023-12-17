import clsx from "clsx";
import React from "react";
import AnimatedPackCard from "./AnimatedPackCard";

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
  const vidRef1mobile = React.useRef<any>(null);
  const vidRef2mobile = React.useRef<any>(null);
  const vidRef3mobile = React.useRef<any>(null);
  const vidRef4mobile = React.useRef<any>(null);

  // const [hovering, setHovering] = React.useState(false);

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

  const handlePlayVideo = () => {
    vidRef1mobile?.current?.play();
    vidRef2mobile?.current?.play();
    vidRef3mobile?.current?.play();
    vidRef4mobile?.current?.play();
  };

  React.useEffect(() => {
    // if (videoPlaying !== 3) {
    handlePlayVideo();
  }, [video, videoPlaying]);

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
                      cardFront={cards[id]?.image}
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
            <div className="w-full h-full block md:hidden">
              <video
                ref={vidRef1mobile}
                className={clsx(
                  { ["hidden"]: videoPlaying !== 0 },
                  "h-full absolute z-0 mobileVideo",
                )}
                // controls
                muted
                src={`./videos/packVideos/card_${
                  packAnimation + 1
                }_purple720x1280.mp4`}
                onEnded={
                  videoPlaying === 0 ? () => endPackOpening(0) : undefined
                }
              ></video>

              <video
                ref={vidRef2mobile}
                className={clsx(
                  { ["hidden"]: videoPlaying !== 1 },
                  "h-full absolute z-0 mobileVideo",
                )}
                // controls
                muted
                src={`./videos/packVideos/card_${
                  packAnimation + 1
                }_green720x1280.mp4`}
                onEnded={
                  videoPlaying === 1 ? () => endPackOpening(1) : undefined
                }
              ></video>

              <video
                ref={vidRef3mobile}
                className={clsx(
                  { ["hidden"]: videoPlaying !== 2 },
                  "w-full absolute z-0 mobileVideo",
                )}
                // controls
                muted
                src={`./videos/packVideos/card_${
                  packAnimation + 1
                }_yellow720x1280.mp4`}
                onEnded={
                  videoPlaying === 2 ? () => endPackOpening(2) : undefined
                }
              ></video>

              <video
                ref={vidRef4mobile}
                className={clsx(
                  { ["hidden"]: videoPlaying !== 3 },
                  "w-screen mobileVideo",
                )}
                // controls
                src="./videos/packVideos/portal_glow_720x1280.mp4"
              ></video>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
