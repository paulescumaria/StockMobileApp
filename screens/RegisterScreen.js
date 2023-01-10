import React, { useContext, useState } from 'react';
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import { auth } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import { UserContext } from '../services/UserContext';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('')
    const [company, setCompany] = useState('')
    const { setUser } = useContext(UserContext);

    const handleSignUp = async () => {
        const response = await auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Registered in with:', user.email);

            setDoc(doc(db, "users", auth.currentUser.uid), {
                name: name,
                email: email,
                company: company,
                isManager: true}).then(() => {
                console.log('user data save')
                }).catch((error) => {
                    console.log(error);
                })     
                
             setUser({
                name: name,
                email: email,
                company: company,
                isManager: true
            })
        })
        .catch(error => alert(error.message))
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.inputContainer}>
                <TextInput placeholder='Name' value={name} onChangeText={text => {setName(text)}} style={styles.input}></TextInput>
                <TextInput placeholder='Company' value={company} onChangeText={text => {setCompany(text)}} style={styles.input}></TextInput> 
                <TextInput placeholder='Email' value={email} onChangeText={text => {setEmail(text)}} style={styles.input}></TextInput>
                <TextInput placeholder='Password' value={password} onChangeText={text => {setPassword(text)}} style={styles.input} secureTextEntry></TextInput>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleSignUp} style={[styles.button, styles.buttonOutline]}>
                    <Text style={styles.buttonOutlineText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen