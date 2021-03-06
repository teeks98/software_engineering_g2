import React, {useState} from 'react';
import * as Crypto from 'expo-crypto';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import {withNavigation} from 'react-navigation';
import { useStateValue  } from '../../StateContext.js';

export default withNavigation(function Form({navigation, ...props}) {
    const BACKEND_ENDPOINT = 'http://34.89.126.252';
    const [{ userDetails }, dispatch] = useStateValue();
    const [username, setUsername] = useState({username: ''});
    const [password, setPassword] = useState({password: ''});

    const wrongLoginAlert = () => {
        alert('Wrong login credentials');
    };
    const accountCreatedAlert = () => {
        alert('Your account has been created, go to login');
    };
    const usernameTakenAlert = () => {
        alert('This username has been taken, please choose another one');
    };

    const userAuth = async () => {
        const digest = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            password.toString(),
        );
        console.log(props.type);
        if (props.type === 'LOGIN') {
            try {
                return await fetch(`${BACKEND_ENDPOINT}/login`, {
                    method: 'POST',
                    body: JSON.stringify({
                        username,
                        hashedPassword: digest,
                    }),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        //console.log(responseJson.response);
                        if (responseJson.response === "True") {
                            navigation.navigate('Dashboard');
                            dispatch({
                                type: 'addUsername',
                                params: { username: username}
                            })
                        } else if (responseJson.response === "False") {
                            //some code that shows the user that they failed login
                            wrongLoginAlert()
                        }
                    });
            } catch (e) {
                console.log(e);
            }
        } else if (props.type === 'SIGN UP') {
            try {
                console.log('Signing up');
                return await fetch(`${BACKEND_ENDPOINT}/signup`, {
                    method: 'POST',
                    body: JSON.stringify({
                        username,
                        hashedPassword: digest,
                    }),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson);
                        if(responseJson.response === "False"){
                            //some code showing user has created an account and goes to login page
                            accountCreatedAlert()

                        }
                        else if(responseJson.response === "True"){
                            //some code showing the user that username has been taken and to choose another one
                            usernameTakenAlert()
                        }
                    });
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputBox}>
                <TextInput
                    style={{color: '#ffffff'}}
                    placeholder="Username"
                    placeholderTextColor="#ffffff"
                    onChangeText={setUsername}
                />
            </View>
            <View style={styles.inputBox}>
                <TextInput
                    style={{color: '#ffffff'}}
                    placeholder="Password"
                    placeholderTextColor="#ffffff"
                    secureTextEntry
                    onChangeText={setPassword}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={userAuth}>
                <Text style={styles.buttonText}>{props.type}</Text>
            </TouchableOpacity>
        </View>
    );
});
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        // justifyContent: 'center'
    },
    inputBox: {
        width: 300,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 25,
        color: '#ffffff',
        paddingHorizontal: 16,
        marginVertical: 8,
        paddingVertical: 8,
        fontSize: 16,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
    },
    button: {
        width: 300,
        backgroundColor: '#1c313a',
        borderRadius: 25,
        alignItems: 'center',
        paddingVertical: 12,
    },
});
