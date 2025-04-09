import React, { useState } from 'react'
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function SearchScreen() {
  const [searchTxt, setSearchTxt] = useState("");
  const [data, setData] = useState(null)

  const handleSearch = () => {
    setData(null);
    // Fetch API 
    fetch('https://rxnav.nlm.nih.gov/REST/drugs.json?name='+searchTxt)
    .then(response => response.json())
    .then(res => {
      if(res.drugGroup.conceptGroup[1].conceptProperties){
        setData(res.drugGroup.conceptGroup[1].conceptProperties)
      }
    })
    .catch(error => {
      //console.log(error);
    })
  }

  return (<View style={{ backgroundColor: '#fff' }}>
    <View style={{ flexDirection: 'row' }}>
      <TextInput 
        value={searchTxt}
        onChangeText={setSearchTxt}
        placeholder='Search by drug name..'
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 5, margin: 5, width: '65%', borderRadius: 15, paddingHorizontal: 15 }}
      />
      <TouchableOpacity 
        style={{ margin: 5, padding: 5, backgroundColor: '#0078ff', width: '30%', borderRadius: 15 }}
        onPress={handleSearch}
      >
        <Text style={{  color: "#fff", fontSize: 20, textAlign: 'center' }}>Search</Text>
      </TouchableOpacity>
    </View>

    {data && <FlatList
      data={data}
      keyExtractor={item => item.rxcui}
      renderItem={({ item }) => (<View style={{ padding: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1, }}>
        <Text style={{color: '#000', fontWeight: "bold"}}>{item.name}</Text>
        <Text style={{color: '#000'}}>{item.synonym}</Text>
        
      </View>)}
    />}
  </View>)
}
