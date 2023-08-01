import React, { useEffect } from "react";
import { ToastAndroid, Platform} from "react-native"
import * as SQLite from 'expo-sqlite';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import bottomTabBarScreen from "./component/bottomTabBarScreen";
import LoadingScreen from "./component/loadingScreen";
import addNewListingScreen from "./screens/addNewListing/addNewListingScreen";
import loginScreen from "./screens/auth/loginScreen";
import editProfileScreen from "./screens/editProfile/editProfileScreen";
import imageFullViewScreen from "./screens/imageFullView/imageFullViewScreen";
import messageScreen from "./screens/message/messageScreen";
import myListingScreen from "./screens/myListing/myListingScreen";
// import notificationScreen from "./screens/notification/notificationScreen";
import privacyPolicyScreen from "./screens/privacyPolicy/privacyPolicyScreen";
import propertyScreen from "./screens/property/propertyScreen";
import searchScreen from "./screens/search/searchScreen";
import SplashScreen from "./screens/splashScreen";
import supportScreen from "./screens/support/supportScreen";
import termsOfUseScreen from "./screens/termsOfUse/termsOfUseScreen";
import { createSharedElementStackNavigator } from 'react-navigation-shared-element/build/v4';
import LeadDetails from "./screens/lead/LeadDetails";
import Notifications1 from "./screens/Notifications";
import LeadCountScreen from "./screens/leadCount/LeadCount";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const projectId = Constants?.expoConfig?.extra?.eas?.projectId;

const switchNavigator = createSwitchNavigator({
  Loading: LoadingScreen,
  mainFlow: createSharedElementStackNavigator(
    {
      Splash: SplashScreen,
      Login: loginScreen,
      BottomBar: bottomTabBarScreen,
      Search: searchScreen,
      // Notification: notificationScreen,
      Property: propertyScreen,
      ImageFullView: imageFullViewScreen,
      Message: messageScreen,
      EditProfile: editProfileScreen,
      AddNewListing: addNewListingScreen,
      MyListing: myListingScreen,
      PrivacyPolicy: privacyPolicyScreen,
      TermsOfUse: termsOfUseScreen,
      Support: supportScreen,
      LeadDetails:LeadDetails,
      Notifications:Notifications1,
      LeadCount:LeadCountScreen,
    },
    {
      initialRouteName: 'BottomBar',
    }
  ),
},
  {
    initialRouteName: 'Loading',
});

const App = createAppContainer(switchNavigator);

// Global Variables
global.Domian            = '128.199.28.62';
global.Extention         = 'thinkRealtyCRM/mobileAppAPI';
global.RelativePath      = 'http://'+global.Domian+'/'+global.Extention;
global.database          = SQLite.openDatabase('ThinkRealty');

//Truncate Database Tables
global.TruncateAllTables = function (){
  global.database.transaction((tx) => {
    let Tables = {
      0 : 'thinkrealty_current_user',
      1 : 'thinkrealty_listing_inquires',
      2 : 'thinkrealty_detail_inquires',
    }
    for (let i = 0; i < Object.values(Tables).length; i++) {
      tx.executeSql(
        "DELETE FROM "+Tables[i]+" WHERE 1"
      )
    }
  })
}

export default () => {

  registerForPushNotificationsAsync = async () => {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      if(Platform.OS === 'android'){
        ToastAndroid.show('Failed to get push token for push notification!', ToastAndroid.LONG);
      }
      else{
        Alert.alert('Sorry!','Failed to get push token for push notification!');
      }
    }
    token = (await Notifications.getExpoPushTokenAsync(
      projectId
    )).data;
    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      global.expoPushToken = token;
      console.log(global?.expoPushToken);
      if(Platform.OS === 'android'){
        ToastAndroid.show(global?.expoPushToken, ToastAndroid.LONG);
      }
      else{
        Alert.alert('Success!',global?.expoPushToken);
      }
    })  
  },[])
  // Create SQL Tables
  global.database.transaction((tx) => {
    //thinkrealty_current_user
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS "
      + "thinkrealty_current_user "
      + "(id INTEGER PRIMARY KEY AUTOINCREMENT, user_key TEXT, user_value TEXT);"
    )

    //thinkrealty_listing_inquires
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS "
      + "thinkrealty_listing_inquires "
      + "(id INTEGER PRIMARY KEY AUTOINCREMENT, ref_no TEXT ,assigned_user_id TEXT, thumbnail_images TEXT, property_name TEXT, property_purpose TEXT, property_address TEXT, property_price TEXT, favourit TEXT);"
    )

    //thinkrealty_detail_inquires
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS "
      + "thinkrealty_detail_inquires "
      + "(id INTEGER PRIMARY KEY AUTOINCREMENT, detail_id TEXT ,meta_key TEXT, meta_value TEXT, meta_label TEXT);"
    )

    // Notification Table
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS "
      + "notifications"
      + "(id INTEGER PRIMARY KEY AUTOINCREMENT, noti_id TEXT ,title TEXT, body TEXT, status TEXT, datetime TEXT);"
    )
    
  })
  return (
    <App />
  );
};