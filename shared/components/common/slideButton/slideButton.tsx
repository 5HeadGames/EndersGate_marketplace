import clsx from "clsx";
import * as React from "react";
import Styles from "./styles.module.scss";

export const SlideButton = ({ value, onClick }) => {
  return (
    <div
      className="flex items-center text-white cursor-pointer h-16"
      onClick={onClick}
    >
      <div
        className={clsx(
          "w-20 flex justify-center rounded-l-md py-3",
          { [`${Styles.onActive}`]: value },
          { [Styles.onUnactive]: !value },
        )}
      >
        On
      </div>
      <div
        className={clsx(
          "w-20 flex justify-center rounded-r-md py-3",
          { [Styles.offActive]: !value },
          { [Styles.offUnactive]: value },
        )}
      >
        Off
      </div>
    </div>
  );
};
