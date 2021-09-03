import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/core';

import firebase from '../../config/Firebase';

const SignIn = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const database = firebase.firestore();

    const onChangeEmail = (text) => {
        setEmail(text);
    }

    const onChangePassword = (text) => {
        setPassword(text);
    }

    const doSignUp = () => {

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                let user = userCredential.user;

                navigation.navigate('HomeScreen', {
                    userId: user.uid
                })

            })
            .catch((error) => {
                //Alert.alert('Atenção', 'Não foi possível criar seu usuário, tente novamente mais tarde!');
                alert(error)
            });
    }


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

            <Text style={styles.title}>Faça seu cadastro</Text>
            <Text style={styles.subTitle}>É muito rápido, leva menos de 1 minuto.</Text>

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
                onPress={doSignUp}
                style={styles.button}
            >
                <Text style={styles.textButton}>Cadastrar</Text>
            </TouchableOpacity>

            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 5
            }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SignIn')}
                >
                    <Text style={{ fontSize: 12, color: "#BDBDBD" }}>Já tem cadastro, faça login aqui !</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.viewImage}>
                <Image
                    style={{ width: 209, height: 124, resizeMode: 'contain' }}
                    source={
                        require("../../images/cadastro.png")
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
