import { useState, useEffect } from "react";
import gamesList from "../../assets/data/gamesList.json";

// 0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U
// V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z

const b62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const b62Half = 31;
const b62KeyName = "list";

const initGames = () => {
  let code = new URLSearchParams(window.location.search).get(b62KeyName) || localStorage.getItem(b62KeyName);
  if (code && validateCode(code)) {
    let decodedGameList = [];
    for (let id of code.split("")) {
      let selected = b62.indexOf(id) >= b62Half;
      let object = gamesList.find((obj) => id === (selected ? obj.selectedId : obj.id));
      if (object) {
        decodedGameList.push({ ...object, selected: selected });
      }
    }
    return decodedGameList;
  } else {
    return gamesList.map((gameObj) => ({
      ...gameObj,
      selected: false,
    }));
  }
};

const validateCode = (code) => {
  let totalGames = gamesList.length;
  if (code.length !== totalGames) {
    return false; // Length of characters (id) in code doesn't match game count.
  }
  let parse = Array(b62Half).fill(0);
  for (let i = 0; i < code.length; i++) {
    let index = b62.indexOf(code[i]);
    if (index !== -1) {
      let rangeIndex = index % b62Half;
      if (rangeIndex < totalGames) {
        let indexCount = parse[rangeIndex] + 1;
        if (indexCount <= 1) {
          parse[rangeIndex] = indexCount;
        } else {
          return false; // Duplicate character (id) or contains both selected and unselected character (id) values.
        }
      } else {
        return false; // Character (id) isn't valid id yet. In base62 range.
      }
    } else {
      return false; // Character (id) Invalid. Not in base62 range.
    }
  }
  return true;
};

const useGames = () => {
  const [games, setGames] = useState(initGames());
  const [allSelected, setAllSelected] = useState(false);

  const toggleAll = () => {
    const updatedGames = games.map((game) => ({
      ...game,
      selected: !allSelected,
    }));
    setGames(updatedGames);
  };

  const toggleId = (id) => {
    const updatedGames = games.map((game) => {
      if (game.id === id) {
        return { ...game, selected: !game.selected };
      }
      return game;
    });
    setGames(updatedGames);
  };

  const openGames = () => {
    games.forEach((game) => {
      if (game.selected) {
        window.open(game.link);
      }
    });
  };

  useEffect(() => {
    let newCode = "";
    let allBoxesSelected = true;
    games.forEach((game) => {
      newCode = newCode + (game.selected ? game.selectedId : game.id);
      if (game.selected === false) {
        allBoxesSelected = false;
      }
    });
    localStorage.setItem(b62KeyName, newCode);
    const url = new URL(window.location.href);
    url.searchParams.set(b62KeyName, newCode);
    window.history.replaceState({}, "", url.toString());
    setAllSelected(allBoxesSelected);
  }, [games]);

  return {
    games,
    allSelected,
    toggleAll,
    toggleId,
    openGames,
  };
};

export default useGames;
