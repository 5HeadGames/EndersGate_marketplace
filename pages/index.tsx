import {useEffect, useState} from "react";
import {useMoralis} from "react-moralis";
import NFTTokenIds from "../shared/components/NFTTokenIds";
import "antd/dist/antd.css";


const App = () => {
  const {isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading} = useMoralis();

  const [inputValue, setInputValue] = useState("explore");

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return <NFTTokenIds inputValue={inputValue} setInputValue={setInputValue} />;
};

export default App;
