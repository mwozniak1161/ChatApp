import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../contexts/User";
import { BootstrapDialogTitle } from "../Base";

export const AvatarDialog = ({
  AvatarDialogOpen,
  setAvatarDialogOpen,
}: { AvatarDialogOpen: boolean, setAvatarDialogOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const { User, dispatchUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [formValue, setFormValue] = useState(User.avatarURL);

  useEffect(() => {
    return () => {
      setResult("");
    };
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND}/account/changeAvatarURL`,
      data: { login: User.login, avatarURL: formValue },
    }).then((res) => {
      setIsLoading(false);
      if (res.data === "Avatar successfully changed!") {
        setResult("Avatar successfully changed!");
        dispatchUser({type:"changeAvatarURL", payload:formValue})
      } else {
        setResult(res.data || "Error");
      }
    });
  };

  return (
    <Dialog
      open={AvatarDialogOpen}
      onClose={() => {
        setAvatarDialogOpen(false);
      }}
    >
      <BootstrapDialogTitle
        id="AvatarDialogTitle"
        onClose={() => {
          setAvatarDialogOpen(false);
        }}
        aria-labelledby="customized-dialog-title"
      >
        Change avatar URL
      </BootstrapDialogTitle>
      <DialogContent sx={{ background: "#2c2f33" }}>
        {isLoading ? (
          <CircularProgress sx={{ margin: 1 }} />
        ) : result === "" ? (
          <>
            <TextField
              autoFocus
              margin="dense"
              id="avatarURL"
              label="Write down your avatar URL"
              type="url"
              fullWidth
              variant="standard"
              value={formValue}
              onChange={(e) => {
                setFormValue(e.target.value);
              }}
            />
          </>
        ) : (
          result !== "" && <DialogContentText sx={{pt:2}} color="white">{result}</DialogContentText>
        )}
      </DialogContent>
      <DialogActions
        sx={{ pb: 2, background: "#2c2f33", borderRadius: "0 0 10px 10px" }}
      >
{        !(result!=="" || isLoading) && <Button type="submit" variant="contained" onClick={handleSubmit}>
          Set avatar URL
        </Button>}
      </DialogActions>
    </Dialog>
  );
};