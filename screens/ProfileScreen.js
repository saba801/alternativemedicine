import React, { useEffect, useState } from 'react';
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

export default function ProfileScreen({ route, navigation }) {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [imageName, setImageName] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const { user } = route.params;

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(doc => {
        if (doc.data()) {
          setData(doc.data());
          setName(doc.data().name);
          setMobile(doc.data().mobile);
          if(doc.data().image && doc.data().image != ""){
            setImageName(doc.data().image);
          }
        }
      });
  }, []);

  const handleUpdateProfile = () => {
    setMsg("");
    if(name != "" && mobile != ""){
      firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          name: name,
          mobile: mobile,
          image: imageName ? imageName:""
        })
        .then(() => {
          if(password != "" && oldPassword != ""){
            const crd = auth.EmailAuthProvider.credential(data.email, oldPassword)
            auth()
            .currentUser
            .reauthenticateWithCredential(crd)
            .then(() => {
              auth()
              .currentUser
              .updatePassword(password)
              .then(() => {
                auth()
                .signOut()
                .then(() => {
                  //navigation.navigate("Login")
                })
                .catch(() => {
                  //
                })
              })
            })
          } else {
            setMsg("Updated successfuly!")
          }
        })
        .catch(err => {
          setMsg("Something went wrong...")
        })
    } else {
      setMsg("Enter all required feilds.")
    }
  }

  const uploadImage = async () => {
    const tmpName = Date.now()+'.jpg';
    const result = await launchImageLibrary({
        mediaType: 'photo',
    });
    
    const reference = storage().ref("images/"+tmpName);
    
    if(!result.didCancel && !result.errorCode){
        const task = reference.putFile(result.assets[0].originalPath);
        task.then(() => {
          setImageName(tmpName)
        })
        .catch(error => {
            console.log(error);
        })
    }
  }

  return <ScrollView style={{backgroundColor: '#fff'}}>
    {data && <View>
      <TouchableOpacity style={{ margin: 15, alignSelf: 'center' }} onPress={uploadImage}>
          <Image source={imageName ? {uri: "https://firebasestorage.googleapis.com/v0/b/alternativemedicine-6ea0c.appspot.com/o/images%2F"+imageName+"?alt=media"} : require('./assets/userprofileplaceholder.jpeg')} style={{ resizeMode: 'contain', borderRadius: 50, width: 150, height: 150, borderWidth: 1, borderColor: '#cccccc' }} />
      </TouchableOpacity>
      <TextInput 
        value={name} 
        onChangeText={setName}
        placeholder="Enter you name"
        style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15, }} 
      />
      <TextInput 
        value={mobile} 
        onChangeText={setMobile}
        placeholder="Enter you mobile"
        style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15, }} 
      />
      <TextInput 
        value={data.email} 
        placeholder="Email address"
        style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15, color: '#000' }} 
        readOnly={true}
      />
      <Text style={{ fontSize: 14, fontStyle: 'italic', color: '#111', textAlign: 'center' }}>Primary registered email address can be edited or changed.</Text>
      <TextInput 
        placeholder="Old Password" 
        style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15, width: '100%' }}
        onChangeText={setOldPassword} 
        secureTextEntry={true}
        value={oldPassword}
      />
      <TextInput 
        placeholder="New Password" 
        style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15, width: '100%' }}
        onChangeText={setPassword} 
        secureTextEntry={true}
        value={password}
      />
      <Text style={{ fontSize: 14, fontStyle: 'italic', color: '#111', textAlign: 'center' }}>Leave empty if you don't want to update your password.</Text>

      <Text style={{ color: 'red', margin: 5, fontSize: 18 }}>{msg}</Text>
      <TouchableOpacity
          style={{ margin: 5, padding: 5, backgroundColor: '#0078ff', width: '30%', borderRadius: 15, marginTop: 25 }}
          onPress={handleUpdateProfile}
      >
          <Text style={{ color: "#fff", fontSize: 20, textAlign: 'center' }}>Update</Text>
      </TouchableOpacity>

    </View>}
  </ScrollView>;
}
