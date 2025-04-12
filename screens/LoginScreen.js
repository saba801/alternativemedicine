//import
import {useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const siginIn = () => {
    if (email !== '' && password !== '') {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(res => {
          firestore()
            .collection('users')
            .doc(res.user.uid)
            .get()
            .then(response => {
              if (response.exists && response.data()) {
                navigation.navigate('Launcher');
              } else {
                auth()
                  .signOut();
              }
            })
            .catch(error => {
              console.log(error)
              auth().signOut();
            });
        })
        .catch(err => {
          console.log(err)
          setMessage('Wrong email or password.');
        });
    } else {
      setMessage('Please enter you email and password.');
    }
  }

  //view
  return (<ScrollView style={{backgroundColor: '#ffffff', alignContent: 'center'}}>
      <View style={{margin: 15, marginTop: '30%', alignItems: 'center'}}>
        <Image
          source={require('./assets/amlogo.png')}
          style={{width: 100, height: 100, resizeMode: 'contain'}}
        />
        <Text
          style={{
            fontSize: 20,
            color: '#000',
            margin: 15,
            textAlign: 'center',
          }}>
          Sign in to your account
        </Text>
        <TextInput
          placeholder="E-mail"
          style={{
            borderWidth: 1,
            borderColor: '#cccccc',
            borderRadius: 5,
            margin: 5,
            padding: 15,
            width: '100%',
          }}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          style={{
            borderWidth: 1,
            borderColor: '#cccccc',
            borderRadius: 5,
            margin: 5,
            padding: 15,
            width: '100%',
          }}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <Text style={{color: 'red', margin: 5, fontSize: 18}}>{message}</Text>

        <TouchableOpacity
          style={{
            margin: 5,
            padding: 5,
            backgroundColor: '#0078ff',
            width: '30%',
            borderRadius: 15,
          }}
          onPress={siginIn}>
          <Text style={{color: '#fff', fontSize: 20, textAlign: 'center'}}>
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{margin: 5, padding: 5, borderRadius: 15, marginTop: 25}}
          onPress={() => navigation.navigate('Register')}>
          <Text
            style={{
              color: '#000',
              fontSize: 16,
              textAlign: 'center',
              borderBottomColor: '#000',
              borderBottomWidth: 1,
            }}
          >
            Don't have an account? Sign Up!
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>);
};

export default LoginScreen;
