import React, {Component, useRef, useCallback, useState, useEffect} from 'react'
import { MenuScreen, ScreenStack } from './sherlocktube.js'
import * as SplashScreen from 'expo-splash-screen';
import { Montserrat_500Medium, Montserrat_500Medium_Italic, Montserrat_600SemiBold, Montserrat_600SemiBold_Italic } from '@expo-google-fonts/montserrat';
import * as Font from 'expo-font';

SplashScreen.preventAutoHideAsync();

let fonts = {
  Montserrat_500Medium,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold,
  Montserrat_600SemiBold_Italic
};

export default function SherlockTube() {

  var[appIsReady, setAppIsReady] = useState(false);
  
  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(fonts);      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <MenuScreen onLayout = {onLayoutRootView}/>
  )
}
