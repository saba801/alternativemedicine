import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Video, {VideoRef} from 'react-native-video';

export default function WatchVideo({ route, navigation }) {
  const [data, setData] = useState(null);
  const {videoId} = route.params;
  const videoRef = useRef();

  useEffect(() => {
    firestore()
      .collection('videos')
      .doc(videoId)
      .get()
      .then(resopnse => {        
        setData(resopnse.data());
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      {data && (
        <Video
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/alternativemedicine-6ea0c.appspot.com/o/videos%2F"+data.file+"?alt=media"
          }}
          ref={videoRef}
          style={{
            height: 250
          }}
          controls={true}
        />
      )}
      {data && (<View style={{ padding: 5 }}>
        <Text style={{color: '#000', fontSize: 20, margin: 5, fontWeight: 'bold'}}>
          {data.title}
        </Text>
        <Text style={{color: '#000', fontSize: 14, margin: 5, fontWeight: 'bold'}}>
          {data.creation_date.toDate().toLocaleDateString("de-DE")}
        </Text>
        <Text style={{color: '#000', fontSize: 18, margin: 5}}>
          {data.description}
        </Text>
      </View>)}
    </ScrollView>
  );
}
