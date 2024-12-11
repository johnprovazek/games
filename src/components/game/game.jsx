import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxTwoToneIcon from "@mui/icons-material/CheckBoxTwoTone";
import CheckBoxOutlineBlankTwoToneIcon from "@mui/icons-material/CheckBoxOutlineBlankTwoTone";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import IconButton from "@mui/material/IconButton";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Game = ({
  name,
  id,
  textColor,
  backgroundColor,
  link,
  description,
  selected,
  selectableLinks,
  updateSelectionBox,
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({ id });

  return (
    <Card
      ref={setNodeRef}
      sx={{ backgroundColor: backgroundColor, transform: CSS.Translate.toString(transform), transition }}
    >
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
          <Typography
            variant="h5"
            sx={{
              color: textColor,
              ml: 2,
              overflowX: "clip",
              textWrap: "nowrap",
              textOverflow: "ellipsis",
              maxWidth: `calc(100% - ${selectableLinks ? 204 : 108}px)`,
            }}
          >
            {name}
          </Typography>
          <Box sx={{ marginLeft: "auto" }}>
            <IconButton
              {...attributes}
              {...listeners}
              disableRipple
              sx={{
                "& .MuiSvgIcon-root": { width: 48, height: 48 },
                p: 0,
                color: "default.black",
                cursor: isDragging ? "grabbing" : "grab",
                display: selectableLinks ? "inline-flex" : "none",
              }}
            >
              <DragIndicatorIcon />
            </IconButton>
            <Checkbox
              disableRipple
              color="default.black"
              sx={{
                "& .MuiSvgIcon-root": { width: 48, height: 48 },
                p: 0,
                color: "default.black",
                display: selectableLinks ? "inline-flex" : "none",
              }}
              icon={<CheckBoxOutlineBlankTwoToneIcon />}
              checkedIcon={<CheckBoxTwoToneIcon />}
              checked={selected}
              onChange={() => {
                updateSelectionBox(id);
              }}
            />
            <IconButton
              disableRipple
              href={link}
              target="_blank"
              sx={{ "& .MuiSvgIcon-root": { width: 48, height: 48 }, p: 0, color: "default.black", ml: 1 }}
            >
              <LaunchTwoToneIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: textColor, width: "calc(100% - 100px)" }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Game;
