import React, { useState, useEffect, useLayoutEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'

import { Picker } from '@react-native-picker/picker';

import { ListItem, Avatar, Button, Icon } from 'react-native-elements'

import { useIsFocused } from '@react-navigation/native'

import { useNavigation } from '@react-navigation/core';

import { Entypo } from '@expo/vector-icons';

import firebase from '../../config/Firebase';
import { SafeAreaView } from 'react-native';
import { Alert } from 'react-native';

import { StatusBar } from 'expo-status-bar';

const Home = ({ route }) => {

    const navigation = useNavigation();
    const [contas, setContas] = useState([]);
    const [pago, setPago] = useState(0);
    const [aberto, setAberto] = useState(0)
    const [selectedStatus, setSelectedStatus] = useState(route.params?.selectedStatus);
    const [selectedMonth, setSelectedMonth] = useState();
    const [visible, setVisible] = useState(false);

    const userId = route.params?.userId;
    const database = firebase.firestore();
    const isFocused = useIsFocused()

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const currentYear = new Date().getFullYear();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

    const onchange = (text) => {
        if (text == null) return false

        setSelectedStatus(text);
        reloadBills(text);
    }

    const createCustomAlertLogoutMsg = (title, message) => {

        Alert.alert(
            title,
            message,
            [
                {
                    text: "Não",
                    onPress: () => { return false },
                    style: "cancel"
                },
                {
                    text: "Sim", onPress: () => {

                        firebase.auth().signOut()
                            .then(() => {
                                navigation.navigate('SignIn');
                            }).catch((error) => {
                                console.log('Logout: ' + error);
                            });

                    }
                }
            ]
        );
    }

    const doLogout = () => {
        createCustomAlertLogoutMsg("Confirma", "Tem certeza que deseja sair ?");
    }

    useEffect(() => {

        calculateTotals();
        reloadBills(selectedStatus);

        if (!selectedMonth) {
            console.log("nao achou selectedMonth")
            setSelectedMonth(monthNames[currentMonth]);
        }

        console.log(selectedMonth);


    }, [isFocused])


    const calculateTotals = () => {

        let abertos = 0;
        let pagos = 0;

        database.collection(userId)
            .get()
            .then((querySnapshot) => {

                querySnapshot.forEach((doc) => {

                    if (doc.data().status === true)
                        pagos = pagos + parseFloat(doc.data().valor);

                    if (doc.data().status === false)
                        abertos = abertos + parseFloat(doc.data().valor);

                    setPago(pagos.toFixed(2));
                    setAberto(abertos.toFixed(2));
                })
            })

    }

    const reloadBills = (status = false) => {

        setContas([]);
        let list = [];

        database.collection(userId)

            .where("status", "==", status)

            // .where("data", ">=", "09/01/2021")
            // .where("data", "<=", "09/30/2021")

            .get()
            .then((querySnapshot) => {

                querySnapshot.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id })
                })
                setContas(list);
            })


    }

    const addItem = () => {
        navigation.navigate("New", { userId: userId })
    }

    const formatData = (dateAux) => {
        return dateAux.substring(3, 5) + "/" + dateAux.substring(0, 2) + "/20" + dateAux.substring(6, 8)
    }

    const formatValor = (valAux) => {
        return parseFloat(valAux).toFixed(2);
    }

    const editItem = (item) => {
        navigation.navigate("Edit",
            {
                userId: userId,
                id: item.id,
                descricao: item.descricao,
                data: formatData(item.data),
                valor: item.valor,
                tipo: item.tipo,
                status: item.status,
                selectedStatus: selectedStatus
            })
    }

    const formatAvatarText = (description) => {

        let splitedDescription = description.split(" ");
        let avatarSuffix;

        if (splitedDescription.length == 1)
            avatarSuffix = description.toUpperCase().substring(0, 2)
        else if (splitedDescription.length >= 2)
            avatarSuffix = splitedDescription[0].toUpperCase().substring(0, 1) + splitedDescription[1].toUpperCase().substring(0, 1)

        return avatarSuffix;

    }

    const previousMonth = () => {
        if (currentMonth > 0) {
            let indexMonth = currentMonth;
            indexMonth = indexMonth - 1;
            setCurrentMonth(indexMonth);
            setSelectedMonth(monthNames[indexMonth]);
        }
    }

    const nextMonth = () => {
        if (currentMonth < 11) {
            let indexMonth = currentMonth;
            indexMonth = indexMonth + 1;
            setCurrentMonth(indexMonth)
            setSelectedMonth(monthNames[indexMonth]);
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar
                style="light"
            />

            <View style={{
                paddingTop: 5,
                height: 180,
                width: '100%',
                backgroundColor: '#9B51E0',
                flexDirection: 'row',
                justifyContent: 'space-around'
            }}>
                <View style={{ paddingTop: 50, paddingHorizontal: 40, justifyContent: 'flex-start', alignItems: "flex-start", }}>
                    <Picker
                        dropdownIconColor="#FFF"
                        selectedValue={selectedStatus}
                        style={{ width: 250, color: "#FFF", left: -8 }}
                        onValueChange={(itemValue, itemIndex) => (
                            onchange(itemValue)
                        )
                        }>
                        <Picker.Item label="Filtrar por Status" value={null} />
                        <Picker.Item label="Contas Pagas" value={true} />
                        <Picker.Item label="Contas em Aberto" value={false} />
                    </Picker>

                    <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>

                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: "#CCC", fontSize: 12 }}>Contas Pagas </Text>
                            <Text style={{ fontWeight: 'bold', color: "#FFF", fontSize: 15 }}>{visible ? "R$ " + pago : "-"}</Text>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => setVisible(!visible)}
                            >
                                <Text />
                                <Entypo name={visible ? "eye" : "eye-with-line"} size={24} color="#FFF" />

                            </TouchableOpacity>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: "#CCC", fontSize: 12 }}>Em aberto</Text>
                            <Text style={{ fontWeight: 'bold', color: "#FFF", fontSize: 15 }}> {visible ? "R$ " + aberto : "-"}</Text>
                        </View>

                    </View>

                    <View style={{
                        width: '100%',
                        marginTop: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}>

                        <TouchableOpacity
                            onPress={() => previousMonth()}
                        >
                            <Entypo name="chevron-left" size={26} color="white" />
                        </TouchableOpacity>

                        <Text style={{
                            fontSize: 14,
                            color: '#CCC'
                        }}>{selectedMonth}</Text>

                        <TouchableOpacity
                            onPress={() => nextMonth()}
                        >
                            <Entypo name="chevron-right" size={26} color="white" />
                        </TouchableOpacity>

                    </View>

                </View>



                <View style={{
                    paddingTop: 40,
                    right: 30
                }}>
                    <TouchableOpacity
                        style={{ width: 40, height: 40, backgroundColor: '#FFF', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => doLogout()}
                    >
                        <Icon name="logout" color='#9B51E0' />
                    </TouchableOpacity>
                </View>

            </View>


            <View style={{
                flex: 2
            }}>

                <FlatList
                    style={{}}
                    showsVerticalScrollIndicator={false}
                    data={contas}
                    renderItem={({ item }) => {
                        return (


                            <ListItem
                                key={item.id}
                                bottomDivider
                            >

                                <Avatar
                                    size="small"
                                    rounded
                                    title={formatAvatarText(item.descricao)}
                                    containerStyle={{ backgroundColor: "#ccc", opacity: 0.7 }}
                                />

                                <ListItem.Content style={{}}>
                                    <ListItem.Title>{item.descricao}</ListItem.Title>
                                    <ListItem.Subtitle>R$ {formatValor(item.valor)}</ListItem.Subtitle>
                                    <ListItem.Subtitle>{formatData(item.data.toString())}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron
                                    size={40}
                                    onPress={() => editItem(item)}
                                />

                            </ListItem>

                        )
                    }}
                />
            </View>

            <View style={{
                flex: 0.25,
                //backgroundColor: '#000',
                width: '100%',
                marginLeft: 0,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: 'red',
                        width: 60,
                        height: 60,
                        backgroundColor: '#9B51E0',
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 4,
                        top: -20,
                        shadowOpacity: 0.4,
                        shadowColor: '#eee',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        zIndex: 9999
                    }}
                    onPress={() => addItem()}
                >
                    <Entypo name="plus" size={60} color="#FFF" />
                </TouchableOpacity>
            </View>


        </SafeAreaView>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flex: 1,
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
