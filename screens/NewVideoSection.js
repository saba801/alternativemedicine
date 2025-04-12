import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function NewVideoSection({ navigation, route }) {
    const [title, setTitle] = useState("");
    const [msg, setMsg] = useState(null);

    const handleAdd = () => {
        if(title !== ''){
            firestore()
            .collection("video-section")
            .add({
                title: title,
            })
            .then(() => {                
                navigation.navigate("Administrator")
            })
            .catch(() => {
                setMsg("Sorry something went wrong...");
            })
        } else {
            setMsg("Please enter all the required feilds..");
        }
    }
    
  return (<ScrollView style={{ backgroundColor: '#fff' }}>
    <Text style={{ fontSize: 16, color: '#000', margin: 15, }}>Title</Text>
    <TextInput placeholder='Title' style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15 }} onChangeText={(value) => setTitle(value)} value={title} multiline={true} />


    {msg && <Text style={{  color: 'red', margin: 5, textAlign: 'center' }}>{msg}</Text>}

    <TouchableOpacity 
        style={{ margin: 5, padding: 5, backgroundColor: '#0078ff', width: '30%', borderRadius: 15, alignSelf: 'center' }}
        onPress={handleAdd}
    >
        <Text style={{ color: "#fff", fontSize: 20, textAlign: 'center' }}>Save</Text>
    </TouchableOpacity>
  </ScrollView>)
}
