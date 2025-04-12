import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import firestore from '@react-native-firebase/firestore';

export default function RecipeDetails({ route, navigation }) {
    const [data, setData] = useState(null);
    const { recipeId } = route.params;

    useEffect(() => {
        firestore()
        .collection("recipes")
        .doc(recipeId)
        .get()
        .then((res) => {
            setData(res.data())
        })
        .catch(error => {
            console.log(error);
            
        })
    }, [])

  return (<ScrollView style={{ backgroundColor: '#fff' }}>
    {data && <View style={{ padding: 5 }}>
        <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/alternativemedicine-6ea0c.appspot.com/o/images%2F"+data.image+"?alt=media" }} style={{
            resizeMode: 'cover',
            width: '100%',
            height: 250
        }} />
        <Text style={{color: '#000', fontSize: 20, margin: 5, fontWeight: 'bold'}}>{data.title}</Text>
        <Text style={{color: '#000', fontSize: 18, margin: 5}}>{data.content}</Text>

    </View>}
  </ScrollView>)
}
