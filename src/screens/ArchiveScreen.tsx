import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Button, Text, TextInput, View, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList  } from '../navigation/types';
import { getDBConnection, createTable, deleteTable, getItems, saveItems, deleteItem } from '../services/db-service';
import { ItemEntryComponent } from '../components/ItemEntryComponent';
import { Item } from '../models';
import uuid from 'react-native-uuid';

type Props = NativeStackScreenProps<RootStackParamList, 'Archive'>;

const ArchiveScreen: React.FC<Props> = ({ navigation, route }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState('');

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      const storedItems = await getItems(db, route.params.archive.id);
      if (storedItems.length) {
        setItems(storedItems);
      } else {
        // await saveArchives(db, initArchives);
        // setArchives(initArchives);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  const addItemEntry = async () => {
    if (!newItem.trim()) return;
    try {
      const newItems = [...items, {
        id: uuid.v4() as string, archive_id: route.params.archive.id, name: newItem
      }];
      setItems(newItems);
      const db = await getDBConnection();
      await saveItems(db, route.params.archive.id, newItems);
      setNewItem('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          {items.map((item) => (
            <Pressable
              key={item.id}
              // onPress={() => 
              //   navigation.navigate('Archive', { archive: archive })
              // }
            >
              <ItemEntryComponent item={item} />
            </Pressable>
          ))}
        </View>
        <View>
          <TextInput value={newItem} onChangeText={text => setNewItem(text)} />
          <Button
            onPress={addItemEntry}
            color="#841584"
            accessibilityLabel="add item to archive"
            title="Add new item to archive"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ArchiveScreen;
