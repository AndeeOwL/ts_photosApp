import { Alert } from "react-native";
import { Profile } from "react-native-fbsdk-next";
import { userInfoType } from "../types/userInfoType";
import { userType } from "../types/userType";
import { fetchUser, insertUser } from "../util/database";

export async function loginCheck(username: string, password: string) {
  const user: userType = await fetchUser(username);
  if (username !== user[1]) {
    Alert.alert("Invalid username");
    return;
  }
  if (password !== user[2]) {
    Alert.alert("Invalid password");
    return;
  }
  return user;
}

export async function getUserInfo(googleAccessToken: string) {
  let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
    headers: {
      Authorization: `Bearer ${googleAccessToken}`,
    },
  });
  const userInfo: userInfoType = await response.json();
  const user: userType = await fetchUser(userInfo.email);
  if (user.length === 4) {
    return [true, user[0], user[1], user[3]];
  } else {
    insertUser(userInfo.email, userInfo.id, false);
    const user: any = await fetchUser(userInfo.email);
    return [true, user[0], user[1], user[3]];
  }
}

export function facebookLogin() {
  Profile.getCurrentProfile().then(async function (currentProfile: any) {
    if (currentProfile) {
      const user: userType = await fetchUser(currentProfile.name);
      if (user.length === 4) {
        return [true, user[0], user[1], user[3]];
      } else {
        insertUser(currentProfile.name, currentProfile.userID, false);
        const newUser: userType = await fetchUser(currentProfile.name);
        return [true, newUser[0], newUser[1], newUser[3]];
      }
    }
  });
}
