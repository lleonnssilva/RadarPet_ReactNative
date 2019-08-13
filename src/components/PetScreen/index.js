import React, { Component } from 'react'
import { Text, View, Image, Button, Linking,TouchableOpacity,FlatList } from 'react-native'

import styles from './styles';


export default class index extends Component {
  makeCall(phone) {
    Linking.openURL(`tel:${phone}`);
  }
  renderItem = ({ item }) => (

   <TouchableOpacity style={{paddingBottom:80,paddingTop:5,paddingLeft:30,paddingRight:30}}>
      <Image   //resizeMode={'contain'}
          style={styles.photo}
          source={{uri: item.url}}
     />
    </TouchableOpacity>
  );

  render() {
    const { navigation } = this.props;
    const pet = navigation.getParam('pet');

    return (
      <View style={styles.container}>
      <View style={{flex:1,paddingTop:50}}>

      <FlatList
          style={{flex:1,}}
          data={pet.files}
          keyExtractor={file => file._id}
          ItemSeparatorComponent={() => <View style={{width:20}} />}
          renderItem={this.renderItem}
          horizontal
      />
      </View>
      <View style={styles.detailContainer}>
      <Text style={styles.name}>{pet.name} foi perdido</Text>
              <Text style={styles.description}>{pet.description}</Text>
              <Text style={styles.contact}>Dono(a): {pet.contactName}</Text>
              <View style={styles.buttonContainer}>
                <Button title="Ligar" onPress={e => { this.makeCall(pet.phone) }}/>
              </View>
      </View>

      </View>
    )
  }
}
