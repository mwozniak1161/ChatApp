import React, { createContext, Dispatch, useContext, useMemo, useReducer } from "react";

interface UserContext {
    User: User
    dispatchUser: React.Dispatch<User>;
}

interface User {
    _id: string;
    login: string;
    accountType: string;
    avatarURL: string;
    friends: never[];
    pendingFriends: never[];
}

interface Action {
    type: "reset" | "changePassword" | "changeAvatarURL" | "load"
    payload?: User | string
}

const initialState = {
  _id:"",
  login:"",
  accountType:"",
  avatarURL:"",
  friends:[],
  pendingFriends:[]
}

const UserContext = createContext<{
  User:User
  dispatchUser: Dispatch<Action>
}>({
  User: initialState,
  dispatchUser: () => null
});

export const UserProvider = (props: {children: React.ReactNode}) => {

  const reducer = (state = initialState, { type, payload }: Action):User => {
    switch (type) {
      case "load":
        return { ...payload as User };
      case "reset":
        return { ...initialState };
      case "changeAvatarURL":
        return { ...state, avatarURL: payload as string};
      case "changePassword":
        return { ...state};
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(() => {
    return { User:state, dispatchUser:dispatch };
  }, [state, dispatch]);

  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

