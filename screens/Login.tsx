import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { AccessToken, LoginButton, Profile } from "react-native-fbsdk-next";
import LoginForm from "../components/LoginForm";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { getUserInfo, loginCheck } from "../services/userService";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigationType";
import { fetchUser, insertUser } from "../util/database";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [googleAccessToken, setGoogleAccessToken] = useState<any>(null);
  const [request, response, promptAsync]: any = Google.useIdTokenAuthRequest({
    clientId: "web-id",
    iosClientId: "ios-id",
    androidClientId: "android-id",
  });
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  WebBrowser.maybeCompleteAuthSession();

  const userInputHandler = (enteredText: string) => {
    setUsername(enteredText);
  };

  const passwordInputHandler = (enteredText: string) => {
    setPassword(enteredText);
  };

  const navigateLogin = async () => {
    const user: any = await loginCheck(username, password);
    if (user) {
      navigation.navigate("Home", {
        id: user[0],
        username: user[1],
        subscribed: user[3],
      });
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      setGoogleAccessToken(response.authentication.accessToken);
      googleAccessToken && fetchUserInformation();
    }
  }, [response, googleAccessToken]);

  const fetchUserInformation = async () => {
    const userInfo: any = await getUserInfo(googleAccessToken);
    if (userInfo) {
      navigation.navigate("Home", {
        id: userInfo[0],
        username: userInfo[1],
        subscribed: userInfo[3],
      });
    }
  };

  const navigateRegister = () => {
    navigation.navigate("Register");
  };

  const loginWithFaceBook = () => {
    Profile.getCurrentProfile().then(async function (currentProfile: any) {
      if (currentProfile) {
        const user: any = await fetchUser(currentProfile.name);
        if (user.length === 4) {
          navigation.navigate("Home", {
            id: user[0],
            username: user[1],
            subscribed: user[3],
          });
        }
        await insertUser(currentProfile.name, currentProfile.userID, 0);
        const newUser: any = fetchUser(currentProfile.name);
        navigation.navigate("Home", {
          id: newUser[0],
          username: newUser[1],
          subscribed: newUser[3],
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your photos app</Text>
      <LoginForm
        usernameChange={userInputHandler}
        passwordChange={passwordInputHandler}
        login={navigateLogin}
        register={navigateRegister}
      />
      <LoginButton
        onLoginFinished={(error: any, result: any) => {
          if (error) {
            console.log("login has error: " + result.error);
          } else if (result.isCancelled) {
            console.log("login is cancelled.");
          } else {
            AccessToken.getCurrentAccessToken().then((data: any) => {
              console.log(data.accessToken.toString());
            });
            loginWithFaceBook();
          }
        }}
        onLogoutFinished={() => console.log("logout.")}
      />
      <View style={styles.googleLoginButton}>
        <Button
          color='white'
          title='Login with Google'
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      </View>
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "aqua",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 50,
  },
  googleLoginButton: {
    backgroundColor: "red",
    margin: 10,
    paddingHorizontal: 15,
  },
});
