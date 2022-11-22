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

export const PasswordDialog = ({
  PasswordDialogOpen,
  setPasswordDialogOpen,
}: {PasswordDialogOpen: boolean, setPasswordDialogOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const { User, dispatchUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [formValue, setFormValue] = useState("");

  useEffect(() => {
    return () => {
      setResult("");
    };
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND}/account/changePassword`,
      data: { login: User.login, password: formValue },
    }).then((res) => {
      setIsLoading(false);
      if (res.data === "Password successfully changed!") {
        setResult("Password successfully changed!");
        dispatchUser({type:"changePassword", payload:formValue})
      } else {
        setResult(res.data || "Error");
      }
    });
  };

  return (
    <Dialog
      open={PasswordDialogOpen}
      onClose={() => {
        setPasswordDialogOpen(false);
      }}
    >
      <BootstrapDialogTitle
        id="PasswordDialogTitle"
        onClose={() => {
          setPasswordDialogOpen(false);
        }}
        aria-labelledby="customized-dialog-title"
      >
        Change Password
      </BootstrapDialogTitle>
      <DialogContent sx={{ background: "#2c2f33" }}>
        {isLoading ? (
          <CircularProgress sx={{ margin: 1 }} />
        ) : result === "" ? (
          <>
            <TextField
              autoFocus
              margin="dense"
              id="Password"
              label="Write down your new Password "
              type="password"
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
          Set Password 
        </Button>}
      </DialogActions>
    </Dialog>
  );
};