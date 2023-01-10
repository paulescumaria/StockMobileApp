import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { styles } from '../styles'
import { auth } from '../firebase'
import { UserContext } from '../services/UserContext'
import { useContext } from 'react/cjs/react.development'

const HomeScreen = () => {

const {user} = useContext(UserContext);

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.homeConta}> Name: {user?.name}</Text>
      <Text style={styles.homeText}> Email: {user?.email}</Text>
      {user?.isManager && 
            <>
              <Text style={styles.homeText}>Company: {user?.company}</Text>
            </>
          }
    </View>
  )
}

export default HomeScreen