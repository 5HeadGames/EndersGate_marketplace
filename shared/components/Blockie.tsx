import Blockies from "react-blockies";

/**
 * Shows a blockie image for the provided wallet address
 * @param {*} props
 * @returns <Blockies> JSX Elemenet
 */

function Blockie(props) {

  return (
    <Blockies
      seed={props.currentWallet ? 'some text' : props.address.toLowerCase()}
      className="identicon"
      {...props}
    />
  );
}

export default Blockie;
