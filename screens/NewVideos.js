import React, { useEffect, useState } from 'react';
import { FlatList, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import firestore, { serverTimestamp } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

export default function NewVideos({ navigation }) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [sectionName, setSectionName] = useState("Select a section");
    const [sectionId, setSectionId] = useState("");
    const [showSections, setShowSections] = useState(false);
    const [imageName, setImageName] = useState("");
    const [videoFileName, setVideoFileName] = useState("")
    const [sectionsList, setSectionsList] = useState(null);
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        firestore()
        .collection("video-section")
        .get()
        .then(response => {
            let videosSectionsList = [];
            
            response.forEach(doc => {
                videosSectionsList.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            
            setSectionsList(videosSectionsList)
        })
    }, [])

    const selectSeaction = (name, itemId) => {
        setSectionName(name);
        setSectionId(itemId);
        setShowSections(false)
    }

    const uploadImage = async (mediaType) => {
        const tmpName = Date.now().toString()+ (mediaType == 'photo'? '.jpg':'.mp4');
        const tmpFolderName = mediaType == 'photo'?'images':'videos';
        const result = await launchImageLibrary({
            mediaType: mediaType,
        });
        
        const reference = storage().ref(tmpFolderName+"/"+tmpName);
        
        if(!result.didCancel && !result.errorCode){
            const task = reference.putFile(result.assets[0].originalPath);
            task.then(() => {
                if(mediaType == 'photo'){
                    setImageName(tmpName);
                    setMsg("Image thumbnail uploaded successfully.");
                } else {
                    setVideoFileName(tmpName);
                    setMsg("Video uploaded successfully.");
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    }

    const saveVideo = () => {
        if(title !== '' && desc !== '' && imageName !== ''){
            firestore()
            .collection("videos")
            .add({
                title: title,
                description: desc,
                file: videoFileName,
                thumbnail: imageName,
                section: sectionId,
                creation_date:  serverTimestamp()
            })
            .then(() => {                
                navigation.navigate("Manage Videos List")
            })
            .catch(() => {
                setMsg("Sorry something went wrong...");
            })
        } else {
            setMsg("Please enter all the required feilds..");
        }
    }

  return (<ScrollView style={{ backgroundColor: '#fff' }}>

    <Modal animationType="fade" transparent={true} visible={showSections}>
        <View style={{ 
            backgroundColor: '#ffffff',
            alignSelf: 'center',
            width: '75%',
            height: 400,
            top: 155,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 15
          }}>
            <Text style={{ textAlign: 'center', color: '#000', margin: 5, fontSize: 18 }}>Select a section</Text>
            <FlatList
                data={sectionsList}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TouchableOpacity style={{ 
                    padding: 15,
                    borderBottomColor: '#ccc',
                    borderBottomWidth: 1,
                }}
                
                onPress={() => selectSeaction(item.title, item.id)}>
                    <Text style={{ color: '#000' }}>{item.title}</Text>
                </TouchableOpacity>}
            />
            <TouchableOpacity style={{ padding: 15, margin: 5, alignSelf: 'center' }} onPress={() => setShowSections(false)}>
                <Text style={{ color: '#000' }}>Colse</Text>
            </TouchableOpacity>
        </View>
    </Modal>
    <Text style={{ fontSize: 16, color: '#000', margin: 15, }}>Title</Text>
    <TextInput placeholder='Video Title' style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15 }} onChangeText={(value) => setTitle(value)} />

    <Text style={{ fontSize: 16, color: '#000', margin: 15, }}>Description</Text>
    <TextInput placeholder='Video Description' style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15 }} onChangeText={(value) => setDesc(value)} multiline={true} />

    <Text style={{ fontSize: 16, color: '#000', margin: 15, }}>Video Section</Text>
    <TouchableOpacity placeholder='Video Description' style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15 }} onPress={() => setShowSections(true)}><Text style={{ color: '#000' }}>{sectionName}</Text></TouchableOpacity>

    <TouchableOpacity style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15 }} onPress={() => uploadImage('photo')}>
        <Text style={{ color: '#000' }}>Upload Video Image Thumbnail</Text>
    </TouchableOpacity>

    <TouchableOpacity style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15 }} onPress={() => uploadImage('video')}>
        <Text style={{ color: '#000' }}>Upload Video</Text>
    </TouchableOpacity>

    {msg && <Text style={{  color: 'red', margin: 5, textAlign: 'center' }}>{msg}</Text>}

    <TouchableOpacity 
        style={{ margin: 5, padding: 5, backgroundColor: '#0078ff', width: '30%', borderRadius: 15, alignSelf: 'center' }}
        onPress={saveVideo}
    >
        <Text style={{ color: "#fff", fontSize: 20, textAlign: 'center' }}>Save</Text>
    </TouchableOpacity>
  </ScrollView>)
}
