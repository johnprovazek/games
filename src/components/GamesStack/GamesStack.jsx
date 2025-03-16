import Stack from "@mui/material/Stack";
import Game from "../Game/Game.jsx";
import { DndContext, KeyboardSensor, useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import gamesData from "../../assets/data/gamesData.json";

const GamesStack = ({ games, powerMode, updateGames }) => {
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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      updateGames((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleSelection = (id) => {
    const updatedGames = games.map((game) => {
      if (game.id === id) {
        return { ...game, selected: !game.selected };
      }
      return game;
    });
    updateGames(updatedGames);
  };

  return (
    <Stack spacing={2} mb={2} direction="column">
      <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
        <SortableContext items={games} strategy={verticalListSortingStrategy}>
          {games.map((game) => (
            <Game
              key={game.id}
              id={game.id}
              selected={game.selected}
              link={gamesData.data[game.id].link}
              description={gamesData.data[game.id].description}
              textColor={gamesData.data[game.id].textColor}
              powerMode={powerMode}
              backgroundColor={gamesData.data[game.id].backgroundColor}
              updateSelectionBox={toggleSelection}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Stack>
  );
};

export default GamesStack;
