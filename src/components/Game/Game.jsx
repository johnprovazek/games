import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxTwoToneIcon from "@mui/icons-material/CheckBoxTwoTone";
import CheckBoxOutlineBlankTwoToneIcon from "@mui/icons-material/CheckBoxOutlineBlankTwoTone";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import IconButton from "@mui/material/IconButton";
import LaunchTwoToneIcon from "@mui/icons-material/LaunchTwoTone";
import Typography from "@mui/material/Typography";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Game = ({ id, selected, link, description, textColor, powerMode, backgroundColor, updateSelectionBox }) => {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <Card
      ref={setNodeRef}
      sx={{
        backgroundColor: backgroundColor,
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
      }}
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
            src={`/games/icons/${id.replaceAll(" ", "")}.ico`}
          />
          <Typography
            variant="h5"
            sx={{
              color: textColor,
              ml: 2,
              overflowX: "clip",
              textWrap: "nowrap",
              textOverflow: "ellipsis",
              maxWidth: `calc(100% - ${powerMode ? 204 : 108}px)`,
            }}
          >
            {id}
          </Typography>
          <Box sx={{ marginLeft: "auto" }}>
            <IconButton
              {...attributes}
              {...listeners}
              disableRipple
              sx={{
                "& .MuiSvgIcon-root": { width: 48, height: 48 },
                p: 0,
                color: "default.grey",
                cursor: isDragging ? "grabbing" : "grab",
                display: powerMode ? "inline-flex" : "none",
              }}
            >
              <DragIndicatorIcon />
            </IconButton>
            <Checkbox
              disableRipple
              color="default.grey"
              sx={{
                "& .MuiSvgIcon-root": { width: 48, height: 48 },
                p: 0,
                color: "default.grey",
                display: powerMode ? "inline-flex" : "none",
              }}
              icon={<CheckBoxOutlineBlankTwoToneIcon />}
              checkedIcon={<CheckBoxTwoToneIcon />}
              checked={selected}
              onChange={() => updateSelectionBox(id)}
            />
            <IconButton
              disableRipple
              href={link}
              target="_blank"
              sx={{ "& .MuiSvgIcon-root": { width: 48, height: 48 }, p: 0, color: "default.grey", ml: 1 }}
            >
              <LaunchTwoToneIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: textColor, mt: 2, width: `calc(100% - 104px)` }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Game;
