import { DOGICON, CATICON } from '../assets/images/markers';
import { PHOTO1, PHOTO2, PHOTO3 } from '../assets/images/pets';

export const getMissedPets = () => {
  return [
    {
      id: 1, name: 'Catinga',
      coordinate: { latitude: -23.5668582, longitude: -46.6608059 },
      type: 'cat', icon: CATICON, photo: PHOTO1,
      missedDate: '2019-03-06', description: 'Gato vira-lastas simpático do posto Ipiranga',
      contact: { name: 'Pedrão', phone: '12982041640' }
    },  ]
}

export const getMissedPet = (id) => {
  return getMissedPets().filter(pet => pet._id === id)[0];
}
