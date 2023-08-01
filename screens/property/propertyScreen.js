import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    Image,
    BackHandler,
    StatusBar,
    Share,
    Platform,
    ToastAndroid,
    Linking,
    Alert,
    ActivityIndicator
} from "react-native";
import * as Sharing from 'expo-sharing';
import { withNavigation } from "react-navigation";
import {captureRef} from 'react-native-view-shot';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GoogleMap from "../../component/googleMapScreen";
import { Fonts, Colors, Sizes } from "../../constant/styles";
import { SharedElement } from 'react-navigation-shared-element';
import CollapsingToolbar from "../../component/sliverAppBarScreen";
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { CircleFade } from "react-native-animated-spinkit";

class PropertyScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            propertyData: null,
            propertyImages: [],
            shareablelink: null,
            nearestPlacesChangableList: null,
            descriptionShow:false,
            pdfuri:null,
            pdfuriloader: false,
        }
        this._shareViewContainer = React.createRef();
    }

    componentDidMount() {
        this.FetchDetail();
        // this.FetchPDF();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        this.props.navigation.pop();
        return true;
    };

    properyID       = this.props.navigation.getParam('properyID');
    properyRef      = this.props.navigation.getParam('properyRef');
    propertyImage   = this.props.navigation.getParam('properyImage');
    propertyName    = this.props.navigation.getParam('propertyName');
    propertyAddress = this.props.navigation.getParam('propertyAddress');
    propertyPurpose = this.props.navigation.getParam('propertyPurpose');
    propertyAmount  = this.props.navigation.getParam('propertyAmount');

    FetchPDF = async() => {
        this.setState({ pdfuriloader: true })
        let res = await fetch(global.RelativePath+'/listing-pdf.php',{
        headers : {
            // 'listing_id'  : '43313916-c8b1-7d62-87d2-641076931aeb',
            'listing_id'  : this.state.propertyData.id
        }
        });
        let resp = await res.json();
        this.shareBill(resp.data.content)
    }

    shareBill = async (uri) => {
        const downloadResumable = FileSystem.createDownloadResumable(
            uri,
            FileSystem.documentDirectory + this.properyRef+'.pdf',
            {},
          );
          
          try {
            const { uri } = await downloadResumable.downloadAsync();
            this.setState({ pdfuriloader: false })
            Sharing.shareAsync(uri);
          } catch (e) {
            console.error(e);
          }
    };    

    FetchDetail = async() => {
        let res = await fetch(global.RelativePath+'/listing-detail.php',{
        headers : {
            'ref_no'  : this.properyRef,
            'user_id'  : global.Current_User.id,
        }
        });
        let resp = await res.json();
        if(resp.data.status === 200 && resp.code === 'Success'){
            if(resp.data.content){
                let a = 0;
                let images = []
                if(resp.data.content.images){
                    for (let image of resp.data.content.images) {
                        if(image){
                            images.push({
                                url:image
                            });
                            a++;
                        }
                    }
                }
                let c = 0;
                let amenities = []
                if(resp.data.content.private_amenities){
                    let p_amenities = resp.data.content.private_amenities.split(",");
                    for (let amenitie of p_amenities) {
                        if(amenitie){
                            amenities.push({'id':c,'name':amenitie,'icon':true});
                            c++;
                        }
                    }
                }

                let d = 0;
                if(resp.data.content.commercial_amenities){
                    let c_amenities = resp.data.content.commercial_amenities.split(",");
                    for (let amenitie of c_amenities) {
                        if(amenitie){
                            amenities.push({'id':d,'name':amenitie,'icon':true});
                            d++;
                        }
                    }
                }

                
                let features = [
                    {
                        id: '1',
                        place: 'Amenities',
                        isExpandable: false,
                        more: amenities
                    }
                ]
                this.setState({"propertyData":resp.data.content,"propertyImages":images,"amenities":amenities,"nearestPlacesChangableList":features,"shareablelink":resp.data.content.shareableLink});
                // this.FetchPDF()
            }
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
    openShareDialog = async () => {
        if (!(await Sharing.isAvailableAsync())) {
            alert(`Uh oh, sharing isn't available on your platform`);
            return;
        }
        captureRef(this._shareViewContainer, {
            // defaults
        }).then(
            uri => {
                const options = {
                   dialogTitle:  this.state.propertyData ? this.state.propertyData.title_en : null,
                };
                Sharing.shareAsync(uri,options);
            },
            error =>
            console.error('Oops, snapshot failed', error)
        );
    };
    
    render() {
        if(Platform.OS === 'ios'){
            return (
                <View style={{flex:1,backgroundColor:"#fff" }}>
                    <StatusBar translucent barStyle="dark-content" />
                    {this.propertyContent()} 
                </View>
            )
        }
        else{
            return (
                <SafeAreaView style={{ flex: 1 }}>
                    <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
                    {this.propertyContent()} 
                </SafeAreaView>
            )
        }
    }

    propertyContent() {
        return(
            <View ref={this._shareViewContainer} flex={1} style={{backgroundColor:'#fff'}}>
                <CollapsingToolbar
                    leftItem={
                        <MaterialIcons name="arrow-back" size={24}
                            color={Colors.whiteColor}
                            onPress={() => this.props.navigation.goBack()}
                        />
                    }
                    rightItem={
                        <View
                            activeOpacity={0.9}
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center", padding:10}}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => {
                                    // this.openShareDialog()
                                    this.FetchPDF();
                                }}>
                                {this.state.pdfuriloader ? (
                                    <ActivityIndicator color={'#fff'} size={'small'} />
                                ):
                                    <MaterialIcons name="share" size={24} color={Colors.whiteColor}
                                        style={{ marginLeft: Sizes.fixPadding }}
                                    />
                                }
                            </TouchableOpacity>
                        </View>
                    }
                    borderBottomRadius={20}
                    toolbarColor={Colors.primaryColor}
                    toolBarMinHeight={40}
                    toolbarMaxHeight={358}
                    src={
                        this.state.propertyImages.length > 0 ? this.state.propertyImages:[]
                        // [
                        //     "https://source.unsplash.com/1024x768/?nature",
                        //     "https://source.unsplash.com/1024x768/?water",
                        //     "https://source.unsplash.com/1024x768/?girl",
                        //     "https://source.unsplash.com/1024x768/?tree", // Network image
                        // ]
                    }>
                    <View style={{ paddingBottom: Sizes.fixPadding * 8.0 }}>
                        {this.propertyInfo()}
                        {/* {this.title({ title: 'Title' })} */}
                        {/* {this.TitleText()} */}
                        {this.title({ title: 'Description' })}
                        {this.descriptionText()}
                        {/* {this.title({ title: 'Photos' })} */}
                        {/* {this.photos()} */}
                        {/* {this.title({ title: 'Location' })} */}
                        {/* {this.mapInfo()} */}
                        {this.nearestPlaces()}
                    </View>
                </CollapsingToolbar>
                {/* {global.Current_User.is_admin && this.contactOwnerInfo()} */}
            </View>
        )
    }

    CallToPhone() {
        if(global.Current_User.phone_mobile){
            Linking.openURL(`tel:${global.Current_User.phone_mobile}`)
        }
        else{
            if(Platform.OS === 'android'){
                ToastAndroid.show('No Phone Numnber Found!', ToastAndroid.LONG);
            }
            else{
                Alert.alert(
                    'Sorry!',
                    'No Phone Numnber Found!'
                );
            }
        }
    }

    contactOwnerInfo() {
        return (
            <View style={styles.ownerInfoContentStyle}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                    }}>
                        <Image
                            source={require('../../assets/images/user/user_7.jpg')}
                            style={{ width: 50.0, height: 50.0, borderRadius: 25.0 }}
                        />
                        <View style={{ marginLeft: Sizes.fixPadding }}>
                            <Text style={{ ...Fonts.blackColor16Bold }}>
                                {global.Current_User.firstname && global.Current_User.firstname} {global.Current_User.lastname && global.Current_User.lastname}
                            </Text>
                            <Text style={{ ...Fonts.grayColor14Medium }}>
                                Agent
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => this.CallToPhone()}
                        style={styles.ownerContactContentStyle}>
                        <Text style={{ ...Fonts.whiteColor14SemiBold }}>
                            Phone Call
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    onShare = async(imageLink) => {
        const result = await Share.share({
            title: this.state.propertyData ? this.state.propertyData.title_en : null,
            // message: this.state.shareablelink ? this.state.shareablelink : 'http://128.199.28.62/thinkRealtyCRM/index.php?module=tc_listing&action=DetailView&record='+this.state.propertyData.id, 
            message: imageLink, 
            url: imageLink
        });
    }

    handleNearestPlacesUpdate({ id, isExpanded }) {
        const newList = this.state.nearestPlacesChangableList.map((property) => {
            if (property.id === id) {
                const updatedItem = { ...property, isExpandable: isExpanded };
                return updatedItem;
            }
            return property;
        });
        this.setState({ nearestPlacesChangableList: newList })

    }

    nearestPlaces() {
        return (
            <View>
                {this.state.nearestPlacesChangableList && this.state.nearestPlacesChangableList.map((item) => (
                    <View key={item.id} style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                        <Collapse
                            onToggle={(isExpanded) => this.handleNearestPlacesUpdate({ id: item.id, isExpanded })}
                        >
                            <CollapseHeader>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginVertical: Sizes.fixPadding - 8.0
                                    }}>
                                    <Text style={{ ...Fonts.blackColor14Bold }}>
                                        {item.place}({item.more.length})
                                    </Text>
                                    <MaterialIcons
                                        name={item.isExpandable ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                        size={24} color={Colors.primaryColor}
                                    />
                                </View>
                            </CollapseHeader>
                            <CollapseBody>
                                <View style={{ marginVertical: Sizes.fixPadding - 5.0 }}>
                                    {item.more.map((item) => (
                                        <View key={item.id}
                                            style={{
                                                flexDirection: 'row',
                                                marginVertical: Sizes.fixPadding - 7.0,
                                            }}>
                                            {item.icon && <MaterialIcons name="check-circle" size={15} color={Colors.primaryColor}/>}
                                            <Text style={{ ...Fonts.grayColor12Medium,marginLeft:5}}>
                                                {item.name}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </CollapseBody>
                        </Collapse>
                    </View>
                ))}
            </View>
        )
    }

    aminities() {
        return (
            <View style={{ marginTop: Sizes.fixPadding - 8.0, paddingBottom: Sizes.fixPadding - 5.0 }}>
                {this.state.amenities && 
                    this.state.amenities.map((item) => (
                        <View key={item.id}>
                            <View style={styles.aminitiesContentStyle}>
                                <MaterialIcons name="check-circle" size={20} color={Colors.primaryColor} />
                                <Text style={{ ...Fonts.blackColor14Regular, marginLeft: 2.0, marginTop: 1.5 }}>
                                    {item.aminities}
                                </Text>
                            </View>
                        </View>
                    ))
                }
            </View>
        )
    }

    mapInfo() {
        return (
            <View style={styles.mapStyle}>
                <GoogleMap
                    latitude={37.33233141}
                    longitude={-122.0312186}
                    height={150}
                    pinColor={Colors.primaryColor}
                />
            </View>
        )
    }

    photos() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                style={{ overflow: 'hidden' }}
                onPress={() => this.props.navigation.navigate('ImageFullView', { image: item.photo, id: item.id })}
            >
                <SharedElement id={item.id}>
                    <Image
                        source={{uri:item.photo}}
                        style={styles.propertyPhotosStyle}
                        resizeMode="cover"
                    />
                </SharedElement>
            </TouchableOpacity>
        )
        return (
            <FlatList
                horizontal
                data={this.state.propertyImages ? this.state.propertyImages : []}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingLeft: Sizes.fixPadding * 2.0,
                    paddingTop: Sizes.fixPadding - 5.0
                }}
            />
        )
    }

    descriptionText() {
        return (
            <View>
            {this.state.propertyData ? (
            <Text
            onPress={() => {
                if(this.state.descriptionShow === false){
                    this.setState({descriptionShow:true})
                } else {
                    this.setState({descriptionShow:false})
                }
            }}
            numberOfLines={this.state.descriptionShow === false ? 3:10000}
            style={{
                ...Fonts.blackColor12Regular, marginHorizontal: Sizes.fixPadding * 2.0,
                textAlign: 'justify'
            }}>
                {this.state.propertyData ? this.state.propertyData.description.trim() : null}
            </Text>
            ):
            <View style={{
                height:150,
                width:'100%',
                alignItems:'center',
                justifyContent:'center'
            }}>
                <CircleFade size={60} color={Colors.blackColor} style={{marginTop:15}}/>
            </View>}
            </View>
        )
    }

    TitleText() {
        return (
            <Text style={{
                ...Fonts.blackColor12Regular, marginHorizontal: Sizes.fixPadding * 2.0,
                textAlign: 'justify'
            }}>
                {this.state.propertyData ? this.state.propertyData.title_en : null}
            </Text>
        )
    }

    title({ title }) {
        return (
            <TouchableOpacity
            onPress={() => {
                if(this.state.descriptionShow === false){
                    this.setState({descriptionShow:true})
                } else {
                    this.setState({descriptionShow:false})
                }
            }}
             style={{flexDirection:'row',width:'94%',alignItems:'center',justifyContent:'space-between'}}>
            <Text style={{
                ...Fonts.blackColor18Bold,
                marginHorizontal: Sizes.fixPadding * 2.0,
                marginTop: Sizes.fixPadding
            }}>
                {title}
            </Text>
            <MaterialIcons
                name={this.state.descriptionShow === true ? "keyboard-arrow-up":"keyboard-arrow-down"}
                size={24} color={Colors.primaryColor}
            />
            </TouchableOpacity>
        )
    }

    propertyInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor18Bold, marginTop: Sizes.fixPadding }}>
                    {this.propertyName}
                </Text>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center', marginTop: Sizes.fixPadding
                }}>
                    <View style={{width: 170}}>
                        <Text style={{ ...Fonts.grayColor14Medium,width:'90%' }}>
                            {this.propertyAddress}
                        </Text>
                        <View style={{flexDirection:'row'}}>
                        <View style={{backgroundColor: Colors.primaryColor,
                            paddingHorizontal: 8,
                            marginBottom: 2,
                            borderRadius: 2,
                            alignItems:'center',
                            width:60,
                            height: 22}}>
                            <Text style={{...Fonts.whiteColor16Bold }}>
                                {this.propertyPurpose}
                            </Text>
                        </View>
                        <TouchableOpacity
                        onPress={() => {this.props.navigation.navigate('LeadCount',{id:this.state.propertyData?.id})}}
                         style={{
                            // backgroundColor: Colors.primaryColor,
                            paddingHorizontal: 5,
                            marginBottom: 2,
                            borderRadius: 2,
                            alignItems:'center',
                            // width:100,
                            height: 23,
                            marginLeft:5,
                            borderWidth:1,
                            borderColor:'#0003',
                            justifyContent:'center',
                            flexDirection:'row',
                            }}>
                            <Text style={{color:'#000',fontSize:12,fontWeight:'800'}}>
                                Lead Count: {this.state.propertyData?.lead_count}
                            </Text>
                            <MaterialIcons
                                name={"keyboard-arrow-right"}
                                size={21} color={Colors.blackColor}
                                style={{marginRight:-6}}
                            />
                        </TouchableOpacity>
                    </View>
                    </View>

                    <View row>
                        <View style={{backgroundColor: Colors.primaryColor,
                            paddingHorizontal: 8,
                            marginBottom: 2,
                            borderRadius: 2,
                            alignItems:'center',
                            height: 22}}>
                            <Text style={{...Fonts.whiteColor16Bold }}>
                                {this.properyRef}
                            </Text>
                        </View>
                        <View style={styles.propertyAmountContentStyle}>
                            <Text style={{ ...Fonts.blackColor16SemiBold }}>
                                {this.state.propertyData?.price} AED
                            </Text>
                        </View>
                    </View>
                </View>
                {this.state.propertyData &&
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: Sizes.fixPadding
                    }}>
                        <View style={{ alignItems: 'center',flexDirection:'row' }}>
                            <MaterialCommunityIcons name="floor-plan" size={20} color={'#000'} style={{marginRight:5,marginTop:-5}} />
                            <Text style={{ ...Fonts.blackColor22Bold }}>{this.state.propertyData.size ? this.state.propertyData.size : null}</Text>
                            <Text> sq feet</Text>
                            {/* <Text style={{ ...Fonts.blackColor14Regular, marginTop: Sizes.fixPadding - 20 }}>
                                Floor
                            </Text> */}
                        </View>
                        <View style={{ alignItems: 'center',flexDirection:'row' }}>
                            <MaterialCommunityIcons name="bed" size={20} color={'#000'} style={{marginRight:5,marginTop:-5}} />
                            <Text style={{ ...Fonts.blackColor22Bold }}>{this.state.propertyData.bedroom ? this.state.propertyData.bedroom : null}</Text>
                            {/* <Text style={{ ...Fonts.blackColor14Regular, marginTop: Sizes.fixPadding - 20 }}>
                                Bedrooms
                            </Text> */}
                        </View>
                        <View style={{ alignItems: 'center',flexDirection:'row' }}>
                            <MaterialCommunityIcons name="bathtub" size={20} color={'#000'} style={{marginRight:5,marginTop:-5}} />
                            <Text style={{ ...Fonts.blackColor22Bold }}>{this.state.propertyData.bathroom ? this.state.propertyData.bathroom : null}</Text>
                            {/* <Text style={{ ...Fonts.blackColor14Regular, marginTop: Sizes.fixPadding - 20 }}>
                                Bathrooms
                            </Text> */}
                        </View>
                        <View style={{ alignItems: 'center',flexDirection:'row' }}>
                            <MaterialCommunityIcons name="car-brake-parking" size={20} color={'#000'} style={{marginRight:5,marginTop:-5}} />
                            <Text style={{ ...Fonts.blackColor22Bold }}>{this.state.propertyData.parking ? this.state.propertyData.parking : null}</Text>
                            {/* <Text style={{ ...Fonts.blackColor14Regular, marginTop: Sizes.fixPadding - 20 }}>
                                Parkings
                            </Text> */}
                        </View>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    propertyAmountContentStyle: {
        borderWidth: 1.0,
        alignItems: 'center',
        height: 34.0,
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
        borderColor: 'rgba(128, 128, 128, 0.5)',
    },
    propertyPhotosStyle: {
        width: 120.0,
        height: 150.0,
        borderRadius: Sizes.fixPadding,
        marginRight: Sizes.fixPadding + 8.0
    },
    mapStyle: {
        borderRadius: Sizes.fixPadding,
        marginVertical: Sizes.fixPadding - 5.0,
        overflow: 'hidden',
        elevation: 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0
    },
    aminitiesContentStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Sizes.fixPadding - 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    ownerInfoContentStyle: {
        position: 'absolute',
        bottom: 0.0,
        height: 70.0,
        backgroundColor: Colors.whiteColor,
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        borderTopColor: 'rgba(128, 128, 128, 0.2)',
        borderTopWidth: 1.0,
        elevation: 2.0,
    },
    ownerContactContentStyle: {
        height: 31.0,
        width: 90.0,
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
})

PropertyScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(PropertyScreen);