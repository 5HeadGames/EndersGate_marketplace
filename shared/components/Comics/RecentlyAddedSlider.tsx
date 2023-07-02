import React from "react";
import { Flex, Text } from "@chakra-ui/react";

function RecentlyAddedSlider() {
  return (
    <Flex
      pb={16}
      w="100%"
      className="main-container-md"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      bgImage={`url(${
        "/images/ComicSeriesBgColor.png" ||
        "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIPEhUSDxIWFRUVFRUVFRUVFRcVFhUXFRUWFhcVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKCwUFDgUFGisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAKgBLAMBIgACEQEDEQH/xAAZAAEBAQEBAQAAAAAAAAAAAAAAAQIDBAf/xAAlEAEBAQEAAQIGAgMAAAAAAAAAARECEiFBMVFhkbHwcYGhwfH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APrCsqCriNQDFkGpASRqRZFkBJys5akWQGfFfFvDAZ8V8WsXAZ8TxaxcBjxXxaxcBjxPFrDAY8TxbwwHPxPFuwwHPxTxdLEsBz8UvLpiWA5WJY6YzYDniY6WM0GMRqpQRCmgCGgsXFkakQZ5jciyNzkGZGpG5GpyDMiyNyNSA541I1IsgMyLjWLgMSLjWLgMYRswGcMaAYq40AziWNgMQxrDAYxMdKmAxjOOuJgONiY7YzgONjNjvYxYDhiWO15ZsBxsYduoxYDCNoDpI3zynMdeYCTlvmLI1gJI3IsiyAki4pAMMUACKCYKlAUARRICgAGIoGIqUAUBksUgJiWNIDFiY2mA5Xlix3sY6gOFjFjvY52A42M116jHqD0c8unMTmOkgLIsiyLAJFFBFAAIAAAAAAAAAAAAAAAAAAAJVATEaQGbGbHSpYDlY59R2sY6gOHUc7y79RzsB6eY3InLUBeYooCRQAAEqgAACRQASKAAAlUAAASKACKAAAlUAAAQUBixix0rNgOPUc7HbpzoO8bjny6QGoJCwFAABJAUAASKACWAoAAhICgACKACWAoAAJICgACKACWAM1pmg59OVdenG/z+AeiNxy5rcoNqzGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAErNarHVBjpzrfTnaDpzW44yukoOsWMStQGiJFBRNAMUAAASRUigJigAiwExQABAJFABMUAEigmKACFTQAtZtArn0trn1QTqudXqsWg3zXTmuErcoO/PTcrhK3KDrK1rnKsoNqzqguqmgKIoJFSLoAQAAAgEApAAAABAWmogKJqaC2palrNoLazalrFoL1XPql6YtA6rGlrOgsrUrnKvNB2lbnTha1KDtxb759Pf/Lcv3cZW50DrrUrlOmp0DpKuucq6DerrnOlgLzuesnv6T4fhrWOb9M+P/WtBoZ00F/K1NNBU/Yazb7Z+wF43PWTffPh98arNPIF01NNBdv8AZazpoLrN/r6f6NTQJbnrm/z6ffC1i3PZNBq1m9M3pm9A1emL0lrNoFrF3PTFtZtBNv7UpQBQA5vzblAFlalAGp01OgBqdHPXzAGvJdADm33a0ANXQA00ANSX5gC6mqAzLfc0ANTyAE8mb0AJemPL5gCXpm0AZ35paAM6gAIAP//Z"
      })`}
      bgPosition="center"
      bgSize="cover"
    >
      <Text color="white" fontSize={["3xl", "3xl", "5xl", "5xl"]}>
        COMIC SERIES
      </Text>
      <Flex
        width={["10rem", "10rem", "15rem", "25rem"]}
        alignItems="center"
        flexDir="column"
      ></Flex>
      <Flex mt={5} flexDir={["column", "column", "row", "row"]}>
        <Card image={"/images/ComicSeriesBanner1.png"} />
        <Card
          image={"/images/ComicSeriesBanner1.png"}
          ml={["0", "0", "3", "3"]}
          mt={["3", "3", "0", "0"]}
        />
        <Card
          image={"/images/ComicSeriesBanner1.png"}
          ml={["0", "0", "3", "3"]}
          mt={["3", "3", "0", "0"]}
        />
      </Flex>
    </Flex>
  );
}

export default RecentlyAddedSlider;

const Card = ({ image, ...rest }) => {
  return (
    <Flex
      {...rest}
      width="18rem"
      bgSize="cover"
      h="10rem"
      bgColor="grey"
      bgImage={
        image
          ? `url(${
              image ||
              "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIPEhUSDxIWFRUVFRUVFRUVFRcVFhUXFRUWFhcVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKCwUFDgUFGisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAKgBLAMBIgACEQEDEQH/xAAZAAEBAQEBAQAAAAAAAAAAAAAAAQIDBAf/xAAlEAEBAQEAAQIGAgMAAAAAAAAAARECEiFBMVFhkbHwcYGhwfH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APrCsqCriNQDFkGpASRqRZFkBJys5akWQGfFfFvDAZ8V8WsXAZ8TxaxcBjxXxaxcBjxPFrDAY8TxbwwHPxPFuwwHPxTxdLEsBz8UvLpiWA5WJY6YzYDniY6WM0GMRqpQRCmgCGgsXFkakQZ5jciyNzkGZGpG5GpyDMiyNyNSA541I1IsgMyLjWLgMSLjWLgMYRswGcMaAYq40AziWNgMQxrDAYxMdKmAxjOOuJgONiY7YzgONjNjvYxYDhiWO15ZsBxsYduoxYDCNoDpI3zynMdeYCTlvmLI1gJI3IsiyAki4pAMMUACKCYKlAUARRICgAGIoGIqUAUBksUgJiWNIDFiY2mA5Xlix3sY6gOFjFjvY52A42M116jHqD0c8unMTmOkgLIsiyLAJFFBFAAIAAAAAAAAAAAAAAAAAAAJVATEaQGbGbHSpYDlY59R2sY6gOHUc7y79RzsB6eY3InLUBeYooCRQAAEqgAACRQASKAAAlUAAASKACKAAAlUAAAQUBixix0rNgOPUc7HbpzoO8bjny6QGoJCwFAABJAUAASKACWAoAAhICgACKACWAoAAJICgACKACWAM1pmg59OVdenG/z+AeiNxy5rcoNqzGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAErNarHVBjpzrfTnaDpzW44yukoOsWMStQGiJFBRNAMUAAASRUigJigAiwExQABAJFABMUAEigmKACFTQAtZtArn0trn1QTqudXqsWg3zXTmuErcoO/PTcrhK3KDrK1rnKsoNqzqguqmgKIoJFSLoAQAAAgEApAAAABAWmogKJqaC2palrNoLazalrFoL1XPql6YtA6rGlrOgsrUrnKvNB2lbnTha1KDtxb759Pf/Lcv3cZW50DrrUrlOmp0DpKuucq6DerrnOlgLzuesnv6T4fhrWOb9M+P/WtBoZ00F/K1NNBU/Yazb7Z+wF43PWTffPh98arNPIF01NNBdv8AZazpoLrN/r6f6NTQJbnrm/z6ffC1i3PZNBq1m9M3pm9A1emL0lrNoFrF3PTFtZtBNv7UpQBQA5vzblAFlalAGp01OgBqdHPXzAGvJdADm33a0ANXQA00ANSX5gC6mqAzLfc0ANTyAE8mb0AJemPL5gCXpm0AZ35paAM6gAIAP//Z"
            })`
          : "grey"
      }
    />
  );
};
