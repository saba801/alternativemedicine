import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore, {serverTimestamp} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';

export default function EditDoctor({navigation, route}) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [experience, setExperience] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [imageName, setImageName] = useState('');
  const [msg, setMsg] = useState(null);
  const {doctor_id} = route.params;

  useEffect(() => {
    firestore()
      .collection('doctors')
      .doc(doctor_id)
      .get()
      .then(response => {
        if (response.data()) {
          setTitle(response.data().name);
          setDesc(response.data().description);
          setExperience(String(response.data().experience));
          setSpecialty(response.data().specialty);
          setImageName(response.data().image);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleMembership = () => {
    firestore()
      .collection('doctors')
      .doc(doctor_id)
      .update({
        name: title,
        specialty: specialty,
        description: desc,
        experience: experience,
        image: imageName,
        creation_date: serverTimestamp(),
      })
      .then(() => {
        navigation.navigate('Doctors List');
      })
      .catch(() => {
        setMsg('Error while try to update info..');
      });
  };

  const uploadImage = async () => {
    const tmpName = Date.now().toString() + '.jpg';
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });

    const reference = storage().ref('images/' + tmpName);

    if (!result.didCancel && !result.errorCode) {
      const task = reference.putFile(result.assets[0].originalPath);
      task
        .then(() => {
          setImageName(tmpName);
          setMsg('Image upload success!');
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  return (
    <ScrollView style={{backgroundColor: '#ffffff'}}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#000',
          margin: 15,
        }}>
        Edit Doctor Public Profile Information:
      </Text>

      <Text style={{fontSize: 16, color: '#000', margin: 15}}>
        Dr. Full Name
      </Text>
      <TextInput
        placeholder="Video Title"
        style={{
          borderWidth: 1,
          borderColor: '#cccccc',
          borderRadius: 5,
          margin: 5,
          padding: 15,
        }}
        value={title}
        onChangeText={value => setTitle(value)}
      />

      <Text style={{fontSize: 16, color: '#000', margin: 15}}>
        Profile Description
      </Text>
      <TextInput
        placeholder="Profile Description"
        style={{
          borderWidth: 1,
          borderColor: '#cccccc',
          borderRadius: 5,
          margin: 5,
          padding: 15,
        }}
        value={desc}
        onChangeText={value => setDesc(value)}
      />

      <Text style={{fontSize: 16, color: '#000', margin: 15}}>experience</Text>
      <TextInput
        placeholder="Experience in years"
        style={{
          borderWidth: 1,
          borderColor: '#cccccc',
          borderRadius: 5,
          margin: 5,
          padding: 15,
        }}
        value={experience}
        onChangeText={value => setExperience(value)}
      />

      <Text style={{fontSize: 16, color: '#000', margin: 15}}>Specialty</Text>
      <TextInput
        placeholder="Specialty"
        style={{
          borderWidth: 1,
          borderColor: '#cccccc',
          borderRadius: 5,
          margin: 5,
          padding: 15,
        }}
        value={specialty}
        onChangeText={value => setSpecialty(value)}
      />

      {imageName && imageName != '' && (
        <Image
          source={{
            uri:
              'https://firebasestorage.googleapis.com/v0/b/alternativemedicine-6ea0c.appspot.com/o/images%2F' +
              imageName +
              '?alt=media',
          }}
          style={{
            resizeMode: 'cover',
            width: 150,
            height: 150,
            borderRadius: 15,
            alignSelf: 'center',
          }}
        />
      )}

      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: '#cccccc',
          borderRadius: 5,
          margin: 5,
          padding: 15,
        }}
        onPress={() => uploadImage('photo')}>
        <Text style={{color: '#000'}}>Upload Profile Image</Text>
      </TouchableOpacity>

      {msg && (
        <Text style={{color: 'red', margin: 5, textAlign: 'center'}}>
          {msg}
        </Text>
      )}

      <TouchableOpacity
        style={{
          margin: 15,
          backgroundColor: 'green',
          padding: 15,
          borderRadius: 5,
        }}
        onPress={handleMembership}>
        <Text style={{color: '#fff', textAlign: 'center'}}>Update</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
