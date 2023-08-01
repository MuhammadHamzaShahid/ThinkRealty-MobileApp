import React, { Component } from "react";
import { Text, View, SafeAreaView, StatusBar, StyleSheet, FlatList, TouchableOpacity, BackHandler, Image, Dimensions } from "react-native";
import { Fonts, Colors, Sizes, } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { withNavigation } from "react-navigation";
import Dialog from "react-native-dialog";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TransitionPresets } from 'react-navigation-stack';

const myListingPropertyList = [

    {
        id: '1',
        properyImage: require('../../assets/images/house/house_2.jpg'),
        propertyName: 'Vraj House',
        propertyAddress: 'Yogi Street, New York',
        propertyAmount: '920000',
        isFavourit: false,
    },
    {
        id: '2',
        properyImage: require('../../assets/images/house/house_5.jpg'),
        propertyName: 'Sky View House',
        propertyAddress: 'Opera Street, New York',
        propertyAmount: '300000',
        isFavourit: false,
    },
];

const { width } = Dimensions.get('screen');

class MyListingScreen extends Component {

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
        myListingPropertyChangableList: myListingPropertyList,
        isDeleteItem: false,
        deleteItemId: '',
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                <StatusBar
                    translucent={false}
                    backgroundColor={Colors.primaryColor}
                />
                {this.header()}
                {this.state.myListingPropertyChangableList.length == 0 ?
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <MaterialCommunityIcons name="format-list-bulleted" size={50} color={Colors.grayColor} />
                        <Text style={{ ...Fonts.grayColor18Bold, marginTop: Sizes.fixPadding }}>
                            No listing found
                        </Text>
                    </View>
                    :
                    <View>
                        <FlatList
                            data={this.state.myListingPropertyChangableList}
                            keyExtractor={(item) => `${item.id}`}
                            renderItem={this.renderItem}
                            contentContainerStyle={{
                                paddingTop: Sizes.fixPadding * 2.0,
                                paddingBottom: Sizes.fixPadding * 8.0,
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                }
                {this.deleteListingDialog()}
            </SafeAreaView>
        )
    }

    deleteListingDialog() {
        return (
            <Dialog.Container
                visible={this.state.isDeleteItem}
                contentStyle={styles.dialogContainerStyle}
            >
                <View style={{ backgroundColor: Colors.whiteColor, alignItems: 'center', }}>
                    <Text style={{ ...Fonts.blackColor16Bold, paddingBottom: Sizes.fixPadding - 5.0, }}>
                        Delete this listing?
                    </Text>
                    <View style={styles.cancelAndDeleteButtonContentStyle}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => this.setState({
                                isDeleteItem: false,
                                deleteItemId: '',
                            })}
                            style={styles.cancelButtonStyle}
                        >
                            <Text style={{ ...Fonts.blackColor14Medium }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9}
                            onPress={() => {
                                this.setState({ isDeleteItem: false })
                                this.handleMyListingPropertyUpdate();
                            }}
                            style={styles.dialogDeleteButtonStyle}
                        >
                            <Text style={{ ...Fonts.whiteColor14Medium }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog.Container>
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
                    My Listing
                </Text>
            </View>
        )
    }

    handleMyListingPropertyUpdate() {
        const newList = this.state.myListingPropertyChangableList.filter((val, i) => {
            if (val.id !== this.state.deleteItemId) {
                return val;
            }
        })
        this.setState({ myListingPropertyChangableList: newList })
    }

    renderItem = ({ item }) => (
        <View style={styles.mylistingPropertyContentStyle}>
            <Image
                source={item.properyImage}
                resizeMode="cover"
                style={styles.myListingPropertyImageStyle}
            />
            <View style={styles.myListingPropertyInfoContentStyle}>
                <View style={{ width: width / 1.9, }}>
                    <Text style={{ ...Fonts.blackColor14SemiBold }}>
                        {item.propertyName}
                    </Text>
                    <Text numberOfLines={1} style={{ ...Fonts.grayColor12Medium }}>
                        {item.propertyAddress}
                    </Text>
                </View>
                <View style={styles.myListingPropertyAmountContentStyle}>
                    <Text style={{ ...Fonts.blackColor16SemiBold }}>
                        {item.propertyAmount}$
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.setState({ isDeleteItem: true, deleteItemId: item.id })}
                style={styles.deleteButtonStyle}>
                <Text style={{ ...Fonts.whiteColor14Medium }}>
                    Delete
                </Text>
            </TouchableOpacity>
        </View>
    )
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
    mylistingPropertyContentStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        elevation: 3.0,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding + 5.0,
    },
    myListingPropertyInfoContentStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding,
        marginVertical: Sizes.fixPadding,
        alignItems: 'center',
    },
    myListingPropertyImageStyle: {
        borderTopLeftRadius: Sizes.fixPadding,
        borderTopRightRadius: Sizes.fixPadding,
        width: '100%',
        height: 220.0,
    },
    myListingPropertyAmountContentStyle: {
        borderWidth: 1.0,
        alignItems: 'center',
        height: 30.0,
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
        borderColor: 'rgba(128, 128, 128, 0.5)',
    },
    deleteButtonStyle: {
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40.0,
        borderBottomLeftRadius: Sizes.fixPadding,
        borderBottomRightRadius: Sizes.fixPadding,
    },
    dialogContainerStyle: {
        borderRadius: Sizes.fixPadding,
        width: width - 40,
        paddingTop: -Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding * 2.0
    },
    dialogDeleteButtonStyle: {
        flex: 0.45,
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 7.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Sizes.fixPadding + 5.0
    },
    cancelButtonStyle: {
        flex: 0.45,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        borderColor: Colors.blackColor,
        borderWidth: 1.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding - 7.0,
    },
    cancelAndDeleteButtonContentStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding,
    }
})

MyListingScreen.navigationOptions = () => {
    return {
        header: () => null,
        ...TransitionPresets.SlideFromRightIOS,
    }
}

export default withNavigation(MyListingScreen);