import React from 'react';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme} from 'galio-framework';
import { materialTheme } from '../constant/Theme';

const { width } = Dimensions.get('screen');

class Product extends React.Component {
  render() {
    const { navigation, product, horizontal, full, style, priceColor, imageStyle } = this.props;
    const imageStyles = [styles.image, full ? styles.fullImage : styles.horizontalImage, imageStyle];
    if(product.type === 'notification'){
      if(product.title){
        return (
          <Block row={horizontal} card flex backgroundColor={product.status == 'New' ? theme.COLORS.WHITE:theme.COLORS.GREY} style={[styles.product, styles.shadow, style,{minHeight:0,marginVertical: -4,padding:10}]}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Profile', { contact_id: product.contact_id, noti_id: product.noti_id, program_id: product.program_id})}>
              <Block flex space="between" style={styles.productDescription}>
                <Text size={16} style={styles.productTitle} bold>{product.title}</Text>
                <Text size={14} muted={!priceColor}>{product.description.trim()}</Text>
                <Text size={12} bold style={{paddingTop:15}} muted>{product.date}</Text>
              </Block>
            </TouchableWithoutFeedback>
          </Block>
        );
      }
    }
    if(product.type === 'course'){
      if(product.title){
        return (
          <Block row={horizontal} card flex backgroundColor={product.hit_program_id == product.program_id ? "#fcb9004d" : theme.COLORS.GREY} style={[styles.product, styles.shadow, style,{minHeight:0,marginVertical: -4,padding:10,marginTop:15}]}>
            <TouchableWithoutFeedback onPress={product.onPress}>
              <Block flex space="between" style={styles.productDescription}>
                <Text size={16} style={styles.productTitle} bold>{product.title} <Text size={10} bold>({product.course_level})</Text></Text>
                <Text size={14} muted={!priceColor}>{product.institute_name} - {product.campus_name}</Text>
                <Text size={14} style={{backgroundColor: materialTheme.COLORS.PRIMARY,color:materialTheme.COLORS.WHITE,padding:5,marginRight: theme.SIZES.BASE / 2,borderRadius: 4,marginTop: 7}}>{product.sales_stage} - {product.securitygroup_name} ({product.assigned_user_name})</Text>
              </Block>
            </TouchableWithoutFeedback>
          </Block>
        );
      }
    }
    else{
      return (
        <Block row={horizontal} cardc flex style={[styles.product, styles.shadow, style]}>
          <TouchableWithoutFeedback onPress={() => navigation.navigate('Product', { product: product })}>
            <Block flex style={[styles.imageContainer, styles.shadow]}>
              <Image source={{ uri: product.image }} style={imageStyles} />
            </Block>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigation.navigate('Product', { product: product })}>
            <Block flex space="between" style={styles.productDescription}>
              <Text size={14} style={styles.productTitle}>{product.title}</Text>
              <Text size={12} muted={!priceColor} color={priceColor}>${product.price}</Text>
            </Block>
          </TouchableWithoutFeedback>
        </Block>
      );
    }
  }
}

export default Product;

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
  productDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    elevation: 1,
  },
  image: {
    borderRadius: 3,
    marginHorizontal: theme.SIZES.BASE / 2,
    marginTop: -16,
  },
  horizontalImage: {
    height: 122,
    width: 'auto',
  },
  fullImage: {
    height: 215,
    width: width - theme.SIZES.BASE * 3,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});