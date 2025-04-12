import React, { useEffect, useState } from 'react';
import { FlatList, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import firestore, { serverTimestamp } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

export default function NewRecipes({ navigation, route }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageName, setImageName] = useState("");
    const [msg, setMsg] = useState(null);

    const uploadImage = async () => {
        const tmpName = Date.now().toString()+'.jpg';
        const result = await launchImageLibrary({
            mediaType: 'photo',
        });
        
        const reference = storage().ref("images/"+tmpName);
        
        if(!result.didCancel && !result.errorCode){
            const task = reference.putFile(result.assets[0].originalPath);
            task.then(() => {
                setImageName(tmpName);
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    const handleAdd = () => {
        if(title !== '' && imageName !== ''){
            firestore()
            .collection("recipes")
            .add({
                title: title,
                image: imageName,
                content: content,
            })
            .then(() => {                
                navigation.navigate("Recipes List")
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
    <TextInput placeholder='Title' style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15 }} onChangeText={(value) => setTitle(value)} value={title} />

    <Text style={{ fontSize: 16, color: '#000', margin: 15, }}>Content</Text>
    <TextInput placeholder='Content' style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15 }} onChangeText={(value) => setContent(value)} value={content} multiline={true} />

    {imageName && <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/alternativemedicine-6ea0c.appspot.com/o/images%2F'+imageName+"?alt=media" }} style={{width: '100%', height: 260, resizeMode: 'cover', margin: 5}} />}
    <TouchableOpacity style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15 }} onPress={() => uploadImage('photo')}>
        <Text style={{ color: '#000' }}>Upload Image</Text>
    </TouchableOpacity>

    {msg && <Text style={{  color: 'red', margin: 5, textAlign: 'center' }}>{msg}</Text>}

    <TouchableOpacity 
        style={{ margin: 5, padding: 5, backgroundColor: '#0078ff', width: '30%', borderRadius: 15, alignSelf: 'center' }}
        onPress={handleAdd}
    >
        <Text style={{ color: "#fff", fontSize: 20, textAlign: 'center' }}>Save</Text>
    </TouchableOpacity>
  </ScrollView>)
}
