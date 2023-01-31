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
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { useIsFocused } from '@react-navigation/native';
import { createNavigationContainerRef } from '@react-navigation/native';



var screenResolution = {width: Dimensions.get('window').width, height: Dimensions.get('window').height}

const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

let fonts = {
  Montserrat_500Medium,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold,
  Montserrat_600SemiBold_Italic
};


export const navigationRef = createNavigationContainerRef()

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

class Youtube {

  video;
  channel;

  constructor() {
    this.video = {}
    this.channel = {}
    this.category = {id:0, title:""}
    this.key = 'AIzaSyATuEC83GkAR8zh80LTlJ-RdZsISPuKtfg'
  }
  async init(url) {
    id = this.validateURL(url)
      if (id) {
        await this.fetchVideoData(id)
        await this.fetchChannelData(this.video.snippet.channelId)
        await this.fetchCategoryData(this.video.snippet.categoryId)
        return true
      } else {
        return false
      }
  }

  validateURL(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }

  async fetchVideoData(id) {
    var ROOT_URL = 'https://www.googleapis.com/youtube/v3/videos'

    var params = {
      part: 'snippet, statistics',
      key: this.key,
      id: id,
    };

    var response = await axios.get(ROOT_URL, { params: params })
    this.video = response.data.items[0]
  }
  async fetchChannelData(id) {
    var ROOT_URL = 'https://www.googleapis.com/youtube/v3/channels'

    var params = {
      part: 'snippet, statistics',
      key: this.key,
      id: id,
    };

    var response = await axios.get(ROOT_URL, { params: params })
    this.channel = response.data.items[0]
  }
  async fetchCategoryData(id) {
    var ROOT_URL = 'https://www.googleapis.com/youtube/v3/videoCategories'

    var params = {
      part: 'snippet',
      hl:'pt_BR',
      key: this.key,
      id: id,
    };

    var response = await axios.get(ROOT_URL, { params: params })
    this.category = {id:id, title:response.data.items[0].snippet.title}
  }
}

export class ScreenStack extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    var initialRouteName = "homeScreen"
    return(
      <NavigationContainer ref={navigationRef}>
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
            initialParams={this.props.tutorial}
          />
          <Stack.Screen
            name="videoScreen"
            component={VideoScreen} 
          />
          <Stack.Screen
            name="sideMenuScreen"
            component={SideMenuScreen} 
          />
          <Stack.Screen
            name="referenceScreen"
            component={ReferenceScreen} 
          />
          <Stack.Screen
            name="creditsScreen"
            component={CreditsScreen} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export class MenuScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tutorial:false
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
    return(
      <SafeAreaView style={styles.container}>
        <View style={{height:screenResolution.height, width:screenResolution.width, flexGrow:1}}>
          <ScreenStack tutorial={this.state.tutorial}/>
          <View style={[styles.fixedContainer, {
            width:screenResolution.width, 
            height:screenResolution.height*0.1, 
            position:'absolute',
            bottom:0,
            backgroundColor:'black'
          }]}>
            <Pressable
              style={[{width:screenResolution.width*0.11, 
                       height:screenResolution.width*0.11,
                       position:'absolute', bottom:17, left:45,
                     }, styles.fixedContainer]} 
              onPress={() => {
                this.setState({
                  tutorial:false
                }, () => {navigate("sideMenuScreen")})
              }}
            >
              <Image style={{flexGrow:0, width:'100%', height:'100%'}} resizeMode='contain' source={Icons.menu} /> 
            </Pressable>  
            <Pressable
              style={[{width:screenResolution.width*0.12, 
                       height:screenResolution.width*0.12,
                       position:'absolute', bottom:17, right:45,
                     }, styles.fixedContainer]} 
              onPress={() => {
                this.setState({
                  tutorial:!this.state.tutorial
                }, () => {navigate("homeScreen", {tutorial:this.state.tutorial})})
              }}
            >
              <Image style={{flexGrow:0, width:'100%', height:'100%'}} resizeMode='contain' source={Icons.help} /> 
            </Pressable>   
            <Pressable
              style={[{width:screenResolution.width*0.3, 
                       height:screenResolution.width*0.3,
                       position:'absolute', bottom:0,
                     }, styles.fixedContainer]} 
              onPress={() => {
                this.setState({
                  tutorial:false
                }, () => {navigate("homeScreen", {tutorial:this.state.tutorial})})
              }}
            >
              <Image style={{flexGrow:0, width:'100%', height:'100%'}} resizeMode='contain' source={Icons.investigate} /> 
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clipboard:'',
      pasted:false,
      url:'',
      buttonText:"Verificar Vídeo",
      buttonColor:'#9172C5',
    }
    this.youtube = new Youtube()
  }

  render() {
    var tutorial = this.props.route.params.tutorial
    return (
      <View style={styles.container}>
        {!tutorial && 
          <Text style={{position:'absolute', top:120, width:screenResolution.width*0.8, height:screenResolution.height*0.5, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(6)}}>Investigue pistas de vídeos que espalham <Text style={{fontFamily:"Montserrat_500Medium_Italic"}}>fake news</Text>.</Text>
        }
        <View style={[{width:screenResolution.width*0.8, height:screenResolution.height*0.1,flexDirection:'row',position:'absolute', top:410}, styles.fixedContainer]}>
          <TextInput value = {(this.state.pasted) ? this.state.clipboard : null} style={[{width:'82%'}, styles.input]} 
              onChangeText={(newUrl) => {
                this.setState({url:newUrl})
              }} 
              onFocus={() => {
                this.setState({pasted:false})
              }}
              placeholder={"Cole seu link aqui"}
            />
          <Pressable
            style={{width:'18%'}} 
            onPress={() => {
              Clipboard.getStringAsync().then((url) => {this.setState({pasted:true, clipboard:url, url:url})})
            }}
          >
            <Image style={{width:'80%', height:'80%'}} resizeMode='contain' source={Icons.paste} />
          </Pressable> 
        </View>
        <Pressable
          style={[{width:screenResolution.width*0.5, 
                   height:screenResolution.height*0.07,
                   position:'absolute', top:500,
                   backgroundColor:this.state.buttonColor,
                   borderRadius:17
                 }, styles.fixedContainer]} 
          onPress={() => {
            this.setState({buttonText:"Aguarde...",
                           buttonColor:'green'})
            const navigation = this.props.navigation
            this.youtube.init(this.state.url).then((valid) => {
              if(valid) {
                console.log("Valido")
                setTimeout(function(){
                  this.setState({buttonText:"Verificar Vídeo",
                                 buttonColor:'#9172C5'});
                }.bind(this),2000); 
                navigation.navigate("videoScreen", {video:this.youtube.video, channel:this.youtube.channel, category:this.youtube.category})
              } else {
                this.setState({buttonText:"Link Inválido",
                               buttonColor:'red'})
                setTimeout(function(){
                  this.setState({buttonText:"Verificar Vídeo",
                                 buttonColor:'#9172C5'});
                }.bind(this),1000); 
                console.log("Inválido")
              }
            })
          }}
        >
          <Text style={{fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(3)}}>{this.state.buttonText}</Text>
        </Pressable> 
        {tutorial &&    
          <Image style={{opacity: tutorial ? 1 : 0, flexGrow:0, width:screenResolution.width*0.8, height:screenResolution.height, position:'absolute', top:60}} resizeMode='contain' source = {Images.tutorial} /> 
        }
      </View> 
    )
  }
};

class Hint extends Component{
  constructor(props) {
    super(props)
    this.state = {
      danger:props.danger,
      warning:props.warning,
    }
  }
  render() {
    return(
      <View style={[this.props.style, styles.fixedContainer, {
        width:screenResolution.width, 
        height:screenResolution.width*0.2,
        backgroundColor:(this.state.danger == 0 ? 'white' : (this.state.danger == 1 ? '#FFFA7E  ' : '#C57272'))
      }]}>
        <Text style={{width:screenResolution.width*0.8, height:'100%', fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(2), textAlignVertical:'center'}}>{this.state.warning}</Text>
      </View>
    )
  }
}

class VideoScreen extends Component {
  constructor(props){
    super(props)
    this.video = this.props.route.params.video
    this.channel = this.props.route.params.channel
    this.category = this.props.route.params.category
    this.hints = []
    this.analyzeVideo()
  }

  analyzeVideo() {
    // Analyzing the video date
    var publishDate = new Date(this.video.snippet.publishedAt)
    var today = new Date()
    var diffTime = Math.abs(today - publishDate);
    var diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    var hint = {}
    if (diffYears > 8) {
      hint = {danger: 2, warning:"Perigo! Este vídeo foi postado há mais de " + diffYears.toString() + " anos! Ele pode conter informações desatualizadas ou fora de contexto!"}
    } else if (diffYears > 3) {
      hint = {danger:1, warning:"Atenção! Este vídeo foi postado há mais de " + diffYears.toString() + " anos! Ele pode conter informações desatualizadas ou fora de contexto!"}
    } else if (diffYears > 1) {
      hint = {danger:0, warning:"Este vídeo foi postado há " + diffYears.toString() + " anos."}
    } else if (diffYears == 1) {
      hint = {danger:0, warning:"Este vídeo foi postado há mais de um ano."}
    } else {
      hint = {danger:0, warning:"Este vídeo foi postado há menos de um ano."}
    }
    this.hints.push(hint)

    // Analyzing the view count
    var viewCount = this.video.statistics.viewCount
    if (viewCount < 500) {
      hint = {danger: 2, warning:"Perigo! Este vídeo possui apenas " + viewCount.toString() + " visualizações! Verifique outras fontes!"}
    } else if (viewCount < 5000) {
      hint = {danger:1, warning:"Atenção! Este vídeo possui apenas " + viewCount.toString() + " visualizações! Verifique outras fontes!"}
    } else {
      hint = {danger:0, warning:"Este vídeo possui " + viewCount.toString() + " visualizações."}
    }    
    this.hints.push(hint)

    // Analyzing the comment count
    var commentCount = this.video.statistics.commentCount
    if (commentCount == 0) {
      hint = {danger: 2, warning:"Perigo! Este vídeo não possui comentários! Procure outras fontes!"}
    } else if (commentCount < 50) {
      hint = {danger:1, warning:"Atenção! Este vídeo possui apenas " + commentCount.toString() + " comentários! Procure mais fontes!"}
    } else {
      hint = {danger:0, warning:"Este vídeo possui " + commentCount.toString() + " Comentários. Recomenda-se ler os mais relevantes!"}
    }    
    this.hints.push(hint)  

    // Analyzing the video category
    var categoryId = this.category.id
    if (categoryId == 25) {
      hint = {danger: 0, warning:"O vídeo está marcado com a categoria \""+ this.category.title + "\"."}
    } else {
      hint = {danger:1, warning:"Atenção! Este vídeo está marcado com a categoria \"" + this.category.title + "\"! Pode não ser uma notícia!"}
    }   
    this.hints.push(hint) 

    // Analyzing the channel creation date
    publishDate = new Date(this.channel.snippet.publishedAt)
    diffTime = Math.abs(today - publishDate);
    diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    if (diffYears > 3) {
      hint = {danger: 0, warning:"Este canal foi criado há quase " + diffYears.toString() + " anos."}
    } else if (diffYears > 1) {
      hint = {danger:1, warning:"Atenção! Este canal foi criado há menos de " + diffYears.toString() + " anos! Verifique sua autenticidade!"}
    } else {
      hint = {danger:2, warning:"Perigo! Este canal foi criado há menos de 1 ano! Procure outras fontes!"}
    } 
    this.hints.push(hint) 

    // Analyzing the channel subscriber number
    var subs = this.channel.statistics.subscriberCount
    if (subs < 100) {
      hint = {danger:2, warning:"Perigo! Este canal possui apenas " + subs + " inscritos! Consulte outras fontes!"}
    } else if (subs < 1000) {
      hint = {danger:1, warning:"Atenção! Este canal possui apenas " + subs + " inscritos! Verifique sua autenticidade!"}
    } else {
      hint = {danger:0, warning:"Este canal possui " + subs + " inscritos."}
    } 
    this.hints.push(hint) 

    // Analyzing the channel subscriber number
    var videos = this.channel.statistics.videoCount
    if (videos < 50) {
      hint = {danger:2, warning:"Perigo! Este canal publicou apenas " + videos + " vídeos! Consulte outras fontes!"}
    } else if (videos < 100) {
      hint = {danger:1, warning:"Atenção! Este canal publicou apenas " + videos + " vídeos! Verifique sua autenticidade!"}
    } else {
      hint = {danger:0, warning:"Este canal publicou " + videos + " vídeos."}
    } 
    this.hints.push(hint) 
  }

  render() {
    return(
      <ScrollView 
          style={{height:screenResolution.height, width:screenResolution.width}}
          contentContainerStyle={{alignItems: 'center'}}>   
        <View style={[styles.fixedContainer, {
          width:screenResolution.width, 
          height:screenResolution.height*0.02,
          }]}/>
        <Text style={{width:screenResolution.width*0.8, height:screenResolution.height*0.06, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(4)}}>Vídeo Analisado:</Text>
        <Text style={{width:screenResolution.width*0.8, height:screenResolution.height*0.13, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(3)}}>{this.video.snippet.title}</Text>
        <Image style={{flexGrow:0, width:'80%', aspectRatio:4/3}} resizeMode='contain' source = {{uri:this.video.snippet.thumbnails.high.url}} /> 
        <Text style={{width:screenResolution.width*0.8, height:screenResolution.height*0.05, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(4)}}>Canal:</Text>        
        <Image style={{flexGrow:0, width:'10%', aspectRatio:1}} resizeMode='contain' source = {{uri:this.channel.snippet.thumbnails.high.url}} /> 
        <Text style={{width:screenResolution.width*0.8, height:screenResolution.height*0.05, fontFamily: 'Montserrat_500Medium', textAlign:'center', fontSize:RFPercentage(3)}}>{this.channel.snippet.title}</Text>
        <Text style={{width:screenResolution.width*0.8, height:screenResolution.height*0.1, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(3.2)}}>Encontramos as seguintes pistas:</Text>        
        <View style={[styles.container]}>
          {this.hints.map((props, key) => {
            return(
              <View key={key} style = {[styles.fixedContainer]}>
                <Hint danger={props.danger} warning={props.warning} />
                <View style={[styles.fixedContainer],{width:'100%', height:screenResolution.height*0.01}} />
              </View>
            )
          })}
        </View>
        <View style={[styles.fixedContainer, {
          width:screenResolution.width, 
          height:screenResolution.height*0.15,
          }]}/>
      </ScrollView>
    )
  }
}

class ReferenceScreen extends Component{
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <ScrollView 
          style={{height:screenResolution.height, width:screenResolution.width}}
          contentContainerStyle={{alignItems: 'center'}}>   
        <View style={[styles.fixedContainer, {
          width:screenResolution.width, 
          height:screenResolution.height*0.02,
          }]}/>
        <Text style={{width:screenResolution.width*0.8, height:screenResolution.height*0.1, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(4)}}>Referências</Text>
        <Text onPress={() => Linking.openURL('https://link.springer.com/chapter/10.1007/978-3-030-90087-8_21')} style={{color: 'blue', width:screenResolution.width*0.8, height:screenResolution.height*0.28, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(3)}}>(Inglês) Detecting Fake News on COVID-19 Vaccine from YouTube Videos Using Advanced Machine Learning Approaches</Text>
        <Text onPress={() => Linking.openURL('https://www.sciencedirect.com/science/article/pii/S0167865522000071')} style={{color: 'blue', width:screenResolution.width*0.8, height:screenResolution.height*0.25, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(3)}}>(Inglês) Effective fake news video detection using domain knowledge and multimodal data fusion on youtube</Text>
        <Text onPress={() => Linking.openURL('https://journals.sagepub.com/doi/abs/10.1177/0163443720977301')} style={{color: 'blue', width:screenResolution.width*0.8, height:screenResolution.height*0.3, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(3)}}>(Inglês) Fake news as fake politics: the digital materialities of YouTube misinformation videos about Brazilian oil spill catastrophe</Text>
        <Text onPress={() => Linking.openURL('https://educamidia.org.br/')} style={{color: 'blue', width:screenResolution.width*0.8, height:screenResolution.height*0.1, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(3)}}>Site Educamídia</Text>
        <Text onPress={() => Linking.openURL('https://g1.globo.com/fato-ou-fake/noticia/2018/09/25/fato-ou-fake-saiba-como-identificar-se-um-conteudo-e-falso.ghtml')} style={{color: 'blue', width:screenResolution.width*0.8, height:screenResolution.height*0.2, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(3)}}>Fato ou Fake? Saiba como identificar se um conteúdo é falso</Text>
        <View style={[styles.fixedContainer, {
          width:screenResolution.width, 
          height:screenResolution.height*0.15,
          }]}/>
      </ScrollView>

    )
  }
}

class CreditsScreen extends Component{
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <ScrollView 
          style={{height:screenResolution.height, width:screenResolution.width}}
          contentContainerStyle={{alignItems: 'center'}}>   
        <View style={[styles.fixedContainer, {
          width:screenResolution.width, 
          height:screenResolution.height*0.02,
          }]}/>
        <Text style={{width:screenResolution.width*0.8, height:screenResolution.height*0.1, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(4)}}>Créditos</Text>
        <Text style={{width:screenResolution.width*0.8, height:screenResolution.height*0.3, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(3)}}>Este aplicativo foi desenvolvido para a disciplina de Sistemas de Informação, na Universidade de Brasília, 2023.</Text>
        <Text style={{width:screenResolution.width*0.8, height:screenResolution.height*0.08, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(4)}}>Desenvolvimento</Text>
        <Text style={{width:screenResolution.width*0.8, height:screenResolution.height*0.3, fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(3)}}>Rodrigo Teixeira</Text>
        <View style={[styles.fixedContainer, {
          width:screenResolution.width, 
          height:screenResolution.height*0.15,
          }]}/>
      </ScrollView>

    )
  }
}

class SideMenuScreen extends Component{
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <View style={styles.container}>
        <Pressable
            style={[{width:'100%', 
                     height:screenResolution.height*0.12,
                     position:'absolute', top:60,
                     backgroundColor:'#9172C5'
                   }, styles.fixedContainer]} 
            onPress={() => {
              const navigation = this.props.navigation
              navigation.navigate("referenceScreen")
            }}>
          <Text style={{fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(4)}}>Referências</Text>
        </Pressable>
        <Pressable
            style={[{width:'100%', 
                     height:screenResolution.height*0.12,
                     position:'absolute', top:180,
                     backgroundColor:'#D9D9D9'
                   }, styles.fixedContainer]} 
            onPress={() => {}}>
          <Text style={{fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(4)}}>Estatísticas</Text>
        </Pressable>
        <Pressable
            style={[{width:'100%', 
                     height:screenResolution.height*0.12,
                     position:'absolute', top:300,
                     backgroundColor:'#D9D9D9'
                   }, styles.fixedContainer]} 
            onPress={() => {}}>
          <Text style={{fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(4)}}>Histórico de Vídeos</Text>
        </Pressable>
        <Pressable
            style={[{width:'100%', 
                     height:screenResolution.height*0.12,
                     position:'absolute', top:420,
                     backgroundColor:'#D9D9D9'
                   }, styles.fixedContainer]} 
            onPress={() => {}}>
          <Text style={{fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(4)}}>Login/Cadastre-se</Text>
        </Pressable>
        <Pressable
            style={[{width:'100%', 
                     height:screenResolution.height*0.12,
                     position:'absolute', top:540,
                     backgroundColor:'#9172C5'
                   }, styles.fixedContainer]} 
            onPress={() => {
              const navigation = this.props.navigation
              navigation.navigate("creditsScreen")
            }}>
          <Text style={{fontFamily: 'Montserrat_500Medium', fontSize:RFPercentage(4)}}>Créditos</Text>
        </Pressable>
      </View>
    )
  }
}