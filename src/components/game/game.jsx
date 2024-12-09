import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxTwoToneIcon from "@mui/icons-material/CheckBoxTwoTone";
import CheckBoxOutlineBlankTwoToneIcon from "@mui/icons-material/CheckBoxOutlineBlankTwoTone";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import IconButton from "@mui/material/IconButton";

const Game = ({ name, id, textColor, backgroundColor, link, description, selected, updateSelectionBox }) => {
  return (
    <>
      <Card sx={{ backgroundColor: backgroundColor }}>
        <CardContent>
          <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
            <Box
              component="img"
              sx={{
                height: 36,
                width: 36,
                borderRadius: 1,
              }}
              src={"/games/icons/" + id + ".ico"}
            />
            <Typography variant="h5" sx={{ color: textColor, ml: 2 }}>
              {name}
            </Typography>
            <Box sx={{ marginLeft: "auto" }}>
              <IconButton
                disableRipple
                href={link}
                sx={{ "& .MuiSvgIcon-root": { width: 48, height: 48 }, p: 0, color: "default.black" }}
              >
                <LaunchTwoToneIcon />
              </IconButton>
              <Checkbox
                disableRipple
                color="default.black"
                sx={{
                  "& .MuiSvgIcon-root": { width: 48, height: 48 },
                  p: 0,
                  pl: 1,
                  color: "default.black",
                }}
                icon={<CheckBoxOutlineBlankTwoToneIcon />}
                checkedIcon={<CheckBoxTwoToneIcon />}
                checked={selected}
                onChange={() => {
                  updateSelectionBox(id);
                }}
              />
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: textColor, width: "calc(100% - 100px)" }}>
            {description}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default Game;
