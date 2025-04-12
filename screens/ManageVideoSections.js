import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

export default function ManageVideoSections({ route, navigation }) {
    const [data, setData] = useState(null);
    const [refreshList, setRefreshList] = useState(Date.now());

    useFocusEffect(useCallback(() => {
        firestore()
        .collection("video-section")
        .get()
        .then(response => {            
            let tmpArr = [];
            
            response.forEach(doc => {
                tmpArr.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            
            setData(tmpArr)
        })
        .catch(error => {
            console.log(error);
        });
    }, [ refreshList ]));

    const handleDelete = (itemId) => {
        Alert.alert("Delete Section", "Are you sure to delete this section?", [
            {
                text: 'No',
                onPress: () => {
                    //
                }
            },
            {
                text: "Yes",
                onPress: () => {
                    firestore()
                    .collection("video-section")
                    .doc(itemId)
                    .delete()
                    .then(() => {
                        setRefreshList(Date.now());
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }
            },
        ])
    }

    return (<ScrollView style={{ backgroundColor: '#ffffff' }}>
        <TouchableOpacity style={{ margin: 5, padding: 5, backgroundColor: '#0078ff', width: '25%', borderRadius: 15 }} onPress={() => navigation.navigate("New Video Section")}>
            <Text style={{ color: '#fff', textAlign: 'center',  }}>New</Text>
        </TouchableOpacity>
        {data && data.map(item => <View style={{
              padding: 15,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}>
            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold', padding: 4}}>{item.title}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ margin: 3, backgroundColor: 'green', padding: 5, borderRadius: 5 }} onPress={() => navigation.navigate("Edit Video Section", { section_id: item.id })}>
                    <Text style={{ color: "#fff" }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ margin: 3, backgroundColor: 'red', padding: 5, borderRadius: 5 }} onPress={() => handleDelete(item.id)}>
                    <Text style={{ color: "#fff" }}>x Delete</Text>
                </TouchableOpacity>
            </View>
        </View>)}
  </ScrollView>)
}
