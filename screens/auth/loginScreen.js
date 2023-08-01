import React, { Component, useState } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    ImageBackground,
    Image,
    ScrollView,
    TouchableOpacity,
    BackHandler,
    Platform,
    Alert,
    ToastAndroid,
} from "react-native";
import { TextInput } from 'react-native-paper';
import { withNavigation } from "react-navigation";
import { LinearGradient } from 'expo-linear-gradient';
import { CircleFade } from 'react-native-animated-spinkit';
import ThinkRealtyFunctions from "../../component/functions";
import { Colors, Fonts, Sizes } from "../../constant/styles";

class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        ToastAndroid.show(global.expoPushToken, ToastAndroid.SHORT);
        // alert(global.expoPushToken)
        // console.log('token',global.expoPushToken)
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        BackHandler.exitApp();
        return true;
    };

    render() {
        return (
            <Login navigation={this.props.navigation} />
        )
    }
}

const Login = ({ navigation }) => {

    const [GetPassword, SetPassword] = useState('');
    const [GetUsername, SetUsername] = useState('');
    const [GetLoading, SetLoading] = useState(false);
    const [GetRemember, SetRemember] = useState(true);

    if(Platform.OS === 'ios'){
        return (
            <View style={{ flex: 1 }}>
                <StatusBar translucent barStyle="dark-content" />
                {LoginContent()} 
            </View>
        )
    }
    else{
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
                {LoginContent()} 
            </SafeAreaView>
        )
    }

    async function Authentication(){
        if(GetUsername !== '' && GetPassword !== ''){
            SetLoading(true);
            let res = await fetch(global.RelativePath+'/login.php',{
                headers : {
                    'login'       : GetUsername,
                    'password'    : GetPassword,
                    'push_token'       : global.expoPushToken
                }
            });
            let resp = await res.json();
            SetLoading(false);
            if(resp.data.status === 200 && resp.code === 'Success'){
                let UserData = global.Current_User = resp.data.content;
                for (const [key, value] of Object.entries(UserData)) {
                    ThinkRealtyFunctions.UpdateUserMeta(key,value);
                }
                ThinkRealtyFunctions.UpdateUserMeta('rememberme',GetRemember);
                navigation.replace('BottomBar')
            }
            else{
                if(Platform.OS === 'android'){
                    ToastAndroid.show(resp.message, ToastAndroid.LONG);
                }
                else{
                Alert.alert(
                    resp.code,
                    resp.message
                );
                }
            }
        }
        else if(GetUsername == ''){
          if(Platform.OS === 'android'){
            ToastAndroid.show('The username field is empty', ToastAndroid.LONG);
          }
          else{
            Alert.alert(
                "Error",
                "The username field is empty"
            );
          }
        }
        else if(GetPassword == ''){
          if(Platform.OS === 'android'){
            ToastAndroid.show('The password field is empty', ToastAndroid.LONG);
          }
          else{
            Alert.alert(
                "Error",
                "The password field is empty"
            );
          }
        }
        else{
          if(Platform.OS === 'android'){
            ToastAndroid.show('Please enter username/email and password', ToastAndroid.LONG);
          }
          else{
            Alert.alert(
                "Error",
                "Please enter username/email and password"
            );
          }
        }
    }

    function LoginContent() {
        return (
            <ImageBackground
                style={{ flex: 1 }}
                source={require('../../assets/images/bg.jpg')}
                resizeMode="cover"
            >
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    colors={['black', 'rgba(0,0.10,0,0.77)', 'rgba(0,0,0,0.1)',]}
                    style={{ flex: 1, paddingHorizontal: Sizes.fixPadding * 2.0 }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {logoImage()}
                        {welcomeInfo()}
                        {UsernameTextField()}
                        {PasswordTextField()}
                        {continueButton()}
                        {GetLoading && loading()}
                    </ScrollView>
                </LinearGradient>
            </ImageBackground>
        )
    }

    function continueButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => Authentication()}
            >
                <LinearGradient
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    colors={['rgba(3, 134, 59, 0.8)', 'rgba(3, 134, 59, 0.6)', 'rgba(3, 134, 59, 0.4)',]}
                    style={styles.continueButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18Medium }}>
                        Login
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        )
    }

    function PasswordTextField() {
        return (
            <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry={true}
                autoCapitalize='none'
                onChangeText={value => SetPassword(value)}
                style={styles.textfieldStyle}
                selectionColor={Colors.whiteColor}
                theme={{ colors: { placeholder: 'white', text: 'white', primary: 'white', underlineColor: 'transparent', } }}
            />
        )
    }

    function UsernameTextField() {
        return (
            <TextInput
                label="Username"
                mode="outlined"
                onChangeText={value => SetUsername(value)}
                style={styles.textfieldStyle}
                autoCapitalize='none'
                selectionColor={Colors.whiteColor}
                theme={{ colors: { placeholder: 'white', text: 'white', primary: 'white', underlineColor: 'transparent', } }}
            />
        )
    }

    function welcomeInfo() {
        return (
            <Text style={{
                ...Fonts.whiteColor14Regular,
            }}>Login your account</Text>
        )
    }

    function logoImage() {
        return (
            <Image
                style={styles.logo}
                source={require('../../assets/images/logo-white.png')}
            />
        )
    }
    
    function loading(){
        return(
            <View style={styles.pageStyle}>
                <CircleFade size={50} color={Colors.whiteColor} style={{marginTop:15}}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    logo: {
        marginTop:'15%',
        alignSelf:'center',
        maxWidth:300,
        maxHeight:300
    },
    pageStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textfieldStyle :{
        ...Fonts.whiteColor14Regular,
        backgroundColor:  "rgba(128, 128, 128, 0.7)",
        marginVertical: Sizes.fixPadding - 3.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
    },
    continueButtonStyle: {
        borderRadius: Sizes.fixPadding * 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding * 4.0,
        marginBottom: Sizes.fixPadding * 2.0,
        height: 56.0,
    },
    searchCountryTextFieldContentStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderBottomWidth: 1.0,
        borderBottomColor: Colors.grayColor
    }
})

LoginScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(LoginScreen);