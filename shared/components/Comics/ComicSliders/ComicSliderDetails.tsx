import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import comicDetails from "../../../comics.json";
import {
  Flex,
  Image,
  Button,
  Text,
  Input,
  useMediaQuery,
} from "@chakra-ui/react";
import { ImCross } from "react-icons/im";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { MdRestore } from "react-icons/md";
import {
  HiOutlineDeviceMobile,
  HiArrowSmLeft,
  HiArrowSmRight,
} from "react-icons/hi";
import { BsGrid1X2Fill, BsXDiamond } from "react-icons/bs";
import "react-medium-image-zoom/dist/styles.css";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getAddressesEth, getContractCustom } from "@shared/web3";
import clsx from "clsx";
import useFullscreenStatus from "@shared/components/common/onFullScreen";
import { useToasts } from "react-toast-notifications";

function ComicSliderDetails() {
  const [loading, setLoading] = useState(true);
  const maximizableElementScreen = React.useRef(null);

  const { addToast } = useToasts();
  let isFullscreen;

  try {
    [isFullscreen] = useFullscreenStatus(maximizableElementScreen);
  } catch (e) {
    addToast(
      "Fullscreen is unsupported by this browser, please try another browser.",
    );
  }
  // const [data, setData] = useState(null);

  const [scale, setScale] = useState(1);
  const [offsetY, setOffsetY] = useState(0);
  const imageRef = useRef(null);
  const [zoomButtons, setZoomButtons] = useState(true);
  const [cursorHand, setCursorHand] = useState(false);

  const { name: comicName } = useRouter().query;
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState<any>(1);
  const [moveToSlide, setMoveToSlide] = useState<any>();
  const [searchIndexSlide, setSearchIndexSlide] = useState<any>("");
  const [slider, setSlider] = useState<any>("");
  const [pannelViewIsActive, setPannelViewIsActive] = useState(true);
  const [browseViewIsActive, setBrowseViewIsActive] = useState(false);
  const [guidedViewIsActive, setGuidedViewIsActive] = useState(false);
  const [pageOrPannal, setPageOrPannal] = useState("Page");
  const [isShown, setIsShown] = useState(false);
  const { ethAddress: account } = useSelector(
    (state: any) => state.layout.user,
  );

  const { providerEth } = useSelector((state: any) => state.layout);

  const { comics: comicsAddress } = getAddressesEth();

  const accountUpdate = async () => {
    setLoading(true);
    console.log("USE EFFECT");
    if (account == "") {
      console.log("NO ACCOUNT");
      return router.push("/login");
    } else {
      await getComicID();
    }
    setLoading(false);
  };

  const currentComic = comicDetails?.find((comic) => {
    return comic.name === comicName;
  });

  const comicImage = currentComic?.pages.find((comic) => {
    return comic.id === 1;
  });

  const [sliderImage, setSliderImage] = useState(
    comicImage?.pages_pannels?.filter((page) => page.isPannal === false),
  );

  // const zoomImagecondition = comicImage.pages_pannels.filter(
  //   (page) => page.isPannal === false,
  // );

  const imageArrayLength = sliderImage?.length;

  React.useEffect(() => {
    if (currentComic) accountUpdate();
  }, [account, currentComic]);

  const getComicID = async () => {
    const comics = getContractCustom("Comics", comicsAddress, providerEth);
    const nftsId = await comics.methods.comicIdCounter().call();
    const balances = await comics.methods
      .balanceOfBatch(
        new Array(parseInt(nftsId)).fill(account),
        new Array(parseInt(nftsId)).fill(1).map((i, id) => id + 1),
      )
      .call();

    const balanceCheck = balances
      .map((i, id) => {
        return { id: id + 1, balance: parseInt(i) };
      })
      .filter((balance) => balance.balance > 0)
      .map((id) => id.id);

    if (!balanceCheck.includes(currentComic?.id)) {
      return router.push("/login");
    }
    setLoading(false);
  };

  const PreviousBtn = (props) => {
    const { className, onClick, currentSlide } = props;
    return (
      <>
        {currentSlide !== 0 && (
          <div className={className} onClick={onClick}>
            <Image src={"/images/left-arrow-main-slider.png"} boxSize="35px" />
          </div>
        )}
      </>
    );
  };

  const NextBtn = (props) => {
    const { className, onClick, slideCount, currentSlide } = props;
    return (
      <>
        {currentSlide !== slideCount - 1 && (
          <div className={className} onClick={onClick}>
            <Image src={"/images/right-arrow-main-slider.png"} boxSize="35px" />
          </div>
        )}
      </>
    );
  };

  const settings = {
    infinite: false,
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    fadeSpeed: 2000,
    // arrows:false,
    responsive: [
      {
        breakpoint: 425,
        settings: {
          arrows: false,
        },
      },
    ],
    afterChange: function (index) {
      setCurrentSlide(index + 1);
    },
    beforeChange: (current, next) => setMoveToSlide({ index: next }),
  };

  const [isAtLeast1024px] = useMediaQuery("(min-width: 500px)");

  var browseSlider = {
    infinite: false,
    arrows: false,
    // prevArrow: <BrowsePreviousBtn />,
    // nextArrow: <BrowseNextBtn />,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 4,
  };

  const browseSlidermobile = {
    infinite: false,
    arrows: false,
    // prevArrow: <BrowsePreviousBtn />,
    // nextArrow: <BrowseNextBtn />,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const handleChange = (event: any) => {
    setSearchIndexSlide(event.target.value - 1);
  };

  const counter = useRef(0);
  const imageLoaded = () => {
    counter.current += 1;
    // console.log()
    console.log(counter.current);

    if (counter.current >= imageArrayLength) {
      setLoading(false);
    }
  };

  const handleChangeGuidedView = (event) => {
    setSliderImage(
      comicImage.pages_pannels.filter((pannal) => pannal.isPannal === true),
    );
    slider.slickGoTo(1);
    setPannelViewIsActive(false);
    setPageOrPannal("Panel");
    setGuidedViewIsActive((current) => !current);
    setZoomButtons(false);
    setOffsetY(0);
    setScale(1);
    counter.current = 1;
    setLoading(true);
  };

  const handleChangePageView = (event) => {
    {
      setSliderImage(
        comicImage.pages_pannels.filter((pannal) => pannal.isPannal === false),
      );
    }
    slider.slickGoTo(0);
    setGuidedViewIsActive(false);
    setPannelViewIsActive((current) => !current);
    setPageOrPannal("Page");
    setZoomButtons(true);
    setCurrentSlide(1);
    counter.current = 1;
    setLoading(true);
    // setPageViewSliderGoToFirstSlider();
  };

  // const browseCounter = useRef(0);
  // const BrowseImageLoaded = () => {

  //   browseCounter.current += 1;
  //   // console.log()
  //   // console.log(counter.current);

  //   if (browseCounter.current >= imageArrayLength) {
  //     setBrowseSliderLoading(false);

  //   }
  // }
  const handleClickShowBrowseSlide = (event) => {
    // 👇️ toggle shown state
    setIsShown((current) => !current);
    // browseCounter.current = 1
    //   setLoading(true);
    setBrowseViewIsActive((current) => !current);
    // setLoading(true);
  };

  const handleClick = () => {
    if (searchIndexSlide > imageArrayLength) {
      return false;
    } else {
      slider.slickGoTo(searchIndexSlide);
    }
  };

  const browseSliderOnClickHandler = (index) => {
    slider.slickGoTo(index);
  };

  if (typeof window === "object") {
    var elem = document?.documentElement;
  }

  function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }
  }

  const handleZoomIn = () => {
    if (scale < 2) {
      setScale(scale + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (scale > 0.5) {
      setScale(scale - 0.1);
    }
    setCursorHand(false);
  };

  const handleReset = () => {
    setScale(1);
    setCursorHand(false);
    setOffsetY(0);
  };

  const handleMouseDown = (event) => {
    if (scale > 1) {
      const startY = event.clientY;
      const onMouseMove = (event) => {
        const deltaY = event.clientY - startY;
        setOffsetY(offsetY + deltaY);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", onMouseMove);
      });

      setCursorHand(true);
    }
  };

  return (
    <div
      style={{ backgroundColor: "#000000", position: "relative" }}
      className={clsx({
        "z-[10000]": isFullscreen,
      })}
    >
      <div
        className={clsx("full-page-slider main-container-md min-h-screen", {
          "pt-16": !isFullscreen,
        })}
      >
        <div className="relative">
          <Button
            className="close-button"
            fontSize={["xl", "2xl", "3xl", "3xl"]}
            bgColor={"transparent"}
            color={"white"}
            mt="20px"
            position="absolute"
            top={0}
            right={35}
            zIndex="11"
            mr={[1, 5, 5, 10]}
          >
            <ImCross
              color="yellow"
              onClick={() => {
                router.push("/comics");
              }}
              className="cross-logo absolute"
            />
          </Button>
        </div>
        {/* Main Comic slider */}
        <div
          style={{
            display: loading ? "flex" : "none",
            color: "white",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image src={"/images/loading-gif.gif"} className="loading-gif" />
        </div>
        {/* {loading ? <div style={{height: '100vh'}}> <img src={Gif} /> </div> : (  */}
        <Slider
          ref={(sliderRef) => setSlider(sliderRef)}
          {...settings}
          style={{ display: loading ? "none" : "block" }}
          className={"main-comic-slider min-h-screen"}
        >
          {sliderImage?.map((item, index) => (
            // <div>
            <Flex
              key={Math.random().toString()}
              mr="0.2rem"
              justifyContent={"center"}
            >
              <div className="main-div-slider min-h-screen">
                <Image
                  onLoad={imageLoaded}
                  src={item.url}
                  onMouseDown={handleMouseDown}
                  ref={imageRef}
                  style={{
                    transform: `scale(${scale}) translateY(${offsetY}px)`,
                    cursor: cursorHand ? "grab" : "context-menu",
                  }}
                  id="pic"
                  zIndex="100"
                  h={["auto", "auto", "95vh", "95vh"]}
                  alt="comic"
                  className="ful-page-slider-images"
                  width={"auto"}
                  maxWidth={"100vw"}
                  ml={"0.2rem"}
                  pr={"0.3rem"}
                ></Image>
              </div>
            </Flex>
          ))}
        </Slider>
        {/* )} */}
        {/* <Slider ref={sliderRef => (setSlider(sliderRef))} {...settings} className='main-comic-slider' >
          {sliderImage.map((item, index) => (
            // <div>
            <Flex key={Math.random().toString()} mr='0.2rem' justifyContent={'center'}>
              <div className='main-div-slider'>
                <Image src={item.url} onMouseDown={handleMouseDown} ref={imageRef}  style={{ transform: `scale(${scale}) translateY(${offsetY}px)`, cursor: cursorHand ? "grab" : "context-menu",}} id="pic" zIndex='100'  h={["auto", "auto", "97.7vh", "97.7vh"]} alt="comic" className='ful-page-slider-images' width={'auto'} max-height='100vh' max-width={'100vw'}  ml={'0.2rem'} pr={'0.3rem'} mt={["0", "0", "2", "2"]}></Image>
              </div>
            </Flex>
          ))}
        </Slider> */}

        {/* THIS IS SLIDER NAVIGATION BAR */}
        <Flex
          className={"slider-navigation main-container-md"}
          zIndex="100"
          flexDir={"column"}
          mt={"-7px"}
          padding={5}
          justifyContent={"center"}
          z-index="1"
          position={"absolute"}
          bottom="0"
          width={"100%"}
          bgColor="#3c3c3c"
        >
          {/* 👇️ show elements on click */}
          {/*This is browse slider */}
          {isAtLeast1024px ? (
            <>
              {/* <div style={{display: browseSliderLoading ? "block" : "none", color: 'white', height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
            <img src={Gif} className='loading-gif' />
    </div> */}
              {isShown && (
                <Slider {...browseSlider} className="browse-slider-bottom">
                  {sliderImage.map((item, index) => (
                    <Flex key={Math.random().toString()}>
                      <div className="browse-slider-main-div">
                        <Image
                          src={item.url}
                          onClick={() => browseSliderOnClickHandler(index)}
                          pl="5px"
                          pr="5px"
                          h={"auto"}
                          w={"auto"}
                          max-height="100vh"
                          max-width={"100vw"}
                          opacity={1}
                          cursor={"pointer"}
                        ></Image>
                      </div>
                    </Flex>
                  ))}
                </Slider>
              )}
            </>
          ) : (
            <>
              {/* <div style={{display: browseSliderLoading ? "block" : "none", color: 'white', height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
            <img src={Gif} className='loading-gif' />
    </div> */}
              {isShown && (
                <Slider
                  {...browseSlidermobile}
                  className="browse-slider-bottom"
                >
                  {sliderImage?.map((item, index) => (
                    <Flex key={Math.random().toString()}>
                      <div className="browse-slider-main-div">
                        <Image
                          src={item.url}
                          onClick={() => browseSliderOnClickHandler(index)}
                          pl="5px"
                          pr="5px"
                          h={"auto"}
                          w={"auto"}
                          max-height="100vh"
                          max-width={"100vw"}
                          opacity={1}
                          cursor={"pointer"}
                        ></Image>
                      </div>
                    </Flex>
                  ))}
                </Slider>
              )}
            </>
          )}

          <Flex
            flexDir={"row"}
            justifyContent="space-between"
            alignItems="center"
            w="100%"
          >
            <Flex
              justifyContent={[
                "flex-start",
                "flex-start",
                "flex-end",
                "flex-end",
              ]}
              w={["30%", "30%", "51.75%", "52.75%"]}
            >
              <Text
                color={"white"}
                className="opacity"
                fontSize={["sm", "sm", "md", "lg"]}
              >
                {pageOrPannal} {currentSlide} of {imageArrayLength}
              </Text>
            </Flex>

            <Flex
              justifyContent="end"
              w={["55%", "55%", "47%", "47%"]}
              gap={2}
              alignItems={"center"}
            >
              <Text color={"white"} fontSize={["sm", "sm", "md", "lg"]} mr={5}>
                Jump To
              </Text>
              <Input
                onChange={handleChange}
                type="number"
                min="1"
                max="25"
                mr={5}
                w={["30%", "30%", "20%", "20%"]}
                color="white"
                borderRadius={"16px"}
              ></Input>
              <Button onClick={handleClick}>GO</Button>
            </Flex>
          </Flex>

          <Input
            onChange={(e) => slider.slickGoTo(e.target.value)}
            value={currentSlide}
            type="range"
            min={0}
            max={imageArrayLength}
            className="slider-progress"
          />

          <Flex
            flexDir={"row"}
            justifyContent="space-between"
            alignItems="center"
            w="100%"
          >
            <Flex
              align={"center"}
              flexWrap="wrap"
              justifyContent={[
                "flex-start",
                "flex-start",
                "flex-end",
                "flex-end",
              ]}
              w={["50%", "50%", "60.75%", "62%"]}
            >
              <Button
                onClick={handleChangePageView}
                className={
                  pannelViewIsActive
                    ? "button-active"
                    : "navigation-bottom-button"
                }
                ml={1}
                bgColor={"transparent"}
                title="Page view"
              >
                <HiOutlineDeviceMobile size={"22px"} color="white" />
              </Button>
              <Button
                onClick={handleClickShowBrowseSlide}
                className={
                  browseViewIsActive
                    ? "button-active"
                    : "navigation-bottom-button"
                }
                ml={1}
                bgColor={"transparent"}
                title="Browse pages"
              >
                <BsXDiamond size={"22px"} color="white" />
              </Button>
              <Button
                onClick={handleChangeGuidedView}
                className={
                  guidedViewIsActive
                    ? "button-active"
                    : "navigation-bottom-button"
                }
                ml={1}
                bgColor={"transparent"}
                title="Guided view"
              >
                <BsGrid1X2Fill size={"22px"} color="white" />
              </Button>
              {/* <Button onClick={handleZoomIn}>Zoom In</Button> */}
              {/* <Button onClick={handleZoomOut}>Zoom Out</Button> */}
              {zoomButtons === true ? (
                <Flex
                  gap={2}
                  mt={["10px", "0", "0", "0"]}
                  ml={["10px", "0", "0", "0"]}
                >
                  <AiOutlineZoomIn
                    onClick={handleZoomIn}
                    title="zoom-in"
                    color="white"
                    size={"22px"}
                    cursor="pointer"
                  />
                  <AiOutlineZoomOut
                    onClick={handleZoomOut}
                    title="zoom-out"
                    color="white"
                    size={"22px"}
                    cursor="pointer"
                  />
                  <MdRestore
                    onClick={handleReset}
                    title="reset-zoom"
                    color="white"
                    size={"22px"}
                    cursor="pointer"
                  />
                </Flex>
              ) : (
                <Flex
                  gap={2}
                  mt={["10px", "0", "0", "0"]}
                  ml={["10px", "0", "0", "0"]}
                >
                  <AiOutlineZoomIn
                    title="zoom-in"
                    color="white"
                    size={"22px"}
                    cursor="not-allowed"
                  />
                  <AiOutlineZoomOut
                    title="zoom-out"
                    color="white"
                    size={"22px"}
                    cursor="not-allowed"
                  />
                  <MdRestore
                    title="reset-zoom"
                    color="white"
                    size={"22px"}
                    cursor="not-allowed"
                  />
                </Flex>
              )}
            </Flex>

            <Flex
              justifyContent="end"
              w={["35%", "55%", "47%", "47%"]}
              alignItems={"center"}
            >
              <Button
                onClick={() => openFullscreen()}
                z-index="1"
                fontSize={["14px", "14px", "16px", "16px"]}
              >
                Open Fullscreen
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </div>
    </div>
  );
}
export default ComicSliderDetails;
