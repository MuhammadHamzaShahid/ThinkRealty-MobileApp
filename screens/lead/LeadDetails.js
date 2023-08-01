import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity,ScrollView,Modal,TextInput,Platform,Alert, ActivityIndicator } from "react-native";
import { withNavigation } from "react-navigation";
import { Fonts, Colors, Sizes } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { TransitionPresets } from 'react-navigation-stack';
import CollapsingToolbar from "../../component/sliverAppBarScreen";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CircleFade } from 'react-native-animated-spinkit';
import * as Clipboard from 'expo-clipboard';
import { Linking } from "react-native";
import { ToastAndroid } from "react-native";

// import { YellowBox } from "react-native";
// YellowBox.ignoreWarnings([""]);

const leadList = [];

const { width } = Dimensions.get('screen');

class LeadDetails extends Component {
    state = {
        leadListDetails:null,
        modalVisible:false,
        dropdownModal:false,
        dropdownData:[],
        selectedName:'Assigned To',
        description:'',
        loading:true
    }

    componentDidMount(){
        this.FetchListing()
        this.FetchDropdown()
    }
    
    copyToClipboard = async (phoneNumber) => {
        await Clipboard.setStringAsync(phoneNumber);
        if(Platform.OS === 'android'){
            ToastAndroid.show('Copied', ToastAndroid.LONG);
        }
        else{
            Alert.alert(
                'Copied'
            );
        }
    };
    
    
    FetchListing = async() => {
        if(typeof global.Current_User != 'undefined'){
            let res = await fetch(global.RelativePath+'/lead-detail.php',{
            headers : {
                // 'ref_no'  : 'TR-L-9005',
                'ref_no'  : this.props?.navigation?.getParam('item')?.ref_no
            }
            });
            let resp = await res.json();
            this.setState({leadListDetails:resp?.data?.content,loading:false,selectedName:'Assigned To',modalVisible:false})
            let images = []
            resp?.data?.content?.images?.map((item) => {
                images.push({url:item})
            })
            this.setState({images:images})
        }
    }

    FetchDropdown = async() => {
        if(typeof global.Current_User != 'undefined'){
            let res = await fetch(global.RelativePath+'/task-dropDown-values.php',{
            headers : {
                'user_id'  : global.Current_User.id
            }
            });
            let resp = await res.json();
            this.setState({
                dropdownData:resp?.data?.content,
            })
        }
    }

    CallToPhone(number) {
        if(number){
            Linking.openURL(`tel:${number}`)
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
    
    saveTask = async() => {
        this.setState({loading:true})
        if(this.state.selectedName != 'Assigned To' && this.state.description != ''){
            let res = await fetch(global.RelativePath+'/task-saving.php',{
                headers : {
                    'user_id'  : global.Current_User.id,
                    'lead_id'  : this.state.leadListDetails.id,
                    'assigned_user_id'  : this.state.selectedName,
                    'description'   : this.state.description,
                }
            });
            await res.json();
            this.FetchListing()
        }
        else{
            if(Platform.OS === 'android'){
                ToastAndroid.show('Please Select Required Fields', ToastAndroid.LONG);
            }
            else{
                Alert.alert(
                    'Sorry!',
                    'Please Select Required Fields!'
                );
            }
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.propertyContent()}
                <View style={{
                    height:40,
                    width:'90%',
                    // backgroundColor:'#ada',
                    flexDirection:'row',
                    alignItems:'center',
                    justifyContent:'space-between',
                    marginLeft:20,
                    marginBottom:20
                }}>
                <TouchableOpacity style={{
                    height:40,
                    width:'44%',
                    backgroundColor:Colors.primaryColor,
                    borderRadius:3,
                    flexDirection:'row',
                    alignItems:'center',
                    justifyContent:'center'
                }}
                onPress={() => this.CallToPhone(this.props.navigation.getParam('item').phone_mobile)}
                >
                    <MaterialIcons name="phone" size={15} color={'#fff'}/>
                    <Text numberOfLines={1} style={{color:'#fff',fontSize:12,marginLeft:10,fontWeight:'bold'}}>
                        Call
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={{
                    height:40,
                    width:'44%',
                    backgroundColor:Colors.primaryColor,
                    borderRadius:3,
                    flexDirection:'row',
                    alignItems:'center',
                    justifyContent:'center'
                }}
                onPress={() => {Linking.openURL(`https://api.whatsapp.com/send?phone=${this.props.navigation.getParam('item').phone_mobile}`)}}
                >
                    <MaterialCommunityIcons name="whatsapp" size={15} color={'#fff'}/>
                    <Text numberOfLines={1} style={{color:'#fff',fontSize:12,marginLeft:3,fontWeight:'bold'}}>
                    WhatsApp
                    </Text>
                </TouchableOpacity>
                </View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}>
                        <View style={{
                            flex:1,
                            backgroundColor:'#0006',
                            alignItems:'center',
                            justifyContent:'center'
                        }}>
                            <View style={{
                                height:300,
                                width:'90%',
                                backgroundColor:'#fff',
                                borderRadius:10,
                                alignItems:'center',
                                justifyContent:'center'
                            }}>
                                <Text style={{color:'#000',fontSize:20,marginBottom:10,fontWeight:'bold'}}>Create a Task</Text>
                                <TouchableOpacity
                                onPress={() => {
                                    let data = this.state.quality;
                                    this.setState({
                                    dropdownModal:true
                                })
                                }}
                                 style={{
                                    height:45,
                                    width:'88%',
                                    // backgroundColor:'#ada',
                                    borderRadius:10,
                                    borderWidth:1,
                                    borderColor:'#0004',
                                    justifyContent:'center'
                                }}>
                                    <Text style={{color:'#000',marginLeft:15}}>{this.state.selectedName}</Text>
                                </TouchableOpacity>
                                <View style={{
                                    height:70,
                                    width:'88%',
                                    borderRadius:10,
                                    borderWidth:1,
                                    borderColor:'#0004',
                                    marginTop:10
                                }}>
                                    <TextInput
                                    autoFocus={false}
                                    style={{color:'#000',paddingLeft:10}}
                                    placeholder="Description"
                                    placeholderTextColor={'#0004'}
                                    onChangeText={(description) => {this.setState({description})}}/>
                                </View>
                                <View style={{width:'100%',alignItems:'center'}}>
                                    {this.state.loading === true ? (
                                    <CircleFade size={30} color={Colors.blackColor} style={{marginTop:15}}/>
                                    ):
                                    <View 
                                    style={{
                                        flexDirection: 'row',
                                        paddingLeft:10,
                                        paddingRight:10
                                    }}>
                                    <TouchableOpacity 
                                        onPress={() => {this.setState({modalVisible:false})}}
                                        style={{
                                            height:45,
                                            width:'45%',
                                            backgroundColor:Colors.grayColor,
                                            borderRadius:10,
                                            justifyContent:'center',
                                            marginTop:30,
                                            marginRight:10,
                                            alignItems:'center',
                                            justifyContent:'center'
                                        }}>
                                        <Text style={{color:'#fff'}}>Close</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => {this.saveTask()}}
                                        style={{
                                            width:'45%',
                                            backgroundColor:Colors.primaryColor,
                                            borderRadius:10,
                                            justifyContent:'center',
                                            marginTop:30,
                                            alignItems:'center',
                                            justifyContent:'center'
                                        }}>
                                        <Text style={{color:'#fff'}}>Save</Text>
                                    </TouchableOpacity> 
                                    </View>}
                                </View>
                            </View>
                        </View>
                </Modal>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.dropdownModal}>
                <View style={{
                    flex:1,
                    alignItems:'center',
                    justifyContent:'center',
                    backgroundColor:'#0006'
                }}>
                    <View style={{
                        // height:200,
                        width:'80%',
                        backgroundColor:'#fff',
                        borderRadius:10
                    }}>
                        <ScrollView>
                        {this.state.dropdownData?.map((item,i) => {
                            return(
                                <TouchableOpacity
                                onPress={() => {
                                        this.setState({selectedName:item,dropdownModal:false})
                                }}
                                 key={i} style={{
                                    height:50,
                                    width:'100%',
                                    borderBottomWidth:this.state.dropdownData.length === i+1 ? 0:1,
                                    justifyContent:'center',
                                    borderColor:'#0003'
                                }}>
                                    <Text style={{marginLeft:15}}>{item}</Text>
                                </TouchableOpacity>
                            )
                        })}
                        </ScrollView>
                    </View>
                </View>
                </Modal>
            </View>
        )
    }

    propertyContent() {
        return(
            <View flex={1}>
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
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center", padding:10}}
                        >
                            {/* <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => this.openShareDialog()}

                            >
                                <MaterialIcons name="share" size={24} color={Colors.whiteColor}
                                    style={{ marginLeft: Sizes.fixPadding }}
                                />
                            </TouchableOpacity> */}
                        </View>
                    }
                    borderBottomRadius={20}
                    toolbarColor={Colors.primaryColor}
                    toolBarMinHeight={40}
                    toolbarMaxHeight={358}
                    src={
                            this.state.images?.length > 0 ? this.state.images:[]
                        }>
                    <View style={{ paddingBottom: Sizes.fixPadding * 8.0 }}>
                    {this.users()}
                    </View>
                </CollapsingToolbar>
            </View>
        )
    }

    users() {
        return (
            <ScrollView>
                <View style={{height:10}}/>
                <View style={{backgroundColor:'#fff'}}>
                <View
                    style={styles.useInfoContentStyle}>
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            backgroundColor:'#fff'
                        }}>
                                <View style={{
                                    height:35,
                                    width:'60%',
                                    borderRadius:3,
                                }}>
                                    <View style={{
                                        height:30,
                                        width:'60%',
                                        backgroundColor:Colors.primaryColor,
                                        borderRadius:3,
                                        justifyContent:'center',
                                        alignItems:'center',
                                        marginTop:7
                                    }}>
                                        <Text style={{color:'#fff',fontSize:14,fontWeight:'bold'}}> Listing Ref-No </Text>
                                    </View>
                                    {this.state.leadListDetails?.listing_name &&
                                        <View style={{
                                            height:30,
                                            width:'60%',
                                            borderRadius:3,
                                            justifyContent:'center',
                                            alignItems:'center',
                                            borderWidth:.5,
                                            marginTop:3
                                        }}>
                                        <Text style={{color:'#000',fontSize:14,fontWeight:'bold'}}>{this.state.leadListDetails?.listing_name}</Text>
                                        </View>
                                    }
                                </View>
                                <View style={{
                                    height:30,
                                    width:'40%',
                                    backgroundColor:Colors.primaryColor,
                                    borderRadius:3,
                                    justifyContent:'center',
                                    alignItems:'center',
                                    marginTop:10
                                }}>
                                <Text style={{color:'#fff',fontSize:14,fontWeight:'bold'}}>{this.props?.navigation?.getParam('item')?.ref_no}</Text>
                                </View>
                        </View>
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            marginBottom:5
                        }}>
                                <View style={{
                                    height:35,
                                    width:'60%',
                                    borderRadius:3,
                                    alignItems:'center',
                                    flexDirection:'row'
                                }}>
                                </View>
                                {this.state.leadListDetails?.price ? (
                                <View style={{
                                    height:30,
                                    width:'40%',
                                    borderRadius:3,
                                    justifyContent:'center',
                                    alignItems:'center',
                                    borderWidth:.5,
                                }}>
                                <Text style={{color:'#000',fontSize:14,fontWeight:'bold'}}>{this.state.leadListDetails?.price} AED</Text>
                                </View>
                                ):null}
                        </View>
                        </View>
                        </View>
                    {this.state.leadListDetails?.listing_name ? (
                        <Text style={{color:'#000',fontSize:20,marginLeft:22,marginTop:5,fontWeight:'bold'}}>Contact Info</Text>
                    ):null}
                    <View style={{backgroundColor:'#fff',marginTop:5}}>
                    <View
                    style={styles.useInfoContentStyle}>
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            backgroundColor:'#fff',
                        }}>
                                <View style={{
                                    height:35,
                                    width:'66%',
                                    borderRadius:3,
                                    alignItems:'center',
                                    flexDirection:'row'
                                }}>
                                    <MaterialIcons name={'person'} size={20} color={Colors.primaryColor} />
                                    <Text numberOfLines={1} style={{color:Colors.primaryColor,marginLeft:4,fontSize:18}}>{this.state.leadListDetails?.lead_name}</Text>
                                </View>
                        </View>
                        <View style={{
                            marginBottom:-10
                        }}>
                            {this.props?.navigation?.getParam('item')?.phone_mobile ? (
                                <TouchableOpacity 
                                    style={{
                                        height:25,
                                        borderRadius:3,
                                        alignItems:'center',
                                        flexDirection:'row',
                                        marginTop:7
                                    }}
                                    onPress={() => this.copyToClipboard(this.props?.navigation?.getParam('item')?.phone_mobile)}
                                >
                                    <MaterialIcons name={'call'} size={18} color={Colors.primaryColor} style={{marginTop:-20}} />
                                    <Text style={{color:'#0006',marginTop:-20,fontSize:13,fontWeight:'bold',marginLeft:8}}>{this.props?.navigation?.getParam('item')?.phone_mobile}</Text>
                                </TouchableOpacity>
                            ):null}
                            {this.state.leadListDetails?.email ? (
                                <TouchableOpacity 
                                    style={{
                                        height:25,
                                        borderRadius:3,
                                        alignItems:'center',
                                        flexDirection:'row',
                                    }}
                                    onPress={() => this.copyToClipboard(this.state.leadListDetails?.email)}
                                >
                                    <MaterialIcons name={'email'} size={18} color={Colors.primaryColor} style={{marginTop:-20}} />
                                    <Text style={{color:'#0006',marginTop:-20,fontSize:13,fontWeight:'bold',marginLeft:8}}>{this.state.leadListDetails?.email}</Text>
                                </TouchableOpacity>
                            ):null}
                            {this.state.leadListDetails?.price ? (
                                <View style={{
                                    // height:30,
                                    width:'30%',
                                    // backgroundColor:Colors.primaryColor,
                                    borderRadius:3,
                                    justifyContent:'center',
                                    alignItems:'center',
                                    // borderWidth:.5,
                                }}>
                                {/* <Text style={{color:'#000',fontSize:14,fontWeight:'bold'}}>${this.state.leadListDetails?.price}</Text> */}
                                </View>
                            ):null}
                        </View>
                        </View>
                        </View>
                        <View style={{backgroundColor:'#fff'}}>
                        {this.state.leadListDetails?.description ? (
                        <Text style={{color:'#000',fontSize:15,marginLeft:15}}>Description:</Text>
                        ):null}
                        </View>
                        <View style={{backgroundColor:'#fff'}}>
                        {this.state.leadListDetails?.description ? (
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            marginTop:5,
                            marginBottom:5
                        }}>
                            <View style={{
                                // height:60,
                                width:'90%',
                                backgroundColor:Colors.lightColor,
                                borderRadius:3,
                                marginLeft:15
                            }}>
                            <Text style={{color:'#000',fontSize:13,marginTop:10,marginLeft:10}}>{this.state.leadListDetails?.description}</Text>
                            </View>
                        </View>
                        ):null}
                        </View>
                        {this.props?.navigation?.getParam('item')?.status ? (
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            marginTop:5,
                            marginBottom:5,
                            backgroundColor:'#fff'
                        }}>
                                <View style={{
                                    height:40,
                                    width:'44%',
                                    borderRadius:3,
                                    justifyContent:'center',
                                }}>
                                <Text style={{color:'#000',fontSize:15,marginLeft:15,fontWeight:"bold"}}>Status:</Text>
                                </View>
                                <View style={{
                                    // height:40,
                                    width:'56%',
                                    // backgroundColor:Colors.lightColor,
                                    borderRadius:3,
                                    justifyContent:'center',
                                    alignItems:'center'
                                }}>
                                <Text style={{color:'#000',fontSize:14,marginLeft:10}}>{this.props?.navigation?.getParam('item')?.status}</Text>
                                </View>
                        </View>
                        ):null}
                        {this.state.leadListDetails?.community_name ? (
                            <View style={{
                                flexDirection:'row',
                                alignItems:'center',
                                // marginTop:5,
                                marginBottom:5,
                                backgroundColor:'#fff'
                            }}>
                                    <View style={{
                                        height:40,
                                        width:'44%',
                                        borderRadius:3,
                                        justifyContent:'center',
                                    }}>
                                    <Text style={{color:'#000',fontSize:15,marginLeft:15,fontWeight:"bold"}}>Community:</Text>
                                    </View>
                                    <View style={{
                                        // height:40,
                                        width:'56%',
                                        // backgroundColor:Colors.lightColor,
                                        borderRadius:3,
                                        justifyContent:'center',
                                        alignItems:'center'
                                    }}>
                                    <Text numberOfLines={1} style={{paddingLeft:10,color:'#000',fontSize:14}}>{this.state.leadListDetails?.community_name}</Text>
                                    </View>
                            </View>
                        ):null}
                        {this.state.leadListDetails?.building_name ? (
                            <View style={{
                                flexDirection:'row',
                                alignItems:'center',
                                // marginTop:5,
                                marginBottom:5,
                                backgroundColor:'#fff'
                            }}>
                                    <View style={{
                                        height:40,
                                        width:'44%',
                                        borderRadius:3,
                                        justifyContent:'center',
                                    }}>
                                    <Text style={{color:'#000',fontSize:15,marginLeft:15,fontWeight:"bold"}}>Building:</Text>
                                    </View>
                                    <View style={{
                                        // height:40,
                                        width:'56%',
                                        // backgroundColor:Colors.lightColor,
                                        borderRadius:3,
                                        justifyContent:'center',
                                        alignItems:'center'
                                    }}>
                                    <Text style={{paddingLeft:10,color:'#000',fontSize:14}}>{this.state.leadListDetails?.building_name}</Text>
                                    </View>
                            </View>
                        ):null}
                        {this.state.leadListDetails?.status_description ? (
                        <View style={{backgroundColor:'#fff'}}>
                        <Text style={{color:'#000',fontSize:15,marginLeft:15,fontWeight:"bold"}}>Status Description:</Text>
                        </View>
                        ):null}
                        <View style={{backgroundColor:'#fff'}}>
                        {this.state.leadListDetails?.status_description ? (
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            marginTop:5,
                            marginBottom:5
                        }}>
                            <View style={{
                                // height:60,
                                width:'96%',
                                // backgroundColor:Colors.lightColor,
                                borderRadius:3,
                                justifyContent:'center',
                            }}>
                            <Text style={{color:'#000',fontSize:15,paddingLeft:10}}>{this.state.leadListDetails?.status_description}</Text>
                            </View>
                        </View>
                        ):null}
                        </View>
                        {this.state.leadListDetails?.lead_source ? (
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            // marginTop:5,
                            marginBottom:5,
                            backgroundColor:'#fff'
                        }}>
                                <View style={{
                                    height:40,
                                    width:'44%',
                                    borderRadius:3,
                                    justifyContent:'center',
                                }}>
                                <Text style={{color:'#000',fontSize:15,marginLeft:15,fontWeight:"bold"}}>Lead Source:</Text>
                                </View>
                                <View style={{
                                    // height:40,
                                    width:'56%',
                                    // backgroundColor:Colors.lightColor,
                                    borderRadius:3,
                                    justifyContent:'center',
                                    alignItems:'center'
                                }}>
                                <Text style={{paddingLeft:10,color:'#000',fontSize:14}}>{this.state.leadListDetails?.lead_source}</Text>
                                </View>
                        </View>
                        ):null}
                        {this.state.leadListDetails?.lead_type ? (
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            // marginTop:5,
                            marginBottom:5,
                            backgroundColor:'#fff'
                        }}>
                                <View style={{
                                    height:40,
                                    width:'44%',
                                    borderRadius:3,
                                    justifyContent:'center',
                                }}>
                                <Text style={{color:'#000',fontSize:15,marginLeft:15,fontWeight:"bold"}}>Lead Type:</Text>
                                </View>
                                <View style={{
                                    // height:40,
                                    width:'56%',
                                    // backgroundColor:Colors.lightColor,
                                    borderRadius:3,
                                    justifyContent:'center',
                                    alignItems:'center'
                                }}>
                                <Text numberOfLines={1} style={{color:'#000',fontSize:14}}>{this.state.leadListDetails?.lead_type}</Text>
                                </View>
                        </View>
                        ):null}
                        <View style={{backgroundColor:'#fff'}}>
                        {this.state.leadListDetails?.lead_source_description ? (
                        <Text style={{color:'#000',fontSize:15,marginLeft:15,marginTop:5,fontWeight:"bold"}}>Lead Source Description:</Text>
                        ):null}
                        </View>
                        {this.state.leadListDetails?.lead_source_description ? (
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            // marginTop:5,
                            marginBottom:5,
                            backgroundColor:'#fff'
                        }}>
                            <View style={{
                                // height:60,
                                width:'96%',
                                // backgroundColor:Colors.lightColor,
                                borderRadius:3,
                                justifyContent:'center',
                            }}>
                            <Text style={{color:'#000',fontSize:13,marginLeft:15,marginTop:5}}>{this.state.leadListDetails?.lead_source_description}</Text>
                            </View>
                        </View>
                        ):null}
                        {this.state.leadListDetails?.emirate_id_c ? (
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            // marginTop:5,
                            marginBottom:5,
                            backgroundColor:'#fff'
                        }}>
                                <View style={{
                                    height:40,
                                    width:'44%',
                                    borderRadius:3,
                                    justifyContent:'center',
                                }}>
                                <Text style={{color:'#000',fontSize:15,marginLeft:15,fontWeight:"bold"}}>Emirate ID:</Text>
                                </View>
                                <View style={{
                                    // height:40,
                                    width:'56%',
                                    // backgroundColor:Colors.lightColor,
                                    borderRadius:3,
                                    justifyContent:'center',
                                    alignItems:'center'
                                }}>
                                <Text style={{color:'#000',fontSize:13}}>{this.state.leadListDetails?.emirate_id_c}</Text>
                                </View>
                        </View>
                        ):null}
                        {this.state.leadListDetails?.campaign_name ? (
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            // marginTop:5,
                            marginBottom:5,
                            backgroundColor:'#fff'
                        }}>
                                <View style={{
                                    height:40,
                                    width:'33%',
                                    borderRadius:3,
                                    justifyContent:'center',
                                }}>
                                <Text style={{color:'#000',fontSize:15,marginLeft:15,fontWeight:"bold"}}>Campaign:</Text>
                                </View>
                                <View style={{
                                    // height:40,
                                    width:'66%',
                                    // backgroundColor:Colors.lightColor,
                                    borderRadius:3,
                                    justifyContent:'center',
                                    alignItems:'center'
                                }}>
                                <Text style={{color:'#000',fontSize:13}}>{this.state.leadListDetails?.campaign_name}</Text>
                                </View>
                        </View>
                        ):null}
                        {this.state.leadListDetails?.license_authority_c ? (
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            marginTop:5,
                            // marginBottom:5,
                            backgroundColor:'#fff'
                        }}>
                                <View style={{
                                    height:40,
                                    width:'44%',
                                    borderRadius:3,
                                    justifyContent:'center',
                                }}>
                                <Text style={{color:'#000',fontSize:15,marginLeft:15,fontWeight:"bold"}}>License No:</Text>
                                </View>
                                <View style={{
                                    // height:40,
                                    width:'56%',
                                    // backgroundColor:Colors.lightColor,
                                    borderRadius:3,
                                    justifyContent:'center',
                                    alignItems:'center'
                                }}>
                                <Text style={{color:'#000',fontSize:13}}>{this.state.leadListDetails?.license_authority_c}</Text>
                                </View>
                        </View>
                        ):null}
                        {this.state.leadListDetails?.license_authority_c ? (
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            marginTop:5,
                            // marginBottom:5,
                            backgroundColor:'#fff'
                        }}>
                                <View style={{
                                    height:40,
                                    width:'44%',
                                    borderRadius:3,
                                    justifyContent:'center',
                                }}>
                                <Text style={{color:'#000',fontSize:15,marginLeft:15,fontWeight:"bold"}}>License Authority:</Text>
                                </View>
                                <View style={{
                                    // height:40,
                                    width:'56%',
                                    // backgroundColor:Colors.lightColor,
                                    borderRadius:3,
                                    justifyContent:'center',
                                    alignItems:'center'
                                }}>
                                <Text style={{color:'#000',fontSize:13}}>{this.state.leadListDetails?.license_authority_c}</Text>
                                </View>
                        </View>
                        ):null}
                        {this.props?.navigation?.getParam('item')?.date_entered ? (
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            backgroundColor:'#fff'
                        }}>
                                <View style={{
                                    height:40,
                                    width:'44%',
                                    borderRadius:3,
                                    justifyContent:'center',
                                }}>
                                <Text style={{color:'#000',fontSize:15,marginLeft:15,fontWeight:"bold"}}>Date Created:</Text>
                                </View>
                                <View style={{
                                    // height:40,
                                    width:'56%',
                                    // backgroundColor:Colors.lightColor,
                                    borderRadius:3,
                                    justifyContent:'center',
                                    alignItems:'center'
                                }}>
                                <Text style={{color:'#000',fontSize:13}}>{this.props?.navigation?.getParam('item')?.date_entered}</Text>
                                </View>
                        </View>
                        ):null}
                        {this.state.leadListDetails?.bedroom ? (
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            marginTop:5,
                            // marginBottom:5,
                            backgroundColor:'#fff'
                        }}>
                                <View style={{
                                    height:40,
                                    width:'44%',
                                    borderRadius:3,
                                    justifyContent:'center',
                                }}>
                                <Text style={{color:'#000',fontSize:15,marginLeft:15,fontWeight:"bold"}}>Bedroom:</Text>
                                </View>
                                <View style={{
                                    // height:40,
                                    width:'56%',
                                    // backgroundColor:Colors.lightColor,
                                    borderRadius:3,
                                    justifyContent:'center',
                                    alignItems:'center'
                                }}>
                                <Text style={{color:'#000',fontSize:13}}>{this.state.leadListDetails?.bedroom}</Text>
                                </View>
                        </View>
                        ):null}
                        {this.state.leadListDetails?.builtup_area ? (
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            marginTop:5,
                            // marginBottom:5,
                            backgroundColor:'#fff'
                        }}>
                                <View style={{
                                    height:40,
                                    width:'44%',
                                    borderRadius:3,
                                    justifyContent:'center',
                                }}>
                                <Text style={{color:'#000',fontSize:15,marginLeft:15,fontWeight:"bold"}}>Built Area:</Text>
                                </View>
                                <View style={{
                                    // height:40,
                                    width:'56%',
                                    // backgroundColor:Colors.lightColor,
                                    borderRadius:3,
                                    justifyContent:'center',
                                    alignItems:'center'
                                }}>
                                <Text style={{color:'#000',fontSize:13,}}>{this.state.leadListDetails?.builtup_area}</Text>
                                </View>
                        </View>
                        ):null}
                        {this.state.leadListDetails?.adset ? (
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            marginTop:5,
                            // marginBottom:5,
                            backgroundColor:'#fff'
                        }}>
                                <View style={{
                                    height:40,
                                    width:'44%',
                                    borderRadius:3,
                                    justifyContent:'center',
                                }}>
                                <Text style={{color:'#000',fontSize:15,marginLeft:15,fontWeight:"bold"}}>Property Type:</Text>
                                </View>
                                <View style={{
                                    // height:40,
                                    width:'56%',
                                    // backgroundColor:Colors.lightColor,
                                    borderRadius:3,
                                    justifyContent:'center',
                                    alignItems:'center'
                                }}>
                                <Text style={{color:'#000',fontSize:13}}>{this.state.leadListDetails?.adset}</Text>
                                </View>
                        </View>
                        ):null}
                        {this.state.leadListDetails?.lead_purpose ? (
                        <View style={{
                            flexDirection:'row',
                            alignItems:'center',
                            marginTop:5,
                            // marginBottom:5,
                            backgroundColor:'#fff'
                        }}>
                                <View style={{
                                    height:40,
                                    width:'44%',
                                    borderRadius:3,
                                    justifyContent:'center',
                                }}>
                                <Text style={{color:'#000',fontSize:15,marginLeft:15,fontWeight:"bold"}}>Property Purpose:</Text>
                                </View>
                                <View style={{
                                    // height:40,
                                    width:'56%',
                                    borderRadius:3,
                                    justifyContent:'center',
                                    alignItems:'center'
                                }}>
                                <Text style={{color:'#000',fontSize:13}}>{this.state.leadListDetails?.lead_purpose}</Text>
                                </View>
                        </View>
                        ):null}
                        <View
                            style={{
                                flexDirection:'row',
                                marginTop:10,
                                paddingLeft:15
                        }}
                        >
                            <Text style={{color:'#000',fontSize:20,width:'85%',fontWeight:'bold'}}>Notes</Text>
                            <TouchableOpacity
                                    onPress={() => {this.setState({modalVisible:true})}}                                
                                    style={{
                                        height:30,
                                        width:30,
                                        backgroundColor:Colors.primaryColor,
                                        borderRadius:40/2,
                                        justifyContent:'center',
                                        alignItems:'center'
                                    }}>
                                   <MaterialCommunityIcons name={'plus-circle-outline'} size={20} color={'#fff'} /> 
                                </TouchableOpacity>
                        </View>
                        {this.state.leadListDetails?.task_data.map((value) => 
                            <View style={{
                                marginTop:5,
                                paddingLeft:12,
                                backgroundColor:'#fff',
                                paddingTop:20,
                                paddingBottom:20,
                            }}>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={{color:'#000',marginRight:10,fontSize:16,fontWeight:'bold'}}>{value.name}</Text> 
                                    <Text style={{color:'#000',fontSize:12,fontWeight:'bold'}} bold>(by {value.added_by})</Text> 
                                    <Text style={{color:'#000',position: 'absolute', right: 25}}>{value.date_entered}</Text>
                                </View>
                                <View>
                                    <Text style={{color:'#000',fontSize:16,marginTop:15,fontWeight:'bold'}} bold>Description:</Text>
                                    <Text style={{color:'#000'}}>{value.description}</Text>
                                </View>
                            </View>
                        )}
            </ScrollView>
        )
    }

    header() {
        return (
            <View style={styles.headerStyle}>
            <View style={styles.headerContentStyle}>
                 <MaterialIcons name="arrow-back" size={24}
                     color={Colors.primaryColor}
                     onPress={() => this.props.navigation.goBack()}
                     style={{ position: 'absolute', marginLeft:10 }}
                 />
                <Text style={{ ...Fonts.primaryColor18Bold,marginLeft:18,marginTop:5 }}>Leads Property Details</Text>
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: Colors.lightColor,
        justifyContent: 'center',
    },
    headerContentStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        height: 60.0,
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        elevation: 10.0,
    },
    useInfoContentStyle: {
        width: width - 40.0,
        alignSelf: 'center',
        // alignItems: 'center',
        borderRadius:4,
    },
    isReadableUserHintStyle: {
        width: 8.0,
        height: 8.0,
        borderRadius: 4.0,
        backgroundColor: Colors.primaryColor,
        marginLeft: Sizes.fixPadding - 7.0,
    },
    userImageStyle: {
        height: 80.0,
        width: 80.0,
        borderRadius: 40.0,
        borderColor: Colors.primaryColor,
        borderWidth: 0.3,
    },
    dividerStyle: {
        backgroundColor: 'rgba(128, 128, 128, 0.8)',
        height: 0.8,
        marginVertical: Sizes.fixPadding + 7.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
    }
})

LeadDetails.navigationOptions = () => {
    return {
        header: () => null,
        ...TransitionPresets.SlideFromRightIOS,
    }
}

export default withNavigation(LeadDetails);