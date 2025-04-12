import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function RecipesScreen({navigation}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    firestore()
      .collection('recipes')
      .get()
      .then(resopnse => {
        const sections_list = [];

        resopnse.forEach(doc => {
          sections_list.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setData(sections_list);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <View style={{ flexDirection: 'row',flexWrap: 'wrap' }}>
      {data &&
        data.map(item => (
          <TouchableOpacity
            key={item.id}
            style={{
              padding: 15,
              width: 180,
            }}
            onPress={() =>
              navigation.navigate('Recipe Details', {
                recipeId: item.id,
              })
            }>
              <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/alternativemedicine-6ea0c.appspot.com/o/images%2F"+item.image+"?alt=media" }} style={{
                resizeMode: 'cover',
                width: 145,
                height: 145,
                borderRadius: 15
            }} />
            <Text style={{color: '#000', margin: 2, textAlign: 'center'}}>{item.title}</Text>
          </TouchableOpacity>
        ))}
        </View>
    </ScrollView>
  );
}
