export const filterCards = ({ card, filters, cardType, type, search }) => {
  let passed = false;

  if (cardType === "all") {
    if (
      filters.avatar.length === 0 &&
      filters.cardRace.length === 0 &&
      filters.cardRole.length === 0 &&
      filters.cardElement.length === 0 &&
      type === ""
    ) {
      passed = true;
    }

    if (filters.cardElement.length > 0) {
      if (
        filters.cardElement?.includes(
          card?.properties?.element?.value?.toLowerCase(),
        )
      ) {
        passed = true;
      } else {
        return false;
      }
    }
    if (filters.cardRace.length > 0) {
      if (
        filters.cardRace?.includes(card?.properties?.race?.value?.toLowerCase())
      ) {
        passed = true;
      } else {
        return false;
      }
    }
    if (filters.cardRole.length > 0) {
      if (
        filters.cardRole?.includes(card?.properties?.role?.value?.toLowerCase())
      ) {
        passed = true;
      } else {
        return false;
      }
    }
    if (filters.avatar.length > 0) {
      if (filters.avatar?.includes("avatars")) {
        if (card?.typeCard === "avatar") {
          passed = true;
        } else {
          return false;
        }
      }
      if (filters.avatar?.includes("guardians")) {
        if (card?.properties?.isGuardian?.value === true) {
          passed = true;
        } else {
          return false;
        }
      }
      if (filters.avatar?.includes("reaction")) {
        if (card.typeCard === "reaction") {
          passed = true;
        } else {
          return false;
        }
      }
      if (filters.avatar?.includes("action")) {
        if (card.typeCard === "action") {
          passed = true;
        } else {
          return false;
        }
      }
      if (filters.avatar?.includes("ghost cards")) {
        if (card?.name === "Shinobi Guardian") {
          passed = true;
        } else {
          return false;
        }
      }
    }
  } else {
    if (cardType === card.typeCard) {
      if (
        filters.avatar.length === 0 &&
        filters.cardRace.length === 0 &&
        filters.cardRole.length === 0 &&
        filters.cardElement.length === 0 &&
        type === ""
      ) {
        passed = true;
      }
      if (filters.cardElement.length > 0) {
        if (
          filters.cardElement?.includes(
            card?.properties?.element?.value?.toLowerCase(),
          )
        ) {
          passed = true;
        } else {
          return false;
        }
      }
      if (filters.cardRace.length > 0) {
        if (
          filters.cardRace?.includes(
            card?.properties?.race?.value?.toLowerCase(),
          )
        ) {
          passed = true;
        } else {
          return false;
        }
      }
      if (filters.cardRole.length > 0) {
        if (
          filters.cardRole?.includes(
            card?.properties?.role?.value?.toLowerCase(),
          )
        ) {
          passed = true;
        } else {
          return false;
        }
      }
      if (filters.avatar.length > 0) {
        if (filters.avatar?.includes("avatars")) {
          if (card?.properties?.isGuardian?.value === true) {
            passed = true;
          } else {
            return false;
          }
        }
        if (filters.avatar?.includes("guardians")) {
          if (card?.properties?.isGuardian?.value === true) {
            passed = true;
          } else {
            return false;
          }
        }
        if (filters.avatar?.includes("reaction")) {
          if (card.typeCard === "reaction") {
            passed = true;
          } else {
            return false;
          }
        }
        if (filters.avatar?.includes("action")) {
          if (card.typeCard === "action") {
            passed = true;
          } else {
            return false;
          }
        }
        if (filters.avatar?.includes("ghost cards")) {
          if (card?.name === "Shinobi Guardian") {
            passed = true;
          } else {
            return false;
          }
        }
      }
    }
  }
  if (type === "guardian_cards" && card?.properties?.isGuardian?.value) {
    if (filters.cardRarity.length === 0) {
      passed = true;
    } else {
      if (filters.cardRarity?.includes(card?.typeCard.toLowerCase())) {
        passed = true;
      } else {
        return false;
      }
    }
  } else if (type === "guardian_cards") {
    return false;
  }

  if (search === "") {
    return passed;
  } else if (card?.name.toLowerCase().includes(search.toLowerCase())) {
    return passed;
  } else {
    return false;
  }
};

export const filterPacks = ({ pack, type, filters, search }) => {
  let passed = false;
  if (type === "guardian_cards" || type === "trading_cards") {
    return false;
  }
  if (filters.packRarity.length > 0) {
    if (filters.packRarity.includes(pack.properties.name.value.toLowerCase())) {
      passed = true;
    }
  } else {
    passed = true;
  }

  if (search === "") {
    return passed;
  } else if (pack?.name.toLowerCase().includes(search.toLowerCase())) {
    return passed;
  } else {
    return false;
  }
};
