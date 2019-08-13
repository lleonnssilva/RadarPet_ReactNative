import React, { Component } from 'react';

import {
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  ToastAndroid,
  View,
  Dimensions
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';
import { api } from "../../../services/Api";

const markerImages = {
  cat: require('../../../assets/images/markers/cat.png'),
  dog: require('../../../assets/images/markers/dog.png'),
  bird: require('../../../assets/images/markers/bird.png'),
  horse: require('../../../assets/images/markers/horse.png'),
  iguana: require('../../../assets/images/markers/iguana.png'),
  chicken: require('../../../assets/images/markers/chicken.png'),
  point: require('../../../assets/images/markers/point.png'),
};
 const { width, height } = Dimensions.get('window');
 watchId = null;
const SPACE = 0.01;
export default class App extends Component {
  state = {
    latitude:0,
    longitude:0,
    latitudeDelta: 0.0143,
    longitudeDelta: 0.0134,
    pets:[]
  }




  componentDidMount = async ()=>{
      const response = await api.get(`pets`);
      this.setState({ pets: response.data });
      this.getLocation();
  }

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios' ||
        (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
  }

  getLocation = async () => {
     const hasLocationPermission = await this.hasLocationPermission();

     if (!hasLocationPermission) return;

    this.setState({ loading: true }, () => {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({ longitude:position.coords.longitude,latitude:position.coords.latitude});
          let region = {
            latitude:       position.coords.latitude,
            longitude:      position.coords.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5}

          this._map.animateToRegion(region, 100);
        },
        (error) => {
          this.setState({ location: error, loading: false });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true }
      );
    });
  }

  getLocationUpdates = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    this.setState({ updatesEnabled: true }, () => {
      this.watchId = Geolocation.watchPosition(
        (position) => {
          this.setState({ location: position });
        },
        (error) => {
          this.setState({ location: error });
        },
        { enableHighAccuracy: true, distanceFilter: 0, interval: 5000, fastestInterval: 2000 }
      );
    });
  }

  removeLocationUpdates = () => {
      if (this.watchId !== null) {
          Geolocation.clearWatch(this.watchId);
          this.setState({ updatesEnabled: false })
      }
  }

  showPetInfo(pet) {
    //console.log(pet)
    this.props.navigation.push('Pet', { pet: pet });
  }
  render() {
    const { latitude,longitude,pets } = this.state;


    return (

      <View style={styles.container}>
        <MapView
        showsUserLocation
        loadingEnabled
        ref={component => {this._map = component;}}
          provider={this.props.provider}
          style={styles.map}
          >
              {pets.map(pet => (
              <Marker
                key={pet._id}
                coordinate={{
                  latitude:parseFloat(pet.coordinate.latitude),
                  longitude:parseFloat(pet.coordinate.longitude)}}
                image={markerImages[pet.icon]}
                onPress={e => { this.showPetInfo(pet) }}/>
            ))}
             {/* <Marker
              anchor={{ x: 0, y: 0 }}
              //image={markerImages['point']}
              coordinate={{
              latitude: latitude ,
              longitude: longitude ,

            }}/> */}

        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    bubble: {
      backgroundColor: 'red',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20,
    },
    button: {
      width: 140,
      paddingHorizontal: 12,
      alignItems: 'center',
      marginHorizontal: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginVertical: 20,
      backgroundColor: 'transparent',
    },
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
    },
    mapSnapshot: { width: 300, height: 300 },
  });
