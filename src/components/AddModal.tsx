import React, { useState } from 'react';
import { View, TextInput, Button, Modal, StyleSheet } from 'react-native';

export const AddModal: React.FC<{
  isVisible: boolean,
  setInputValue: Function

}> = ({ isVisible, setInputValue }) => {
  const [textInput, setTextInput] = useState('');

  const setNewTextInput = () => {
    setInputValue(textInput);
    setTextInput('');
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.modalContainer}>
  
           <TextInput
            style={styles.textInput}
            value={textInput}
            onChangeText={setTextInput}
            placeholder="Add archive"
          />
          <Button title="Create archive" onPress={setNewTextInput} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 40,
    height: '60%',
    marginTop: 'auto'
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
});