import React from "react";
import { Block, Text, theme} from "galio-framework";
import { CircleFade } from 'react-native-animated-spinkit';
import { StyleSheet, FlatList, View, RefreshControl, TouchableOpacity, Alert, ToastAndroid} from "react-native";

export default class Notifications extends React.Component {
  state = {
    refreshing    : false,
    loading       : true,
    notifications : null,
  };

  componentDidMount(){
    this.GetUserNotification();
  }

  componentDidUpdate(){
    // this.GetUserNotification();
  }

  GetUserNotification = async() => {
    let res = await fetch(global.RelativePath+'/fetch-mobile-notifications.php',{
      headers : {
        'user_id'          : global.Current_User.id,
      }
    });
    let resp = await res.json();
    this.setState({loading:false,refreshingfalse:false})
    if(resp.data.status === 200 && resp.code === 'Success'){
      this.setState({notifications:resp.data.content,loading:false});
    }
  }


  is_read = async(id) => {
    if(id){
      let res = await fetch(global.RelativePath+'/update-mobile-notifications.php',{
        headers : {
          'notification_id' : id,
        }
      });
      let resp = await res.json();
      if(resp.data.status === 200 && resp.code === 'Success'){
        if(Platform.OS === 'android'){
            ToastAndroid.show(resp.data.content, ToastAndroid.LONG);
        }
        else{
            Alert.alert(
                'Success!',
                resp.data.content
            );
        }
      }
    }
  }

  renderItem = ({ item }) => (
    <Block space="between" style={styles.rows}>
      <Block card flex backgroundColor={item.status == '1' ? theme.COLORS.WHITE:theme.COLORS.GREY} style={[styles.product, styles.shadow, {minHeight:0,marginVertical: -4,padding:10}]}>
        <TouchableOpacity onPress={() => {this.is_read(item.notification_id)}}>
          <Block flex space="between" style={styles.productDescription}>
            <Text size={16} style={styles.productTitle} bold>{item.title}</Text>
            <Text size={14}>{item.description.trim()}</Text>
            <Text size={12} bold style={{paddingTop:15}} muted>{item.date_entered}</Text>
          </Block>
        </TouchableOpacity>
      </Block>
    </Block> 
  );

  render() {
    return (
      <Block flex style={styles.notification}>
        {this.state.loading && 
          <View style={{justifyContent: 'center',alignItems: 'center',}}>
            <CircleFade size={50} color={"black"} style={{margin:15}}/>
          </View>
        }
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.GetUserNotification}
            />
          }
          data={this.state.notifications}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderItem}
        />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  product: {
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
  },
  productTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 6,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  notification: {
    paddingVertical: theme.SIZES.BASE / 3,
  },
  title: {
    paddingTop: theme.SIZES.BASE / 2,
    paddingBottom: theme.SIZES.BASE * 1.5,
  },
  rows: {
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE * 1.25,
  }
});
