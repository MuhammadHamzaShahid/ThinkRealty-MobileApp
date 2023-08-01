import React, { Component } from "react";
import { View, Image, StatusBar, BackHandler } from "react-native";
import { withNavigation } from "react-navigation";
import { Colors } from "../../constant/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { SharedElement } from 'react-navigation-shared-element';


class ImageFullViewScreen extends Component {

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

    id = this.props.navigation.getParam('id');
    propertyImage = this.props.navigation.getParam('image');

    static sharedElements = (navigation, otherNavigation, showing) => {
        const id = navigation.getParam('id');
        return [id];
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.blackColor, justifyContent: 'center' }}>
                <StatusBar backgroundColor={Colors.blackColor} />
                {this.closeButton()}
                <SharedElement id={this.id}>
                    <Image
                        source={{uri:this.propertyImage}}
                        style={{ height: 414.0, width: '100%' }}
                        resizeMode="contain"
                    />
                </SharedElement>
            </View>
        )
    }

    closeButton() {
        return (
            <MaterialIcons
                name="close"
                size={24}
                color={Colors.whiteColor}
                onPress={() => this.props.navigation.goBack()}
                style={{ position: 'absolute', left: 20.0, top: 10.0, }}
            />
        )
    }
}

ImageFullViewScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(ImageFullViewScreen);