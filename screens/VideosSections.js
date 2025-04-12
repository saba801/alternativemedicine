import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function VideosSections({navigation}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    firestore()
      .collection('video-section')
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
      {data &&
        data.map(item => (
          <TouchableOpacity
            key={item.id}
            style={{
              padding: 15,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}
            onPress={() =>
              navigation.navigate('Videos List', {
                sectionId: item.id,
                title: item.title,
              })
            }>
            <Text style={{color: '#000'}}>{item.title}</Text>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}
