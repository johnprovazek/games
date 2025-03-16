import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Zoom from "@mui/material/Zoom";
import PopupGIF from "../../assets/images/popup.gif";

const Warning = ({ open, acknowledge }) => {
  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Zoom}
      >
        <DialogTitle id="alert-dialog-title" sx={{ p: 2 }}>
          Enable pop-ups
        </DialogTitle>
        <IconButton
          aria-label="close"
          disableRipple
          onClick={acknowledge}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "default.grey",
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ px: 2, py: 0 }}>
          <DialogContentText sx={{ color: "default.grey", pb: 2 }}>
            You will need to enable pop-ups for this site to be able to open multiple pages at once.
          </DialogContentText>
          <Box
            component="img"
            sx={{
              height: "100%",
              width: "100%",
              borderRadius: "4px",
            }}
            alt="The house from the offer."
            src={PopupGIF}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2 }}>
          <Button
            onClick={acknowledge}
            autoFocus
            sx={{
              color: "default.grey",
              backgroundColor: "default.white",
            }}
          >
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Warning;
