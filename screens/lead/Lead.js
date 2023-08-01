import React, { Component } from "react";
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, Linking, Platform, ToastAndroid, Alert, TextInput} from "react-native";
import { withNavigation } from "react-navigation";
import { Fonts, Colors, Sizes } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { CircleFade } from 'react-native-animated-spinkit';

const leadList = [];

const { width } = Dimensions.get('screen');

class Lead extends Component {
    state = {
        leadList:[],
        pagination:10,
        Loading:false,
        searchShow:false,
        searchText:'',
        searchData:[],
        searchLoading:false
    }

    FetchSearchLeads = async (searchText) => {
        this.setState({searchLoading:true})
        let res = await fetch(global.RelativePath+'/leads-search.php',{
        headers : {
            'user_id'  : global.Current_User.id,
            'ref_no'  : searchText,
        }
        });
        let resp = await res.json();
        this.setState({ leadList:resp?.data?.content,searchLoading:false})
    }

    render() {
        return (
            <View style={{ flex: 1,backgroundColor:Colors.lightColor }}>
                {this.header()}
                {this.state.searchShow === true ? (
                <View style={{
                    height:45,
                    width:'94%',
                    alignSelf:'center',
                    // backgroundColor:'#ada',
                    borderRadius:5,
                    marginTop:10,
                    borderWidth:1,
                    borderColor:Colors.primaryColor,
                    // justifyContent:'center',
                    flexDirection:'row',
                    alignItems:'center'
                }}>
                    <MaterialIcons name="search" size={24} style={{marginLeft:10}} color={Colors.primaryColor}/>
                    <TextInput
                    style={{paddingLeft:10,width:'75%'}}
                    placeholder="Search Ref #"
                    autoFocus={true}
                    onChangeText={(searchText) => {
                        this.setState({searchText:searchText})
                        this.FetchSearchLeads(searchText)
                        }}/>
                    <TouchableOpacity
                    style={{
                        height:40,
                        width:'15%',
                        // backgroundColor:'#ada',
                        // alignItems:'center',
                        justifyContent:'center'
                    }}
                    onPress={() => {
                        this.setState({searchText:'',searchShow:false})
                        this.FetchListing()
                        }}>
                    <Entypo name="cross" size={24} style={{marginLeft:10}} color={Colors.primaryColor}/>
                    </TouchableOpacity>
                </View>
                ):null}
                {this.users()}
            </View>
        )
    }

    componentDidMount(){
        this.FetchListing()
    }

    FetchListing = async() => {
        this.setState({searchLoading:true})
        if(typeof global.Current_User != 'undefined'){
            let res = await fetch(global.RelativePath+'/leads.php',{
            headers : {
                'user_id'  : global.Current_User.id,
                'pagination'  : this.state.pagination+this.state.leadList?.length,
            }
            });
            let resp = await res.json();
            console.log(resp?.data?.content[0])
            resp?.data?.content?.map((item) => {
                this.state.leadList.push(item)
            })    
            this.setState({Loading:false,searchLoading:false})
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

    users() {
        const renderItem = ({ item,index }) => (
            <View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    key={index}
                    onPress={() => this.props.navigation.navigate('LeadDetails', { item: item })}
                    style={styles.useInfoContentStyle}>
                        <View style={{
                            flexDirection:'row',
                            marginTop:10,
                            marginBottom:5
                        }}>
                            <Image
                                source={{uri:item.image}}
                                style={styles.propertyPhotosStyle}
                            />
                            <View style={{flex:1}}>
                                <View style={{flexDirection:'row'}}>
                                    <View style={{width:'60%'}}>
                                        <Text numberOfLines={1} style={{color:Colors.primaryColor,fontSize:15,fontWeight:'bold'}}>{item.lead_name ? item.lead_name : ' '}</Text>
                                        <Text numberOfLines={1} style={{color:"#000",fontSize:13,marginTop:15}}>{item.lead_source}</Text>
                                    </View>
                                    <View>
                                        <View style={{
                                            height:25,
                                            paddingLeft:7,
                                            paddingRight:7,
                                            backgroundColor:Colors.primaryColor,
                                            borderRadius:3,
                                            justifyContent:'center',
                                            alignItems:'center'
                                        }}>
                                            <Text numberOfLines={1} style={{color:'#fff',fontSize:12,fontWeight:'bold'}}>{item.ref_no}</Text>
                                        </View>
                                        <View style={{
                                            height:25,
                                            marginTop:4,
                                            paddingLeft:7,
                                            paddingRight:7,
                                            borderRadius:3,
                                            borderWidth:.5,
                                            justifyContent:'center',
                                            alignItems:'center'
                                        }}>
                                            <Text numberOfLines={1} style={{color:'#000',fontSize:10,fontWeight:'bold'}}>{item.status}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{
                                    height:50,
                                    width:'96%',
                                    // backgroundColor:'#ada',
                                    flexDirection:'row',
                                    alignItems:'center',
                                    justifyContent:'space-between',
                                    marginTop:10
                                }}>
                                <TouchableOpacity style={{
                                    height:35,
                                    width:'48%',
                                    backgroundColor:Colors.primaryColor,
                                    borderRadius:3,
                                    flexDirection:'row',
                                    alignItems:'center',
                                    justifyContent:'center'
                                }}
                                onPress={() => this.CallToPhone(item.phone_mobile)}
                                >
                                    <MaterialIcons name="phone" size={15} color={'#fff'}/>
                                    <Text numberOfLines={1} style={{color:'#fff',fontSize:12,marginLeft:10,fontWeight:'bold'}}>
                                        Call
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                style={{
                                    height:35,
                                    width:'48%',
                                    backgroundColor:Colors.primaryColor,
                                    borderRadius:3,
                                    flexDirection:'row',
                                    alignItems:'center',
                                    justifyContent:'center'
                                }}
                                onPress={() => {
                                    // Linking.openURL(`https://api.whatsapp.com/send?phone=${item.phone_mobile}`)
                                    // Linking.openURL(`https://wa.me/${item.phone_mobile}`)
                                    Linking.openURL(`https://wa.me/${item.phone_mobile}`)                                    
                                    }}>
                                    <MaterialCommunityIcons name="whatsapp" size={15} color={'#fff'}/>
                                    <Text numberOfLines={1} style={{color:'#fff',fontSize:12,marginLeft:3,fontWeight:'bold'}}>
                                    WhatsApp
                                    </Text>
                                </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                </TouchableOpacity>
            </View>
        )
        return (
            <>
            {this.state.leadList.length > 0 ? (
            <FlatList
                ListEmptyComponent={
                    <>
                        <View style={{justifyContent: 'center',alignItems: 'center',}}>
                            <CircleFade size={50} color={Colors.blackColor} style={{marginTop:15}}/>
                        </View>
                    </>
                }
                data={this.state.leadList}
                // keyExtractor={(item) => `${item.id}`}
                keyExtractor={(item, index) => `_key${index.toString()}`}
                listKey={(item, index) => `_key${index.toString()}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={this.renderFooter()}
                contentContainerStyle={{
                paddingBottom: Sizes.fixPadding * 8.0
                }}
            />):
            <View style={{justifyContent: 'center',alignItems: 'center',}}>
            {this.state.searchLoading === true ? (
            <CircleFade size={50} color={Colors.blackColor} style={{marginTop:15}}/>
            ):<Text style={{color:'#000',marginTop:15}}>Reference Number not exist</Text>}
            </View>}
            </>
        )
    }

    header() {
        return (
            <View style={styles.headerStyle}>
                <View style={styles.headerContentStyle}>
                    <Text style={{ ...Fonts.primaryColor18Bold }}>Leads</Text>
                    <View style={{ flexDirection: 'row',alignItems:'center',justifyContent:'flex-end' }}>
                    <TouchableOpacity
                        onPress={() => {this.setState({searchShow:true})}}
                        style={{
                            // backgroundColor:'#ada',
                            height:40,
                            width:'30%',
                            alignItems:'center',
                            justifyContent:'center',
                            // marginRight:-16
                        }}>
                        <MaterialIcons name="search" size={24} color={Colors.primaryColor}
                            // onPress={() => {this.setState({searchShow:true})}}
                        />
                        </TouchableOpacity>
                        <TouchableOpacity                             
                        onPress={() => {this.props.navigation.navigate('Notifications')}}>
                        <MaterialIcons name="notifications" size={24} color={Colors.primaryColor}
                            style={{ marginLeft: Sizes.fixPadding + 5.0 }}
                        />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    renderFooter = () => {
        return (
          //Footer View with Load More button
          <>
          {this.state.searchText === '' ? (
          <View
            style={{
              // padding: 10,
              height:50,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop:20
            //   backgroundColor:'#ada'
            }}>
            {this.state.Loading === false ? (
              <TouchableOpacity
              onPress={() => {
                // let pagination = this.state.pagination+10;
                // console.log(pagination)
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
          ):null}
          </>
        );
      };

}

const styles = StyleSheet.create({
    headerStyle: {
        padding: 20,
        backgroundColor: '#fff',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        justifyContent: 'center',
        // backgroundColor:'#ada'
    },
    headerContentStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    useInfoContentStyle: {
        width: '95%',
        marginLeft:10,
        backgroundColor:'#fff',
        borderRadius:4,
        marginTop:10
    },
    propertyPhotosStyle: {
        width: 120,
        height: 120,
        borderRadius: Sizes.fixPadding,
        marginRight: Sizes.fixPadding + .03,
        marginLeft:10,
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

export default withNavigation(Lead);