import React, { Component } from "react";
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";
import { Fonts, Colors, Sizes } from "../../constant/styles";

const userList = [
    {
        id: '1',
        image: require('../../assets/images/user/user_1.jpg'),
        name: 'Russel Tailor',
        about: 'Hello, How can i help you?',
        seen: '1d ago',
        isReadable: true,
    },
    {
        id: '2',
        image: require('../../assets/images/user/user_2.jpg'),
        name: 'David Miller',
        about: 'Okay',
        seen: '1d ago',
        isReadable: false,
    },
    {
        id: '3',
        image: require('../../assets/images/user/user_3.jpg'),
        name: 'Lliana George',
        about: 'You can come tomorrow.',
        seen: '5d ago',
        isReadable: false,
    },
    {
        id: '4',
        image: require('../../assets/images/user/user_4.jpg'),
        name: 'Suzein Smith',
        about: 'Nice to talk with you.',
        seen: '1w ago',
        isReadable: false,
    },
    {
        id: '5',
        image: require('../../assets/images/user/user_5.jpg'),
        name: 'Amenda Johnson',
        about: 'So what you think?',
        seen: '2w ago',
        isReadable: true,
    },
    {
        id: '6',
        image: require('../../assets/images/user/user_6.jpg'),
        name: 'John Smith',
        about: 'Hello, How can i help you?',
        seen: '2w ago',
        isReadable: false,
    },
    {
        id: '7',
        image: require('../../assets/images/user/user_7.jpg'),
        name: 'Royla Seft',
        about: 'How are you?',
        seen: '3w ago',
        isReadable: false,
    },
    {
        id: '8',
        image: require('../../assets/images/user/user_8.jpg'),
        name: 'Kafe Smith',
        about: 'Hey I\'m here',
        seen: '3w ago',
        isReadable: false,
    },
];

const { width } = Dimensions.get('screen');

class ChatScreen extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.header()}
                {this.users()}
            </View>
        )
    }

    users() {
        const renderItem = ({ item }) => (
            <View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => this.props.navigation.navigate('Message', { name: item.name })}
                    style={styles.useInfoContentStyle}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={item.image}
                            style={styles.userImageStyle}
                            resizeMode="cover"
                        />
                        <View style={{
                            width: width - 190,
                            marginLeft: Sizes.fixPadding,
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ ...Fonts.blackColor16SemiBold }}>
                                    {item.name}
                                </Text>
                                {item.isReadable ?
                                    <View style={styles.isReadableUserHintStyle}>
                                    </View> : null
                                }
                            </View>

                            <Text numberOfLines={1}
                                style={{
                                    ...Fonts.grayColor14Regular,
                                    marginTop: Sizes.fixPadding - 7.0
                                }}
                            >
                                {item.about}
                            </Text>
                        </View>
                    </View>
                    <Text style={{ ...Fonts.grayColor12Regular }}>
                        {item.seen}
                    </Text>
                </TouchableOpacity>
                <View style={styles.dividerStyle}>
                </View>
            </View>
        )
        return (
            <FlatList
                data={userList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: Sizes.fixPadding * 2.0,
                    paddingBottom: Sizes.fixPadding * 6.0
                }}
            />
        )
    }

    header() {
        return (
            <View style={styles.headerStyle}>
                <Text style={{ ...Fonts.primaryColor18Bold }}>Chats</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        height: 60.0,
        elevation: 5.0,
        backgroundColor: Colors.whiteColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    useInfoContentStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width - 40.0,
        alignSelf: 'center',
        alignItems: 'center'
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

export default withNavigation(ChatScreen);