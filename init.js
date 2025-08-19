import { setGlobal } from "reactn";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BASE_URL } from "./config/constant";
import setAuthToken from "./config/setAuthToken";

const init = async () => {
  document.addEventListener("gesturestart", (e) => {
    e.preventDefault();
  });

  if (localStorage.getItem("app") !== "Virtual 2.x.x") {
    localStorage.clear();
    localStorage.setItem("app", "Virtual 2.x.x");
  }

  let token = localStorage.getItem("token");
  let userString = localStorage.getItem("user");
  let user = userString ? JSON.parse(userString) : null;

  if (token) {
    const decoded = jwtDecode(token, { complete: true });
    const dateNow = new Date();
    const isExpired = decoded.exp * 1000 < dateNow.getTime();

    let result;

    if (!isExpired) {
      try {
        const res = await axios({
          method: "post",
          url: `${BASE_URL}/auth/check-user`,
          data: { id: decoded.id },
        });
        result = res.data;
      } catch (e) {
        result = null;
      }
    }

    if (!result || result.error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      token = localStorage.getItem("token");
      userString = localStorage.getItem("user");
      user = userString ? JSON.parse(userString) : null;
    }
  }

  if (token) {
    setAuthToken(token);
  }

  const state = {
    version: "2.9.2",
    entryPath: window.location.pathname,
    token,
    user: user || (token ? jwtDecode(token) : {}),
    rooms: [],
    meetings: [],
    nav: "rooms",
    search: "",
    over: null,
    isPicker: false,
    streams: [],
    inCall: false,
    video: true,
    audio: true,
    audioStream: null,
    videoStream: null,
    screenStream: null,
    callStatus: null,
    counterpart: null,
    callDirection: null,
    meeting: null,
    showPanel: true,
    panel: "standard",
  };

  setGlobal(state).then(() =>
    console.log("Global state init complete!", state)
  );
};

export default init;
