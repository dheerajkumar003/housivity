import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import {Colors} from '../assets/theme';

const filterType = [
  {title: 'Apartment', id: 1},
  {title: 'Bungalow/Villa', id: 2},
  {title: 'Penthouse', id: 3},
  {title: 'Row House', id: 4},
  {title: 'Farm House', id: 5},
];

const FilterModal = ({isModalVisible, setModalVisible, toggleModal}) => {
  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.buttonContainer}>
              {filterType.map((item, index) => {
                return (
                  <TouchableOpacity key={item.id} style={styles.filterButton}>
                    <Text style={styles.buttonText}>{item.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.actionButtons}>
              <Pressable style={styles.cancelButton} onPress={toggleModal}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.applyButton} onPress={toggleModal}>
                <Text style={styles.applyText}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    width: '90%', // Ensure the modal width fits within the screen
    backgroundColor: 'white', // Use a neutral background color for better visibility
    padding: 16,
    marginTop: 55,
    borderRadius: 15,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderWidth: 0.4,
    margin: 5,
    borderColor: Colors.grey,
  },
  buttonText: {
    color: Colors.black,
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  cancelButton: {
    borderColor: Colors.filterText,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelText: {
    color: Colors.black,
  },
  applyButton: {
    backgroundColor: Colors.orange,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 30,
  },
  applyText: {
    color: '#fff',
  },
});

export default FilterModal;
