import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Text, TextInput, TouchableOpacity, View} from 'react-native';
import firestore, {serverTimestamp} from '@react-native-firebase/firestore';

export default function Conversation({route, navigation}) {
  const [data, setData] = useState(null);
  const [updated, setUpdated] = useState(null);
  const [message, setMessage] = useState('');
  const chatbox = useRef();
  const {msg, userType} = route.params;

  useEffect(() => {
    if (msg) {
      firestore()
        .collection('messages_replies')
        .where('message_id', '==', msg.id)
        .orderBy('message_date', 'asc')
        .get()
        .then(resopnse => {
          const sections_list = [msg];

          resopnse.forEach(doc => {
            sections_list.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          if(msg.read && msg.read == userType){
              firestore()
                .collection('doctors_messages')
                .doc(msg.id)
                .update({
                  read: msg.userType === userType ? false : (msg.read == 'doctor' ?'user' : 'doctor'),
                })
                .then(() => {                  
                  //
                })
                .catch((err) => {
                  //console.log(err);
                })

          }

          setData(sections_list);
        })
        .catch(err => {
          //console.log('test', err);
        });
    }
  }, [updated]);

  const sendMsg = () => {
    if(message != ""){
      firestore()
      .collection('messages_replies')
      .add({
        message_id: msg.id,
        message: message,
        message_date: serverTimestamp(),
        userType: userType,
        user_id: msg.user_id,
      })
      .then(res => {
        firestore()
          .collection('doctors_messages')
          .doc(msg.id)
          .update({
            read: userType == 'user'? 'doctor':'user',
          })
          .then(() => {
            //
          })
          .catch(() => {
            //
          })
        setMessage(' ');
        setUpdated(Date.now());
      })
      .catch(err => {
        //console.log(err);
      });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={{
              backgroundColor: item.userType == 'user' ? '#fff' : '#34cceb',
              padding: 15,
              borderRadius: 15,
              margin: 15,
              borderWidth: 1,
              borderColor: '#ccc',
              borderBottomEndRadius: item.userType == 'user' ? 0 : 15,
              borderBottomLeftRadius: item.userType == 'user' ? 15 : 0,
              marginTop: 0,
              width: '65%',
              alignSelf: item.userType == 'user' ? 'flex-end' : 'flex-start',
            }}>
            <Text style={{color: '#000'}}>{item.message}</Text>
            <Text style={{color: '#000', fontSize: 12}}>
              {item.message_date && item.message_date.toDate().toLocaleString('de-DE')}
            </Text>
          </View>
        )}
        ref={chatbox}
        onContentSizeChange={() =>
          chatbox.current.scrollToEnd({animated: true})
        }
        onLayout={() => chatbox.current.scrollToEnd({animated: true})}
      />
      <View
        style={{
          margin: 3,
        }}>
        <TextInput
          onChangeText={setMessage}
          value={message}
          style={{
            color: '#000',
            borderColor: '#ccc',
            borderWidth: 1,
            margin: 5,
            borderRadius: 15,
          }}
          multiline={true}
        />
        <TouchableOpacity
          style={{
            margin: 5,
            padding: 5,
            backgroundColor: '#0078ff',
            width: '30%',
            borderRadius: 15,
          }}
          onPress={sendMsg}>
          <Text style={{color: '#fff', fontSize: 20, textAlign: 'center'}}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
