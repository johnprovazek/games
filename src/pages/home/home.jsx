import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Game from "../../components/game/game";
import useGames from "../../hooks/useGames/useGames";

const HomePage = () => {
  const { games, allSelected, toggleAll, toggleId, openGames } = useGames();
  const [buttonHovered, setButtonHovered] = useState(false);

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
          {games.map((game, key) => (
            <Game
              key={key}
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
        </Stack>
      </Box>
    </>
  );
};

export default HomePage;
