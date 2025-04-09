import React, { useCallback } from 'react';
import {useEffect} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useState} from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function DoctorsControl({route, navigation}) {
  const [name, setName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const {user} = route.params;
  const [data, setData] = useState(null);
  const [updated, setUpdated] = useState(null);

  useFocusEffect(useCallback(() => {
    if (user && user.uid) {
      firestore()
        .collection('doctors_messages')
        .where('doctor_id', '==', user.uid)
        .orderBy('message_date', 'desc')
        .get()
        .then(resopnse => {
          const tmpArr = [];

          resopnse.forEach(doc => {
              tmpArr.push({
                id: doc.id,
                ...doc.data()
              })
          });

          setData(tmpArr);
        })
        .catch(err => {
          //console.log(err);
        });
    }
  }, [updated, user]));

  useEffect(() => {
    if (user && user.uid) {
      setLoadingUser(true);
      firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(doc => {
          
          if (doc.data()) {
            if (doc.data().userType == 'doctor') {
              setIsAdmin(true);
            }
            setName(doc.data().name);
            setLoadingUser(false);
          }
        })
        .catch(() => {
          setIsAdmin(false);
          setLoadingUser(false);
        });
    }
  }, []);

  const handleSignOut = () => {
    auth().signOut();
  };

  return (
    <ScrollView style={{backgroundColor: '#ffffff'}}>
      {!loadingUser && isAdmin && !data && (
        <Text
          style={{
            color: '#000',
            textAlign: 'center',
            margin: 15,
            padding: 15,
          }}>
          There are no messages available at this moment
        </Text>
      )}
      {!loadingUser &&
        isAdmin &&
        data &&
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
                msg: item, userType: 'doctor'
              })
            }>
            <Text style={{color: '#000'}}>{item.doctor_name}</Text>
            {item.read && item.read == 'doctor' && (
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

      {loadingUser && (
        <>
          <Image
            source={require('./assets/amlogo.png')}
            style={{
              width: 100,
              height: 100,
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              color: '#000',
              textAlign: 'center',
              margin: 15,
              padding: 15,
            }}>
            Checking current login user privileges...
          </Text>
        </>
      )}

      {!loadingUser && !isAdmin && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
          }}>
          <Image
            source={require('./assets/amlogo.png')}
            style={{
              width: 100,
              height: 100,
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              color: '#000',
              textAlign: 'center',
              margin: 5,
              padding: 15,
            }}>
            You are not authorized to access,
          </Text>
          <Text
            style={{
              color: '#000',
              textAlign: 'center',
              margin: 5,
              padding: 15,
            }}>
            login with a diffrent authorized account...
          </Text>
          <TouchableOpacity
            style={{
              borderColor: '#0078ff',
              borderWidth: 1,
              width: 100,
              margin: 15,
              padding: 5,
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: '#0078ff',
                fontSize: 13,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
