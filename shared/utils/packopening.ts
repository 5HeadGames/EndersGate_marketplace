import { convertArrayCards } from "@shared/components/common/convertCards";

const getCardsType = (type) => {
  const allCards = convertArrayCards();
  return allCards.filter((c) => c.typeCard === type);
};

export const getTypePackAnimation = (id, cards) => {
  console.log(id, cards, "getTypePack");
  const goldCards = getCardsType("gold").map((c) => c?.properties?.id?.value);
  const ironCards = getCardsType("iron").map((c) => c?.properties?.id?.value);
  const stoneCards = getCardsType("stone").map((c) => c?.properties?.id?.value);
  const legendaryCards = getCardsType("legendary").map(
    (c) => c?.properties?.id?.value,
  );

  switch (id) {
    case 0:
      if (
        cards.filter((card) => stoneCards.includes(parseInt(card))).length > 0
      ) {
        return 2;
      } else {
        return 0;
      }
    case 1:
      if (
        cards.filter((card) => goldCards.includes(parseInt(card))).length > 0
      ) {
        return 2;
      } else if (
        cards.filter((card) => ironCards.includes(parseInt(card))).length > 0
      ) {
        return 1;
      } else {
        return 0;
      }
    case 2:
      if (
        cards.filter((card) => legendaryCards.includes(parseInt(card))).length >
        0
      ) {
        return 2;
      } else {
        return 1;
      }
    case 3:
      console.log(
        cards.filter((card) => legendaryCards.includes(parseInt(card))),
        legendaryCards,
      );

      if (
        cards.filter((card) => legendaryCards.includes(parseInt(card))).length >
        1
      ) {
        return 2;
      } else {
        return 1;
      }
  }
};
