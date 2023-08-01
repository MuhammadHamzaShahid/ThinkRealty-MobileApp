import React, { Component } from "react";
import { 
    Text,
    SafeAreaView,
    View,
    StatusBar,
    StyleSheet,
    ImageBackground,
    Platform,
    Alert
} from "react-native";
import { withNavigation } from "react-navigation";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Sizes, Fonts } from "../constant/styles";
import { CircleFade } from 'react-native-animated-spinkit';
import ThinkRealtyFunctions from "../component/functions";
import NetInfo from "@react-native-community/netinfo";
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Location from 'expo-location';

// TaskManager.defineTask('demo-task', async () => {
//   let location = await Location.getCurrentPositionAsync({});
//   location.user_id = global?.Current_User?.id
//   let res = await fetch('http://128.199.28.62/thinkRealtyCRM/mobileAppAPI/location-saving.php',{
//     method:'GET',
//     headers : {
//       'user_id'          : location.user_id,
//       'accuracy'          : location.coords.accuracy,
//       'altitude'          : location.coords.altitude,
//       'altitudeAccuracy'          : location.coords.altitudeAccuracy,
//       'heading'          : location.coords.heading,
//       'latitude'          : location.coords.latitude,
//       'longitude'          : location.coords.longitude,
//       'speed'          : location.coords.speed,
//       'timestamp'          : location.timestamp,
//     }
//   });
//   let resp = await res.json();
//   return BackgroundFetch.BackgroundFetchResult.NewData;
// });

// BackgroundFetch.registerTaskAsync('demo-task', {
//   minimumInterval: 60, // 1 min
//   stopOnTerminate: false,
//   startOnBoot: true,
// })
//   .then(() => console.log('BackgroundFetch.registerTaskAsync success'))
//   .catch(error => alert(`Error registerTaskAsync: ${error.message}`));

class SplashScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            rememberMe  : false,
            loading     : true,
            intervalId  : null 
          };
    }
     requestPermissions = async () => {
        const foreground = await Location.requestForegroundPermissionsAsync()
        if (foreground.granted){
             await Location.requestBackgroundPermissionsAsync()
             setInterval(async() => {
                let location = await Location.getCurrentPositionAsync({});
                location.user_id = global?.Current_User?.id
                let res = await fetch('http://128.199.28.62/thinkRealtyCRM/mobileAppAPI/location-saving.php',{
                    method:'GET',
                    headers : {
                      'user_id'          : location.user_id,
                      'accuracy'          : location.coords.accuracy,
                      'altitude'          : location.coords.altitude,
                      'altitudeAccuracy'          : location.coords.altitudeAccuracy,
                      'heading'          : location.coords.heading,
                      'latitude'          : location.coords.latitude,
                      'longitude'          : location.coords.longitude,
                      'speed'          : location.coords.speed,
                      'timestamp'          : location.timestamp,
                    }
                  });
                  let resp = await res.json();
            }, 60000);    
        }
      }

    componentDidMount = async () => {
        // Location.getBackgroundPermissionsAsync().then(async(res) =>{
        //     console.log('getpermission',res)
        //     if(res?.granted){
        //         let { coords } = await Location.getCurrentPositionAsync();
        //         console.log('coords',coords)
        
        //         if (coords) {
        //           const { latitude, longitude } = coords;
        //           let response = await Location.reverseGeocodeAsync({
        //             latitude,
        //             longitude
        //           });
              
        //           for (let item of response) {
        //             let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
        //             console.log('address',address)      
        //           }
        //         }                        
        //     } else {
        //         this.requestPermissions()
        //     }
        // })
        // console.log('request')
        var interval =  setInterval(() => {
            let response = NetInfo.fetch()
            response.then((value) => {
                if(value.isConnected ){
                    clearInterval(interval);
                    global.database.transaction((tx) => {
                        tx.executeSql(
                            "SELECT * FROM `thinkrealty_current_user` WHERE user_key = 'rememberme' OR user_key = 'id'",
                            [],
                            (tx, success) => {
                                if(success.rows.length){
                                    global.Current_User = success.rows._array;
                                    for (let i = 0; i < success.rows.length; i++) {
                                        if(success.rows._array[i].user_key === 'id'){
                                            this.CheckUserExist(success.rows._array[i].user_value);
                                        }
                                        if(success.rows._array[i].user_key ==='rememberme'){
                                            if(success.rows._array[i].user_value == 'true'){
                                                this.setState({'rememberMe': true});
                                            }
                                        }
                                    }
                                }
                                else{
                                    this.PushToLoginScreen();
                                }
                            }
                        )
                    })
                }
                else{
                    this.setState({'loading': false});
                }
            });
        }, 1000);
        this.setState({'intervalId': interval});
    }

    CheckUserExist = async(id) => {
        let res = await fetch(global.RelativePath+'/remember-me.php',{
            headers : {
            'user_id'  : id
            }
        });
        let resp = await res.json();
        if(resp.data.status === 200 && resp.code === 'Success'){
            let UserData = global.Current_User = resp.data.content;
            for (const [key, value] of Object.entries(UserData)) {
                ThinkRealtyFunctions.UpdateUserMeta(key,value);
            }
            if(this.state.rememberMe == true){
                this.PushToBottomBarScreen();
            }
            else{
                this.PushToLoginScreen();
            }
        }
        else{
            Alert.alert(
                resp.code,
                resp.message,
                [
                {
                    text: "Login Again",
                    onPress: () => {
                        this.PushToLoginScreen();
                    }
                },
            ]
            );
        }
    }

    PushToLoginScreen = () => {
        return this.props.navigation.replace('Login');
    }

    PushToBottomBarScreen = () => {
        return this.props.navigation.replace('BottomBar');
    }

    SplashContent = () => {
        return (
            <ImageBackground
                    style={{ flex: 1 }}
                    source={require('../assets/images/bg.jpg')}
                    resizeMode="cover"
                >
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    colors={['black', 'rgba(0,0.10,0,0.77)', 'rgba(0,0,0,0.1)',]}
                    style={styles.pageStyle}
                >
                    {this.state.loading ? 
                        <Text style={{ ...Fonts.whiteColor18Medium, textAlign: 'center' }}>Loading.....</Text>
                        :
                        <Text style={{ ...Fonts.whiteColor18Medium, textAlign: 'center' }}>Please Check Your Internet Connection</Text>
                    }
                    <CircleFade size={50} color={Colors.whiteColor} style={{marginTop:15}}/>
                </LinearGradient>
            </ImageBackground>
        )
    }

    render() {
        if(Platform.OS === 'ios'){
            return (
                <View style={{ flex: 1 }}>
                    <StatusBar translucent barStyle="dark-contentc" />
                    {this.SplashContent()}
                </View>
            )
        }
        else{
            return (
                <SafeAreaView style={{ flex: 1 }}>
                    <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
                    {this.SplashContent()}
                </SafeAreaView>
            )
        }
    }
}

const styles = StyleSheet.create({
    pageStyle: {
        flex: 1,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

SplashScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(SplashScreen);