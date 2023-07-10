import clsx from "clsx";
import { relative } from "path";
import React, { useState, useEffect } from "react";

import { animated } from "react-spring";
import { use3dEffect } from "use-3d-effect";

const AnimatedPackCard = (props: any) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const ref = React.useRef(null);
  const { style, ...mouseHandlers } = use3dEffect(ref);

  const FlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="AnimatedCardPackBack"
      style={{
        height: props.height,
        display: "flex",
        justifyContent: "end",
        overflow: "visible",
      }}
    >
      <div
        style={{ position: "relative", zIndex: 100, height: "100%" }}
        className={clsx(!isFlipped ? "card" : "card flipped", props.className)}
      >
        <div onClick={FlipCard} className="card-block card-front animation">
          <img
            height={props.height}
            className="AnimatedCardPackBack"
            src={
              props.cardType == "reaction" || props.cardType == "action"
                ? "./assets/ACTION_REACTION_CARD_BACK.png"
                : props.cardType == "wood"
                ? "./assets/bert_kurtback.png"
                : props.cardType == "stone"
                ? "./assets/CardStoneBack.png"
                : props.cardType == "iron"
                ? "./assets/cardsilver.png"
                : props.cardType == "gold"
                ? "./assets/CardBack.png"
                : "./assets/redback.png"
            }
          />
        </div>
        <div className="card-block card-back">
          <animated.div
            className="AnimatedCardfront"
            ref={ref}
            style={{
              background: "none",
              color: "white",
              ...style,
            }}
            {...mouseHandlers}
          >
            <img className="PackCard" src={props.cardFront} />
          </animated.div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedPackCard;
