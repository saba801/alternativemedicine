import React, {useCallback, useEffect, useState} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

export default function Messages({navigation}) {
  const [data, setData] = useState(null);
  const [updated, setUpdated] = useState(null);

  useFocusEffect(useCallback(() => {
    firestore()
      .collection('doctors_messages')
      .orderBy('message_date', 'desc')
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
        //console.log(err);
      });
  }, [ updated ]));

  const deleteMsg = (item) => {
    Alert.alert("Delete Message", "Are you sure", [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'OK', onPress: () => {
        firestore()
        .collection("doctors_messages")
        .doc(item)
        .delete()
        .then(res => {
          setUpdated(Date.now())
        })
        .catch(err => {
          //console.log(err);
        })
      }},
      ]
    )
  }

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
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            onPress={() =>
              navigation.navigate('Conversation', {
                msg: item, userType: 'user'
              })
            }
            onLongPress={() => deleteMsg(item.id)}>
            <Text style={{color: '#000'}}>{item.doctor_name}</Text>
            {item.read && item.read == 'user' && (
              <View
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: 'lime',
                  borderRadius: 50,
                }}></View>
            )}
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}
