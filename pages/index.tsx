import {useEffect, useState} from "react";
import NFTTokenIds from "../shared/components/NFTTokenIds";
import "antd/dist/antd.css";


const App = () => {
  const [inputValue, setInputValue] = useState("explore");

  return <NFTTokenIds inputValue={inputValue} setInputValue={setInputValue} />;
};

export default App;
