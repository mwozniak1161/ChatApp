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
import { useNavigate } from "react-router";
import { useUser } from "../../../contexts/User";
import { BootstrapDialogTitle } from "../Base";

export const DeleteDialog = ({
  DeleteDialogOpen,
  setDeleteDialogOpen,
}: {DeleteDialogOpen: boolean, setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const { User, dispatchUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [formValue, setFormValue] = useState("");
 const navigate = useNavigate()
  useEffect(() => {
    return () => {
      setResult("");
    };
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND}/account/delete`,
      data: { login: User.login, password: formValue },
    }).then((res) => {
      setIsLoading(false);
      if (res.data === "Account successfully deleted!") {
        setResult("Account successfully deleted! Redirecting to homepage...");
        dispatchUser({type:"reset"})
        setTimeout(()=>{
          navigate("/")
        },2000)
      } else {
        setResult(res.data || "Error");
      }
    });
  };

  return (
    <Dialog
      open={DeleteDialogOpen}
      onClose={() => {
        setDeleteDialogOpen(false);
      }}
    >
      <BootstrapDialogTitle
        id="DeleteDialogTitle"
        onClose={() => {
          setDeleteDialogOpen(false);
        }}
        aria-labelledby="customized-dialog-title"
      >
        Delete account
      </BootstrapDialogTitle>
      <DialogContent sx={{ background: "#2c2f33" }}>
        {isLoading ? (
          <CircularProgress sx={{ margin: 1 }} />
        ) : result === "" ? (
          <>
            <TextField
              autoFocus
              margin="dense"
              id="Delete"
              label="Type password to delete account"
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
          Delete password
        </Button>}
      </DialogActions>
    </Dialog>
  );
};