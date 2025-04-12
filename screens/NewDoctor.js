import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore, {serverTimestamp} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';

export default function NewDoctor({navigation}) {
  const [searchTxt, setSearchTxt] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [experience, setExperience] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [imageName, setImageName] = useState('');
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState(null);

  const handleSearch = () => {
    firestore()
      .collection('users')
      .where('mobile', '==', searchTxt)
      .get()
      .then(response => {
        if (response.docs.length != 0) {
          setData({
            id: response.docs[0].id,
            ...response.docs[0].data(),
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleMembership = () => {
    firestore()
      .collection('users')
      .doc(data.id)
      .update({
        userType: 'doctor',
      })
      .then(() => {
        firestore()
        .collection('doctors')
        .doc(data.id)
        .set({
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
          setMsg("Error while try to add new doctor..")
        });
      })
      .catch(() => {
        setMsg("Error while try to add new doctor..")
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
          setMsg("Image upload success!");
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  return (
    <ScrollView style={{backgroundColor: '#ffffff'}}>
      <View style={{flexDirection: 'row'}}>
        <TextInput
          value={searchTxt}
          onChangeText={setSearchTxt}
          placeholder="Search by drug name.."
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 5,
            margin: 5,
            width: '65%',
            borderRadius: 15,
            paddingHorizontal: 15,
          }}
        />
        <TouchableOpacity
          style={{
            margin: 5,
            padding: 5,
            backgroundColor: '#0078ff',
            width: '30%',
            borderRadius: 15,
          }}
          onPress={handleSearch}>
          <Text style={{color: '#fff', fontSize: 20, textAlign: 'center'}}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {data && (
        <View
          style={{
            padding: 15,
          }}>
          <Text
            style={{
              color: '#000',
              fontSize: 16,
              fontWeight: 'bold',
              padding: 4,
            }}>
            Name: {data.name}
          </Text>
          <Text
            style={{
              color: '#000',
              fontSize: 16,
              fontWeight: 'bold',
              padding: 4,
            }}>
            E-mail: {data.email}
          </Text>
          <Text
            style={{
              color: '#000',
              fontSize: 16,
              fontWeight: 'bold',
              padding: 4,
            }}>
            Mobile: {data.mobile}
          </Text>
          <Text
            style={{
              color: '#000',
              fontSize: 16,
              fontWeight: 'bold',
              padding: 4,
            }}>
            Date of registration:{' '}
            {data.register_date.toDate().toLocaleDateString('en-GB')}
          </Text>
          <Text
            style={{
              color: '#000',
              fontSize: 16,
              fontWeight: 'bold',
              padding: 4,
            }}>
            User Type: {data.userType}
          </Text>
          {data.userType == 'doctor' && (
            <Text
              style={{
                color: '#000',
                fontSize: 16,
                fontWeight: 'bold',
                padding: 4,
              }}>
              This user is already in the doctors list..
            </Text>
          )}
          {data.userType == 'user' && (
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#000',
                  marginVertical: 15,
                }}>
                Doctor Public Profile Information:
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
                onChangeText={value => setDesc(value)}
              />

              <Text style={{fontSize: 16, color: '#000', margin: 15}}>
                experience
              </Text>
              <TextInput
                placeholder="Experience in years"
                style={{
                  borderWidth: 1,
                  borderColor: '#cccccc',
                  borderRadius: 5,
                  margin: 5,
                  padding: 15,
                }}
                onChangeText={value => setExperience(value)}
              />

              <Text style={{fontSize: 16, color: '#000', margin: 15}}>
                Specialty
              </Text>
              <TextInput
                placeholder="Specialty"
                style={{
                  borderWidth: 1,
                  borderColor: '#cccccc',
                  borderRadius: 5,
                  margin: 5,
                  padding: 15,
                }}
                onChangeText={value => setSpecialty(value)}
              />

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
                onPress={() => handleMembership(data.id)}>
                <Text style={{color: '#fff', textAlign: 'center'}}>
                  Upgrade Membership
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
