import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import Search from "../../../shared/components/SearchComponent/Search";
import User from "../../../shared/components/UserComponent/User";

import Loader from "../../../shared/components/LoaderComponent/Loader"
import Error from "../../../shared/components/ErrorComponent/Error";

import { selectAuthUser } from "../../../redux/auth/auth.selectors";
import { listUsersApi } from "../../../shared/api/user.api";

import styles from "./ChatBox.module.css";

function ChatBox() {
  const navigate = useNavigate();
  const authUser = useSelector(selectAuthUser);

const [results, setResults] = useState([]);
const [term, setTerm] = useState("");
const [isBusy, setIsBusy] = useState(false);

  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const nothingFound =
    !isBusy &&
    !errorMsg &&
    term.trim().length > 0 &&
    results.length === 0;

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);
        const data = await listUsersApi();
        setPeople(data);
      } catch (err) {
        const message =
          err?.response?.data?.message || err?.message || "Unknown error";
        setErrorMsg(message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const startChat = (user) => {
    navigate("/messages", {
      replace: true,
      state: { toUser: user },
    });
  };

  const items = (people || []).map((item) => (
    <User key={item._id} user={item} onClick={startChat} />
  ));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.heading}>{authUser?.username}</h3>
      </div>

      <Search onClick={startChat} />

      <ul className={styles.results}>{items}</ul> 
     {nothingFound && ( 
      <div className={styles.empty}>User not found</div> 
  )}

      {isLoading && <Loader loading={isLoading} />}
      {errorMsg && <Error>{errorMsg}</Error>}
    </div>
  );
}

export default ChatBox;
