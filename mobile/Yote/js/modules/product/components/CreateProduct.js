/**
* Will create a new product from information in the TextInputs
*/

// import react things
import React, { PropTypes } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';

// import react-native components
import Image from 'Image';
import Platform from 'Platform';
import ScrollView from 'ScrollView';
import StyleSheet from 'StyleSheet';
import Text from 'Text';
import TextInput from 'TextInput';
import TouchableOpacity from 'TouchableOpacity';
import View from 'View';

// import global components
import Base from '../../../global/components/BaseComponent';
import YTButton from '../../../global/components/YTButton';
import YTHeader from '../../../global/components/YTHeader';
import YTTouchable from '../../../global/components/YTTouchable';

// import libraries
import moment from 'moment';
import _ from 'lodash';

// import actions
import * as productActions from '../productActions'

// import styles
import productStyles from '../productStyles'; 
import YTColors from '../../../global/styles/YTColors';

class CreateProduct extends Base {
  constructor(props) {
    super(props);
    this.state = {
      isFormValid: false
      , newProduct: {
        title: ""
        , description: ""
      }
    }
    this._bind(
      '_closeModal'
      , '_handleAction'
      , '_handleInputChange'
      , '_checkFormValid'
      , '_openLibrary'
    )
  }

  componentDidMount() {
    this.refs['newProduct.title'].focus();
  }

  _checkFormValid() {

    var requiredInputs = Object.keys(this.refs).filter((ref) => this.refs[ref].props.isRequired);

    var isValid = true;
    for(var i = 0; i < requiredInputs.length; i++) {

      var theVal = _.get(this.state, requiredInputs[i]);
      if(!theVal || theVal.length < 1) {
        isValid = false;
      }
    }

    this.setState({isFormValid: isValid});
  }

  _handleAction() {
    console.log("_handleAction fired");

    const { dispatch, user } = this.props;
    const { newProduct } = this.state;
    if(!this.state.isFormValid) {
      Alert.alert("Whoops", "All fields are required.");
      return;
    }
    dispatch(productActions.sendCreateProduct(newProduct)).then((res) => {
      dispatch(productActions.addProductToList(res.item._id)); 
      this.props.navigator.pop();
    });
  }

  _closeModal() {
    this.props.navigator.pop();
  }

  _openLibrary() {
    this.refs['newProduct.title'].blur();
    this.props.navigator.push({library: true});
  }

  _handleInputChange(e, target) {
    var newState = _.update( this.state, target, function() {
      return e.nativeEvent.text;
    });
    console.log("input changed");
    this.setState(newState);
    this._checkFormValid();
  }

  _scrollToInput(e, refName) {
    setTimeout(() => {
      var scrollResponder = this.refs.myScrollView.getScrollResponder();
      // var scrollResponder = scrollView.getScrollRef();
      var offset = 130;
      // console.log(offset);
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        ReactNative.findNodeHandle(this.refs[refName]),
        offset, // adjust depending on your contentInset
        /* preventNegativeScrollOffset */ true
        // false
      );
    }, 150);
  }

  render() {

    const { navigator, isFetching } = this.props;
    const { newProduct, isFormValid } = this.state;
    const leftItem = {
      title: 'Cancel',
      onPress: this._closeModal
    };
    const rightItem = {
      title: 'Import',
      onPress: this._openLibrary
    }

    return (
      <View style={productStyles.container} >
        <YTHeader
          navigator={navigator}
          leftItem={leftItem}
          title="Create Product"
        />
        <ScrollView ref="myScrollView" keyboardDismissMode="interactive" style={[productStyles.formWrapper]}>
          <View style={productStyles.cell}>
            <Text style={productStyles.newProductHeader}>Product Info</Text>
            <View style={productStyles.infoBox}>
              <View>
                <Text style={productStyles.label}>Title</Text>
                <TextInput
                  ref="newProduct.title"
                  onFocus={ (e) => this._scrollToInput(e, 'newProduct.title')}
                  isRequired={true}
                  style={productStyles.input}
                  placeholder=""
                  placeholderTextColor={YTColors.lightText}
                  autoCorrect={true}
                  onChange={ (e) => this._handleInputChange(e, "newProduct.title") }
                  returnKeyType="go"
                  value={this.state.newProduct.title}
                  onSubmitEditing={this._handleAction}
                />
              </View>
            </View>
          </View>
          <View style={productStyles.cell}>
            <Text style={productStyles.newProductHeader}>Product Description</Text>
            <View style={productStyles.infoBox}>
              <View>
                <Text style={productStyles.label}>Description</Text>
                <TextInput
                  ref="newProduct.description"
                  onFocus={ (e) => this._scrollToInput(e, 'newProduct.description')}
                  isRequired={true}
                  style={productStyles.input}
                  placeholder=""
                  placeholderTextColor={YTColors.lightText}
                  autoCorrect={true}
                  onChange={ (e) => this._handleInputChange(e, "newProduct.description")}
                  returnKeyType="go"
                  value={this.state.newProduct.description}
                  onSubmitEditing={this._handleAction}
                />
              </View>
            </View>
          </View>
          <View style={{padding: 10}}>
            <YTButton
              onPress={this._handleAction}
              caption={isFetching ? "Creating..." : "Create new product"}
              isDisabled={!isFormValid}
            />
          </View>
        </ScrollView>
      </View>
    )
  }
}


const mapStoreToProps = (store) => {

  return {
    user: store.user.loggedIn.user
    , isFetching: store.product.selected.isFetching
  }
}

export default connect(mapStoreToProps)(CreateProduct);
