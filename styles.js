import { startAfter } from "firebase/firestore";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  buttonSignOut: {
    backgroundColor: '#00c04b',
    width: '50%',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    signOut: {
      justifyContent:'flex-end',
      alignItems:'flex-end'
    }
  },
  buttonAddProduct: {
    backgroundColor: '#00c04b',
    width: '50%',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    margin: 5,
    // justifyContent:'flex-end',
    // alignItems:'flex-end'
  },
  buttonEnd: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36
  },
  buttonsView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  }

});