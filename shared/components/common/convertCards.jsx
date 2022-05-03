import cards from "../../../cards.json";

export const convertArrayCards = () => {
  let countLength = 0;
  Object.keys(cards).forEach((key, index) => {
    cards[key]?.forEach((card, index) => {
      countLength++;
    });
  });
  const newArray = [];
  Object.keys(cards).forEach((key, index) => {
    cards[key]?.forEach((card, index) => {
      if (card.properties?.id?.value !== undefined) {
        // console.log(key, "if");
        newArray[parseInt(card.properties.id.value)] = {
          ...card,
          typeCard: key,
        };
      } else {
        newArray.push({ ...card, typeCard: key });
      }
    });
  });
  return newArray;
};
