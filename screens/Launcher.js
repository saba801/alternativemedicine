import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function Launcher({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
      }}>
    <Image source={require('./assets/amlogo.png')} style={{
        width: 100,
        height: 100,
        resizeMode: 'contain'
    }} />
    <Text style={{ color: '#0078ff', fontSize: 22, fontWeight: 'bold', margin: 15 }}>Altawazun Alsihiyu</Text>

    <TouchableOpacity
        style={{margin: 15, backgroundColor: '#0078ff', margin: 15, padding: 15, borderRadius: 15, width: '45%'}}
        onPress={() => navigation.navigate("Home")}
    >
        <Text style={{ color: '#ffff', textAlign: 'center' }}>Home</Text>
    </TouchableOpacity>  
    <TouchableOpacity
        style={{margin: 15, backgroundColor: '#0078ff', margin: 15, padding: 15, borderRadius: 15, width: '45%'}}
        onPress={() => navigation.navigate("Doctors Control")}
    >
        <Text style={{ color: '#ffff', textAlign: 'center' }}>Doctors Contorl</Text>
    </TouchableOpacity>  
    <TouchableOpacity
        style={{margin: 15, backgroundColor: '#0078ff', margin: 15, padding: 15, borderRadius: 15, width: '45%'}}
        onPress={() => navigation.navigate("Administrator")}
    >
        <Text style={{ color: '#ffff', textAlign: 'center' }}>Administrator</Text>
    </TouchableOpacity> 
  </View>)
}
