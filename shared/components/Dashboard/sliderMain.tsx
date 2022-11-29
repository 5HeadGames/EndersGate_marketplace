import { LoadingOutlined } from "@ant-design/icons";
import clsx from "clsx";
import React from "react";
import { timer } from "../common/CustomTimeout";
import NFTCardSlider from "../Marketplace/itemCard/cardSliderMain";

export const SliderMain = ({ salesDefault, cards }) => {
  const [arraySlider, setArraySlider] = React.useState([]);
  const [arrayPos, setArrayPos] = React.useState([0, 1, 2, 3]);

  // const [onTimeChange, setOnTimeChange] = React.useState(false);

  const timeoutRef = React.useRef(null);

  function resetTimeout() {
    timeoutRef.current.pause();
  }

  React.useEffect(() => {
    setArraySlider(salesDefault);
  }, [salesDefault]);

  React.useEffect(() => {
    console.log("test");
    if (timeoutRef.current) {
      resetTimeout();
    }
    // setOnTimeChange(false);
    // setOnTimeChange(true);
    timeoutRef.current = new timer(() => {
      switch (arrayPos[2]) {
        case 0:
          setArrayPos((prev) => [3, 2, 1, 0]);
          break;
        case 1:
          setArrayPos((prev) => [0, 3, 2, 1]);
          break;

        case 2:
          setArrayPos((prev) => [1, 0, 3, 2]);
          break;
        case 3:
          setArrayPos((prev) => [2, 1, 0, 3]);
          break;
      }
    }, 4000);

    return () => {
      resetTimeout();
    };
  }, [arrayPos]);

  return (
    <div
      className={clsx(
        { ["items-center justify-center text-xl"]: arraySlider.length < 2 },
        "w-full relative flex items-end justify-end rounded-xl overflow-hidden min-h-[300px]",
      )}
    >
      {arraySlider.length > 2 ? (
        <>
          <div className="absolute bottom-0 left-0 w-full">
            <div className="flex gap-4 items-end justify-between overflow-hidden relative w-full h-[200px] bg-transparent">
              {arraySlider.map((a, id) => {
                return (
                  <ItemCardSlider
                    a={a}
                    arrayPos={arrayPos}
                    setArrayPos={setArrayPos}
                    resetTimeout={resetTimeout}
                    cards={cards}
                    id={id}
                  />
                );
              })}
            </div>
          </div>
          <div className={`item-card-${arrayPos[3]}`}>
            <NFTCardSlider
              classes={{ root: `cursor-pointer` }}
              id={arraySlider[arrayPos[3]].nftId}
              transactionId={arraySlider[arrayPos[3]].id}
              seller={arraySlider[arrayPos[3]].seller}
              icon={
                cards[arraySlider[arrayPos[3]].nftId].properties.image.value
              }
              sale={arraySlider[arrayPos[3]]}
              // onTimeChange={onTimeChange}
              name={cards[arraySlider[arrayPos[3]].nftId].properties.name.value}
              byId={false}
              price={arraySlider[arrayPos[3]].price}
            />
          </div>
        </>
      ) : (
        <LoadingOutlined />
      )}
    </div>
  );
};

const ItemCardSlider = ({
  arrayPos,
  id,
  setArrayPos,
  resetTimeout,
  cards,
  a,
}) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div className={clsx("bottom-0 absolute", `item-${arrayPos[id]}`)}>
      <div
        className={clsx(
          { ["item-0-width"]: arrayPos[id] == 0 },
          { ["item-1-width"]: arrayPos[id] == 1 },
          { ["item-2-width"]: arrayPos[id] == 2 },
          { ["item-3-width"]: arrayPos[id] == 3 },
          "rounded-xl flex flex-col text-gray-100 cursor-pointer relative overflow-hidden border border-gray-500",
        )}
        onClick={() => {
          switch (id) {
            case 0:
              setArrayPos((prev) => [3, 2, 1, 0]);
              break;
            case 1:
              setArrayPos((prev) => [0, 3, 2, 1]);
              break;

            case 2:
              setArrayPos((prev) => [1, 0, 3, 2]);
              break;
            case 3:
              setArrayPos((prev) => [2, 1, 0, 3]);
              break;
          }
          resetTimeout();
        }}
      >
        <img
          src="/icons/play.png"
          className={clsx(
            { "opacity-1": hover },
            { "opacity-0": !hover },
            "absolute top-0 w-full h-full transition-all duration-500",
          )}
          alt=""
        />
        <img
          src={cards[a.nftId].properties.image.value}
          className={`absolute top-[-20%] bottom-0 left-[-40%] right-0 margin-auto min-w-[175%]`}
          alt=""
        />
      </div>
    </div>
  );
};
