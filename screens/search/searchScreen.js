import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    FlatList,
    TextInput,
    Image,
    TouchableOpacity,
    SafeAreaView,
    BackHandler
} from "react-native";
import { withNavigation } from "react-navigation";
import { Fonts, Colors, Sizes } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';

const recentSearchesList = [
    {
        id: '1',
        searchText: '4 Bhk Bunglow',
    },
    {
        id: '2',
        searchText: '2 Bhk Bunglow',
    },
];

const featuredPropertyList = [
    {
        id: '1',
        properyImage: require('../../assets/images/house/house_1.jpg'),
        propertyName: 'Sky View House',
        propertyAddress: 'Opera Street, New York',
        propertyAmount: '360000',
        isFavourit: false,
    },
    {
        id: '2',
        properyImage: require('../../assets/images/house/house_2.jpg'),
        propertyName: 'Vraj House',
        propertyAddress: 'Yogi Street, New York',
        propertyAmount: '920000',
        isFavourit: false,
    },
    {
        id: '3',
        properyImage: require('../../assets/images/house/house_3.jpg'),
        propertyName: 'Yogi Villa',
        propertyAddress: 'Opera Street, New York',
        propertyAmount: '490000',
        isFavourit: false,
    },
    {
        id: '4',
        properyImage: require('../../assets/images/house/house_5.jpg'),
        propertyName: 'Sky View House',
        propertyAddress: 'Opera Street, New York',
        propertyAmount: '300000',
        isFavourit: false,
    },
    {
        id: '5',
        properyImage: require('../../assets/images/house/house_6.jpg'),
        propertyName: 'Sky View House',
        propertyAddress: 'Opera Street, New York',
        propertyAmount: '360000',
        isFavourit: false,
    },
];

class SearchScreen extends Component {

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
        isSearch: false,
        featuredPropertyChangableList: featuredPropertyList,
        showSnackBar: false,
        isInWishList: false,
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
                <StatusBar
                    translucent={false}
                    backgroundColor={Colors.primaryColor}
                />
                <View style={{ flex: 1 }}>
                    <FlatList
                        ListHeaderComponent={
                            <>
                                {this.backArrow()}
                                {this.searchTextField()}
                                {this.title({ title: 'Your recent searches' })}
                                {this.recentSearches()}
                                {this.title({ title: 'Featured Properties' })}
                            </>
                        }
                        data={this.state.featuredPropertyChangableList}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={this.renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                    <Snackbar
                        style={styles.snackBarStyle}
                        visible={this.state.showSnackBar}
                        onDismiss={() => this.setState({ showSnackBar: false })}
                    >
                        {this.state.isInWishList ? 'Removed from shortlist' : 'Added to shortlist'}
                    </Snackbar>
                </View>
            </SafeAreaView>
        )
    }

    handleFeaturedPropertyUpdate({ id }) {
        const newList = this.state.featuredPropertyChangableList.map((property) => {
            if (property.id === id) {
                const updatedItem = { ...property, isFavourit: !property.isFavourit };
                return updatedItem;
            }
            return property;
        });
        this.setState({ featuredPropertyChangableList: newList })
    }

    renderItem = ({ item }) => (
        <View style={{
            ...styles.featuredPropertyContentStyle,
            marginTop: item.id == '1' ? Sizes.fixPadding - 5.0 : 0.0
        }}>
            <Image
                source={item.properyImage}
                resizeMode="cover"
                style={styles.featuredPropertyImageStyle}
            />
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    this.handleFeaturedPropertyUpdate({ id: item.id })
                    this.setState({ isInWishList: item.isFavourit, showSnackBar: true })
                }}
                style={styles.addToFavouriteContainerStyle}>
                <MaterialIcons
                    name={item.isFavourit ? "favorite" : "favorite-border"}
                    size={16}
                    color={Colors.grayColor}
                />
            </TouchableOpacity>
            <View style={styles.featuredPropertyInfoContentStyle}>
                <View style={{ width: '72%', }}>
                    <Text style={{ ...Fonts.blackColor14SemiBold }}>
                        {item.propertyName}
                    </Text>
                    <Text numberOfLines={1} style={{ ...Fonts.grayColor12Medium }}>
                        {item.propertyAddress}
                    </Text>
                </View>
                <View style={styles.featuredPropertyAmountContentStyle}>
                    <Text style={{ ...Fonts.blackColor16SemiBold }}>
                        {item.propertyAmount}$
                    </Text>
                </View>
            </View>
        </View>
    )

    recentSearches() {

        const renderItem = ({ item }) => (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: Sizes.fixPadding - 5.0,
                marginHorizontal: Sizes.fixPadding * 2.0,
            }}>
                <MaterialIcons name="history" size={23} color={Colors.grayColor} />
                <Text style={{ ...Fonts.blackColor14Regular, marginLeft: Sizes.fixPadding - 3.0 }}>
                    {item.searchText}
                </Text>
            </View>
        )
        return (
            <View>
                <FlatList
                    data={recentSearchesList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    contentContainerStyle={{
                        paddingTop: Sizes.fixPadding - 5.0,
                        paddingBottom: Sizes.fixPadding
                    }}
                />
            </View>

        )
    }

    title({ title }) {
        return (
            <Text style={{ ...Fonts.blackColor16SemiBold, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                {title}
            </Text>
        )
    }

    searchTextField() {
        return (
            <View style={styles.searchFieldStyle}>
                <MaterialIcons name="search" size={24}
                    color={this.state.isSearch ? Colors.primaryColor : Colors.grayColor} />
                <TextInput
                    placeholder="Search for properties"
                    style={{
                        flex: 1,
                        ...Fonts.grayColor14Medium,
                        marginLeft: Sizes.fixPadding,
                        paddingTop: 2.0,

                    }}
                    selectionColor={Colors.primaryColor}
                    onFocus={() => this.setState({ isSearch: true })}
                    onBlur={() => this.setState({ isSearch: false })}
                />
            </View>
        )
    }

    backArrow() {
        return (
            <MaterialIcons name="arrow-back" size={24} color="black"
                onPress={() => this.props.navigation.goBack()}
                style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginTop: Sizes.fixPadding }}
            />
        )
    }
}

const styles = StyleSheet.create({
    addToFavouriteContainerStyle: {
        width: 30.0,
        height: 30.0,
        borderRadius: 15.0,
        position: 'absolute',
        right: 10.0,
        top: 10.0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchFieldStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 37.0,
        backgroundColor: 'rgba(128, 128, 128, 0.25)',
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        marginVertical: Sizes.fixPadding * 2.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    featuredPropertyContentStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        elevation: 3.0,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding + 5.0,
    },
    featuredPropertyImageStyle: {
        borderTopLeftRadius: Sizes.fixPadding,
        borderTopRightRadius: Sizes.fixPadding,
        width: '100%',
        height: 220.0,
    },
    featuredPropertyInfoContentStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: Sizes.fixPadding,
        marginRight: Sizes.fixPadding + 5.0,
        marginVertical: Sizes.fixPadding,
        alignItems: 'center',
    },
    featuredPropertyAmountContentStyle: {
        borderWidth: 1.0,
        alignItems: 'center',
        height: 30.0,
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
        borderColor: 'rgba(128, 128, 128, 0.5)',
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: -10.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
    },
})

SearchScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(SearchScreen);