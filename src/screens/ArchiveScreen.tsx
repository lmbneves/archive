import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Button, TextInput, View, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList  } from '../navigation/types';
import { getDBConnection, createTable, getItems, saveItems } from '../services/db-service';
import { ItemEntryComponent } from '../components/ItemEntryComponent';
import { AddModal } from '../components/AddModal';
import { Item } from '../models';
import uuid from 'react-native-uuid';

type Props = NativeStackScreenProps<RootStackParamList, 'Archive'>;

const ArchiveScreen: React.FC<Props> = ({ navigation, route }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleModalNewItem = (name: string) => {
    addItemEntry(name);
    setModalVisible(false);
  };
  const addItemEntry = async (name: string) => {
    if (!name.trim()) return;
    try {
      const newItems = [...items, {
        id: uuid.v4() as string, archive_id: route.params.archive.id, name: name
      }];
      setItems(newItems);
      const db = await getDBConnection();
      await saveItems(db, route.params.archive.id, newItems);
      setNewItem('');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

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
          <Button
              onPress={() => setModalVisible(true)}
              color="#841584"
              accessibilityLabel="open add item modal"
              title="Add item to archive"
            />
            <AddModal
              isVisible={modalVisible}
              setInputValue={handleModalNewItem}
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ArchiveScreen;
