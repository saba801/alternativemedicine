import React from 'react';
import {useEffect} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useState} from 'react';

export default function Administrator({route, navigation}) {
  const [name, setName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const { user } = route.params;

  useEffect(() => {
    if (user && user.uid) {
      setLoadingUser(true);
      firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(doc => {
          if (doc.data()) {
            if (doc.data().userType == 'admin') {
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
      {!loadingUser && isAdmin && (
        <>
          <Text
            style={{
              color: '#000000',
              fontSize: 16,
              fontWeight: 'bold',
              margin: 15,
            }}>
            Hello {name}, welcome to the admin dashboard,
          </Text>
          <TouchableOpacity
            style={{
              borderColor: '#0078ff',
              borderWidth: 1,
              width: 100,
              margin: 15,
              padding: 5,
            }}
            
            onPress={handleSignOut}>
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

          <Text
            style={{
              margin: 15,
              color: '#000000',
              fontSize: 18,
              fontWeight: 'bold',
              marginVertical: 25,
            }}>
            Manage Application Content
          </Text>
          <TouchableOpacity
            style={{
              padding: 15,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}
            onPress={() => navigation.navigate('App Data')}>
            <Text style={{color: '#000'}}>App Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 15,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}
            onPress={() => navigation.navigate('Manage Video Sections')}>
            <Text style={{color: '#000'}}>Videos Sections</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 15,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}
            onPress={() => navigation.navigate('Manage Videos List')}>
            <Text style={{color: '#000'}}>Videos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 15,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}
            onPress={() => navigation.navigate('Recipes List')}>
            <Text style={{color: '#000'}}>Recipes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 15,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}
            onPress={() => navigation.navigate('Doctors List')}>
            <Text style={{color: '#000'}}>Doctors</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 15,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}
            onPress={() => navigation.navigate('Users')}>
            <Text style={{color: '#000'}}>Users</Text>
          </TouchableOpacity>
        </>
      )}

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
              padding: 15
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
          }}
        >
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
              padding: 15
            }}>
            You are not authorized to access,
          </Text>
          <Text
            style={{
              color: '#000',
              textAlign: 'center',
              margin: 5,
              padding: 15
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
