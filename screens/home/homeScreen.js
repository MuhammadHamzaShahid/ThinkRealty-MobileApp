import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    FlatList,
    Dimensions,
    StatusBar,
    Platform,
    TextInput
} from "react-native";
import { withNavigation } from "react-navigation";
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Fonts, Colors, Sizes } from "../../constant/styles";
import { CircleFade } from 'react-native-animated-spinkit';
import { Snackbar } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { ImageBackground } from "react-native";

const BACKGROUND_FETCH_TASK = 'background-notfication-igec';

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  
  const now = Date.now();
  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

const { width, height } = Dimensions.get('screen');

class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isBuy: true,
            shortlistProperty: null,
            featuredPropertyChangableList: [],
            showSnackBar: false,
            isInWishList: false,
            Loading: false,
            intervalId:null,
            noticollection:null,
            pagination:10,
            searchShow:false,
            searchText:'',
            searchData:[],
            searchLoading:false
        };
    }
    
    componentDidMount() {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false
            }),
        });
        this.registerBackgroundFetchAsync();  
        Notifications.addNotificationResponseReceivedListener((response) => {
        // Notifications.dismissAllNotificationsAsync();
        this.props.navigation.navigate('Notifications');
        });  
        const intervalId = setInterval(() => {
            this.FetchListing();
        }, 1000*60);

        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            this.IsNewNotification();
        });

        this.FetchListing();
        this.GetShortList();
        this.IsNewNotification();
        this.setState({ intervalId: intervalId })
        
    }
    
    componentWillUnmount(){
        clearInterval(this.state.intervalId)
        this.focusListener.remove();
    }

    registerBackgroundFetchAsync = async() => {
        return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 1, // 1 minutes
          stopOnTerminate: false, // android only,
          startOnBoot: true, // android only
        })
      }

    IsNewNotification = async() => {
        let res = await fetch(global.RelativePath+'/fetch-mobile-notifications.php',{
        headers : {
            'user_id'          : global.Current_User.id,
        }
        });
        let resp = await res.json();
        if(resp.data.status === 200 && resp.code === 'Success'){
            this.setState({NewNoti:false});
            for (var i=0; i < resp.data.content.length; i++) {
                if(resp.data.content[i].status == 0){
                    this.setState({NewNoti:true});
                }
            }
        }
    }
    
    FetchListing = async() => {
        if(typeof global.Current_User != 'undefined'){
            let res = await fetch(global.RelativePath+'/listing.php',{
            headers : {
                'user_id'  : global.Current_User.id,
                'pagination'  : this.state.featuredPropertyChangableList ? this.state.pagination+this.state.featuredPropertyChangableList?.length:this.state.pagination,
            }
            });
            let resp = await res.json();
            resp?.data?.content?.map((item) => {
                this.state.featuredPropertyChangableList.push(item)
            })
            this.setState({"Loading" : false})
            if(resp.data.status === 200 && resp.code === 'Success'){
                if(resp.data.content){
                    global.database.transaction((tx) => {
                        for(let i = 0; i < resp.data.content.length; i++){
                            tx.executeSql("SELECT * FROM `thinkrealty_listing_inquires` WHERE `ref_no` =  '"+resp.data.content[i].ref_no+"' LIMIT 1",
                                [],
                                (tx, success) => {
                                    if(success.rows.length){
                                        tx.executeSql('UPDATE `thinkrealty_listing_inquires` SET `assigned_user_id` = "'+resp.data.content[i].assigned_user_id+'", `thumbnail_images` = "'+resp.data.content[i].thumbnail+'", `property_name` = "'+resp.data.content[i].property_name+'", `property_purpose` = "'+resp.data.content[i].property_purpose+'", `property_address` = "'+resp.data.content[i].location+'", `property_price` = "'+resp.data.content[i].price+'" WHERE `ref_no` =  "'+resp.data.content[i].ref_no+'"');
                                    }
                                    else{
                                        if(i <= 3){
                                            tx.executeSql('INSERT INTO `thinkrealty_listing_inquires` (`assigned_user_id`, `thumbnail_images`, `property_name`, `property_purpose`, `property_address`, `property_price`, `ref_no`, `favourit`) VALUES ("'+resp.data.content[i].assigned_user_id+'","'+resp.data.content[i].thumbnail+'","'+resp.data.content[i].property_name+'","'+resp.data.content[i].property_purpose+'","'+resp.data.content[i].location+'","'+resp.data.content[i].price+'","'+resp.data.content[i].ref_no+'","true")');
                                        }
                                        else{
                                            tx.executeSql('INSERT INTO `thinkrealty_listing_inquires` (`assigned_user_id`, `thumbnail_images`, `property_name`, `property_purpose`, `property_address`, `property_price`, `ref_no`, `favourit`) VALUES ("'+resp.data.content[i].assigned_user_id+'","'+resp.data.content[i].thumbnail+'","'+resp.data.content[i].property_name+'","'+resp.data.content[i].property_purpose+'","'+resp.data.content[i].location+'","'+resp.data.content[i].price+'","'+resp.data.content[i].ref_no+'","false")');
                                        }
                                    }
                                }
                            )
                        }
                    })
                }
            }
            // this.GetListing();
            this.GetShortList();
        }
    }

    FetchSearchListing = async (searchText) => {
        this.setState({"searchLoading":true})
        let res = await fetch(global.RelativePath+'/listings-search.php',{
        headers : {
            'user_id'  : global.Current_User.id,
            'ref_no'  : searchText,
        }
        });
        let resp = await res.json();
        this.setState({ "searchData" : resp?.data?.content,"searchLoading":false})
    }

    GetShortList = async() => {
        global.database.transaction((tx) => {
            tx.executeSql("SELECT * FROM `thinkrealty_listing_inquires` WHERE `favourit` = 'true'",
                [],
                (tx, success) => {
                    this.setState({ "shortlistProperty" : success.rows._array})
                }
            );
        })
    }
    
    GetListing = async() => {
        global.database.transaction((tx) => {
            tx.executeSql("SELECT * FROM `thinkrealty_listing_inquires` WHERE `favourit` = 'true'",
                [],
                (tx, success) => {
                    this.setState({ "shortlistProperty" : success.rows._array})
                }
            );
            tx.executeSql("SELECT * FROM `thinkrealty_listing_inquires`",
                [],
                (tx, success) => {
                    if(success.rows.length){
                    }
                }
            );
        })
    }

    render() {
        if(Platform.OS === 'android'){
            return (
                <View style={{ flex: 1 }}>
                    <StatusBar translucent barStyle="dark-content" />
                    {this.homeContent()} 
                </View>
            )
        }
        else{
            return (
                <SafeAreaView style={{ flex: 1 }}>
                    <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
                    {this.homeContent()} 
                </SafeAreaView>
            )
        }
    }

    renderFooter = () => {
        return (
          //Footer View with Load More button
          <View
            style={{
              // padding: 10,
              height:50,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            //   backgroundColor:'#ada'
            }}>
            {this.state.Loading === false ? (
              <TouchableOpacity
              onPress={() => {
                this.setState({Loading:true})
                this.FetchListing()
              }}
                style={{
                  height: 40,
                  width: '40%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // flexDirection: 'row',
                //   backgroundColor:Colors.grayColor,
                  borderRadius:10,
                  borderWidth:1,
                  borderColor:Colors.primaryColor
                }}>
                    <Text style={{color:Colors.primaryColor}}>Load More</Text>
              </TouchableOpacity>
            ):
              <View
                style={{
                  height: 40,
                  width: '40%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // flexDirection: 'row',
                //   backgroundColor:Colors.grayColor,
                  borderRadius:10,
                  borderWidth:1,
                  borderColor:Colors.primaryColor
                }}>
                    <CircleFade size={20} color={Colors.primaryColor} style={{}}/>
              </View>}
          </View>
        );
      };
    
    homeContent = () => {
        return (
            <View style={{ flex: 1 }}>
            <StatusBar translucent={false} />
            {/* <Header
            //   back
              title={'List Property'}
              navigation={this.props.navigation}
            /> */}
                {this.header()}
                {this.state.searchShow === true ? (
                <View style={{
                    height:45,
                    width:'88%',
                    alignSelf:'center',
                    // backgroundColor:'#ada',
                    borderRadius:10,
                    marginTop:20,
                    borderWidth:1,
                    borderColor:Colors.primaryColor,
                    // justifyContent:'center',
                    flexDirection:'row',
                    alignItems:'center',
                    marginBottom:10
                }}>
                    <MaterialIcons name="search" size={24} style={{marginLeft:10}} color={Colors.primaryColor}/>
                    <TextInput
                    style={{paddingLeft:10,width:'75%'}}
                    placeholder="Search Ref #"
                    autoFocus={true}
                    onChangeText={(searchText) => {
                        this.setState({searchText:searchText})
                        this.FetchSearchListing(searchText)
                        }}/>
                    <TouchableOpacity
                    style={{
                        height:40,
                        width:'15%',
                        // backgroundColor:'#ada',
                        // alignItems:'center',
                        justifyContent:'center'
                    }}
                    onPress={() => {this.setState({searchText:'',searchShow:false})}}>
                    <Entypo name="cross" size={24} style={{marginLeft:10}} color={Colors.primaryColor}/>
                    </TouchableOpacity>
                </View>
                ):null}
                {this.state.searchText === '' ? (
                <View style={{marginBottom:60}}>
                {this.state.featuredPropertyChangableList.length > 0 ? (
                <FlatList
                    ListEmptyComponent={
                        this.state.featuredPropertyChangableList &&
                        <>
                            <View style={{justifyContent: 'center',alignItems: 'center',}}>
                                <CircleFade size={50} color={Colors.blackColor} style={{marginTop:15}}/>
                            </View>
                        </>
                    }
                    ListHeaderComponent={
                        this.state.featuredPropertyChangableList ?
                        <>
                            {/* {this.buyAndRentButton()} */}
                            {this.title({ title: 'Favourite Listings' })}
                            {this.nearbyProperties()}
                            {this.title({ title: 'Featured Listings' })}
                        </>
                        :
                        <View style={{
                            flex:1,
                            alignSelf: 'center',
                            alignItems: 'center',
                            position:"absolute",
                            top:height/3
                        }}>
                            <View style={{justifyContent: 'center',alignItems: 'center',}}>
                                <CircleFade size={50} color={Colors.blackColor} style={{marginTop:15}}/>
                            </View>
                        </View>
                    }
                    data={this.state.featuredPropertyChangableList}
                    // keyExtractor={(item) => `${item.id}`}
                    keyExtractor={(item, index) => `_key${index.toString()}`}
                    renderItem={this.renderItem}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 8.0, }}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={this.renderFooter()}
                />
                ):
                <View style={{
                    flex:1,
                    alignSelf: 'center',
                    alignItems: 'center',
                    position:"absolute",
                    top:height/12
                }}>
                    <View style={{justifyContent: 'center',alignItems: 'center',}}>
                        <CircleFade size={50} color={Colors.blackColor} style={{marginTop:15}}/>
                    </View>
                </View>}
                </View>
                ):
                <View style={{marginTop:10,width:'94%',alignSelf:'center'}}>
                {this.state.searchData ? (
                <FlatList
                    ListEmptyComponent={
                        this.state.searchData &&
                        <>
                            <View style={{justifyContent: 'center',alignItems: 'center',}}>
                                {this.state.searchLoading === true ? (
                                <CircleFade size={50} color={Colors.blackColor} style={{marginTop:15}}/>
                                ):
                                <Text style={{color:'#000'}}>Reference Number not exist</Text>}
                            </View>
                        </>
                    }
                    ListHeaderComponent={
                        this.state.searchData ?
                        <>
                            {/* {this.buyAndRentButton()}
                            {this.title({ title: 'Favourite Listings' })}
                            {this.nearbyProperties()}
                            {this.title({ title: 'Featured Listings' })} */}
                        </>
                        :
                        <View style={{
                            flex:1,
                            alignSelf: 'center',
                            alignItems: 'center',
                            position:"absolute",
                            top:height/3
                        }}>
                            <View style={{justifyContent: 'center',alignItems: 'center',}}>
                                <CircleFade size={50} color={Colors.blackColor} style={{marginTop:15}}/>
                            </View>
                        </View>
                    }
                    data={this.state.searchData}
                    // keyExtractor={(item) => `${item.id}`}
                    keyExtractor={(item, index) => `_key${index.toString()}`}
                    renderItem={this.renderItem}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 8.0, }}
                    showsVerticalScrollIndicator={false}
                    // ListFooterComponent={this.renderFooter()}
                />
                ):
                <View style={{
                    flex:1,
                    alignSelf: 'center',
                    alignItems: 'center',
                    position:"absolute",
                    top:height/12
                }}>
                    <View style={{justifyContent: 'center',alignItems: 'center',}}>
                        <CircleFade size={50} color={Colors.blackColor} style={{marginTop:15}}/>
                    </View>
                </View>}
                </View>}
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

    handleFeaturedPropertyUpdate({ id }) {
        const newList = this.state.featuredPropertyChangableList.map((property) => {
            if (property.id === id) {
                var fvrt = property.favourit === 'true' ? 'false':'true'
                global.database.transaction((tx) => {
                    tx.executeSql('UPDATE `thinkrealty_listing_inquires` SET `favourit` = "'+fvrt+'" WHERE `id` =  "'+id+'"');
                })
                const updatedItem = { ...property, favourit: fvrt };
                return updatedItem;
            }
            return property;
        });
        this.GetShortList();
        this.setState({ featuredPropertyChangableList: newList })
    }

    renderItem = ({ item }) => (
        <TouchableOpacity
            onPressIn={() => this.props.navigation.navigate('Property',
                {
                    properyID       : item?.id,
                    properyRef      : item?.ref_no,
                    properyImage    : item?.thumbnail,
                    propertyName    : item?.property_name,
                    propertyAddress : item?.property_address,
                    propertyPurpose : item?.property_purpose,
                    propertyAmount  : item?.property_price,
                    favourit        : item?.favourit,
                })}
            style={styles.featuredPropertyContentStyle}>
            <ImageBackground
                source={{uri:item?.thumbnail}}
                resizeMode="cover"
                borderTopLeftRadius= {Sizes.fixPadding}
                borderTopRightRadius= {Sizes.fixPadding}        
                style={styles.featuredPropertyImageStyle}
            />
            <TouchableOpacity
                onPress={() => {
                    this.handleFeaturedPropertyUpdate({ id: item.id })
                    this.setState({ isInWishList: item.favourit === 'true' ? 'false':'true', showSnackBar: true })
                }}
                style={styles.addToFavouriteContainerStyle}>
                <MaterialIcons
                    name={item.favourit === 'true' ? "favorite" : "favorite-border"}
                    size={16}
                    color={Colors.grayColor}
                />
            </TouchableOpacity>
            <View style={styles.featuredPropertyInfoContentStyle}>
                <View style={{ width: width / 1.9, }}>
                    <Text style={{ ...Fonts.blackColor14SemiBold }}>
                        {item.property_name}
                    </Text>
                    <Text style={{ ...Fonts.grayColor12Medium }}>
                        {item.property_address}
                    </Text>
                </View>
                <View row>
                    <View style={{backgroundColor: Colors.primaryColor,
                        paddingHorizontal: 8,
                        marginBottom: 2,
                        borderRadius: 2,
                        alignItems:'center',
                        height: 22}}>
                        <Text style={{...Fonts.whiteColor16Bold }}>
                            {item.ref_no}
                        </Text>
                    </View>
                    <View style={styles.featuredPropertyAmountContentStyle}>
                        <Text style={{ ...Fonts.blackColor12Bold }}>
                            {item.price} AED
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
    handleNearByPropertyUpdate({ id }) {
        const newList = this.state.shortlistProperty.map((property) => {
            if (property.id === id) {
                var fvrt = property.favourit === 'true' ? 'false':'true'
                global.database.transaction((tx) => {
                    tx.executeSql('UPDATE `thinkrealty_listing_inquires` SET `favourit` = "'+fvrt+'" WHERE `id` =  "'+id+'"');
                })
                const updatedItem = { ...property, favourit: fvrt };
                return updatedItem;
            }
            return property;
        });
        this.GetShortList();
        this.setState({ shortlistProperty: newList })
    }

    nearbyProperties() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Property',
                    {
                        properyID       : item.id,
                        properyRef      : item.ref_no,
                        properyImage    : item.thumbnail_images,
                        propertyName    : item.property_name,
                        propertyAddress : item.property_address,
                        propertyPurpose : item.property_purpose,
                        propertyAmount  : item.property_price,
                        favourit        : item.favourit,
                    })}
                style={styles.nearByPropertContentStyle}>
                <Image source={{uri:item.thumbnail_images}}
                    resizeMode="cover"
                    style={styles.nearByPropertyImageStyle}
                    onPress={() => this.props.navigation.navigate('Property',
                    {
                        properyID       : item.id,
                        properyRef      : item.ref_no,
                        properyImage    : item.thumbnail_images,
                        propertyName    : item.property_name,
                        propertyAddress : item.property_address,
                        propertyPurpose : item.property_purpose,
                        propertyAmount  : item.property_price,
                        favourit        : item.favourit,
                    })}
                />
                <TouchableOpacity
                    onPress={() => {
                        this.handleFeaturedPropertyUpdate({ id: item.id })
                        this.handleNearByPropertyUpdate({ id: item.id })
                        this.setState({ isInWishList: item.favourit === 'true' ? 'false':'true', showSnackBar: true })
                    }}
                    style={styles.addToFavouriteContainerStyle}>
                    <MaterialIcons
                        name={item.favourit ? "favorite" : "favorite-border"}
                        size={16}
                        color={Colors.grayColor}
                    />
                </TouchableOpacity>
                <View style={{ marginHorizontal: Sizes.fixPadding }}>
                    <Text style={{ ...Fonts.blackColor14SemiBold, marginTop: Sizes.fixPadding }}>
                        {item.property_name}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={{ ...Fonts.grayColor12Medium, marginVertical: Sizes.fixPadding - 5.0 }}
                    >
                        {item.property_address}
                    </Text>
                    <Text style={{ ...Fonts.blackColor16SemiBold }}>
                        {item.property_price} AED
                    </Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <FlatList
                horizontal
                data={this.state.shortlistProperty}
                // keyExtractor={(item) => `${item.id}`}
                keyExtractor={(item, index) => `_key${index.toString()}`}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingLeft: Sizes.fixPadding * 2.0,
                    paddingBottom: Sizes.fixPadding + 5.0
                }}
                showsHorizontalScrollIndicator={false}
            />
        )
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

    buyAndRentButton() {
        return (
            <View style={styles.buyAndRentButtonContainerStyle}>
                <TouchableOpacity
                    disabled={true}
                    onPress={() => this.setState({ isBuy: true })}
                    style={{
                        ...styles.buyAndRentButtonStyle,
                        backgroundColor: this.state.isBuy ? 'grey' : Colors.whiteColor,
                        borderColor: this.state.isBuy ? null : Colors.primaryColor,
                        borderWidth: this.state.isBuy ? 0.0 : 1.0,

                    }}>
                    <Text style={this.state.isBuy ? { ...Fonts.whiteColor16Bold } : { ...Fonts.primaryColor16Medium }}>
                        Buy
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={true}
                    onPress={() => this.setState({ isBuy: false })}
                    style={{
                        ...styles.buyAndRentButtonStyle,
                        backgroundColor: this.state.isBuy ? 'grey' : Colors.primaryColor,
                        borderColor: this.state.isBuy ? 'grey' : null,
                        borderWidth: this.state.isBuy ? 1.0 : 0.0,
                    }}>
                    <Text style={this.state.isBuy ? { ...Fonts.whiteColor16Bold } : { ...Fonts.whiteColor16Bold }}>
                        Rent
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    header() {
        return (
            <View style={styles.headerStyle}>
                <View style={styles.headerContentStyle}>
                    <Text style={{ ...Fonts.primaryColor18Bold,marginLeft:Sizes.fixPadding * 2.0}}>Listings</Text>
                    <View style={{ flexDirection: 'row',height:70,alignItems:'center',justifyContent:'flex-end' }}>
                        <TouchableOpacity
                        onPress={() => {this.setState({searchShow:true})}}
                        style={{
                            // backgroundColor:'#ada',
                            height:70,
                            width:'30%',
                            alignItems:'center',
                            justifyContent:'center',
                            marginRight:-16
                        }}>
                        <MaterialIcons name="search" size={24} color={Colors.primaryColor}
                            // onPress={() => {this.setState({searchShow:true})}}
                        />
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={{
                            height:70,
                            width:'33%',
                            // backgroundColor:'#ada',
                            alignItems:'center',
                            justifyContent:'center',
                        }}
                        onPress={() => {this.props.navigation.navigate('Notifications')}}>
                        {this.state.NewNoti && <Text style={{color:'red',fontSize:24,position:'absolute',top:10}}>•</Text>}
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
        // padding: 20,
        backgroundColor: Colors.lightColor,
        // paddingHorizontal: Sizes.fixPadding * 2.0,
        justifyContent: 'center',
        height:70
    },
    headerContentStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buyAndRentButtonContainerStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: Sizes.fixPadding * 2.0,
    },
    buyAndRentButtonStyle: {
        flex: 0.47,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 3.0,
        alignItems: 'center',
        justifyContent: 'center'
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
    nearByPropertyImageStyle: {
        width: 160.0,
        height: 110.0,
        borderTopLeftRadius: Sizes.fixPadding + 5.0,
        borderTopRightRadius: Sizes.fixPadding + 5.0,
        position:'relative'
    },
    nearByPropertContentStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 4.0,
        width: 160.0,
        borderRadius: Sizes.fixPadding + 5.0,
        marginRight: Sizes.fixPadding * 2.0
    },
    featuredPropertyContentStyle: {
        marginHorizontal: Sizes.fixPadding * 1.0,
        elevation: 3.0,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding + 5.0,
        // backgroundColor:'#ada',
        // height:330
    },
    featuredPropertyImageStyle: {
        borderTopLeftRadius: Sizes.fixPadding,
        borderTopRightRadius: Sizes.fixPadding,
        width: '100%',
        height: 220.0,
        resizeMode:'cover'
    },
    featuredPropertyInfoContentStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding,
        marginVertical: Sizes.fixPadding,
        alignItems: 'center',
    },
    featuredPropertyAmountContentStyle: {
        borderWidth: 1.0,
        alignItems: 'center',
        height: 30.0,
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
        // paddingHorizontal: Sizes.fixPadding,
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

export default withNavigation(HomeScreen);