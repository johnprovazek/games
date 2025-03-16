import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GamesStack from "../../components/GamesStack/GamesStack.jsx";
import Warning from "../../components/Warning/Warning.jsx";
import gamesData from "../../assets/data/gamesData.json";
import useLocalStorage from "../../hooks/useLocalStorage.jsx";

// Safari on iOS allows enabling popups only globally not scoped to individual sites.
// Disabling power user feature for Safari on iOS users.
const ALLOW_POWER_USERS =
  !(navigator.userAgent.toLowerCase().includes("iphone") || navigator.userAgent.toLowerCase().includes("ipad")) ||
  navigator.userAgent.toLowerCase().includes("crios");
// Chrome on android opens multiple links in reverse order.
const LINKS_ORDER_NORMAL = !(
  navigator.userAgent.toLowerCase().includes("android") &&
  navigator.userAgent.toLowerCase().includes("chrome") &&
  navigator.userAgent.toLowerCase().includes("mobile")
);
const GAMES_LIST_KEY_NAME = "games-list";
const GAMES_POWER_MODE_KEY_NAME = "games-power-mode";
const GAMES_WARNING_ACKNOWLEDGED_KEY_NAME = "games-warning-acknowledged";
const DEFAULT_GAMES = gamesData.list.map((game) => ({
  id: game,
  selected: false,
}));

// Validates local storage games. Removing any outdated games and adding any new games.
const validateLocalStorageGames = (localStorageGames) => {
  const validGames = [];
  const validIdsSet = new Set(gamesData.list);
  localStorageGames.forEach((game) => {
    if (validIdsSet.has(game.id)) {
      validGames.push(game);
    }
  });
  const validGamesIds = new Set(validGames.map((game) => game.id));
  gamesData.list.forEach((id) => {
    if (!validGamesIds.has(id)) {
      validGames.push({ id: id, selected: false });
    }
  });
  return validGames;
};

const HomePage = () => {
  const [games, setGames] = useLocalStorage(GAMES_LIST_KEY_NAME, DEFAULT_GAMES, validateLocalStorageGames);
  const [powerMode, setPowerMode] = useLocalStorage(GAMES_POWER_MODE_KEY_NAME, false);
  const [warningAcknowledged, setWarningAcknowledged] = useLocalStorage(GAMES_WARNING_ACKNOWLEDGED_KEY_NAME, false);
  const [warningOpen, setWarningOpen] = useState(false);

  let allSelected = games.every((obj) => obj.selected === true);
  let noneSelected = games.every((obj) => obj.selected === false);

  const toggleAll = () => {
    setGames(
      games.map((game) => ({
        ...game,
        selected: !allSelected,
      })),
    );
  };

  const togglePowerMode = () => {
    if (!warningAcknowledged) {
      setWarningOpen(true);
    }
    setPowerMode(!powerMode);
  };

  const acknowledge = () => {
    setWarningAcknowledged(true);
    setWarningOpen(false);
  };

  const openGames = () => {
    let gamesOrdered = LINKS_ORDER_NORMAL ? games : [...games].reverse();
    gamesOrdered
      .filter((game) => game.selected)
      .forEach((game) => window.open(gamesData.data[game.id].link, "_blank", "noopener,noreferrer"));
  };

  return (
    <>
      <Warning open={warningOpen} acknowledge={acknowledge} />
      <Box mb={12}>
        <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" my={3}>
          <Typography color="default.grey" variant="h4">
            Games
          </Typography>
          <Typography color="default.grey" variant="subtitle1">
            A list of fun daily internet games.
          </Typography>
          {powerMode && (
            <Stack spacing={2} direction="row" mt={1}>
              <Button
                variant="contained"
                onClick={() => toggleAll()}
                sx={{
                  minWidth: "140px",
                  color: "default.grey",
                  backgroundColor: "default.white",
                }}
              >
                {allSelected ? "Deselect All" : "Select All"}
              </Button>
              <Button
                variant="contained"
                disabled={noneSelected}
                onClick={() => openGames()}
                sx={{
                  minWidth: "140px",
                  color: "default.grey",
                  backgroundColor: "default.white",
                }}
              >
                Open Selected
              </Button>
            </Stack>
          )}
        </Box>
        <GamesStack games={games} powerMode={powerMode} updateGames={setGames} />
        <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
          {ALLOW_POWER_USERS && (
            <Button
              variant="text"
              disableRipple
              onClick={() => togglePowerMode()}
              sx={{
                color: "default.grey",
              }}
            >
              {powerMode ? "Disable Power User Mode" : "Enable Power User Mode"}
            </Button>
          )}
          {!ALLOW_POWER_USERS && (
            <Typography color="default.grey" variant="button">
              Limited Features on Safari iOS
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
