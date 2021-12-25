import {useNativeBalance} from "@shared/hooks/useNativeBalance";
import {n4} from "@shared/helpers/formatters";

function NativeBalance(props) {
  const {balance, nativeName} = useNativeBalance(props);

  return (
    <div style={{textAlign: "center", whiteSpace: "nowrap"}}>{`${n4.format(
      balance.formatted
    )} ${nativeName}`}</div>
  );
}

export default NativeBalance;
