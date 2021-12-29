import { useDispatch, useSelector } from "react-redux";
import { clearLoginToken } from "../reducers/login";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { updateUser } from "../reducers/user";
import '../styles/navbar.css'

function Navbar() {
  const [newGroup, setNewGroup] = useState(false);
  const state = useSelector((state) => {
    return { token: state.token.loginToken, user: state.user.user };
  });
  const dispatch = useDispatch();
  const handleSignOut = () => {
    dispatch(clearLoginToken(""));
  };
  const handleCreateNewGroup = (e) => {
    e.preventDefault();
    if (e.target[0]?.value)
      axios
        .post(`/api/group/${state.user._id}`, {
          name: e.target[0].value,
        })
        .then((res) => {
          setNewGroup(!newGroup);
          console.log("successfully created a new group", res.data);
          dispatch(
            updateUser(state.user)
          );
        })
        .catch(() => {
          console.log("failed at creating new group");
        });
  };
  return (
    <nav>
      <ul>
        <li>
          <p>{state.user.userName}</p>
        </li>
        <li>
          <Link
            onClick={() => setNewGroup(false)}
            className="color-inherit"
            to="/home"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            onClick={() => setNewGroup(false)}
            className="color-inherit"
            to="/search"
          >
            Search
          </Link>
        </li>
        <li>
          <input
            className={newGroup ? "display-none" : ""}
            type="submit"
            onClick={() => setNewGroup(true)}
            value="create group"
          />
          <form onSubmit={handleCreateNewGroup}>
            <input
              className={newGroup ? "" : "display-none"}
              type="text"
              placeholder="group name"
            />
            <input
              className={newGroup ? "" : "display-none"}
              type="submit"
              value="create group"
            />
          </form>
          <input
            className={newGroup ? "" : "display-none"}
            type="submit"
            onClick={() => setNewGroup(false)}
            value="cancel"
          />
        </li>
        <li>
          <button onClick={handleSignOut}>Sign Out</button>
        </li>
      </ul>
    </nav>
  );
}
export default Navbar;
