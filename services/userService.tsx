import { Alert } from "react-native";
import { Profile } from "react-native-fbsdk-next";
import { userInfoType } from "../types/userInfoType";
import { userType } from "../types/userType";
import { fetchUser, insertUser } from "../util/database";

export async function loginCheck(username: string, password: string) {
  const user: userType = await fetchUser(username).then(function () {
    if (user !== undefined) {
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
  });
}

export async function getUserInfo(googleAccessToken: string) {
  let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
    headers: {
      Authorization: `Bearer ${googleAccessToken}`,
    },
  });
  const userInfo: userInfoType = await response.json();
  const user: userType = await fetchUser(userInfo.email).then(
    async function () {
      if (user !== undefined) {
        return user;
      } else {
        insertUser(userInfo.email, userInfo.id, false);
        const newUser: userType = await fetchUser(userInfo.email).then(
          function () {
            return newUser;
          }
        );
      }
    }
  );
}

export async function facebookLogin() {
  Profile.getCurrentProfile().then(async function (currentProfile: any) {
    if (currentProfile) {
      const user: userType = await fetchUser(currentProfile.name).then(
        async function () {
          if (user !== undefined) {
            return user;
          } else {
            insertUser(currentProfile.name, currentProfile.userID, false);
            const newUser: userType = await fetchUser(currentProfile.name).then(
              function () {
                return newUser;
              }
            );
          }
        }
      );
    }
  });
}
