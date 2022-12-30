import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/core'


const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation()

   useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
            navigation.replace("Home")
        }
        })

      return unsubscribe
    }, [])

    const handleSignUp = () => {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Registered in with:', user.email);
        })
        .catch(error => alert(error.message))
    }

    const handleLogin = () => {
        auth
        .signInWithEmailAndPassword(email,password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Logged in with:', user.email);
        })
        .catch(error => alert(error.message))
    }

    return (
        <KeyboardAvoidingView style={loginStyle.container} behavior="padding">
            <View style={loginStyle.inputContainer}>
                <TextInput placeholder='Email' value={email} onChangeText={text => {setEmail(text)}} style={loginStyle.input}></TextInput>
                <TextInput placeholder='Password' value={password} onChangeText={text => {setPassword(text)}} style={loginStyle.input} secureTextEntry></TextInput>
            </View>
            <View style={loginStyle.buttonContainer}>
                <TouchableOpacity onPress={handleLogin} style={loginStyle.button}>
                    <Text style={loginStyle.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignUp} style={[loginStyle.button, loginStyle.buttonOutline]}>
                    <Text style={loginStyle.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

export const loginStyle = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '75%',
    marginTop: 100
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 50,
    marginTop: 5,
  },
  buttonContainer: {
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#00c04b',
    width: '100%',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#00c04b',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#00c04b',
    fontWeight: '700',
    fontSize: 16,
  },
});