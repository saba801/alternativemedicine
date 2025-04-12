//import
import {useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const FeedbackScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  const handleSend = () => {
    let success = true;

    if (message === '' || username === '') {
      setMsg('Please enter required feilds.');
      success = false;
    }

    if (!email.includes('@')) {
      setMsg('Please enter a valid email.');
      success = false;
    }

    if (mobile.length < 7) {
      setMsg('Please enter a valid mobile number.');
      success = false;
    }

    if (success == true) {
      fetch('https://api.mailjet.com/v3.1/send', {
        method: 'POST',
        body: JSON.stringify({
          Messages: [
            {
              From: {
                Email: 'sabaalshabibi917@gmail.com',
                Name: username,
              },
              To: [
                {
                  Email: 'sabaalshabibi917@gmail.com',
                  Name: 'Altawazun Alsihiyu',
                },
              ],
              Subject: "New message from Altawazun Alsihiyu Mobile App",
              TextPart: `${message} \n User Full Name: ${username} \n User E-mail: ${email} \n User Mobile Number: ${mobile}`,
            },
          ],
        }),
        headers: new Headers({
          Authorization:
            'Basic ' +
            btoa(
              'e93a01d59bc45d15aec379fa7f8897c8:dc0cc17c18e133a7a199712f3650b5c5',
            ),
          'Content-Type': 'application/json',
        }),
      })
        .then(res => res.json())
        .then(response => {
          navigation.navigate('Home');
        })
        .catch(err => {
          setMsg('Error while sending feedback...');
        });
    }
  };

  return (
    <ScrollView style={{backgroundColor: '#ffffff', alignContent: 'center'}}>
      <View style={{margin: 15, marginTop: '30%', alignItems: 'center'}}>
        <Text
          style={{
            fontSize: 20,
            color: '#000',
            margin: 15,
            textAlign: 'center',
          }}>
          Send Users Feedback
        </Text>
        <TextInput
          placeholder="Fulll Name"
          style={{
            borderWidth: 1,
            borderColor: '#cccccc',
            borderRadius: 5,
            margin: 5,
            padding: 15,
            width: '100%',
          }}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Mobile"
          style={{
            borderWidth: 1,
            borderColor: '#cccccc',
            borderRadius: 5,
            margin: 5,
            padding: 15,
            width: '100%',
          }}
          onChangeText={setMobile}
        />
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
          placeholder="Feechback Message"
          style={{
            borderWidth: 1,
            borderColor: '#cccccc',
            borderRadius: 5,
            margin: 5,
            padding: 15,
            width: '100%',
          }}
          value={message}
          onChangeText={setMessage}
          multiline={true}
        />

        <Text style={{color: 'red', margin: 5, fontSize: 18}}>{msg}</Text>

        <TouchableOpacity
          style={{
            margin: 5,
            padding: 5,
            backgroundColor: '#0078ff',
            width: '30%',
            borderRadius: 15,
          }}
          onPress={handleSend}>
          <Text style={{color: '#fff', fontSize: 20, textAlign: 'center'}}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FeedbackScreen;
