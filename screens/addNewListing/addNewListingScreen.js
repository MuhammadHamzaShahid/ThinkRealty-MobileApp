import React, { Component } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    BackHandler,
    Dimensions,
    TouchableOpacity,
    ScrollView
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { withNavigation } from "react-navigation";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { BottomSheet } from 'react-native-elements';
import { TransitionPresets } from 'react-navigation-stack';

const { width } = Dimensions.get('screen');

class AddNewListingScreen extends Component {

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
        titleFocus: false,
        addressFocus: false,
        squarefeetFocus: false,
        noOfBathroomFocus: false,
        noOfBedroomFocus: false,
        noOfKitchenFocus: false,
        priceFocus: false,
        isBuy: true,
        showBottomSheet: false,
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
                        contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 8.0 }}>
                        {this.addPhoto()}
                        {this.titleTextField()}
                        {this.addressTextField()}
                        {this.squarefeetTextField()}
                        {this.noOfBathroomTextField()}
                        {this.noOfBedroomTextField()}
                        {this.noOfKitchenTextField()}
                        {this.priceTextField()}
                        {this.buyRentButton()}
                    </ScrollView>
                </View>
                {this.addListingButton()}
                {this.changeProfileOptions()}
            </SafeAreaView>
        )
    }

    changeProfileOptions() {
        return (
            <BottomSheet
                isVisible={this.state.showBottomSheet}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.50, 0, 0.50)' }}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => this.setState({ showBottomSheet: false })}
                    style={styles.bottomSheetContentStyle}
                >
                    <Text style={{ ...Fonts.blackColor18Bold, textAlign: 'center' }}>
                        Choose Option
                    </Text>
                    <View style={{
                        backgroundColor: '#CFC6C6', height: 1.0,
                        marginBottom: Sizes.fixPadding + 2.0,
                        marginTop: Sizes.fixPadding - 5.0,
                    }}>

                    </View>
                    <View style={{ flexDirection: 'row', marginHorizontal: Sizes.fixPadding * 2.0 }}>
                        <MaterialIcons name="photo-camera" size={24} color={Colors.blackColor} />
                        <Text style={{ ...Fonts.blackColor16Medium, marginLeft: Sizes.fixPadding }}>
                            Camera
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0 }}>
                        <MaterialIcons name="photo-album" size={22} color={Colors.blackColor} />
                        <Text style={{ ...Fonts.blackColor16Medium, marginLeft: Sizes.fixPadding }}>
                            Choose from gallery
                        </Text>
                    </View>
                </TouchableOpacity>
            </BottomSheet>
        )
    }

    addListingButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.props.navigation.goBack()}
                style={styles.addNewListingButtonStyle}>
                <Text style={{ ...Fonts.whiteColor18Bold }}>Add Listing</Text>
            </TouchableOpacity>
        )
    }

    buyRentButton() {
        return (
            <View style={{
                flexDirection: 'row',
                marginHorizontal: Sizes.fixPadding * 2.0,
                marginTop: Sizes.fixPadding
            }}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => this.setState({ isBuy: true })}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: width / 2.0,
                    }}>
                    <View style={styles.buyOrRentUnselectedStyle}>
                        {this.state.isBuy
                            ?
                            <View style={styles.buyOrRentSelectedStyle}></View>
                            :
                            null
                        }
                    </View>
                    <Text style={{ ...Fonts.blackColor14Medium, marginLeft: Sizes.fixPadding - 2.0 }}>
                        Buy
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => this.setState({ isBuy: false })}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.buyOrRentUnselectedStyle}>
                        {this.state.isBuy
                            ?
                            null
                            :
                            <View style={styles.buyOrRentSelectedStyle}></View>
                        }
                    </View>
                    <Text style={{ ...Fonts.blackColor14Medium, marginLeft: Sizes.fixPadding - 2.0 }}>
                        Rent
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    priceTextField() {
        return (
            <TextInput
                label="Price(in USD)"
                mode="outlined"
                placeholder={this.state.priceFocus ? "Price(in USD)" : ""}
                style={styles.textFieldStyle}
                onFocus={() => this.setState({ priceFocus: true })}
                onFocus={() => this.setState({ priceFocus: false })}
                selectionColor={Colors.blackColor}
                theme={{ colors: { primary: 'gray', underlineColor: 'transparent', } }}
            />
        )
    }

    noOfKitchenTextField() {
        return (
            <TextInput
                label="No. of kitchen rooms"
                mode="outlined"
                placeholder={this.state.noOfKitchenFocus ? "No. of kitchen rooms" : ""}
                style={styles.textFieldStyle}
                onFocus={() => this.setState({ noOfKitchenFocus: true })}
                onFocus={() => this.setState({ noOfKitchenFocus: false })}
                selectionColor={Colors.blackColor}
                theme={{ colors: { primary: 'gray', underlineColor: 'transparent', } }}
            />
        )
    }

    noOfBedroomTextField() {
        return (
            <TextInput
                label="No. of bed rooms"
                mode="outlined"
                placeholder={this.state.noOfBedroomFocus ? "No. of bed rooms" : ""}
                style={styles.textFieldStyle}
                onFocus={() => this.setState({ noOfBedroomFocus: true })}
                onFocus={() => this.setState({ noOfBedroomFocus: false })}
                selectionColor={Colors.blackColor}
                theme={{ colors: { primary: 'gray', underlineColor: 'transparent', } }}
            />
        )
    }

    noOfBathroomTextField() {
        return (
            <TextInput
                label="No. of bathrooms"
                mode="outlined"
                placeholder={this.state.noOfBathroomFocus ? "No. of bathrooms" : ""}
                style={styles.textFieldStyle}
                onFocus={() => this.setState({ noOfBathroomFocus: true })}
                onFocus={() => this.setState({ noOfBathroomFocus: false })}
                selectionColor={Colors.blackColor}
                theme={{ colors: { primary: 'gray', underlineColor: 'transparent', } }}
            />
        )
    }

    squarefeetTextField() {
        return (
            <TextInput
                label="Square feet"
                mode="outlined"
                placeholder={this.state.squarefeetFocus ? "Square feet" : ""}
                style={styles.textFieldStyle}
                onFocus={() => this.setState({ squarefeetFocus: true })}
                onFocus={() => this.setState({ squarefeetFocus: false })}
                selectionColor={Colors.blackColor}
                theme={{ colors: { primary: 'gray', underlineColor: 'transparent', } }}
            />
        )
    }

    addressTextField() {
        return (
            <TextInput
                label="Address"
                mode="outlined"
                placeholder={this.state.addressFocus ? "Address" : ""}
                style={styles.textFieldStyle}
                onFocus={() => this.setState({ addressFocus: true })}
                onFocus={() => this.setState({ addressFocus: false })}
                selectionColor={Colors.blackColor}
                theme={{ colors: { primary: 'gray', underlineColor: 'transparent', } }}
            />
        )
    }

    titleTextField() {
        return (
            <TextInput
                label="Title"
                mode="outlined"
                placeholder={this.state.titleFocus ? "Title" : ""}
                style={styles.textFieldStyle}
                onFocus={() => this.setState({ titleFocus: true })}
                onFocus={() => this.setState({ titleFocus: false })}
                selectionColor={Colors.blackColor}
                theme={{ colors: { primary: 'gray', underlineColor: 'transparent', } }}
            />
        )
    }

    addPhoto() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.setState({ showBottomSheet: true })}
                style={styles.addPhotoContentStyle}>
                <MaterialCommunityIcons name="camera-plus" size={24} color="black" />
            </TouchableOpacity>
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
                    Add New Listing
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
    textFieldStyle: {
        ...Fonts.blackColor14Medium,
        marginHorizontal: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.whiteColor,
        marginVertical: Sizes.fixPadding - 3.0,
        height: 50.0
    },
    buyOrRentUnselectedStyle: {
        height: 20.0,
        width: 20.0,
        borderRadius: 10.0,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buyOrRentSelectedStyle: {
        width: 14.0,
        height: 14.0,
        borderRadius: 7.0,
        backgroundColor: Colors.primaryColor
    },
    addNewListingButtonStyle: {
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding,
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
    },
    addPhotoContentStyle: {
        width: 100.0,
        height: 100.0,
        borderRadius: 50.0,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding,
    },
    bottomSheetContentStyle: {
        backgroundColor: Colors.whiteColor,
        paddingTop: Sizes.fixPadding + 5.0,
        paddingBottom: Sizes.fixPadding,
    }
})

AddNewListingScreen.navigationOptions = () => {
    return {
        header: () => null,
        ...TransitionPresets.SlideFromRightIOS,
    }
}

export default withNavigation(AddNewListingScreen);