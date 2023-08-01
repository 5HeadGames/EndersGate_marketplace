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
    reaction: "/images/reactio.png",
    action: "/images/action.png",
    wood: "/images/wood.png",
    stone: "/images/stone.png",
    iron: "/images/iron.png",
    gold: "/images/gold.png",
    legendary: "/images/legendary.png",
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
