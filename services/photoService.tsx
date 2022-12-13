import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "expo-image-picker";
import { Alert } from "react-native";
import { insertPhoto } from "../util/database";

export async function takePhoto(
  loadedImages: string[],
  subscribed: number,
  verifyPermissions: any,
  id: number
) {
  if (loadedImages.length < 10 || subscribed === 1) {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const photo: any = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    await insertPhoto(photo.assets[0].uri, id);
  } else {
    Alert.alert("Free space full buy subscription to add more photos");
  }
}

export async function uploadPhoto(
  loadedImages: string[],
  subscribed: number,
  id: number
) {
  if (loadedImages.length < 10 || subscribed === 1) {
    const image: any = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    await insertPhoto(image.assets[0].uri, id);
  } else {
    Alert.alert("Free space full buy subscription to add more photos");
  }
}
