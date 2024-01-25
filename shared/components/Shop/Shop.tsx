/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getAddresses, switchChain } from "@shared/web3";
import { addCartShop, editCartShop, removeAllShop } from "@redux/actions";
import { toast } from "react-hot-toast";
import { CHAIN_IDS_BY_NAME } from "@shared/utils/chains";
import { useBlockchain } from "@shared/context/useBlockchain";
import { useCartModal } from "@shared/components/common/cartModal";
import { useUser } from "@shared/context/useUser";
import { packsShop, updateSales } from "@shared/utils/utils";
import { DropdownShop } from "@shared/components/common/dropdowns/dropdownShop";
import { nFormatter } from "@shared/components/common/specialFields/SpecialFields";
import ModalShop from "./ModalShop";
import { ShoppingCartOutlined } from "@ant-design/icons";

const Shop = () => {
  const [sales, setSales] = useState([]);
  const [saleToShow, setSale] = useState(packsShop[0]);
  const [counters, setCounters] = useState([1, 1, 1, 1]);

  const { blockchain } = useBlockchain();

  const { Modal, show, isShow, hide } = useCartModal();

  const { cartShop } = useSelector((state: any) => state.layout);

  const { shop: shopAddress, MATICUSD } = getAddresses(blockchain);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (blockchain) {
      try {
        switchChain(CHAIN_IDS_BY_NAME[blockchain]);
        updateSales({
          blockchain,
          shopAddress,
          setSales,
        });
        dispatch(removeAllShop());
      } catch (err) {
        toast.error(
          "An error occurred while changing the network, please try again.",
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockchain]);

  React.useEffect(() => {
    if (sales.length) setSale(sales[0]);
  }, [sales]);

  return (
    <>
      <div
        className="w-full h-full relative overflow-hidden shop flex flex-col items-center pb-16"
        style={{ minHeight: "100vh" }}
      >
        <ModalShop
          Modal={Modal}
          isShow={isShow}
          hide={hide}
          setSales={setSales}
        />

        <img
          src="/images/shop/shop_background.png"
          className="flex absolute z-0 w-full h-full"
          alt="bg-shop"
        />
        <img
          src="/images/shop/bg_top.png"
          className="w-full h-full relative pt-12"
          alt="bg-top"
        />
        <h1 className="Poppins relative border-y-4 border-[#B8902E] Poppins text-white sm:text-5xl text-4xl text-center font-[600] py-12 w-full">
          CARD SHOP
        </h1>

        <div className="flex xl:flex-row flex-col xl:justify-between xl:items-end items-center relative w-full pt-6">
          <div className="flex w-full items-center justify-center gap-2">
            <DropdownShop>
              <>
                {" "}
                <div className="relative sm:w-64 w-40">
                  <div className="absolute flex shrink-0 items-center justify-center w-full h-full">
                    <h2 className="relative  sm:text-xl text-md text-white">
                      NFT PACKS
                    </h2>
                  </div>
                  <img
                    src="./images/bgGold.png"
                    className="cursor-pointer"
                    alt=""
                  />
                </div>
                <div className="relative sm:w-64 w-40">
                  <div className="absolute flex shrink-0 items-center justify-center w-full h-full">
                    <h2 className="relative  sm:text-xl text-md text-white">
                      AVATAR CARDS
                    </h2>
                  </div>
                  <img
                    src="./images/bgNonSelected.png"
                    className="cursor-pointer"
                    alt=""
                  />
                </div>
                <div className="relative sm:w-64 w-40">
                  <div className="absolute flex shrink-0 items-center justify-center w-full h-full">
                    <h2 className="relative  sm:text-xl text-md text-white">
                      EG COMICS
                    </h2>
                  </div>
                  <img
                    src="./images/bgNonSelected.png"
                    className="cursor-pointer"
                    alt=""
                  />
                </div>
              </>
            </DropdownShop>
            <div
              className={clsx(
                { "!border-alert-error": cartShop.length > 0 },
                "border border-transparent py-[13px] px-5 bg-overlay lg:flex hidden items-center justify-center text-white cursor-pointer z-10 relative",
              )}
              onClick={() => {
                show();
              }}
            >
              <img
                src="./images/bgGold.png"
                className="cursor-pointer absolute w-full h-full"
                alt=""
              />

              {cartShop.length > 0 && (
                <div className="p-1 rounded-full flex items-center justify-center absolute top-1 left-1 bg-alert-error min-w-4 min-h-4 z-10">
                  <p
                    className="flex items-center justify-center w-4 h-4 font-bold"
                    style={{ fontSize: "10px" }}
                  >
                    {nFormatter(
                      cartShop
                        .map((item) => parseInt(item.quantity))
                        .reduce((acc, red) => acc + red),
                    )}
                  </p>
                </div>
              )}

              <ShoppingCartOutlined className="text-3xl flex items-center justify-center relative" />
            </div>
          </div>
        </div>
        <div className="2xl:w-4/5 w-full 2xl:px-0 xl:px-16 lg:px-10 px-8 flex xl:flex-row xl:items-start xl:justify-start flex-col items-center justify-center xl:gap-10 gap-8 pt-10">
          <div className="relative w-full flex md:flex-row flex-col md:items-start items-center xl:w-[50%]">
            <div
              className={clsx(
                "flex flex-col items-center justify-center w-full gap-2 border border-white p-4 pt-2",
              )}
            >
              {sales?.map((sale) => {
                return (
                  <SaleButton
                    saleSelected={saleToShow?.name}
                    sale={sale}
                    setSale={setSale}
                  />
                );
              })}
            </div>
          </div>
          <div className="relative w-full flex md:flex-row flex-col md:items-start items-center xl:w-[50%]">
            <div className={clsx("flex w-full")}>
              <ShopElement
                sale={saleToShow}
                counters={counters}
                setCounters={setCounters}
                index={saleToShow.index}
              />
            </div>
          </div>
        </div>
        <div className="sm:block hidden pt-56 w-full"></div>
        <div
          className="fixed bottom-4 right-4 p-2 py-1 rounded-full bg-overlay lg:hidden flex items-center justify-center hover:bg-primary  text-white cursor-pointer z-10"
          onClick={() => {
            show();
          }}
        >
          <div className="relative flex items-center justify-center p-3">
            {cartShop.length > 0 && (
              <p
                className="px-2 py-0.5 rounded-full flex items-center justify-center absolute top-0 left-0 bg-yellow-600 text-white font-bold"
                style={{ fontSize: "11px" }}
              >
                {nFormatter(
                  cartShop
                    .map((item) => parseInt(item.quantity))
                    .reduce((acc, red) => acc + red),
                )}
              </p>
            )}
            <ShoppingCartOutlined className="text-xl" />
          </div>
        </div>
      </div>
    </>
  );
};

const SaleButton = ({ sale, saleSelected, setSale }) => {
  return (
    <button
      className={clsx(
        "border-b border-white w-full relative flex justify-between items-center",
      )}
      onClick={() => {
        setSale(sale);
      }}
    >
      <img
        src="/images/shop/selected_pack_effect.png"
        className={clsx("w-full absolute h-full top-0", {
          hidden: sale.name != saleSelected,
        })}
        alt=""
      />
      <p
        className={clsx(
          { "md:hidden !text-[#F1E298]": sale.name === saleSelected },
          "py-2 px-5 md:text-xl sm:text-lg text-[14px] text-white text-left RingBearer lowercase",
        )}
      >
        {sale?.nameList}
      </p>
      <img
        src={sale?.imageList}
        className={clsx(
          { "!hidden": sale.name !== saleSelected },
          "h-[35px] py-2 px-4 relative md:flex hidden",
        )}
        alt={sale?.nameList}
      />
      <p className="py-2 px-4 text-white text-left sm:text-lg text-[12px]">
        {sale?.currentPrice}
      </p>
    </button>
  );
};

const ShopElement = ({ sale, counters, setCounters, index }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    user: { ethAddress: account },
  } = useUser();
  const { cartShop } = useSelector((state: any) => state.layout);

  return (
    <div className="relative flex sm:flex-row flex-col border border-white w-full p-3">
      <div className="flex flex-col items-center justify-center relative h-full py-6 px-4 shadow-white sm:w-2/5 w-full">
        <img
          src="./images/box_pack.png"
          className="absolute w-full h-full"
          alt=""
        />

        <img
          src={sale?.imagePack}
          alt=""
          style={{ flexShrink: 0 }}
          className="relative pt-2 w-44"
        />
        <div
          className="relative flex items-center justify-center my-2"
          style={{
            height: "40px",
            width: "160px",
            flexShrink: 0,
          }}
        >
          <h2 className="Poppins font-[500] text-md text-center text-gray-200 relative">
            {sale?.amount} LEFT
          </h2>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 p-4 sm:w-3/5 w-full">
        <div className="w-full flex flex-col">
          <h2 className="text-primary-disabled text-sm font-[500] w-full">
            ELEMENTAL CONFLICT
          </h2>
          <h1
            className={clsx("text-3xl font-[600] uppercase Poppins")}
            style={{ color: sale?.color }}
          >
            {sale?.name}
          </h1>
          <img src="/images/shop/line2.png" className="w-full mb-4" alt="" />
          <p className="Poppins text-primary-disabled text-sm font-[400] relative">
            {sale?.description}
          </p>
        </div>

        <div
          className={clsx(
            "flex justify-between gap-4 w-full relative shadow-white py-4",
          )}
        >
          <div className="flex gap-2">
            <div
              className="cursor-pointer text-xl text-white px-4 py-1 font-bold rounded-md border border-white"
              onClick={
                counters[index] > 1
                  ? () => {
                      setCounters((prev: any) => {
                        const newArray: any = [];
                        prev.forEach((previous: any, index2) => {
                          if (index === index2) {
                            newArray.push(previous - 1);
                          } else {
                            newArray.push(previous);
                          }
                        });
                        return newArray;
                      });
                    }
                  : undefined
              }
            >
              -
            </div>
            <input
              className="text-xl text-white text-center bg-transparent px-4 py-1 font-bold rounded-md border border-white"
              value={counters[index]}
              type="number"
              min={1}
              max={10}
              onChange={(e: any) => {
                if (e.target.value.length < 3) {
                  setCounters((prev: any) => {
                    const newArray: any = [];
                    prev.forEach((previous: any, id) => {
                      if (id === index) {
                        newArray.push(e.target.value);
                      } else {
                        newArray.push(previous);
                      }
                    });
                    return newArray;
                  });
                }
              }}
            />

            <div
              className="cursor-pointer text-xl text-white px-4 py-1 font-bold rounded-md border border-white"
              onClick={
                counters[index] < 10
                  ? () => {
                      setCounters((prev: any) => {
                        const newArray: any = [];
                        prev.forEach((previous: any, index2) => {
                          if (index === index2) {
                            newArray.push(previous + 1);
                          } else {
                            newArray.push(previous);
                          }
                        });
                        return newArray;
                      });
                    }
                  : undefined
              }
            >
              +
            </div>
          </div>
        </div>
        <div className="flex w-full gap-2 relative items-start">
          {sale?.previousPrice && (
            <h2 className="Poppins uppercase text-3xl font-[600] text-center text-primary-disabled relative">
              {sale?.previousPrice}
              <img
                src="/images/shop/line_text.png"
                className="h-full absolute top-0 "
                alt=""
              />
            </h2>
          )}
          <h2 className="Poppins uppercase text-3xl font-[600] text-center text-white relative">
            {sale?.currentPrice}
          </h2>
          {sale.percentageOff && (
            <div className="flex items-center justify-center relative px-2 ">
              <img
                src="/images/shop/bg-off.png"
                className="absolute h-full rounded-lg top-0 shadow-white"
                alt=""
              />
              <p className="Poppins uppercase text-md text-center text-green-button relative font-[500] h-6">
                {sale?.percentageOff}
              </p>
            </div>
          )}
        </div>
        <div className="w-full">
          <div
            className="text-xl cursor-pointer relative px-6 py-1 flex items-center justify-center w-fit"
            onClick={() => {
              if (account) {
                if (
                  cartShop
                    .map((item) => {
                      return item.id;
                    })
                    .includes(sale?.id)
                ) {
                  dispatch(
                    editCartShop({
                      item: {
                        ...sale,
                        quantity: counters[index],
                      },
                      id: cartShop
                        .map((item) => {
                          return item.id;
                        })
                        .indexOf(sale.id),
                    }),
                  );
                  toast.success(
                    "Your item has been edited successfully to the cart",
                  );
                } else {
                  dispatch(
                    addCartShop({
                      ...sale,
                      quantity: counters[index],
                    }),
                  );
                  toast.success(
                    "Your item has been added successfully to the cart",
                  );
                }
              } else {
                router.push("/login?redirect=true&redirectAddress=/shop");
              }
            }}
          >
            <img
              src="/images/shop/button_shop.svg"
              className="h-full absolute top-0"
              alt=""
            />
            <h2 className="RingBearer text-black relative font-black">
              {account ? "add to cart" : "login to buy"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
