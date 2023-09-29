/* eslint-disable eqeqeq */
import React from "react";
import { Flex, Text, Image, useMediaQuery } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ComicSeriesSlider from "./ComicSeriesSlider";
import MyComics from "./MyComicsSlider";
import clsx from "clsx";
import { CheckIcon, PlusIcon, XIcon } from "@heroicons/react/solid";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { useRouter } from "next/router";
import { Button } from "@shared/components/common/button";
import { addCartComics, removeFromCartComics } from "@redux/actions";
import { Input } from "@shared/components/common/form/input";
import { useModal } from "@shared/hooks/modal";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useUser } from "@shared/context/useUser";

function RecentlyAddedComic({ price, getPriceMatic, balance, showCart }) {
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const [issues, setIssues] = React.useState([
    { name: "", photo: "" },
    {
      id: 1,
      name: "HvsO ISSUES #1",
      nameComic: "Humans vs Ogres Issue #1",
      nameLink: "HvsO_1",
      photo:
        "https://bafybeicafdbizjwthvopchg4ftfd3g3omaqk3huqggbhbcw3ybeyykwe44.ipfs.dweb.link/HumansVsOgres1.webp",
      issues: [
        { id: 1, name: "Humans vs Ogres Issue #1" },
        { id: 2, name: "Humans vs Ogres Issue #2" },
      ],
      quantity: 0,
    },
    {
      id: 1,
      name: "HvsO ISSUES #2",
      nameComic: "Humans vs Ogres Issue #1",
      nameLink: "HvsO_2",
      photo:
        "https://bafybeifq6v425pkeiy6y2unudh5vycts6ueumr6te3gmvvmlcfzblu6snm.ipfs.dweb.link/HumansVsOgres2-1.webp",
      issues: [
        { id: 1, name: "Humans vs Ogres Issue #1" },
        { id: 2, name: "Humans vs Ogres Issue #2" },
      ],
      quantity: 0,
    },
    { name: "", photo: "" },
  ]);

  const [nftModal, setNftModal] = React.useState({
    id: 0,
    balance: 0,
    nameLink: "",
    issues: [],
  });

  const router = useRouter();

  const dispatch = useDispatch();

  const {
    user: { ethAddress: account },
  } = useUser();

  const { currentComicsSupply, comicsLimit } = useSelector(
    (state: any) => state.nfts,
  );

  const { Modal, isShow, show, hide } = useModal();

  const onClickItem = (item: any, id) => {
    if (account) {
      let valid = false;
      balance.forEach((balance: { balance: number; id: any }) => {
        if (balance.balance > 0 && balance.id === item.id) {
          valid = true;
        }
      });
      if (valid) {
        setNftModal({
          ...item,
          price: price,
          quantity: 1,
          balance: 1,
        });
      } else {
        setNftModal({
          ...item,
          price: price,
          quantity: issues[id].quantity,
          balance: 0,
        });
      }
      show();
    } else {
      router.push("/login?redirect=true&redirectAddress=/comics");
    }
  };

  return (
    <div className="sliders-container">
      <Modal isShow={isShow} withoutX>
        <div
          style={{ width: "90vw", maxWidth: "350px" }}
          className="relative bg-overlay flex flex-col items-center gap-4 jusify-center shadow-2xl rounded-2xl mt-16"
        >
          <img
            src="/images/modalBg.png"
            className="w-full opacity-25 absolute top-0"
            alt=""
          />
          <img
            src="/images/modalImages.svg"
            className="w-[275px] absolute top-[-100px]"
            alt=""
          />
          <div className="absolute h-full w-full rounded-2xl bg-gradient-to-b from-transparent to-overlay px-2 from-0% to-50% "></div>
          <div className="absolute top-2 right-2 flex justify-end w-full py-2">
            <XIcon
              className="text-white w-5 cursor-pointer p-[2px] rounded-full bg-overlay border border-white"
              onClick={() => {
                hide();
              }}
            />
          </div>

          <div className="h-32 w-full"></div>

          <div className="flex flex-col items-center justify-center relative rounded-full px-2">
            <h2 className="text-white text-center font-bold text-2xl text-red-alert">
              Comic Book - Mint the NFT, Get a Free Physical Copy!{" "}
            </h2>{" "}
            <p className="text-center text-white text-lg py-4">
              Own an exclusive limited edition comic book! Mint the NFT now to
              claim your digital version and unlock amazing benefits. Plus,
              enjoy free global shipping and receive a physical printed copy
              delivered right to your doorstep!
            </p>
            <div className="flex flex-col pb-6">
              <h2 className="text-green-button text-center font-bold text-2xl">
                LIMITED: {comicsLimit - currentComicsSupply}/{comicsLimit} Left
              </h2>
              <span className="text-yellow-600 text-center text-sm">
                Split across 3 Blockchains
              </span>
            </div>
            {nftModal.balance > 0 ? (
              <Button
                decoration="greenLine"
                className="px-8 py-3 mb-2 rounded-full text-white relative border-none flex items-center justify-center w-full"
                onClick={() => {
                  router.push(
                    `/comics/${nftModal.nameLink}/${nftModal.issues[0].id}`,
                  );
                }}
              >
                <img
                  src="/images/buttonBg.png"
                  className="absolute top-0 left-0 h-full w-full"
                  alt=""
                />
                <p className="font-[900] text-white text-lg relative">
                  Read Now!
                </p>
              </Button>
            ) : (
              <Button
                decoration="greenLine"
                className="px-8 py-3 mb-2 rounded-full text-white relative border-none flex items-center justify-center w-full"
                onClick={() => {
                  nftModal.issues.forEach((issue) => {
                    dispatch(
                      addCartComics({
                        ...nftModal,
                        name: issue.name,
                        idNFT: issue.id,
                        price: price,
                        quantity: 1,
                      }),
                    );
                  });
                  getPriceMatic();
                  showCart();
                }}
              >
                <img
                  src="/images/buttonBg.png"
                  className="absolute top-0 left-0 h-full w-full"
                  alt=""
                />
                <p className="font-[900] text-white text-lg relative">
                  Get Yours Now!
                </p>
              </Button>
            )}
          </div>
        </div>
      </Modal>

      <Flex mt={20} mb={20} justifyContent={"center"}>
        <Text
          fontSize={["30px", "50px", "65px", "4xl"]}
          ml={3}
          color="#FFFFFF"
          fontWeight="500"
        >
          RECENTLY ADDED
        </Text>
      </Flex>
      <Slider {...settings}>
        {issues.map((i: any, id) => {
          return (
            i.name && (
              <SliderItem
                issues={issues}
                id={i.id}
                i={i}
                price={price}
                onClickItem={onClickItem}
                setIssues={setIssues}
              />
            )
          );
        })}
      </Slider>
      <MyComics balance={balance} />
    </div>
  );
}
export default RecentlyAddedComic;

const SliderItem = ({ price, onClickItem, id, i, setIssues, issues }) => {
  const { addToast } = useToasts();

  const [hoverBuy, setHoverBuy] = React.useState([false, false, false, false]);

  const { register } = useForm();

  const router = useRouter();

  const dispatch = useDispatch();

  const {
    user: { ethAddress: account },
  } = useUser();

  const { cartComics } = useSelector((state: any) => state.layout);

  return (
    <Flex className="relative flex flex-col items-center justify-center">
      <Flex className="box-shadow relative w-auto flex items-center justify-center">
        <div
          onMouseOver={() =>
            setHoverBuy((prev) => {
              const array = [];
              prev.forEach((i, idPrev) => {
                if (id === idPrev) {
                  array.push(true);
                } else {
                  array.push(i);
                }
              });
              return array;
            })
          }
          onMouseLeave={() =>
            setHoverBuy((prev) => {
              const array = [];
              prev.forEach((i, idPrev) => {
                if (id === idPrev) {
                  array.push(false);
                } else {
                  array.push(i);
                }
              });
              return array;
            })
          }
          style={{ zIndex: 1000 }}
          className={clsx(
            "rounded-full p-2 flex w-10 h-10 items-center justify-center border-overlay-border border cursor-pointer absolute top-4 right-6",
            {
              "gap-1 w-20 px-3 text-center": hoverBuy[id],
            },
            {
              "hover:bg-red-500 bg-green-button hover:transition-all transition-all duration-500 hover:duration-500":
                cartComics.filter((e) => e.id === i.id).length > 0,
            },
            {
              "bg-overlay hover:bg-overlay-2 hover:transition-all transition-all duration-500 hover:duration-500":
                cartComics.filter((e) => e.id === i.id).length === 0,
            },
          )}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {cartComics.filter((e) => e.id === i.id).length > 0 ? (
            hoverBuy[id] ? (
              <XIcon
                className="!w-6 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    removeFromCartComics({
                      id: i.id,
                    }),
                  );
                }}
              />
            ) : (
              <CheckIcon className="!w-6 text-white" />
            )
          ) : (
            <>
              <PlusIcon
                className="shrink-0 w-6 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  if (account) {
                    if (issues[id].quantity > 0) {
                      issues[id].issues.forEach((issue) => {
                        dispatch(
                          addCartComics({
                            ...i,
                            name: issue.name,
                            idNFT: issue.id,
                            price: price,
                            quantity: issues[id].quantity,
                          }),
                        );
                      });

                      toast.success("Your items has been added successfully");
                    } else {
                      toast.error(
                        "You can't add 0 items to the cart, please try again with a different quantity",
                      );
                    }
                  } else {
                    router.push("/login?redirect=true&redirectAddress=/comics");
                  }
                }}
              />

              <Input
                type="number"
                name="quantity"
                register={register}
                classNameContainer={clsx(
                  "border-none outline-none bg-transparent text-white w-10 text-sm p-0",
                )}
                className={clsx(
                  {
                    hidden: !hoverBuy[id] || parseInt(i.amount) <= 1,
                  },
                  "p-0 bg-transparent",
                )}
                withoutX
                onClick={(e) => e.preventDefault()}
                min={1}
                defaultValue={issues[id].quantity}
                value={issues[id].quantity}
                onChange={(e) => {
                  if (parseInt(e.target.value) > parseInt(i.amount)) {
                    addToast(
                      "Your amount exceeds the amount of NFTs of the sale",
                      { appearance: "error" },
                    );
                  } else {
                    setIssues((prev) => {
                      const array = [];
                      prev.forEach((a, idPrev) => {
                        array.push({
                          ...a,
                          quantity:
                            id === idPrev
                              ? parseInt(e.target.value)
                              : a.quantity,
                        });
                      });
                      return array;
                    });
                  }
                }}
              ></Input>
            </>
          )}
        </div>
        <Image
          className="images-width cursor-pointer shade-on-hover relative"
          fontWeight="500"
          ml={2}
          mt={2}
          mr={2}
          src={i.photo}
          onClick={() => onClickItem(i, id)}
        ></Image>
      </Flex>
      <Text className="endersgate-issues-text" color="#FFFFFF">
        {i.name}
      </Text>
    </Flex>
  );
};
