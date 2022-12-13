import { useState, useEffect } from "react";
import { PaymentView } from "../components/PaymentView";
import { useNavigation } from "@react-navigation/native";
import MakePayment from "../components/MakePayment";
import PaymentResponse from "../components/PaymentResponse";
import { checkPaymentStatus } from "../util/axios";
import useStripe from "../customHooks/useStripe";
import {
  PaymentScreenProps,
  RootStackParamList,
} from "../types/navigationType";
import { StackNavigationProp } from "@react-navigation/stack";

const PaymentScreen = ({ route }: PaymentScreenProps) => {
  const [response, setResponse] = useState();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [makePayment, setMakePayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const cartInfo = {
    id: "prod_MvrCJN5lTUaaGD",
    description: "Subscription",
    amount: 1,
  };
  const [functionName, setFunctionName] = useState("");
  useStripe(functionName, route.params.id, cartInfo);

  useEffect(() => {
    setFunctionName("gInit");
  }, []);

  const createPaymentMethod = () => {
    setFunctionName("paymentMethod");
  };

  const pay = async () => {
    setFunctionName("payWithApple");
    navigation.navigate("Home", {
      id: route.params.id,
      username: route.params.username,
      subscribed: route.params.subscribed,
    });
  };

  const onCheckStatus = async (paymentResponse: any) => {
    setPaymentStatus("Please wait while confirming your payment!");
    setResponse(paymentResponse);
    let jsonResponse = JSON.parse(paymentResponse);
    try {
      const payStatus: any = checkPaymentStatus(
        route.params.id,
        jsonResponse,
        cartInfo
      );
      setPaymentStatus(payStatus);
    } catch (error) {
      setPaymentStatus(" Payment failed due to some issue");
    }
  };

  if (!makePayment) {
    return (
      <MakePayment
        cartInfo={cartInfo}
        setMakePayment={() => setMakePayment(true)}
        createPaymentMethod={createPaymentMethod}
        pay={pay}
      />
    );
  } else {
    if (response !== undefined) {
      return (
        <PaymentResponse paymentStatus={paymentStatus} response={response} />
      );
    } else {
      return (
        <PaymentView
          onCheckStatus={onCheckStatus}
          product={cartInfo.description}
          amount={cartInfo.amount}
        />
      );
    }
  }
};

export default PaymentScreen;
