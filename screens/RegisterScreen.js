import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import { auth } from '../firebase';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Registered in with:', user.email);
        })
        .catch(error => alert(error.message))
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.inputContainer}>
                <TextInput placeholder='Email' value={email} onChangeText={text => {setEmail(text)}} style={styles.input}></TextInput>
                <TextInput placeholder='Password' value={password} onChangeText={text => {setPassword(text)}} style={styles.input} secureTextEntry></TextInput>
            </View>
            <TouchableOpacity onPress={handleSignUp} style={[styles.button, styles.buttonOutline]}>
                    <Text style={styles.buttonOutlineText}>Sign Up</Text>
                </TouchableOpacity>
        </KeyboardAvoidingView>
    )


}

export default RegisterScreen