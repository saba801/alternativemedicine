import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Alert,
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function RecipesList({route, navigation}) {
  const [data, setData] = useState(null);
  const [refreshList, setRefreshList] = useState(Date.now());

  useLayoutEffect(() => {
    firestore()
      .collection('recipes')
      .get()
      .then(response => {
        let tmpArr = [];

        response.forEach(doc => {
          tmpArr.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setData(tmpArr);
      })
      .catch(error => {
        console.log(error);
      });
  }, [refreshList]);

  const handleDelete = itemId => {
    Alert.alert('Delete Section', 'Are you sure to delete this section?', [
      {
        text: 'No',
        onPress: () => {
          //
        },
      },
      {
        text: 'Yes',
        onPress: () => {
          firestore()
            .collection('recipes')
            .doc(itemId)
            .delete()
            .then(() => {
              setRefreshList(Date.now());
            })
            .catch(error => {
              console.log(error);
            });
        },
      },
    ]);
  };

  return (
    <ScrollView style={{backgroundColor: '#ffffff'}}>
      <TouchableOpacity
        style={{
          margin: 5,
          padding: 5,
          backgroundColor: '#0078ff',
          width: '25%',
          borderRadius: 15,
        }}
        onPress={() => navigation.navigate('New Recipes')}>
        <Text style={{color: '#fff', textAlign: 'center'}}>New</Text>
      </TouchableOpacity>
      {data &&
        data.map(item => (
          <View
            style={{
              padding: 15,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}>
            <Text
              style={{
                color: '#000',
                fontSize: 16,
                fontWeight: 'bold',
                padding: 4,
              }}>
              {item.title}
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                style={{
                  margin: 3,
                  backgroundColor: 'green',
                  padding: 5,
                  borderRadius: 5,
                }}
                onPress={() =>
                  navigation.navigate('Edit Recipes', {item_id: item.id})
                }>
                <Text style={{color: '#fff'}}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  margin: 3,
                  backgroundColor: 'red',
                  padding: 5,
                  borderRadius: 5,
                }}
                onPress={() => handleDelete(item.id)}>
                <Text style={{color: '#fff'}}>x Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
    </ScrollView>
  );
}
