import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DndContext, KeyboardSensor, useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import Game from "../../components/game/game";
import gamesData from "../../assets/data/gamesData.json";

const B62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const B62_HALF = 31;
const B62_KEY_NAME = "list";
const VERSION_KEY_NAME = "version";
const LINKS_ORDER_NORMAL = !(
  navigator.userAgent.toLowerCase().includes("android") &&
  navigator.userAgent.toLowerCase().includes("chrome") &&
  navigator.userAgent.toLowerCase().includes("mobile")
);
const LINKS_SELECTABLE =
  !(navigator.userAgent.toLowerCase().includes("iphone") || navigator.userAgent.toLowerCase().includes("ipad")) ||
  navigator.userAgent.toLowerCase().includes("crios");

const gamesToCode = (games) => {
  return games.reduce((code, game) => code + (game.selected ? game.selectedId : game.id), "");
};

const codeToGames = (code) => {
  let decodedGames = [];
  for (let id of code.split("")) {
    let gameSelected = B62.indexOf(id) >= B62_HALF;
    let gameObject = gamesData.gamesList.find((obj) => id === (gameSelected ? obj.selectedId : obj.id));
    if (gameObject) {
      decodedGames.push({ ...gameObject, selected: gameSelected });
    }
  }
  return decodedGames;
};

const validateCode = (code, gamesLength) => {
  if (code.length !== gamesLength) {
    return false; // Length of characters (id) in code doesn't match game count.
  }
  let duplicateCodeArray = Array(B62_HALF).fill(0);
  for (let i = 0; i < code.length; i++) {
    let index = B62.indexOf(code[i]);
    if (index === -1) {
      return false; // Character (id) Invalid. Not in base62 range.
    }
    let rangeIndex = index % B62_HALF;
    if (rangeIndex > gamesLength) {
      return false; // Character (id) isn't valid id yet. In base62 range.
    }
    let indexCount = duplicateCodeArray[rangeIndex] + 1;
    if (indexCount > 1) {
      return false; // Duplicate character (id) or contains both selected and unselected character (id) values.
    } else {
      duplicateCodeArray[rangeIndex] = indexCount;
    }
  }
  return true;
};

const HomePage = () => {
  const [games, setGames] = useState(null);
  const [allSelected, setAllSelected] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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
    let gamesOrdered = LINKS_ORDER_NORMAL ? games : [...games].reverse();
    gamesOrdered.forEach((game) => {
      if (game.selected) {
        window.open(game.link);
      }
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setGames((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    if (games !== null) {
      let newCode = gamesToCode(games);
      localStorage.setItem(B62_KEY_NAME, newCode);
      const url = new URL(window.location.href);
      url.searchParams.set(B62_KEY_NAME, newCode);
      window.history.replaceState({}, "", url.toString());
      let allBoxesSelected = games.every((game) => game.selected);
      setAllSelected(allBoxesSelected);
    }

    window.addEventListener("storage", () => {
      const updatedCode = localStorage.getItem(B62_KEY_NAME);
      if (games !== null && updatedCode !== gamesToCode(games)) {
        setGames(codeToGames(updatedCode));
      }
    });

    return () => {
      window.removeEventListener("storage", () => {});
    };
  }, [games]);

  useEffect(() => {
    const defaultGames = gamesData.gamesList.map((gameObject) => ({
      ...gameObject,
      selected: false,
    }));

    let code = new URLSearchParams(window.location.search).get(B62_KEY_NAME) || localStorage.getItem(B62_KEY_NAME);
    if (code) {
      let currentVersion = localStorage.getItem(VERSION_KEY_NAME);
      if (currentVersion && currentVersion < gamesData.version && validateCode(code, code.length)) {
        let currentGames = codeToGames(code);
        const currentGamesIds = new Set(currentGames.map((gameObject) => gameObject.id));
        const missingGames = gamesData.gamesList.filter((gameObject) => !currentGamesIds.has(gameObject.id));
        setGames([...currentGames, ...missingGames]);
      } else if (validateCode(code, gamesData.gamesList.length)) {
        setGames(codeToGames(code));
      } else {
        setGames(defaultGames);
      }
    } else {
      setGames(defaultGames);
    }
    localStorage.setItem(VERSION_KEY_NAME, gamesData.version);
  }, []);

  return (
    <>
      <Box mb={2}>
        <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
          <Typography color="default.black" variant="h4" mt={2}>
            Games
          </Typography>
          <Typography color="default.black" variant="subtitle1" sx={{ minHeight: "36px" }}>
            A list of fun daily internet games.
          </Typography>
          <Typography color="default.black" variant="subtitle1" sx={{ minHeight: "36px" }}>
            {buttonHovered ? <i>Enable popups to open multiple pages at once.</i> : " "}
          </Typography>
          <Stack spacing={2} direction="row" mt={1}>
            <Button
              variant="contained"
              onClick={toggleAll}
              sx={{
                minWidth: "140px",
                color: "default.black",
                backgroundColor: "default.white",
                display: LINKS_SELECTABLE ? "block" : "none",
              }}
            >
              {allSelected ? "Deselect All" : "Select All"}
            </Button>
            <Button
              variant="contained"
              onClick={() => openGames()}
              sx={{
                minWidth: "140px",
                color: "default.black",
                backgroundColor: "default.white",
                display: LINKS_SELECTABLE ? "block" : "none",
              }}
              onMouseOver={() => setButtonHovered(true)}
              onMouseOut={() => setButtonHovered(false)}
            >
              Open Selected
            </Button>
          </Stack>
        </Box>
        {games && (
          <Stack spacing={2} mt={2} mb={12}>
            <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
              <SortableContext items={games}>
                {games.map((game) => (
                  <Game
                    key={game.id}
                    id={game.id}
                    game={game}
                    selectableLinks={LINKS_SELECTABLE}
                    updateSelectionBox={toggleId}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </Stack>
        )}
      </Box>
    </>
  );
};

export default HomePage;
