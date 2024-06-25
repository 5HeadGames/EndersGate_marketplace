import clsx from "clsx";
import React, { useState } from "react";
import { PackOpening } from "./PackOpeningDesktop";
import { PackOpeningMobile } from "./PackOpeningMobile";
import { TransactionText } from "../common/specialFields/SpecialFields";
import { convertArrayCards } from "../common/convertCards";
import { getWeb3 } from "@shared/web3";
import { useModal } from "@shared/hooks/modal";
import { getTypePackAnimation } from "@shared/utils/packopening";

export const PackOpeningComponent: React.FC<any> = ({
  arrayPacks,
  packContract,
  NFTContract,
  updateBalance,
  account,
  history,
  setHistory,
}) => {
  const refAudioLoop = React.useRef(null);
  const [video, setVideo] = React.useState(false);
  const [isLoadingPack, setIsLoadingPack] = useState(false);
  const [animating, setAnimating] = React.useState(false);
  const [backgroundSound, setBackgroundSound] = React.useState(true);
  const [cardToOpen, setCardToOpen] = React.useState<any[]>([]);
  const [cardsPack, setCardsPack] = React.useState<any[]>([]);
  const [videoPlaying, setVideoPlaying] = React.useState(-1);
  const [packAnimation, setPackAnimation] = React.useState(-1);
  const [openingPack, setOpeningPack] = React.useState(false);
  const [startFlashing, setStartFlashing] = React.useState(false);
  const [startFlashingPack, setStartFlashingPack] = React.useState(false);

  const cards = convertArrayCards();

  const { Modal, show, isShow } = useModal();

  const openPack = async (index: any, id: any) => {
    setIsLoadingPack(true);
    setOpeningPack(true);
    setPackAnimation(id);
    try {
      const web3 = await getWeb3();
      await packContract.methods.unpack(id, 1).send({ from: account });
      const block = await web3.eth.getBlockNumber();
      const eventsTransfer = await NFTContract.getPastEvents("TransferSingle", {
        filter: {
          from: "0x0000000000000000000000000000000000000000",
          to: account,
        }, // Using an array means OR: e.g. 20 or 23
        fromBlock: block - 900,
        toBlock: "latest",
      });

      const pack = eventsTransfer.slice(
        eventsTransfer.length - 5,
        eventsTransfer.length,
      );
      setHistory(
        eventsTransfer.map(({ transactionHash: txHash, returnValues }: any) => {
          return { txHash, id: returnValues.id };
        }),
      );
      const packIDs: any = [];
      pack.forEach((card: any) => {
        packIDs.push(card.returnValues.id);
      });
      setCardsPack(packIDs);
      setStartFlashing(true);
      setAnimating(true);
      setOpeningPack(false);
      setVideoPlaying(0);
      setCardToOpen((prev) => {
        const newArray: any[] = [];
        prev.forEach((a, id) => {
          if (index === id) {
            newArray.push(true);
          } else {
            newArray.push(false);
          }
        });
        return newArray;
      });
      setTimeout(() => {
        console.log(getTypePackAnimation(id, packIDs) as any);
        setVideoPlaying(getTypePackAnimation(id, packIDs) as any);
        setCardToOpen(new Array(5).fill(false));
        setAnimating(false);
        setVideo(true);
        updateBalance();
      }, 2100);
      setIsLoadingPack(false);
      setOpeningPack(false);
    } catch (error) {
      console.log(error);
      setOpeningPack(false);
      setIsLoadingPack(false);
    }
  };

  const endPackOpening = () => {
    setVideoPlaying(3);
  };

  React.useEffect(() => {
    const audio: any = document.getElementById("bgAudio");
    if (audio) {
      audio.volume = 0.1;
    }
  }, [video]);

  return (
    <>
      {!video && (
        <audio
          className="hidden"
          src="./videos/packVideos/40s_Loop_final.wav"
          autoPlay
          id="bgAudio"
          loop
          ref={refAudioLoop}
        ></audio>
      )}
      {openingPack && (
        <div className="fixed top-0 flex items-center justify-center left-0 w-full h-full z-50 openingPack">
          <p className="loading text-3xl text-white font-bold">
            Opening your pack
          </p>
        </div>
      )}
      <>
        <PackOpening
          cards={cards}
          updateBalance={updateBalance}
          arrayPacks={arrayPacks}
          account={account}
          openPack={openPack}
          cardsPack={cardsPack}
          animating={animating}
          setNoAudio={setVideo}
          endPackOpening={endPackOpening}
          video={video}
          backgroundSound={backgroundSound}
          setBackgroundSound={setBackgroundSound}
          isLoading={isLoadingPack}
          setIsLoading={setIsLoadingPack}
          videoPlaying={videoPlaying}
          setVideoPlaying={setVideoPlaying}
          cardToOpen={cardToOpen}
          startFlashing={startFlashing}
          setStartFlashing={setStartFlashing}
          setStartFlashingPack={setStartFlashingPack}
          startFlashingPack={startFlashingPack}
          packAnimation={packAnimation}
          show={show}
          refAudioLoop={refAudioLoop}
        />
        <PackOpeningMobile
          cards={cards}
          refAudioLoop={refAudioLoop}
          updateBalance={updateBalance}
          packContract={packContract}
          backgroundSound={backgroundSound}
          setBackgroundSound={setBackgroundSound}
          arrayPacks={arrayPacks}
          account={account}
          openPack={openPack}
          cardsPack={cardsPack}
          endPackOpening={endPackOpening}
          animating={animating}
          setNoAudio={setVideo}
          video={video}
          isLoading={isLoadingPack}
          setIsLoading={setIsLoadingPack}
          videoPlaying={videoPlaying}
          setVideoPlaying={setVideoPlaying}
          cardToOpen={cardToOpen}
          setCardToOpen={setCardToOpen}
          startFlashing={startFlashing}
          setStartFlashing={setStartFlashing}
          setStartFlashingPack={setStartFlashingPack}
          startFlashingPack={startFlashingPack}
          packAnimation={packAnimation}
          show={show}
        />
      </>
      <Modal isShow={isShow} withoutX>
        <div className="w-auto relative bg-overlay border-2 border-primary overflow-auto">
          {history && history.length > 0 ? (
            <div className="flex flex-col items-center justify-center w-full">
              <h1 className="text-white font-bold text-lg py-2">
                History of Packs
              </h1>
              <div
                className={clsx(
                  "md:grid md:grid-cols-2 flex flex-col gap-x-4 sm:px-10 px-4 pb-6 mb-4 overflow-y-scroll relative",
                )}
                style={{
                  maxHeight: "70vh",
                  maxWidth: "90vw",
                  minWidth: "60vw",
                }}
              >
                {history.map((card: any) => {
                  return (
                    <div
                      className="flex justify-between items-center gap-2 py-4 px-2 border-y border-white historyItem"
                      key={"history" + card.txHash + card?.id}
                    >
                      <img
                        src={cards[card?.id]?.image}
                        className="h-32"
                        alt=""
                      />
                      <div className="flex flex-col">
                        <h2 className="text-base text-white textHistory">
                          txhash:{" "}
                          <a
                            className="cursor-pointer font-bold  lowercase"
                            href={"https://explorer.pops.one/tx/" + card.txHash}
                          >
                            <TransactionText text={card.txHash} />
                          </a>
                        </h2>
                        <h2 className="text-base text-white textHistory lowercase">
                          {cards[card?.id]?.properties?.name?.value}
                        </h2>
                        <h2 className="text-base text-white textHistory lowercase">
                          tokenid: {cards[card?.id]?.properties?.id?.value}
                        </h2>
                        {cards[card?.id]?.properties?.rarity && (
                          <h2 className="text-base text-white textHistory lowercase">
                            rarity: {cards[card.id]?.properties?.rarity?.value}
                          </h2>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              className="flex items-center justify-center font-bold text-red-600 w-full px-10"
              style={{ height: "60vh", width: "60vw" }}
            >
              You don't have history pack
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
