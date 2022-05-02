import cards from "../../cards2.json";

export const convertArrayCards = () => {
  console.log(cards);

  let countLength = 0;

  Object.keys(cards).forEach((key, index) => {
    console.log(key);
    cards[key]?.forEach((card, index) => {
      countLength++;
    });
  });
  const newArray = [];
  Object.keys(cards).forEach((key, index) => {
    console.log(key);
    cards[key]?.forEach((card, index) => {
      if (card.properties?.id?.value) {
        newArray[parseInt(card.properties.id.value)] = card;
      } else {
        newArray.push(card);
      }
    });
  });

  console.log(newArray);
  return newArray;
};
