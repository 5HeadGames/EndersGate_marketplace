"use client";
import React from "react";
import clsx from "clsx";
import Web3 from "web3";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  Container,
} from "@chakra-ui/react";
import ReactCardFlip from "react-card-flip";
// import Tilt from "react-parallax-tilt";
import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { onGetAssets } from "@redux/actions";
import {
  getAddresses,
  getContractCustom,
  getNativeBlockchain,
  onlyAcceptsERC20,
} from "@shared/web3";
import { Icons } from "@shared/const/Icons";
import { useBlockchain } from "@shared/context/useBlockchain";
import Link from "next/link";
import { useUser } from "@shared/context/useUser";

export const CardInventory = (props) => {
  const { classes } = props;
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isShow, setIsShow] = React.useState(false);
  const [transfer, setTransfer] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { blockchain } = useBlockchain();

  const {
    user: { ethAddress: account, provider },
  } = useUser();

  const { endersGate, pack, comics } = getAddresses(blockchain);

  const dispatch = useDispatch();

  const [nftSendData, setNftSendData] = React.useState({
    id: 0,
    name: "",
    type: "",
    address: "",
    quantity: undefined,
    balance: 0,
  });

  const getAssets = async () => {
    dispatch(onGetAssets({ address: account, blockchain }));
  };

  const transferNft = async () => {
    const web3 = new Web3(provider);
    if (!web3) return;
    if (nftSendData.quantity === 0) {
      return alert("Your quantity of tokens to transfer must be higher than 0");
    }
    setLoading(true);

    try {
      switch (props.typeNFT) {
        case "pack":
          const PacksContract = getContractCustom("EndersPack", pack, provider);
          await PacksContract.methods
            .safeTransferFrom(
              account,
              nftSendData.address,
              props.id,
              nftSendData.quantity,
              "0x00",
            )
            .send({
              from: account,
            });
          break;
        case "card":
          const CardsContract = getContractCustom(
            "EndersGate",
            endersGate,
            provider,
          );
          await CardsContract.methods
            .safeTransferFrom(
              account,
              nftSendData.address,
              props.id,
              nftSendData.quantity,
              "0x00",
            )
            .send({
              from: account,
            });
          break;
        case "comic":
          const ComicsContract = getContractCustom(
            getNativeBlockchain(blockchain)
              ? "ComicsNative"
              : onlyAcceptsERC20(blockchain)
              ? "ComicsOnlyMultiToken"
              : "Comics",
            comics,
            provider,
          );
          await ComicsContract.methods
            .safeTransferFrom(
              account,
              nftSendData.address,
              props.id,
              nftSendData.quantity,
              "0x00",
            )
            .send({
              from: account,
            });
          break;
        default:
          return;
      }
      setLoading(false);
      alert("Your token was succesfully transfered");
      getAssets();
      setNftSendData({
        id: 0,
        name: "",
        type: "",
        address: "",
        quantity: undefined,
        balance: 0,
      });
    } catch (err) {
      console.log({ err });
      alert("Your token couldn't be transfered");
    }
    setTransfer(false);
    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={isShow} onClose={() => setIsShow(false)}>
        <ModalOverlay />

        <ModalContent
          className={clsx(
            "bg-transparent w-full modalBody flex items-center justify-center",
          )}
          style={{ background: "transparent" }}
        >
          <ModalBody
            className="flex flex-col w-full items-center justify-center relative"
            style={{ background: "transparent" }}
          >
            {transfer && (
              <Container
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  m: "auto",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  top: "0",
                  zIndex: 10000,
                }}
              >
                <Container
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    bg: "transparent",
                    w: "max",
                  }}
                >
                  <div
                    className={clsx(
                      "flex flex-col items-center relative w-full ",
                      { "pt-[90px]": loading },
                    )}
                  >
                    {loading ? (
                      <>
                        <img
                          src="./images/inventory/transferArrow.png"
                          className="h-24 absolute top-0 z-[1000] right-0"
                          alt=""
                        />
                        <div className="text-white text-3xl text-center flex flex-col items-center justify-center h-52 w-96 gap-2 relative rounded-xl bg-overlay border border-white">
                          <p className="text-center font-bold text-green-button text-sm absolute top-2 mx-auto left-0 right-0 flex items-center justify-center gap-2">
                            Check your wallet extension{" "}
                          </p>
                          <h2 className="text-white font-bold text-center text-lg">
                            Transfer in Progress...
                          </h2>
                          <LoadingOutlined />
                        </div>
                      </>
                    ) : (
                      <div className="relative flex flex-col items-center rounded-xl bg-overlay border border-white">
                        <h4 className="text-white text-xl text-center relative Poppins font-black py-2 border-b border-white px-4 w-full">
                          Transfer
                        </h4>
                        <div className="flex flex-col w-full items-center">
                          <div className="flex flex-col py-4 gap-2 w-full items-center border-b border-white px-4">
                            <p className="text-xs text-white font-thin w-full">
                              <span className="font-bold"> Note:</span> Make
                              sure you are sending to the wallet you trust.
                            </p>
                            <ul className="text-white text-xs w-full list-disc">
                              <li>&#8226; Enter the wallet address</li>
                              <li>&#8226; Enter quantity</li>
                              <li>&#8226; Confirm the transfer</li>
                              <li>&#8226; Sign the transaction</li>
                            </ul>
                          </div>
                          <div className="flex flex-col border-b border-white py-4 gap-4 px-4 w-full">
                            <input
                              className="bg-transparent relative px-6 py-3 Poppins text-white w-full placeholder-white rounded-full text-xs font-thin border border-white"
                              value={nftSendData.address}
                              placeholder="Address"
                              onChange={(e) =>
                                setNftSendData((prev) => ({
                                  ...prev,
                                  address: e.target.value,
                                }))
                              }
                            />

                            <input
                              className="bg-transparent relative px-6 py-3 Poppins text-white w-full placeholder-white rounded-full text-xs font-thin border border-white"
                              value={
                                nftSendData.quantity !== null
                                  ? nftSendData.quantity
                                  : undefined
                              }
                              min={1}
                              placeholder="Quantity"
                              onChange={(e) =>
                                setNftSendData((prev: any) => ({
                                  ...prev,
                                  quantity: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="flex xl:flex-row flex-col justify-center items-center gap-2  py-4 w-full">
                            <div
                              className="relative cursor-pointer border border-alert-error rounded-xl"
                              onClick={() => setTransfer(false)}
                            >
                              <div className="p-1 px-4 flex relative items-center ">
                                <span
                                  style={{
                                    display: "block",
                                  }}
                                  className="text-white Poppins font-thin text-sm text-center"
                                >
                                  Cancel
                                </span>
                              </div>
                            </div>
                            <div
                              className="relative cursor-pointer border border-green-button rounded-xl"
                              onClick={() => transferNft()}
                            >
                              <div className="p-1 px-4 flex relative items-center">
                                <span
                                  style={{
                                    display: "block",
                                  }}
                                  className="text-white Poppins font-thin text-sm text-center"
                                >
                                  Confirm Transfer
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Container>
              </Container>
            )}
            <div
              className={clsx(
                { "opacity-50": transfer },
                "flex flex-col items-center justify-center max-w-md overflow-hidden px-4",
              )}
              style={{ minHeight: "100vh" }}
            >
              {props.typeNFT === "card" && (
                <div className="flex justify-end items-center w-full mb-2">
                  <Button
                    variant="contained"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      border: "solid 1px",
                      borderColor: "white",
                      py: 1,
                      px: 1,
                      fontSize: "10px",
                      lineHeight: "9px",
                      height: "20px",
                      color: "white",
                      outline: "none",
                      ring: "none",
                      borderRadius: "16px",
                    }}
                    onClick={() => setIsFlipped((prev) => !prev)}
                  >
                    Flip Card <ReloadOutlined />
                  </Button>
                </div>
              )}
              <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                <div>
                  <img
                    onClick={() => setIsFlipped((prev) => !prev)}
                    src={props.icon}
                    className={clsx({ hidden: isFlipped }, "cardPreview")}
                    alt=""
                  />
                </div>
                <div>
                  <img
                    onClick={() => setIsFlipped((prev) => !prev)}
                    className={clsx({ hidden: !isFlipped }, "cardPreview")}
                    src={props.back || props.icon}
                    alt=""
                  />
                </div>
              </ReactCardFlip>

              <div className="relative w-80 mt-2">
                <img
                  src="/images/box_footer_card.png"
                  className="absolute w-full h-full top-0"
                  alt=""
                />
                <div
                  className="text-xl text-center font-bold p-6 relative z-10 flex items-center justify-center gap-4 mt-1 cursor-pointer"
                  style={{ color: "#FFDB8A" }}
                >
                  {props.typeNFT === "pack" && (
                    <Button
                      variant="contained"
                      sx={{
                        border: "solid 1px",
                        borderColor: "white",
                        py: 1,
                        px: 4,
                        bgColor: "#000",
                        fontSize: "15px",
                        lineHeight: "16px",
                        color: "white",
                        outline: "none",
                        ring: "none",
                      }}
                    >
                      <Link href={`/pack_opening`}>Open</Link>
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    sx={{
                      border: "solid 1px",
                      borderColor: "white",
                      py: 1,
                      px: 4,
                      bgColor: "#000",
                      fontSize: "15px",
                      lineHeight: "16px",
                      color: "white",
                      outline: "none",
                      ring: "none",
                    }}
                  >
                    <Link href={`/${props.typeNFT}/${props.id}`}>
                      {props.rented ? "View Detail" : "Sell / Rent"}
                    </Link>
                  </Button>

                  <Button
                    variant="contained"
                    sx={{
                      border: "solid 1px",
                      borderColor: "white",
                      py: 1,
                      px: 4,
                      bgColor: "#000",
                      fontSize: "15px",
                      lineHeight: "16px",
                      color: "white",
                      outline: "none",
                      ring: "none",
                    }}
                    onClick={() => {
                      setTransfer(true);
                    }}
                  >
                    Transfer
                  </Button>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div
        className={clsx(
          "rounded-xl flex flex-col w-48 text-white cursor-pointer relative overflow-hidden",
          classes?.root,
        )}
        onClick={() => {
          setIsShow(true);
        }}
      >
        <div className="flex flex-col relative h-full justify-center items-center">
          <div className="w-full h-72 flex justify-center items-center">
            <img
              src={props.icon || Icons.logo}
              className={props.icon ? "h-64" : "h-24"}
              alt="eg_icon"
            />
          </div>
          <h2 className="text-sm font-thin text-gray-500 text-center">
            <span className="font-bold text-white">{props.name}</span> #
            {props.id !== undefined ? props.id : "12345"}
          </h2>
          <div className="text-xs font-thin text-gray-500 p-1 text-center">
            {props.balance && <span>QUANTITY: {props.balance}</span>}
          </div>
        </div>
      </div>
    </>
  );
};
