import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  Keyboard,
  Animated as ReactAnimated,
  Easing as ReactEasing
} from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

import { runTiming } from './helpers/runTiming';

export default function App() {
  const buttonOpacity = new Animated.Value(1);
  const [viewTransformY] = React.useState(new ReactAnimated.Value(0));

  const handleStateChange = Animated.event([
    {
      nativeEvent : ({state}) => Animated.block([
        Animated.cond(Animated.eq(state, State.END), Animated.set(buttonOpacity, runTiming(new Animated.Clock(), buttonOpacity, 0)))
      ])
    }
  ]);

  const closeForm = Animated.event([
    {
      nativeEvent : ({state}) => Animated.block([
        Animated.cond(Animated.eq(state, State.END), Animated.set(buttonOpacity, runTiming(new Animated.Clock(), buttonOpacity, 1)))
      ])
    }
  ]);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
  
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    }
  }, []);

  const _keyboardDidShow = () => {
    ReactAnimated.timing(
      viewTransformY,
      {
        toValue : -300,
        duration : 400,
        easing : ReactEasing.ease
      }
    ).start();
  }

  const _keyboardDidHide = () => {
    ReactAnimated.timing(
      viewTransformY,
      {
        toValue : 0,
        duration : 400
      }
    ).start();
  };

  const imageBottomMargin = Animated.interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').height / 3, 0]
  })

  const firstButtonTranslateY = Animated.interpolate(buttonOpacity, {
    inputRange : [0, 1],
    outputRange : [100 ,0]
  });

  const secondButtonTranslateY = Animated.interpolate(buttonOpacity, {
    inputRange : [0, 1],
    outputRange : [-100, 0]
  });

  const loginFormTranslateY = Animated.interpolate(buttonOpacity, {
    inputRange : [0, 1],
    outputRange : [0, Dimensions.get('window').height / 2]
  })

  const rotateButton = Animated.interpolate(buttonOpacity, {
    inputRange : [0, 1],
    outputRange : [0, 180]
  })

  return (
    
<ReactAnimated.View style={{...styles.container, transform : [{translateY : viewTransformY}]}}>      
      
      <Animated.View style={{...StyleSheet.absoluteFill, zIndex : 1, bottom : imageBottomMargin}}>
        <Image 
          source={require('./assets/images/leaf-background.jpg')}
          style={{width : '100%', height : '100%'}}
        />
      </Animated.View>

      {/* SIGN IN BUTTONS */}
      <View style={{...styles.buttonContainer, zIndex : 2}}>
        <TapGestureHandler onHandlerStateChange={handleStateChange}>
          <Animated.View 
            style={{...styles.button, 
                    opacity : buttonOpacity,
                    transform : [{translateY : firstButtonTranslateY}]
                    }}>
            <Text style={{color : 'black'}}>LOGIN</Text>
          </Animated.View>
        </TapGestureHandler>

        <TapGestureHandler onHandlerStateChange={handleStateChange}>
          <Animated.View 
            style={{...styles.button, 
                    opacity : buttonOpacity, 
                    backgroundColor : '#3b5998',
                    transform : [{translateY : secondButtonTranslateY}]
                    }}>
            <Text style={{color : 'white'}}>LOGIN WITH FACEBOOK</Text>
          </Animated.View>
        </TapGestureHandler>
      </View>

      {/* LOGIN FORM */}
      <Animated.View style={{...styles.loginFormContainer, transform : [{translateY : loginFormTranslateY}]}}>
      
        {/* CLOSE BUTTON */}
        <TapGestureHandler onHandlerStateChange={closeForm}>
          <Animated.View style={{...styles.closeButton}}>
            <Animated.Text style={{fontSize : 30, color : '#424242', transform : [{rotate: Animated.concat(rotateButton, 'deg')}]}}>X</Animated.Text> 
          </Animated.View>
        </TapGestureHandler>

        <Animated.View style={{...styles.loginForm}}>
          <TextInput 
            placeholder={'username'}
            placeholderTextColor="gray"
            style={{...styles.input}}
          />
          <TextInput 
            placeholder={'password'}
            placeholderTextColor="gray"
            style={{...styles.input}}
          />

          <TapGestureHandler>
            <View style={{...styles.loginButton}}>
              <Text style={{color : 'black', fontSize : 20}}>LOGIN</Text>
            </View>
          </TapGestureHandler>

        </Animated.View>

      </Animated.View>


    </ReactAnimated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent : 'flex-end'
  },
  buttonContainer : {
    height : Dimensions.get('window').height / 3,
    justifyContent : 'center',
    alignItems : 'center',

  },
  button: {
    backgroundColor : 'white',
    paddingVertical : 17,
    borderRadius : 35,
    width : Dimensions.get('window').width * 3 / 4,
    alignItems : 'center',
    justifyContent : 'center',
    marginVertical : 10,
  },
  loginFormContainer: {
    position : 'absolute',
    top : null, 
    height : Dimensions.get('window').height / 3,
    backgroundColor : 'white',
    width : Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex : 100,

    transform : [{translateY : Dimensions.get('window').height / 2}]
  },
  loginForm : {
    backgroundColor : 'white',
    width: '85%',
    height: '75%',
    borderRadius: 10,
  },

  closeButton: {
    height: 50,
    width : 50,
    borderRadius : 25,
    backgroundColor : '#f7f7f7',
    justifyContent : 'center',
    alignItems: 'center',

    position : 'absolute',
    top : -30,
    right : (Dimensions.get('window').width / 2) - 25,
    zIndex : 1000,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  input: {
    borderWidth : 1,
    borderColor : 'gray',
    borderRadius : 30,
    paddingVertical : 10,
    paddingHorizontal : 20,
    marginVertical : 10,
    fontSize : 16
  },
  loginButton : {
    backgroundColor : 'white',
    borderRadius : 20,
    paddingVertical : 10,
    marginVertical : 10,
    justifyContent : 'center',
    alignItems : 'center',

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    
  }
});
