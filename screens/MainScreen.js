import React, {useState, useCallback, useEffect} from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

export default function MainScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState(null);

  const handleSignOut = () => {
    auth().signOut();
  };

  useEffect(() => {
    firestore()
    .collection('data')
    .doc('vncx55B1GUVA3m35G9vm')
    .get()
    .then(response => {      
      setData(response.data())
    })
    .catch(error => {
      console.log(error);
    });
  }, [])

  useFocusEffect(useCallback(() => {
    setModalVisible(false)
  }, []))

  return (
    <ScrollView style={{ backgroundColor: 'white', height: '100%', position: 'relative' }}>
      <Modal animationType="fade" transparent={true} visible={modalVisible} >
        <View
          style={{
            flex: 1,
            alignSelf: 'center',
            width: '75%',
          }}
          onPress={() => setModalVisible(false)}
          >
          <View
            style={{
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 20,
              width: '100%',
              padding: 3,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={{ padding: 15, margin: 3, borderBottomColor: '#ccc', borderBottomWidth: 1, width: '100%'  }}>
              <Text style={{ color: '#000' }}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut} style={{ padding: 15, margin: 3, borderBottomColor: '#ccc', borderBottomWidth: 1, width: '100%'  }}>
              <Text>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 15, margin: 3, borderBottomColor: '#ccc', borderBottomWidth: 1, width: '100%'  }}>
              <Text>close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#0078ff',
        }}>
        <Text style={{fontSize: 21, margin: 5, padding: 3, color: '#fff'}}>
          Altawazun Alsihiyu
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{margin: 15}}
            onPress={() => navigation.navigate("Messages")}>
            <Image
              source={require('./assets/msgcon.png')}
              style={{width: 20, height: 20, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{margin: 15}}
            onPress={() => setModalVisible(true)}>
            <Image
              source={require('./assets/settingsicon.png')}
              style={{width: 20, height: 20, resizeMode: 'contain'}}
            />
          </TouchableOpacity>  
        </View>
      </View>
      
      {data && <View>
        <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/alternativemedicine-6ea0c.appspot.com/o/images%2F'+data.image+"?alt=media" }} style={{width: '100%', height: 260, resizeMode: 'cover'}} />

        <Text style={{ color: '#0078ff', fontSize: 26, padding: 15 }}>About</Text>

        <Text style={{padding: 15, color: '#000'}}>
          {data.about}
        </Text>
      </View>}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
        <TouchableOpacity onPress={() => navigation.navigate("Videos")}>
          <Image
            source={require('./assets/videosicon.png')}
            style={{width: 100, height: 100, resizeMode: 'contain'}}
          />
          <Text style={{ color: '#0078ff', textAlign: 'center' }}>Videos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Recipes")}>
          <Image
            source={require('./assets/traditionalrecipes.png')}
            style={{width: 100, height: 100, resizeMode: 'contain'}}
          />
          <Text style={{ color: '#0078ff', textAlign: 'center' }}>Recipes</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Doctors")}>
          <Image
            source={require('./assets/doctorsicon.png')}
            style={{width: 100, height: 100, resizeMode: 'contain'}}
          />
          <Text style={{ color: '#0078ff', textAlign: 'center' }}>Doctors</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Image
            source={require('./assets/searchapi.png')}
            style={{width: 100, height: 100, resizeMode: 'contain'}}
          />
          <Text style={{ color: '#0078ff', textAlign: 'center' }}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Chatbot")}>
          <Image
            source={require('./assets/chatboticon.png')}
            style={{width: 100, height: 100, resizeMode: 'contain'}}
          />
          <Text style={{ color: '#0078ff', textAlign: 'center' }}>Chatbot</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Feedback")}>
          <Image
            source={require('./assets/feedbackicon.png')}
            style={{width: 100, height: 100, resizeMode: 'contain'}}
          />
          <Text style={{ color: '#0078ff', textAlign: 'center' }}>Feedback</Text>
        </TouchableOpacity>
        
      </View>


      {/* <TouchableOpacity style={{ position: 'absolute', zIndex: 1, bottom: 0 }}>
          <Image
            source={require('./assets/chatboticon.png')}
            style={{width: 100, height: 100, resizeMode: 'contain'}}
          />
      </TouchableOpacity> */}
    </ScrollView>
  );
}
