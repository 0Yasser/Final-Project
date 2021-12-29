const initialState = {
  user: {
    _id: "",
    userName: "",
    email: "",
    friends: []
  },
};

const user = (state = initialState, { type, payload }) => {
  switch (type) {
    case "UPDATE_USER":
      return { user: payload };
    case "CLEAR_USER":
      return {
        user: {
          _id: "",
          userName: "",
          email: "",
          friends: []
        },
      };
    default:
      return state;
  }
};

export default user;

export const updateUser = (new_token) => {
  return {
    type: "UPDATE_USER",
    payload: new_token,
  };
};

export const clearUser = (new_token) => {
  return {
    type: "CLEAR_USER",
    payload: new_token,
  };
};
