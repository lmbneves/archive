import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getDBConnection, updateItem } from '../services/db-service';

type Props = NativeStackScreenProps<RootStackParamList, 'Item'>;

const ItemScreen: React.FC<Props> = ({ navigation, route }) => {

  const [itemData, setItemData] = useState(route.params.item);
  const [notes, setNotes] = useState(itemData.notes);
  const [placeholderText, setPlaceholderText] = useState(`Add your thoughts about ${itemData.name}...`)

  const updateNotes = async () => {
    try {
      const db = await getDBConnection();
      // it resets the state
      await updateItem(db, itemData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    updateNotes();
  }, [itemData]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.itemHeaderWrapper}>
          <Text>{itemData.name}</Text>
        </View>
        <View style={styles.itemNotesWrapper}>
          <TextInput 
            value={notes}
            onChangeText={setNotes}
            onBlur={() => setItemData((prevItemData) => ({...prevItemData, notes: notes}))}
            placeholder={placeholderText}
            style={styles.notesInput}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  itemHeaderWrapper: {
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc'
  },
  itemNotesWrapper: {
    paddingVertical: 20
  },
  notesInput: {

  }
});

export default ItemScreen;