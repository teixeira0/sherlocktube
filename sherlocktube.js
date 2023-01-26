import React, {Component, useRef} from 'react'
import { Alert, Image, StyleSheet, Button, Text, ScrollView, TextInput, Dimensions, TouchableOpacity, 
  ImageBackground, Modal, FlatList, View, Pressable, Linking, PixelRatio } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { Montserrat_500Medium, Montserrat_500Medium_Italic, Montserrat_600SemiBold, Montserrat_600SemiBold_Italic } from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';
import { styles } from './styles.js'
import { Images, Icons } from './Files.js'
import * as Device from 'expo-device';

var screenResolution = {width: Dimensions.get('window').width, height: Dimensions.get('window').height}

const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

let fonts = {
  Montserrat_500Medium,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold,
  Montserrat_600SemiBold_Italic
};

export function ScreenStack( props ) {
  const isNewEqualization = props.isNewEqualization
  var initialRouteName  = "homePage"
  return(
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown:false, 
          cardOverlayEnabled:false, 
          cardShadowEnabled:false,
          cardStyle:{
            backgroundColor:'transparent'
          }
        }}
      >
        <Stack.Screen
          name="homeScreen"
          component={HomeScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  async _loadFontsAsync() {
    await Font.loadAsync(fonts);
    await SplashScreen.hideAsync();
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  render() {
    return (
      <SafeAreaView style={[styles.container]}>
        <View style={{alignItems: 'center', marginHorizontal: 0,flexGrow:0, height:screenResolution.height, width:screenResolution.width}}>
          <Text style={{position:'absolute', top:100, width:screenResolution.width*0.8, height:screenResolution.height*0.5, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(6)}}>Investigue pistas de vídeos que espalham <Text style={{fontFamily:"Montserrat_500Medium_Italic"}}>fake news</Text>.</Text>
          <View style={[{width:screenResolution.width*0.8, height:screenResolution.height*0.1,flexDirection:'row',position:'absolute', top:390}, styles.fixedContainer]}>
            <TextInput style={[{width:'78%'}, styles.input]} 
                onChangeText={(newName) => {
                }} 
                placeholder={"Cole seu link aqui"}
              />
            <Pressable
              style={{width:'22%'}} 
              onPress={() => {
              }}
            >
              <Image style={{width:'60%', height:'60%'}} resizeMode='contain' source={Icons.paste} />
            </Pressable> 
          </View>
          <Pressable
              style={[{width:screenResolution.width*0.5, 
                       height:screenResolution.height*0.07,
                       position:'absolute', top:480,
                       backgroundColor:'#9172C5',
                       borderRadius:17
                     }, styles.fixedContainer]} 
              onPress={() => {
              }}
            >
              <Text style={{fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(3)}}>Verificar vídeo</Text>
            </Pressable>     
        </View>
      </SafeAreaView> )
  }
};