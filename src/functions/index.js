import React from 'react'
import { AntDesign, FontAwesome, Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export const returnCategoryColor = (id) => {
    let categoryColor = "";
    switch (id) {
        case "1":
            categoryColor = "#4F4F4F";
            break;

        case "2":
            categoryColor = "#EB5757";
            break;

        case "3":
            categoryColor = "#F2994A";
            break;

        case "4":
            categoryColor = "#F2C94C";
            break;

        case "5":
            categoryColor = "#6FCF97";
            break;

        case "6":
            categoryColor = "#2F80ED";
            break;

        case "7":
            categoryColor = "#2D9CDB";
            break;

        case "8":
            categoryColor = "#E0E0E0";
            break;

        case "9":
            categoryColor = "#9B51E0";
            break;

        case "10":
            categoryColor = "#000";
            break;

        default:
            categoryColor = "Outros"
            break;
    }

    return categoryColor;
}

export const returnCategoryName = (id) => {
    let categoryName = "";
    switch (id) {
        case "1":
            categoryName = "Despesas Fixas";
            break;

        case "2":
            categoryName = "Cartão de Crédito";
            break;

        case "3":
            categoryName = "Internet";
            break;

        case "4":
            categoryName = "Empréstimo";
            break;

        case "5":
            categoryName = "Veículos";
            break;

        case "6":
            categoryName = "Impostos";
            break;

        case "7":
            categoryName = "Vestuário";
            break;

        case "8":
            categoryName = "Educação";
            break;

        case "9":
            categoryName = "TED/DOC/PIX";
            break;

        case "10":
            categoryName = "Outros";
            break;

        default:
            categoryName = "Outros"
            break;
    }

    return categoryName;
}

export const returnIconName = (id) => {

    switch (id) {
        case "1": //DESPESAS FIXAS
            return (
                <FontAwesome name="home" size={20} color="#9B51E0" />
            )
            break;

        case "2": //CARTAO DE CREDITO
            return (
                <AntDesign name="creditcard" size={20} color="#9B51E0" />
            )
            break;

        case "3": //INTERNET
            return (
                <FontAwesome name="wifi" size={20} color="#9B51E0" />
            )
            break;

        case "4": //EMPRESTIMO
            return (
                <FontAwesome name="bank" size={20} color="#9B51E0" />
            )
            break;

        case "5": //VEICULOS
            return (
                <FontAwesome5 name="car" size={20} color="#9B51E0" />
            )
            break;

        case "6": //IMPOSTOS
            return (
                <FontAwesome name="money" size={20} color="#9B51E0" />
            )
            break;

        case "7": //VESTUARIO
            return (
                <FontAwesome5 name="tshirt" size={20} color="#9B51E0" />
            )
            break;

        case "8": //EDUCACAO
            return (
                <Ionicons name="ios-school" size={20} color="#9B51E0" />
            )
            break;

        case "9": //TED/DOC/PIX
            return (
                <MaterialCommunityIcons name="bank-transfer-in" size={20} color="#9B51E0" />
            )
            break;

        case "10": // OUTROS
            return (
                <MaterialCommunityIcons name="dots-horizontal" size={20} color="#9B51E0" />
            )
            break;

        default:
            break;
    }

}