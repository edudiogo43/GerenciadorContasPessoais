import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList, SafeAreaView } from 'react-native'

import { Picker } from '@react-native-picker/picker';

import { ListItem, Avatar, Icon } from 'react-native-elements'

import { useIsFocused } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/core';

import { Entypo } from '@expo/vector-icons';

import firebase from '../../config/Firebase';
import { Alert } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { returnCategoryName, returnIconName, returnCategoryColor } from '../../functions';

//import moment from 'moment';

import {
    PieChart,
} from 'react-native-chart-kit'

import { Dimensions } from 'react-native'
const screenWidth = Dimensions.get('window').width

const chartConfig = {
    backgroundGradientFrom: '#000000',
    backgroundGradientTo: '#cccccc',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    fontFamily: 'Roboto_900Black'
}

const Home = ({ route }) => {

    const navigation = useNavigation();
    const [contas, setContas] = useState([]);
    const [pago, setPago] = useState(0);
    const [aberto, setAberto] = useState(0)
    const [selectedStatus, setSelectedStatus] = useState(route.params?.selectedStatus);
    const [selectedMonth, setSelectedMonth] = useState();
    const [visible, setVisible] = useState(false);
    const [closed, setClosed] = useState(false);
    const [closedChart, setClosedChart] = useState(false);

    const [geral, setGeral] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const userId = route.params?.userId;
    const database = firebase.firestore();
    const isFocused = useIsFocused()

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const currentYear = new Date().getFullYear();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

    const [categories, setCategories] = useState([]);

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
            setSelectedMonth(monthNames[currentMonth]);
        }

    }, [isFocused])


    const calculateTotals = () => {

        let abertos = 0;
        let pagos = 0;

        let categLocal = [];



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

                    categLocal.push({
                        "name": doc.data().tipo,
                        "value": doc.data().valor.toString(),
                    })

                    setCategories(categLocal);
                    setGeral(categories);

                })

            })

        setGeral(categories);

        let copyCategory = []
        let copyGeral = geral;

        geral.map((v, i) => {

            let name = v.name;
            let sum = 0;

            if (!copyCategory.find(element => element.name === name)) {

                copyGeral.map((v, i) => {

                    if (v.name === name) {
                        sum = sum + parseFloat(v.value);
                    }

                })

                if (sum > 0) {
                    copyCategory.push({ name: name, value: sum.toFixed(2) });
                }
            }

        })

        setGeral([])
        setGeral(copyCategory);

        var chartCategories = [];
        setCategorias([]);

        copyCategory.map((v, i) => {

            let population = Number(parseFloat(v.value).toFixed(0));
            console.log("Population:" + population)

            chartCategories.push({
                "name": returnCategoryName(v.name),
                "population": population,
                "color": returnCategoryColor(v.name),
                "legendFontColor": returnCategoryColor(v.name),
                "legendFontSize": 13,
            })
        })

        setCategorias(chartCategories)

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
        return dateAux; //.substring(3, 5) + "/" + dateAux.substring(0, 2) + "/20" + dateAux.substring(6, 8)
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

            {/* Header */}
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
                        style={{ width: 250, color: "#FFF", left: -8, fontFamily: 'Roboto_300Light' }}
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
                            <Text style={{ color: "#CCC", fontSize: 12, fontFamily: 'Roboto_700Bold' }}>Contas Pagas </Text>
                            <Text style={{ color: "#FFF", fontSize: 15, fontFamily: 'Roboto_700Bold' }}>{visible ? "R$ " + pago : "-"}</Text>
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
                            <Text style={{ color: "#CCC", fontSize: 12, fontFamily: 'Roboto_700Bold' }}>Em aberto</Text>
                            <Text style={{ color: "#FFF", fontSize: 15, fontFamily: 'Roboto_700Bold' }}> {visible ? "R$ " + aberto : "-"}</Text>
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
                            fontFamily: 'Roboto_500Medium',
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

            {/* Visao Geral */}

            {closed &&

                <View style={{
                    margin: 10,
                    backgroundColor: '#fff',
                    height: 50,
                    padding: 20,
                    borderRadius: 12,
                    shadowColor: '#171717',
                    shadowOffset: { width: -2, height: 4 },
                    shadowOpacity: 0.9,
                    shadowRadius: 3,
                    elevation: 5,
                    shadowColor: '#52006A',
                }}>

                    <View style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#fff',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{ fontSize: 16, fontWeight: '400', fontFamily: 'Roboto_500Medium' }}>Visão Geral</Text>

                        <TouchableOpacity
                            style={{ backgroundColor: '#fff', width: 25, height: 25, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => setClosed(false)}
                        >
                            <Entypo name="chevron-down" size={20} color="black" />
                        </TouchableOpacity>

                    </View>

                </View>
            }

            {!closed &&
                <View style={{
                    flexWrap: 'wrap',
                    margin: 10,
                    backgroundColor: '#fff',
                    padding: 20,
                    borderRadius: 12,
                    shadowColor: '#171717',
                    shadowOffset: { width: -2, height: 4 },
                    shadowOpacity: 0.9,
                    shadowRadius: 3,
                    elevation: 5,
                    shadowColor: '#52006A',
                }}>
                    <View style={{
                        width: '100%',
                        backgroundColor: '#FFF',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{ fontSize: 16, fontWeight: '400', fontFamily: 'Roboto_500Medium' }}>Visão Geral</Text>

                        <TouchableOpacity
                            style={{ backgroundColor: '#fff', width: 25, height: 25, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => setClosed(true)}
                        >
                            <Entypo name="chevron-up" size={20} color="black" />
                        </TouchableOpacity>

                    </View>

                    <View style={{ marginTop: 10, backgroundColor: '#fff', width: '100%', margin: 0 }}>

                        {geral.map((v, i) =>

                            <>
                                <View
                                    key={i}
                                    style={{
                                        marginTop: 10,
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexDirection: 'row'
                                    }}>

                                    <View style={{
                                        backgroundColor: '#fff',
                                        width: 250,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start'
                                    }}>
                                        {returnIconName(v.name)}
                                        <Text> </Text>
                                        <Text style={{ fontFamily: 'Roboto_300Light' }}>{returnCategoryName(v.name)}</Text>
                                    </View>

                                    <Text style={{ fontWeight: '600', fontFamily: 'Roboto_500Medium' }}>R$ {v.value}</Text>
                                </View>

                                <View
                                    style={{
                                        marginTop: 1,
                                    }}
                                />

                            </>

                        )}

                        {/* <View style={{
                            marginTop: 10,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            <View style={{
                                backgroundColor: '#fff',
                                width: 250,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}>

                                <AntDesign name="creditcard" size={20} color="#9B51E0" />
                                <Text> </Text>
                                <Text style={{ fontFamily: 'Roboto_300Light' }}>Cartão de Crédito</Text>
                            </View>
                            <Text style={{ fontWeight: '600', fontFamily: 'Roboto_500Medium' }}>R$ 3589,15</Text>
                        </View>

                        <View style={{
                            marginTop: 10,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            <View style={{
                                backgroundColor: '#fff',
                                width: 250,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}>

                                <FontAwesome name="wifi" size={20} color="#9B51E0" />
                                <Text> </Text>
                                <Text style={{ fontFamily: 'Roboto_300Light' }}>Internet</Text>
                            </View>
                            <Text style={{ fontWeight: '600', fontFamily: 'Roboto_500Medium' }}>R$ 159,99</Text>
                        </View>

                        <View style={{
                            marginTop: 10,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            <View style={{
                                backgroundColor: '#fff',
                                width: 250,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}>

                                <FontAwesome name="bank" size={20} color="#9B51E0" />
                                <Text> </Text>
                                <Text style={{ fontFamily: 'Roboto_300Light' }}>Empréstimos</Text>
                            </View>
                            <Text style={{ fontWeight: '600', fontFamily: 'Roboto_500Medium' }}>1745,00</Text>
                        </View>

                        <View style={{
                            marginTop: 10,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            <View style={{
                                backgroundColor: '#fff',
                                width: 250,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}>

                                <Ionicons name="ios-school" size={20} color="#9B51E0" />
                                <Text> </Text>
                                <Text style={{ fontFamily: 'Roboto_300Light' }}>Educação</Text>
                            </View>
                            <Text style={{ fontWeight: '600', fontFamily: 'Roboto_500Medium' }}>950,87</Text>
                        </View> */}


                    </View>

                </View>

            }

            {/* Gráfico */}

            {closedChart &&

                <View style={{
                    margin: 10,
                    backgroundColor: '#fff',
                    height: 50,
                    padding: 20,
                    borderRadius: 12,
                    shadowColor: '#171717',
                    shadowOffset: { width: -2, height: 4 },
                    shadowOpacity: 0.9,
                    shadowRadius: 3,
                    elevation: 5,
                    shadowColor: '#52006A',
                }}>

                    <View style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#fff',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{ fontSize: 16, fontWeight: '400', fontFamily: 'Roboto_500Medium' }}>Despesas por Categorias</Text>

                        <TouchableOpacity
                            style={{ backgroundColor: '#fff', width: 25, height: 25, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => setClosedChart(false)}
                        >
                            <Entypo name="chevron-down" size={20} color="black" />
                        </TouchableOpacity>

                    </View>

                </View>
            }


            {!closedChart &&

                <View style={{
                    margin: 10,
                    backgroundColor: '#fff',
                    height: 250,
                    padding: 10,
                    borderRadius: 12,
                    shadowColor: '#171717',
                    shadowOffset: { width: -2, height: 4 },
                    shadowOpacity: 0.9,
                    shadowRadius: 3,
                    elevation: 5,
                    shadowColor: '#52006A',
                }}>

                    <View style={{
                        width: '100%',
                        backgroundColor: '#FFF',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={{ fontSize: 16, fontWeight: '400', fontFamily: 'Roboto_500Medium' }}>Despesas por Categorias</Text>

                        <TouchableOpacity
                            style={{ backgroundColor: '#fff', width: 25, height: 25, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}
                            onPress={() => setClosedChart(true)}
                        >
                            <Entypo name="chevron-up" size={20} color="black" />
                        </TouchableOpacity>

                    </View>


                    <PieChart
                        data={categorias}
                        width={screenWidth - 50}
                        height={200}
                        chartConfig={chartConfig}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="-5"
                        style={{ fontFamily: 'Roboto_300Light' }}
                    />

                </View>

            }


            {/* Lista de contas */}
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
                                    <ListItem.Title style={{ fontFamily: 'Roboto_700Bold' }}>{item.descricao}</ListItem.Title>
                                    <ListItem.Subtitle style={{ fontFamily: 'Roboto_300Light' }}>R$ {formatValor(item.valor)}</ListItem.Subtitle>
                                    <ListItem.Subtitle style={{ fontFamily: 'Roboto_300Light' }}>{formatData(item.data.toString())}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron
                                    size={45}
                                    onPress={() => editItem(item)}
                                />

                            </ListItem>

                        )
                    }}
                />
            </View>

            <View style={{
                flex: 0.25,
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
        fontFamily: 'Roboto_300Light'
    }
})
