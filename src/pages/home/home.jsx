import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DndContext, KeyboardSensor, useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import Game from "../../components/game/game";
import gamesList from "../../assets/data/gamesList.json";

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

const HomePage = () => {
  const [games, setGames] = useState(initGames());
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
    games.forEach((game) => {
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
              sx={{ minWidth: "140px", color: "default.black", backgroundColor: "default.white" }}
            >
              {allSelected ? "Deselect All" : "Select All"}
            </Button>
            <Button
              variant="contained"
              onClick={() => openGames()}
              sx={{ minWidth: "140px", color: "default.black", backgroundColor: "default.white" }}
              onMouseOver={() => setButtonHovered(true)}
              onMouseOut={() => setButtonHovered(false)}
            >
              Open Selected
            </Button>
          </Stack>
        </Box>
        <Stack spacing={2} mt={2} mb={12}>
          <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
            <SortableContext items={games}>
              {games.map((game) => (
                <Game
                  key={game.id}
                  name={game.name}
                  id={game.id}
                  textColor={game.textColor}
                  backgroundColor={game.backgroundColor}
                  link={game.link}
                  description={game.description}
                  selected={game.selected}
                  updateSelectionBox={toggleId}
                />
              ))}
            </SortableContext>
          </DndContext>
        </Stack>
      </Box>
    </>
  );
};

export default HomePage;
