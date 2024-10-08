import { HubConnectionBuilder } from "@microsoft/signalr";
import { getCookie } from "../helpers/cookies";

const hubUrl = "https://hthecomapiserver.azurewebsites.net"
const getToken = () => {
  return getCookie("hthToken");
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