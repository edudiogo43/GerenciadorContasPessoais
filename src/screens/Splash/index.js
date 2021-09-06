import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native';

const index = () => {

    const navigation = useNavigation();


    useEffect(() => {

        setTimeout(() => {
            navigation.navigate("SignIn");
        }, 1000);


    }, [])

    return (
        <View style={styles.container}>

            <View style={styles.viewImage}>
                <Image
                    style={{ width: 209, height: 124, resizeMode: 'contain' }}
                    source={
                        require("../../images/splashbg.png")
                    }
                />
            </View>

            <ActivityIndicator
                style={{ marginTop: 40 }}
                size="large"
                color="#FFF"
            />

        </View>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9B51E0'
    }
})
