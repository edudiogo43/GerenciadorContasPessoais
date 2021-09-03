import React, { useState, useEffect } from 'react'
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import { useNavigation } from '@react-navigation/core';

import firebase from '../../config/Firebase';

const SignIn = (props) => {
    const navigation = useNavigation();

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const database = firebase.firestore();

    // firebase.auth().signOut().then(() => {
    //     navigation.navigate('SignIn');
    // }).catch((error) => {
    //     console.log('Logout: ' + error);
    // });

    useEffect(() => {
        // firebase.auth().onAuthStateChanged((user) => {
        //     if (user) {
        //         console.log(user.uid);
        //         navigation.navigate('HomeScreen', {
        //             "userId": user.uid
        //         })
        //     }
        // })

        navigation.navigate('HomeScreen');
    }, [])


    const onChangeEmail = (text) => {
        setEmail(text);
    }

    const onChangePassword = (text) => {
        setPassword(text);
    }

    const doSignIn = () => {

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                let user = userCredential.user;

                navigation.navigate('HomeScreen', {
                    userId: user.uid
                })

            })
            .catch((error) => {
                Alert.alert('Atenção', 'Não foi possível efetuar seu login no momento, tente novamente mais tarde!');
            });

    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

            <Text style={styles.title}>Bem vindo de Volta !</Text>
            <Text style={styles.subTitle}>Seu organizador financeiro pessoal.</Text>

            <View style={styles.textContainer}>
                <Text>E-mail</Text>
                <TextInput
                    style={styles.textField}
                    placeholder="Digite seu email"
                    placeholderTextColor="#BDBDBD"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
            </View>

            <View style={styles.textContainer}>
                <Text>Senha</Text>
                <TextInput
                    style={styles.textField}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#BDBDBD"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
            </View>

            <TouchableOpacity
                onPress={doSignIn}
                style={styles.button}
            >
                <Text style={styles.textButton}>Entrar</Text>
            </TouchableOpacity>

            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 5
            }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SignUp')}
                >
                    <Text style={{ fontSize: 12, color: "#BDBDBD" }}>Ainda não tem cadastro, registre aqui !</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.viewImage}>
                <Image
                    style={{ width: 209, height: 124, resizeMode: 'contain' }}
                    source={
                        require("../../images/login.png")
                    }
                />
            </View>

        </KeyboardAvoidingView>
    )
}

export default SignIn

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#9B51E0',
        top: -50,
    },
    subTitle: {
        fontSize: 16,
        color: '#BDBDBD',
        top: -50,
    },
    textContainer: {
        flexDirection: 'column',
    },
    textField: {
        width: '100%',
        height: 42,
        backgroundColor: '#F2F2F2',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        width: '100%',
        height: 59,
        backgroundColor: '#9B51E0',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    textButton: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    viewImage: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    }
})
