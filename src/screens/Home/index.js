import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'

import { Picker } from '@react-native-picker/picker';

import { ListItem, Avatar, Button, Icon } from 'react-native-elements'

import { useNavigation } from '@react-navigation/core';

import firebase from '../../config/Firebase';
import { Header } from 'react-native-elements/dist/header/Header';
import { SafeAreaView } from 'react-native';


const Home = ({ navigation, route }) => {

    //const navigation = useNavigation();
    const [contas, setContas] = useState([]);

    const [pago, setPago] = useState(0);
    const [aberto, setAberto] = useState(0)

    const userId = route.params?.userId;
    //console.log(userId);
    const [selectedStatus, setSelectedStatus] = useState(false);

    const database = firebase.firestore();

    const forceReload = route.params?.forceReload;
    if (forceReload)
        reloadBills();

    const onchange = (text) => {
        setSelectedStatus(text);
        reloadBills();
    }

    const doLogout = () => {
        firebase.auth().signOut().then(() => {
            navigation.navigate('SignIn');
        }).catch((error) => {
            console.log('Logout: ' + error);
        });
    }

    useEffect(() => {

        reloadBills();

    }, [])

    const deleteItem = (id) => {
        database.collection("Tasks").doc(id).delete();
        reloadBills();
    }

    const payItem = (id, status) => {
        database.collection("Tasks").doc(id).update({
            "status": status ? false : true
        })
        reloadBills();
    }


    const reloadBills = () => {

        let abertos = 0;
        let pagos = 0;

        database.collection("Tasks").where("status", "==", selectedStatus)
            .get()
            .then((querySnapshot) => {
                //onSnapshot((query) => {
                //database.collection(userId).onSnapshot((query) => {
                const list = [];

                querySnapshot.forEach((doc) => {

                    if (doc.data().status === true)
                        pagos = pagos + parseFloat(doc.data().valor);

                    if (doc.data().status === false)
                        abertos = abertos + parseFloat(doc.data().valor);

                    setPago(pagos);
                    setAberto(abertos);

                    list.push({ ...doc.data(), id: doc.id })
                })
                setContas(list);
            })

    }

    return (
        <SafeAreaView style={styles.container}>

            <Header
                rightComponent={
                    <TouchableOpacity
                        onPress={() => doLogout()}
                    >
                        <Icon name="logout" color='#9B51E0' />
                    </TouchableOpacity>
                }
                centerComponent={{ text: '', style: {} }}
                centerComponent={
                    <View style={{ backgroundColor: 'white', width: '150%', padding: 10, justifyContent: 'flex-start' }}>
                        <Picker
                            selectedValue={selectedStatus}
                            style={{ width: 250 }}
                            onValueChange={(itemValue, itemIndex) =>
                                onchange(itemValue)
                            }>
                            <Picker.Item label="Filtrar por Status" value={false} />
                            <Picker.Item label=" - Contas Pagas" value={true} />
                            <Picker.Item label=" - Contas em Aberto" value={false} />
                        </Picker>

                        <View style={{ marginBottom: 10 }} />
                        <View>
                            <Text style={{ fontWeight: 'bold' }}>Despesas Pagas <Text style={{ color: '#9B51E0' }}>R$ {pago}</Text></Text>
                            <Text style={{ fontWeight: 'bold' }}>Em aberto <Text style={{ color: '#EB5757' }}>R$ {aberto}</Text></Text>
                        </View>
                    </View>

                }
            />

            <FlatList
                showsVerticalScrollIndicator={false}
                data={contas}
                renderItem={({ item }) => {
                    return (

                        <ListItem.Swipeable bottomDivider

                            leftContent={
                                <Button
                                    onPress={() => payItem(item.id, item.status)}
                                    title={item.status === false ? "Quitar" : "Desfazer"}
                                    icon={{ name: 'info', color: 'white' }}
                                    buttonStyle={{ minHeight: '100%' }}
                                />
                            }

                            rightContent={
                                <Button
                                    onPress={() => deleteItem(item.id)}
                                    title="Apagar"
                                    icon={{ name: 'delete', color: 'white' }}
                                    buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                                />
                            }

                        >
                            <ListItem.Content>
                                <ListItem.Title> {item.descricao}</ListItem.Title>
                                <ListItem.Subtitle style={{ color: '#9B51E0', fontWeight: 'bold' }}>R$ {item.valor}</ListItem.Subtitle>
                                {/* <ListItem.Subtitle style={{ color: '#E6E6E6' }}>{item.data.toDate().toLocaleDateString('pt-BR', { dateStyle: 'medium' })}</ListItem.Subtitle> */}
                                <ListItem.Subtitle style={{ color: '#E6E6E6' }}>{item.data.toString()}</ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem.Swipeable>



                    )
                }}
            />


        </SafeAreaView>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flex: 1,
        paddingTop: 10,
    }

    ,
    dropdown: {
        backgroundColor: 'white',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        marginTop: 20,
    },
    dropdown2: {
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 0.5,
        marginTop: 20,
        padding: 8,
    },
    icon: {
        marginRight: 5,
        width: 18,
        height: 18,
    },
    item: {
        paddingVertical: 17,
        paddingHorizontal: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },

})
