import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function ChatbotScreen({route, navigation}) {
    const [chatbotData, setChatbotData] = useState(null);
    const [message, setMessage] = useState('');
    const chatbox = useRef()
    const [chatMessages, setChatMessges] = useState([]);
    const { user } = route.params;

    useEffect(() => {
        firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then(doc => {
            if(doc.data()){
              setChatMessges([{
                "role":"model",
                "parts": [{
                  "text": "Hello "+ doc.data().name +", How can I help you?"}]
                }])
            }

            firestore()
            .collection("chatbot")
            .get()
            .then(res => {
                let tmpArr = []
                res.forEach(doc => {
                    tmpArr.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
                setChatbotData(tmpArr)
            })
            .catch(err => {
                console.log(err);
            })
        })
    }, [])

  const askChatbot = () => {
    let tmpArr = chatMessages;

    if(message == ""){
      return false;
    }

    tmpArr.push({
      "role":"user",
      "parts": [{
        "text": message
      }]
    });

    setMessage("")

    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB7VkU9nAe5zVUQE-fvrOs8OZHFh3JR-ug', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        "contents": chatMessages
      })
    })
    .then((response) =>  response.json())
    .then(res => {      
      const { content } = res.candidates[0];
      tmpArr.push(content);
      setChatMessges(tmpArr);
    })
    .catch(error => {
      console.log(error);
    });
  }
  
  return (
    <View
      style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        data={chatMessages}
        keyExtractor={(item, index) => "message-"+index}
        renderItem={({ item }) =>
          (<View
            style={{
              backgroundColor: item.role == 'user' ? '#fff' : '#34cceb',
              padding: 15,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 15,
              margin: 15,
              borderBottomEndRadius: item.role == 'user' ? 0 : 15,
              borderBottomLeftRadius: item.role == 'user' ? 15 : 0,
              marginTop: 0,
              width: '65%',
              alignSelf: item.role == 'user' ? 'flex-end' : 'flex-start',
            }}>
            <Text style={{color: '#000'}}>{item.parts[0].text}</Text>
          </View>
        )}
        ref={chatbox}
        onContentSizeChange={() => chatbox.current.scrollToEnd({animated: true})}
        onLayout={() => chatbox.current.scrollToEnd({animated: true})}
        />
      <View
        style={{
          margin: 3
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
          onPress={askChatbot}>
          <Text style={{color: '#fff', fontSize: 20, textAlign: 'center'}}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
