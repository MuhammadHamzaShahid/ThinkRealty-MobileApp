import React, { Component } from "react";
import { 
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
    StatusBar,
    Platform
} from "react-native";
import { withNavigation } from "react-navigation";
import { MaterialIcons } from '@expo/vector-icons';
import { Fonts, Colors, Sizes } from "../../constant/styles";
import { Snackbar } from 'react-native-paper';

const { width } = Dimensions.get('screen');

class ShortlistScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shortlistProperty: null,
            showSnackBar: false,
            isInWishList: false,
        };
    }

    componentDidMount() {
        this.GetListing();
    }

    GetListing = async() => {
        global.database.transaction((tx) => {
            tx.executeSql("SELECT * FROM `thinkrealty_listing_inquires` WHERE `favourit` = 'true'",
                [],
                (tx, success) => {
                    this.setState({ "shortlistProperty" : success.rows._array})
                }
            );
        })
    }

    render() {
        if(Platform.OS === 'ios'){
            return (
                <View style={{ flex: 1 }}>
                    <StatusBar translucent barStyle="dark-content" />
                    {this.shortContent()} 
                </View>
            )
        }
        else{
            return (
                <SafeAreaView style={{ flex: 1 }}>
                    <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
                    {this.shortContent()} 
                </SafeAreaView>
            )
        }
    }

    shortContent = () => {
        return (
            <View style={{ flex: 1 }}>
                {this.header()}
                <FlatList
                    ListEmptyComponent={
                        <>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <MaterialIcons name="favorite-border" size={50} color={Colors.grayColor} />
                                <Text style={{ ...Fonts.grayColor18Bold}}>
                                    No item in Short List
                                </Text>
                            </View>
                        </>
                    }
                    data={this.state.shortlistProperty}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={this.renderItem}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 8.0, }}
                    showsVerticalScrollIndicator={false}
                />
                <Snackbar
                    style={styles.snackBarStyle}
                    visible={this.state.showSnackBar}
                    onDismiss={() => this.setState({ showSnackBar: false })}
                >
                    {this.state.isInWishList === 'false' ? 'Removed from shortlist' : 'Added to shortlist'}
                </Snackbar>
            </View>
        )
    }

    handleShortListPropertyUpdate({ id }) {
        const newList = this.state.shortlistProperty.map((property) => {
            if (property.id === id) {
                var fvrt = property.favourit === 'true' ? 'false':'true'
                global.database.transaction((tx) => {
                    tx.executeSql('UPDATE `thinkrealty_listing_inquires` SET `favourit` = "'+fvrt+'" WHERE `id` =  "'+id+'"');
                    tx.executeSql("SELECT * FROM `thinkrealty_listing_inquires` WHERE `favourit` = 'true'",
                        [],
                        (tx, success) => {
                            this.setState({ "shortlistProperty" : success.rows._array})
                        }
                    );
                })
                const updatedItem = { ...property, favourit: fvrt };
                return updatedItem;
            }
            return property;
        });
        this.setState({ shortlistProperty: newList })
    }

    renderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.props.navigation.navigate('Property',
                {
                    properyID       : item.id,
                    properyRef      : item.ref_no,
                    properyImage    : item.thumbnail_images,
                    propertyName    : item.property_name,
                    propertyAddress : item.property_address,
                    propertyAmount  : item.property_price,
                    favourit        : item.favourit
                })}
            style={styles.shortlistPropertyContentStyle}>
            <Image
                source={{uri:item.thumbnail_images}}
                resizeMode="cover"
                style={styles.shortlistPropertyImageStyle}
            />
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    this.handleShortListPropertyUpdate({ id: item.id })
                    this.setState({ isInWishList: item.favourit === 'true' ? 'false':'true', showSnackBar: true })
                }}
                style={styles.addToFavouriteContainerStyle}>
                <MaterialIcons
                    name={item.favourit === 'true' ? "favorite" : "favorite-border"}
                    size={16}
                    color={Colors.grayColor}
                />
            </TouchableOpacity>
            <View style={styles.shortlistPropertyInfoContentStyle}>
                <View style={{ width: width / 1.9, }}>
                    <Text style={{ ...Fonts.blackColor14SemiBold }}>
                        {item.property_name}
                    </Text>
                    <Text numberOfLines={1} style={{ ...Fonts.grayColor12Medium }}>
                        {item.property_address}
                    </Text>
                </View>
                <View style={styles.shortlistPropertyAmountContentStyle}>
                    <Text style={{ ...Fonts.blackColor16SemiBold }}>
                        {item.property_price}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    handleNearByPropertyUpdate({ id }) {
        const newList = this.state.nearbyProperyChangableList.map((property) => {
            if (property.id === id) {
                const updatedItem = { ...property, favourit: !property.favourit };
                return updatedItem;
            }
            return property;
        });
        this.setState({ nearbyProperyChangableList: newList })

    }

    title({ title }) {
        return (
            <Text style={{
                ...Fonts.blackColor18SemiBold, marginHorizontal: Sizes.fixPadding * 2.0,
                marginVertical: Sizes.fixPadding - 5.0
            }}>
                {title}
            </Text>
        )
    }

    header() {
        return (
            <View style={styles.headerStyle}>
                <View style={styles.headerContentStyle}>
                    <Text style={{ ...Fonts.primaryColor18Bold }}>Short List</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <MaterialIcons name="search" size={24} color={Colors.primaryColor}
                            onPress={() => alert('Coming Soon')}//this.props.navigation.navigate('Search')
                        />
                        <TouchableOpacity
                        onPress={() => {this.props.navigation.navigate('Notification')}}>
                        <MaterialIcons name="notifications" size={24} color={Colors.primaryColor}
                            style={{ marginLeft: Sizes.fixPadding + 5.0 }}
                        />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        padding: 20,
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        justifyContent: 'center'
    },
    headerContentStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
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
    shortlistPropertyContentStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        elevation: 3.0,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding + 5.0,
    },
    shortlistPropertyImageStyle: {
        borderTopLeftRadius: Sizes.fixPadding,
        borderTopRightRadius: Sizes.fixPadding,
        width: '100%',
        height: 220.0,
    },
    shortlistPropertyInfoContentStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding,
        marginVertical: Sizes.fixPadding,
        alignItems: 'center',
    },
    shortlistPropertyAmountContentStyle: {
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
        bottom: 50.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
    }
})

export default withNavigation(ShortlistScreen);