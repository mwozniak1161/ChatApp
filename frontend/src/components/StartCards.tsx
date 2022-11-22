import { Button, FormControl, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import { useNavigate } from "react-router";
import useDebounce from "../hooks/useDebounce";
import getCookie from "../utils/getCookie";

import { AvabileCard } from "../pages/Home";
interface AccountCredentials{
    login: string;
    password: string;
}

interface CardType {
  setCardVisible: React.Dispatch<React.SetStateAction<AvabileCard>>
AccountCredentials: AccountCredentials
setAccountCredentials: React.Dispatch<React.SetStateAction<{
    login: string;
    password: string;
}>>
}

export const StartCard = ({ children, heading }: { children:React.ReactNode, heading:string }) => {
  return (
    <Box
      sx={{
        borderRadius: "8px",
        background: "#23272a",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        width: "clamp(280px, 80%, 1024px)",
        margin: "auto auto 8vh",
        boxShadow: "0px 0px 10px 1px #000000",
      }}
     component={motion.div} initial={{ opacity:.3}}
        animate={{
          opacity:1,
          transition: { duration: .2, ease: "linear" },
        }}
        exit={{ opacity:0 , transition: { duration: .2}}}
    >
      <Typography
        variant="h2"
        fontSize={36}
        fontWeight="400"
        color="lightgreen"
        pb={2}
      >
        {heading}
      </Typography>
      {children}
    </Box>
  );
};

export const JoinCard = ({
  setCardVisible,
  AccountCredentials,
  setAccountCredentials,
}: CardType) => {
  const [helperTextErr, setHelperTextErr] = useState("");

  const debouncedLoginCheck = useDebounce(AccountCredentials.login, 500);

  const handleProceedingToPassword = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND}/account/loginExists/?login=${AccountCredentials.login}`,
    })
      .then((res) => {
        if (res.data !== "User already exists!" && AccountCredentials.login !== "") {
          setCardVisible("Password");
        }
      })
      .catch((res) => {
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      axios({
        method: "GET",
        url: `${process.env.REACT_APP_BACKEND}/account/loginExists/?login=${AccountCredentials.login}`,
      }).then((res) => {
        res.data === "User already exists!"
          ? setHelperTextErr("*Already in use!")
          : setHelperTextErr("");
      });
    };
    if (debouncedLoginCheck) {
      fetchData();
    }
  }, [debouncedLoginCheck]);

  return (
    <StartCard heading={"Try it now!"}>
      <FormControl>
        <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          <TextField
            id="join"
            label="Type your nickname..."
            variant="standard"
            onChange={(e) => {
              setAccountCredentials((prev: AccountCredentials) =>
                prev
                  ? { ...prev, login: e.target.value }
                  : prev
              );
            }}
            required
            error={helperTextErr !== "" && true}
            helperText={helperTextErr}
            sx={{
              padding: "0 4px",
              width: { xs: "100%", sm: "70%" },
              mb: 3,
              input: { color: "white" },
            }}
            InputLabelProps={{
              style: { color: "#fff" },
            }}
            defaultValue={AccountCredentials.login}
          />
          <Button
            type="submit"
            color="success"
            variant="contained"
            sx={{
              height: "48px",
              width: "30%",
              borderRadius: 0,
              ml: "auto",
              mb: 1,
            }}
            endIcon={<MdSend />}
            onClick={handleProceedingToPassword}
          >
            Join
          </Button>

          <Button
            onClick={() => {
              setCardVisible("Account");
            }}
            color="primary"
            variant="outlined"
            sx={{ height: "48px", borderRadius: 0, ml: "auto" }}
            endIcon={<MdSend />}
          >
            Already have account?
          </Button>
        </Box>
      </FormControl>
    </StartCard>
  );
};

export const PasswordCard = ({
  setCardVisible,
  AccountCredentials,
  setAccountCredentials,
}: CardType) => {
  const [helperTextErr, setHelperTextErr] = useState("");

  const handlerJoin = () => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND}/account/createUser`,
      data: AccountCredentials,
    }).then((res) => {
      if (res.data !== "User created!") {
        setHelperTextErr(res.data);
      } else {
        axios({
          method: "POST",
          url: `${process.env.REACT_APP_BACKEND}/account/loginUser`,
          data: AccountCredentials,
          withCredentials: true,
        })
          .then((res) => {
            if (res.data === "Successfully logged in!") {
              setCardVisible("Success");
            } else {
              setHelperTextErr(res.data);
            }
          })
          .catch((rej) => {
            setHelperTextErr(rej.response.data);
          });
      }
    });
  };

  return (
    <StartCard heading={"Setup password"}>
      <FormControl>
        <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          <TextField
            type="password"
            error={helperTextErr !== "" && true}
            helperText={`*If password not set, account will be automatically deleted after session. ${helperTextErr}`}
            id="join"
            label="Your password (can leave empty*)"
            variant="standard"
            onChange={(e) => {
              setAccountCredentials((prev: AccountCredentials) =>
                prev
                  ? { ...prev, password: e.target.value }
                  : prev
              );
            }}
            sx={{
              width: { xs: "100%", sm: "70%" },
              mb: 3,
              input: { color: "red" },
            }}
            InputLabelProps={{
              style: { color: "#aaa" },
            }}
          />
          <Button
            color="success"
            variant="contained"
            sx={{
              height: "48px",
              width: "30%",
              borderRadius: 0,
              ml: "auto",
              mb: 1,
            }}
            endIcon={<MdSend />}
            onClick={handlerJoin}
          >
            Join
          </Button>
        </Box>
      </FormControl>
    </StartCard>
  );
};

export const LoginCard = ({
  setCardVisible,
  AccountCredentials,
  setAccountCredentials,
}: CardType) => {
  const [helperTextErr, setHelperTextErr] = useState("");
  const handleLogin = () => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND}/account/loginUser`,
      data: AccountCredentials,
      withCredentials: true,
    })
      .then((res) => {
        if (res.data === "Successfully logged in!") {
          setCardVisible("Success");
        } else {
          setHelperTextErr(res.data);
        }
      })
      .catch((rej) => {
        setHelperTextErr(rej.response.data);
      });
  };

  return (
    <StartCard heading="Login">
      <FormControl>
        <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          <TextField
            error={helperTextErr === "Login invalid." && true}
            id="join"
            label="Nickname"
            variant="standard"
            value={AccountCredentials.login}
            onChange={(e) => {
              setAccountCredentials((prev) =>
                prev
                  ? { ...prev, login: e.target.value }
                  : prev
              );
            }}
            sx={{ width: { xs: "100%" }, mb: 3 }}
            InputLabelProps={{
              style: { color: "#aaa" },
            }}
          />
          <TextField
            type="password"
            error={helperTextErr !== "" && true}
            id="join"
            label="Password"
            variant="standard"
            onChange={(e) => {
              setAccountCredentials((prev: AccountCredentials) =>
                prev
                  ? { ...prev, password: e.target.value }
                  : prev
              );
            }}
            sx={{ width: { xs: "100%" }, mb: 3 }}
            InputLabelProps={{
              style: { color: "#aaa" },
            }}
            helperText={helperTextErr}
          />

          <Button
            color="primary"
            variant="outlined"
            sx={{ height: "48px", width: "30%", borderRadius: 0, mb: 1 }}
            endIcon={<MdSend />}
            onClick={() => {
              setCardVisible("Join");
            }}
          >
            back
          </Button>

          <Button
            color="success"
            variant="contained"
            sx={{
              height: "48px",
              width: "30%",
              borderRadius: 0,
              ml: "auto",
              mb: 1,
            }}
            endIcon={<MdSend />}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
      </FormControl>
    </StartCard>
  );
};

export const SuccessCard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    let interval = setInterval(() => {
      navigate("/app/conversations");
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <StartCard heading="Success">
      <Typography
        variant="h4"
        fontSize={24}
        color="white"
        fontWeight="400"
        pb={2}
      >
        Proceeding to application....
      </Typography>
    </StartCard>
  );
};
