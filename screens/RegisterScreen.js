//import
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { serverTimestamp } from "@react-native-firebase/firestore";

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [username, setUsername] = useState("");
    const [mobile, setMobile] = useState("");
    const [message, setMessage] = useState("");

    const siginIn = () => {
        let success = true;

        if(email === "" || password === ""){
            setMessage("Please enter you email and password.");
            success = false;
        }

        if(!email.includes('@')){
            setMessage("Please enter a valid email.");
            success = false;
        }

        if(mobile.length < 7){
            setMessage("Please enter a valid mobile number.");
            success = false;
        }

        if(password != repeatPassword){
            setMessage("Passwords are not matched.");
            success = false;
        }

        if(password.length < 6){
            setMessage("Password is too short.");
            success = false;
        }

        // if everthing is valid
        if(success == true){
            // create user
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then((response) => {                    
                    // profile save 
                    firestore()
                    .collection('users')
                    .doc(response.user.uid)
                    .set({
                        name: username,
                        mobile: mobile,
                        email: email,
                        userType: 'user',
                        register_date: serverTimestamp()
                    })
                    .then((res) => {                        
                        // on success go to home
                        navigation.navigate("Home");
                    })
                    .catch(err => {
                        // on error show message
                        setMessage("Something went wrong, try again.");
                    })
                })
                .catch(error => {                    
                    if (error.code === 'auth/email-already-in-use') {
                        setMessage('That email address is already in use, try login!');
                    } else {
                        setMessage("Something went wrong.");
                    }
                });
        }
    }

    return (<ScrollView style={{ backgroundColor: '#ffffff', alignContent: 'center', }}>
        <View style={{ margin: 15, marginTop: '30%', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, color: '#000', margin: 15, textAlign: 'center' }}>Create New Account</Text>
            <TextInput
                placeholder="Username"
                style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15, width: '100%' }}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Mobile"
                style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15, width: '100%' }}
                onChangeText={setMobile}
            />
            <TextInput 
                placeholder="E-mail"
                style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15, width: '100%' }}
                onChangeText={setEmail}
            />
            <TextInput 
                placeholder="Password" 
                style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15, width: '100%' }}
                onChangeText={setPassword} 
                secureTextEntry={true}
            />
            <TextInput 
                placeholder="Repeat Password" 
                style={{ borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, margin: 5, padding: 15, width: '100%' }}
                onChangeText={setRepeatPassword} 
                secureTextEntry={true}
            />

            <Text style={{ color: 'red', margin: 5, fontSize: 18 }}>{message}</Text>

            <TouchableOpacity 
                style={{ margin: 5, padding: 5, backgroundColor: '#0078ff', width: '30%', borderRadius: 15 }}
                onPress={siginIn}
            >
                <Text style={{ color: "#fff", fontSize: 20, textAlign: 'center' }}>Sign Up</Text>
            </TouchableOpacity>
        </View>


    </ScrollView>)
}

export default RegisterScreen;