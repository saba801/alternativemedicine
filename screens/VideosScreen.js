import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import firestore from '@react-native-firebase/firestore';

export default function VideosScreen({ route, navigation }) {
  const [data, setData] = useState(null);
  const { sectionId, title } = route.params;

  useEffect(() => {
    firestore()
      .collection('videos')
      .where('section', '==', sectionId)
      .orderBy('creation_date', 'desc')
      .get()
      .then(resopnse => {
        console.log(resopnse.docs);
        
        const videos_list = [];

        resopnse.forEach(doc => {
          videos_list.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setData(videos_list);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {data &&
        data.map(item => (
          <TouchableOpacity
            key={item.id}
            style={{
              padding: 15,
              width: 180,
              margin: 4
            }}
            onPress={() =>
              navigation.navigate('Watch', {
                videoId: item.id,
              })
            }>
            <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/alternativemedicine-6ea0c.appspot.com/o/images%2F"+item.thumbnail+"?alt=media" }} style={{
                resizeMode: 'cover',
                width: 145,
                height: 145,
                borderRadius: 15
            }} />
            <Text style={{color: '#000', textAlign: 'center' }}>{item.title}</Text>
          </TouchableOpacity>
        ))}
        </View>
    </ScrollView>)
}
