
import React from "react";
import { View } from "react-native";
import * as Font from "expo-font";

export default class LoadingScreen extends React.Component {
    async componentDidMount() {
        await Font.loadAsync({
            Poppins_Bold: require("../assets/fonts/Poppins-Bold.ttf"),
            Poppins_Medium: require("../assets/fonts/Poppins-Medium.ttf"),
            Poppins_Regular: require("../assets/fonts/Poppins-Regular.ttf"),
            Poppins_SemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
        });
        this.props.navigation.navigate('Splash');
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
            </View>
        )
    }
}

