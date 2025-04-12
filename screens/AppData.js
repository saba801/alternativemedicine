import React, { useEffect, useState } from 'react';
import { FlatList, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import firestore, { serverTimestamp } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

export default function AppData({ navigation }) {
    const [about, setAbout] = useState("");
    const [imageName, setImageName] = useState("");
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        firestore()
        .collection("data")
        .doc('vncx55B1GUVA3m35G9vm')
        .get()
        .then(response => {
            setAbout(response.data().about);
            setImageName(response.data().image);
        })
        .catch(() => {

        })
    }, [])

    const uploadImage = async () => {
        const tmpName = Date.now()+'.jpg';
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

    const handleUpdate = () => {
        if(about !== '' && imageName !== '' && imageName !== ''){
            firestore()
            .collection("data")
            .doc('vncx55B1GUVA3m35G9vm')
            .update({
                about: about,
                image: imageName,
                updated_at: new Date()
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
    <Text style={{ fontSize: 16, color: '#000', margin: 15, }}>About</Text>
    <TextInput placeholder='About' style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15 }} onChangeText={(value) => setAbout(value)} value={about} multiline={true} />

    {imageName && <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/alternativemedicine-6ea0c.appspot.com/o/images%2F'+imageName+"?alt=media" }} style={{width: '100%', height: 260, resizeMode: 'cover', margin: 5}} />}
    <TouchableOpacity style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15 }} onPress={() => uploadImage('photo')}>
        <Text style={{ color: '#000' }}>Upload Image</Text>
    </TouchableOpacity>


    {msg && <Text style={{  color: 'red', margin: 5, textAlign: 'center' }}>{msg}</Text>}

    <TouchableOpacity 
        style={{ margin: 5, padding: 5, backgroundColor: '#0078ff', width: '30%', borderRadius: 15, alignSelf: 'center' }}
        onPress={handleUpdate}
    >
        <Text style={{ color: "#fff", fontSize: 20, textAlign: 'center' }}>Update</Text>
    </TouchableOpacity>
  </ScrollView>)
}
