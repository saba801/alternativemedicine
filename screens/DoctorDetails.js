import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import firestore, { serverTimestamp } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function DoctorDetails({ route, navigation }) {
    const [data, setData] = useState(null);
    const [msg, setMsg] = useState("");
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const { doctorId } = route.params;

    useEffect(() => {
        firestore()
        .collection("doctors")
        .doc(doctorId)
        .get()
        .then((res) => {
            setData(res.data())
        })
        .catch(error => {
            //console.log(error);
        })
    }, [])

    // invoke useEffect on startup 
    useEffect(() => {
        auth().onAuthStateChanged((userData) => {            
            if(userData){
                setUser(userData.uid)
                
                firestore()
                    .collection("users")
                    .doc(userData.uid)
                    .get()
                    .then(res => {                        
                        setUsername(res.data().name)
                    })
                    .catch(err => {
                        //console.log('err');
                    });
            }
        });
    }, []);

    const sendMsg = () => {
        firestore()
        .collection("doctors_messages")
        .add({
            doctor_id: doctorId,
            doctor_name: data.name,
            message: msg,
            message_date: serverTimestamp(),
            userType: "user",
            user_id: user,
            username: username
        })
        .then(res => {
            navigation.navigate("Messages")
        })
        .catch(err => {
            console.log(err);
        })
    }

  return (<ScrollView style={{ backgroundColor: '#fff' }}>
    {data && <View style={{ padding: 5 }}>
        <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/alternativemedicine-6ea0c.appspot.com/o/images%2F"+data.image+"?alt=media" }} style={{
            resizeMode: 'cover',
            width: '100%',
            height: 250
        }} />
        <Text style={{color: '#000', fontSize: 20, margin: 5, fontWeight: 'bold'}}>{data.name}</Text>
        <Text style={{color: '#000', fontSize: 18, margin: 5}}>Specialty: {data.specialty}</Text>
        <Text style={{color: '#000', fontSize: 18, margin: 5}}>Experience: {data.experience} Years</Text>
        <Text style={{color: '#000', fontSize: 18, margin: 5}}>{data.description}</Text>
        <Text style={{color: '#000', fontSize: 18, margin: 5}}>Send message to this doctor:</Text>
        <TextInput 
            onChangeText={setMsg} 
            value={msg} 
            style={{
                color:'#000',
                borderColor: '#ccc',
                borderWidth: 1,
                margin: 5,
                borderRadius: 15
            }}
            multiline={true}
        />
        <TouchableOpacity
            style={{ margin: 5, padding: 5, backgroundColor: '#0078ff', width: '30%', borderRadius: 15 }}
            onPress={sendMsg}
        >
            <Text style={{ color: "#fff", fontSize: 20, textAlign: 'center' }}>Send</Text>
        </TouchableOpacity>
    </View>}
  </ScrollView>)
}
