import { Link } from 'expo-router';
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container} >
      

        <Text>Home Screen</Text>
        <Link href ="/task" style={styles.button}>
            Go to Tasks Page
        </Link>

    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#25292e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button:{
        fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
    }
})
