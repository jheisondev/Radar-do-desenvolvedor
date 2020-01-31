import React,{ useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import { connect, disconnect, subscribeToNewDevs } from '../services/socket';

function Main({ navigation }) {
  const [ devs, setDevs ] = useState([]);
  const [ techs, setTechs] = useState('');
  const [ currentRegion, setCurrentRegion ] = useState(null);
  
 
  useEffect(()=> {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      }

    }

    loadInitialPosition();
  }, []);

  useEffect(() => {
    subscribeToNewDevs(dev => setDevs([...devs, dev]));
  },[devs]);

  function setupWebsocket() {
    disconnect();

    const { latitude, longitude } = currentRegion;
    
    connect(
      latitude,
      longitude,
      techs,
    );
  }

  async function loadDevs() {
    const { latitude, longitude } = currentRegion;

    const response = await api.get('/search', {
      params: {
        latitude,
        longitude,
        techs
      }
      
    });

    setDevs(response.data.devs);
    setupWebsocket();
  }
  
  function handleRegionChanged(region) {
    // console.log(region);
    setCurrentRegion(region);
  }

  if(!currentRegion) {
    return null;
  }

  return (
    <>
      <MapView 
        initialRegion={currentRegion} 
        style={styles.map}
        onRegionChangeComplete={handleRegionChanged}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id} 
            coordinate={{ 
              latitude: dev.location.coordinates[1], 
              longitude: dev.location.coordinates[0],
            }}
          >

          <Image 
            style={styles.avatar} 
            source={{ uri: dev.avatar_url }}
          />
        
          <Callout style={styles.callout} onPress={() => {
            // Navegação 
            navigation.navigate('Profile', { github_username: dev.github_username });
          }}>
            <View style={styles.viewCallout}>
              <Text style={styles.name}>{dev.name}</Text>
              <Text style={styles.bio}>{dev.bio}</Text>
              <View style={styles.footerTechs}>
                <Text style={styles.techs}>{dev.techs.join(', ')}</Text>
              </View>
            </View>
          </Callout>
        </Marker>
        ))}
      </MapView>
      
      <View style={styles.form}>
        
        <TextInput 
          style={styles.searchInput}
          placeholder="Buscar..."
          placeholderTextColor="#666"
          autoCorrect={false}
          autoCompleteType="name" 
          value={techs}
          onChangeText={setTechs}
        />

        <TouchableOpacity onPress={loadDevs} style={styles.searchButton}>
          <MaterialIcons name="my-location" size={20} color="#fff" />
        </TouchableOpacity>

      </View>
      
    </>
  );
}


const styles = StyleSheet.create({
  map: {
    flex: 1,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  callout: {
    borderRadius: 20,
  },

  viewCallout: {
    width: 260, 
  },

  name: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7d40e7',
  },

  bio: {
    color: '#666',
    marginTop: 5,
  },

  techs: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 10,
    marginTop: 5,
  },

  form: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 100,
    flexDirection: 'row',
  },

  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 4,
  },

  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#7d40e7',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },

})

export default Main;