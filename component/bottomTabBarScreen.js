import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, BackHandler, SafeAreaView, StatusBar } from "react-native";
import { withNavigation } from "react-navigation";
import Lead from "../screens/lead/Lead";
import HomeScreen from "../screens/home/homeScreen";
import SettingScreen from "../screens/setting/settingScreen";
import ShortlistScreen from "../screens/shortlist/shortlistScreen";
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from "../constant/styles";

class BottomTabBarScreen extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        BackHandler.exitApp();
        return true;
    };

    state = { currentIndex: 1 };

    render() {
        if(Platform.OS === 'ios'){
            return (
                <View style={{ flex: 1 }}>
                    <StatusBar hidden={true} translucent barStyle="dark-content" />
                    {this.bottomContent()} 
                </View>
            )
        }
        else{
            return (
                <SafeAreaView style={{ flex: 1 }}>
                    <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
                    {this.bottomContent()} 
                </SafeAreaView>
            )
        }
    }

    bottomContent(){
        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                <StatusBar
                    translucent={false}
                    backgroundColor={Colors.primaryColor}
                />
                {this.state.currentIndex == 1 ?
                    <HomeScreen /> :
                    this.state.currentIndex == 2 ?
                        <Lead /> :
                        this.state.currentIndex == 3 ?
                            <ShortlistScreen /> :
                            <SettingScreen />
                }
                <View style={styles.bottomTabBarStyle}>
                    {this.bottomTabBarItem({
                        index: 1,
                        iconName: "home",
                    })}
                    {this.bottomTabBarItem({
                        index: 2,
                        iconName: "view-list",
                    })}
                    {this.bottomTabBarItem({
                        index: 3,
                        iconName: "favorite",
                    })}
                    {this.bottomTabBarItem({
                        index: 4,
                        iconName: "settings",
                    })}
                </View>
            </View>
        )
    }

    bottomTabBarItem({ index, iconName }) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={this.state.currentIndex == index ? styles.bottomTabSelectedIconStyle : null}
                onPress={() => this.setState({ currentIndex: index })}
            >
                <MaterialIcons name={iconName} size={24} color={Colors.primaryColor} />
            </TouchableOpacity>
        )
    }
}

BottomTabBarScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(BottomTabBarScreen);

const styles = StyleSheet.create({
    bottomTabBarStyle: {
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
        height: 60.0,
        backgroundColor: Colors.whiteColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30.0,
        borderTopColor: 'rgba(128, 128, 128, 0.2)',
        borderTopWidth: 1.0,
        elevation: 2.0
    },
    bottomTabSelectedIconStyle: {
        height: 40.0,
        width: 40.0,
        borderRadius: 20.0,
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
        alignItems: 'center',
        justifyContent: 'center'
    }
})



