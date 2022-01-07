import React from "react";
import {useAppDispatch} from "redux/store";
import {onBlurLayout} from "redux/actions";

const styles = {
  back: {
    position: "absolute" as any,
    backgroundColor: "black",
    opacity: "0.5",
    top: 0,
    left: 0,
    zIndex: 100,
    width: "100%",
    height: "100vh",
  },
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const Dialog: React.FunctionComponent<Props> = (props) => {
  const {open, onClose, children} = props;
  const rootRef = React.useRef(null);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!rootRef.current) return;

    document.addEventListener("click", onClose);

    return () => {
      document.removeEventListener("click", onClose);
    };
  }, [rootRef.current, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="bg-secondary text-white border-primary border border-2 p-5 absolute rounded-md"
        style={{top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 200}}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
      <div style={styles.back} ref={rootRef}></div>
    </>
  );
};

export default Dialog;
