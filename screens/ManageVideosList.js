import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

export default function ManageVideosList({ route, navigation }) {
    const [data, setData] = useState(null);
    const [refreshList, setRefreshList] = useState(Date.now());

    useFocusEffect(useCallback(() => {
        firestore()
        .collection("videos")
        .get()
        .then(response => {
            let videosList = [];
            
            response.forEach(doc => {
                videosList.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            
            setData(videosList)
        })
        .catch(error => {
            console.log(error);
        });
    }, [ refreshList ]));

    const handleDelete = (itemId) => {
        Alert.alert("Delete Video", "Are you sure to delete this video?", [
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
                    .collection("videos")
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
        <TouchableOpacity style={{ margin: 5, padding: 5, backgroundColor: '#0078ff', width: '25%', borderRadius: 15 }} onPress={() => navigation.navigate("New Videos")}>
            <Text style={{ color: '#fff', textAlign: 'center',  }}>New</Text>
        </TouchableOpacity>
        {data && data.map(item => <View style={{
              padding: 15,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}>
            <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold', padding: 4}}>{item.title}</Text>
            <Text style={{ color: '#000', padding: 4}}>{item.description}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{ margin: 3, backgroundColor: 'green', padding: 5, borderRadius: 5 }} onPress={() => navigation.navigate("Edit Videos", { video_id: item.id })}>
                    <Text style={{ color: "#fff" }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ margin: 3, backgroundColor: 'red', padding: 5, borderRadius: 5 }} onPress={() => handleDelete(item.id)}>
                    <Text style={{ color: "#fff" }}>x Delete</Text>
                </TouchableOpacity>
            </View>
        </View>)}
  </ScrollView>)
}
