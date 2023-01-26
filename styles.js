import React from 'react';
import { Image, StyleSheet, Button, Text, TouchableOpacity, FlatList, View } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  fixedContainer: {
    flexGrow: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  carta: {
    alignSelf:'center',
    flex:1,
    // Without height undefined it won't work
    aspectRatio: 9 / 16,
  },
  botoes: {
    alignSelf:'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});