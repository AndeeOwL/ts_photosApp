import { Alert } from "react-native";
import { Profile } from "react-native-fbsdk-next";
import { userInfoType } from "../types/userInfoType";
import { fetchUser, insertUser } from "../util/database";

export async function loginCheck(username: string, password: string) {
  const user: any = await fetchUser(username);
  if (user) {
    if (username !== user[1]) {
      Alert.alert("Invalid username");
    } else if (password !== user[2]) {
      Alert.alert("Invalid password");
    } else return user;
  }
}

export async function getUserInfo(googleAccessToken: string) {
  let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
    headers: {
      Authorization: `Bearer ${googleAccessToken}`,
    },
  });
  const userInfo: userInfoType = await response.json();
  const user: any = await fetchUser(userInfo.email);
  if (user) {
    return user;
  } else {
    await insertUser(userInfo.email, userInfo.id, 0);
    if (user) {
      return user;
    }
  }
}
