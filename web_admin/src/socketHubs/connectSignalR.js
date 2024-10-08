import { HubConnectionBuilder } from "@microsoft/signalr";
import { getCookie } from "../helpers/cookies";

const hubUrl = "https://localhost:7202"
const getToken = () => {
  return getCookie("hthTokenAdm");
}

export const connectSignalR = async (url) => {

  const connection = new HubConnectionBuilder()
    .withUrl(`${hubUrl}${url}`, {
      withCredentials: false,
      accessTokenFactory: () => getToken(),
    })
    .withAutomaticReconnect()
    .build();
  return connection;
}