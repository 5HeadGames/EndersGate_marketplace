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

  const cardsBacks = {
    reaction: "./images/ACTION_REACTION_CARD_BACK.png",
    action: "./images/ACTION_REACTION_CARD_BACK.png",
    wood: "./images/bert_kurtback.png",
    stone: "./images/CardStoneBack.png",
    iron: "./images/cardsilver.png",
    gold: "./images/CardBack.png",
    legendary: "./images/redback.png",
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
            src={cardsBacks[props.cardType]}
            alt="card back"
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
            <img className="PackCard" src={props.cardFront} alt="card front" />
          </animated.div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedPackCard;
