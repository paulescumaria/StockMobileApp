import * as React from 'react';
import { DataTable, Button, Dialog, Portal, Provider, TextInput, IconButton  } from 'react-native-paper';
import { View, Text } from 'react-native'
import { useState, useEffect } from 'react';
import { styles } from '../styles'
import { ScrollView } from 'react-native-gesture-handler';
import { doc, setDoc, getDocs, getDoc, collection, firebase, updateDoc, firestore, deleteField, deleteDoc} from "firebase/firestore";
import { db } from '../firebase';


const ProductsList = () => {

}

export default ProductsList