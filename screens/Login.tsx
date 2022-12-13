import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { AccessToken, LoginButton } from "react-native-fbsdk-next";
import LoginForm from "../components/LoginForm";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  facebookLogin,
  getUserInfo,
  loginCheck,
} from "../services/userService";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigationType";
import { userType } from "../types/userType";
import { fbLoginType } from "../types/fbLoginType";

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

  const navigateHome = (id: number, username: string, subscribed: boolean) => {
    navigation.navigate("Home", {
      id: id,
      username: username,
      subscribed: subscribed,
    });
  };

  const navigateLogin = async () => {
    const user: userType = await loginCheck(username, password).then(
      function () {
        if (user) {
          navigateHome(user[0], user[1], user[3]);
        }
      }
    );
  };

  useEffect(() => {
    if (response?.type === "success") {
      setGoogleAccessToken(response.authentication.accessToken);
      googleAccessToken && fetchUserInformation();
    }
  }, [response, googleAccessToken]);

  const fetchUserInformation = async () => {
    const userInfo: userType = await getUserInfo(googleAccessToken).then(
      function () {
        if (userInfo) {
          navigateHome(userInfo[0], userInfo[1], userInfo[3]);
        }
      }
    );
  };

  const navigateRegister = () => {
    navigation.navigate("Register");
  };

  const loginWithFaceBook = async () => {
    const userInfo: userType = await facebookLogin().then(function () {
      if(userInfo){
      navigateHome(userInfo[0], userInfo[1], userInfo[3]);
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
