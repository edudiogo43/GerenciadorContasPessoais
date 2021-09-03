import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native'

import { Header, Icon } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';
import { TextInput } from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { KeyboardAvoidingView } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { AntDesign } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/core';

import firebase from '../../config/Firebase';
import { Alert } from 'react-native';

const New = ({ navigation, route }) => {

    const database = firebase.firestore();

    const [selectedDespesa, setSelectedDespesa] = useState();
    const [descricao, setDescricao] = useState();
    const [vencimento, setVencimento] = useState();
    const [valor, setValor] = useState();

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onchangePicker = (text) => {
        setSelectedDespesa(text)
        //alert(text);
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);

        let dateAux = currentDate.toLocaleDateString('pt-BR', { dateStyle: 'short' });
        let newDate = dateAux.substring(3, 5) + "/" + dateAux.substring(0, 2) + "/20" + dateAux.substring(6, 8)

        setVencimento(newDate);
        setDate(currentDate);

    };

    const addConta = () => {

        if (!descricao || !vencimento || !valor || !selectedDespesa) {
            Alert.alert("Atenção", "Preencha todos os campos !");
            return false;
        }

        const data = {
            "descricao": descricao,
            "data": vencimento,
            "valor": valor,
            "tipo": selectedDespesa,
            "status": false,
        }

        //console.log(data);

        database.collection("Tasks").add(
            // "descricao": descricao,
            // "data": vencimento,
            // "valor": valor,
            // "tipo": selectedDespesa,
            // "status": "false",
            data
        )

        navigation.navigate("HomeScreen", {
            forceReload: true
        })
    }

    return (
        <KeyboardAvoidingView
            behavior="padding"
            style={styles.container}>

            <Header
                backgroundColor='#9B51E0'
                rightComponent={
                    <View style={{ height: 100, justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={() => addConta()}
                        >
                            <View style={styles.buttonHeader}>
                                <Entypo name="plus" size={36} color="#9B51E0" />
                            </View>
                        </TouchableOpacity>
                    </View>
                }

                centerComponent={
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'flex-start', height: 100 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFF' }}>Incluindo uma conta</Text>
                    </View>
                }
            />

            <View style={styles.textFieldView}>
                <Text style={styles.labelField}>Descrição resumida</Text>
                <TextInput
                    style={styles.textField}
                    placeholder="Digite a descrição da despesa"
                    value={descricao}
                    onChangeText={(text) => setDescricao(text)}
                />
            </View>

            <Text style={styles.labelFieldPicker}>Tipo de despesa</Text>
            <View style={styles.textPickerView}>
                <Picker
                    selectedValue={selectedDespesa}
                    onValueChange={(itemValue, itemIndex) =>
                        onchangePicker(itemValue)
                    }>
                    <Picker.Item label="Despesas Fixas" value="1" />
                    <Picker.Item label="Cartão de Crédito" value="2" />
                    <Picker.Item label="Internet" value="3" />
                    <Picker.Item label="Empréstimo" value="4" />
                    <Picker.Item label="Veículos" value="5" />
                    <Picker.Item label="Impostos" value="6" />
                    <Picker.Item label="Vestuário" value="7" />
                    <Picker.Item label="Educação" value="8" />
                </Picker>
            </View>

            <View style={styles.textFieldView}>
                <Text style={styles.labelField}>Valor da Conta</Text>
                <TextInput
                    keyboardType="numeric"
                    style={styles.textField}
                    placeholder="Digite o valor da conta"
                    value={valor}
                    onChangeText={(text) => setValor(text)}
                />
            </View>


            <View style={styles.textFieldView}>
                <Text style={styles.labelField}>Data de Vencimento</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        keyboardType="numeric"
                        style={styles.calendarField}
                        placeholder="Data de vencimento do documento"
                        value={vencimento}
                        editable={false}
                    />

                    <TouchableOpacity
                        onPress={() => setShow(true)}
                    >
                        <AntDesign name="calendar" size={40} color="white" />
                    </TouchableOpacity>

                </View>
            </View>

            <View>
                {show && (<DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
                )}


            </View>


        </KeyboardAvoidingView>
    )
}

export default New

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9B51E0'
    },
    buttonHeader: {
        width: 58,
        height: 58,
        backgroundColor: '#F2F2F2',
        borderRadius: 29,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textFieldView: {
        padding: 10,
    },
    calFieldView: {
        backgroundColor: 'red',
        padding: 10,
    },
    labelFieldPicker: {
        padding: 10,
        color: '#FFF',
        fontWeight: 'bold',
    },
    textPickerView: {
        borderRadius: 8,
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#FFF',
        width: 360,
        height: 47,
    },
    labelField: {
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    textField: {
        width: 360,
        backgroundColor: '#F2F2F2',
        height: 47,
        borderRadius: 8,
        padding: 10,
    },
    calendarField: {
        width: 300,
        backgroundColor: '#F2F2F2',
        height: 47,
        borderRadius: 8,
        padding: 10,
        marginRight: 10
    },
    inputBorder: {
        width: '30%',
        borderRadius: 8,
        borderColor: '#cacaca',
        borderWidth: 1,
        marginBottom: 20,
    },
})
