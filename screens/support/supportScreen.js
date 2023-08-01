import React, { Component } from "react";
import { Text, View, SafeAreaView, StatusBar, StyleSheet, ScrollView, TouchableOpacity, BackHandler } from "react-native";
import { withNavigation } from "react-navigation";
import { Fonts, Colors, Sizes, } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { TransitionPresets } from 'react-navigation-stack';

class SupportScreen extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        this.props.navigation.pop();
        return true;
    };

    state = {
        name: '',
        email: '',
        support: '',
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                <StatusBar
                    translucent={false}
                    backgroundColor={Colors.primaryColor}
                />
                <View style={{ flex: 1 }}>
                    {this.header()}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: Sizes.fixPadding * 2.0 }}
                    >
                        {this.nameTextField()}
                        {this.emailTextField()}
                        {this.supportTextField()}
                        {this.submitButton()}
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }

    submitButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.props.navigation.goBack()}
                style={styles.submitButtonStyle}>
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Submit
                </Text>
            </TouchableOpacity>
        )
    }

    supportTextField() {
        return (
            <View style={{ marginBottom: Sizes.fixPadding + 3.0, }}>
                <TextInput
                    placeholder="Write here"
                    multiline={true}
                    numberOfLines={6}
                    mode="outlined"
                    value={this.state.support}
                    onChangeText={text => this.setState({ support: text })}
                    style={{
                        ...Fonts.blackColor14Medium,
                        marginHorizontal: Sizes.fixPadding * 2.0,
                        backgroundColor: Colors.whiteColor,
                    }}
                    selectionColor={Colors.primaryColor}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
                />
            </View>

        )
    }

    emailTextField() {
        return (
            <View style={{ marginBottom: Sizes.fixPadding + 3.0 }}>
                <TextInput
                    placeholder="Email"
                    mode="outlined"
                    value={this.state.email}
                    onChangeText={text => this.setState({ email: text })}
                    style={{
                        ...Fonts.blackColor14Medium,
                        height: 50.0,
                        marginHorizontal: Sizes.fixPadding * 2.0,
                        backgroundColor: Colors.whiteColor,
                    }}
                    selectionColor={Colors.primaryColor}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
                />
            </View>
        )
    }

    nameTextField() {
        return (
            <View style={{ marginBottom: Sizes.fixPadding + 3.0 }}>
                <TextInput
                    placeholder="Name"
                    mode="outlined"
                    value={this.state.name}
                    onChangeText={text => this.setState({ name: text })}
                    style={{
                        ...Fonts.blackColor14Medium,
                        height: 50.0,
                        marginHorizontal: Sizes.fixPadding * 2.0,
                        backgroundColor: Colors.whiteColor,
                    }}
                    selectionColor={Colors.primaryColor}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent' } }}
                />
            </View>
        )
    }

    header() {
        return (
            <View style={styles.headerContentStyle}>
                <MaterialIcons name="arrow-back" size={24}
                    color="black"
                    onPress={() => this.props.navigation.goBack()}
                    style={{ position: 'absolute', left: 20.0, }}
                />
                <Text style={{
                    ...Fonts.blackColor18Bold,
                    alignSelf: 'center',
                    justifyContent: 'center'
                }}>
                    Support
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerContentStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60.0,
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        elevation: 10.0,
    },
    submitButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding,
        marginVertical: Sizes.fixPadding + 5.0
    }
})

SupportScreen.navigationOptions = () => {
    return {
        header: () => null,
        ...TransitionPresets.SlideFromRightIOS,
    }
}

export default withNavigation(SupportScreen);