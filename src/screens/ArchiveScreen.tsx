import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList  } from '../navigation/types';
import { getDBConnection, createTable, getItems, saveItems } from '../services/db-service';
import { ItemEntryComponent } from '../components/ItemEntryComponent';
import { Item } from '../models';
import uuid from 'react-native-uuid';

type Props = NativeStackScreenProps<RootStackParamList, 'Archive'>;

const ArchiveScreen: React.FC<Props> = ({ navigation, route }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState('');
  const [placeholderText, setPlaceholderText] = useState(`Add to ${route.params.archive.name}...`)

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["15%"], []);

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
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handlePresentModalDismiss = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
  }, []);

  const handleCreateItemSubmit = () => {
    addItemEntry();
    // chain these actions?
    handlePresentModalDismiss();
  };
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

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  return (
    <BottomSheetModalProvider>
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
        </ScrollView>
      </SafeAreaView>
      <Button
        onPress={handlePresentModalPress}
        title="Add item"
        color="black"
      />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View>
            <BottomSheetTextInput
              style={styles.textInput}
              value={newItem}
              onChangeText={setNewItem}
              onSubmitEditing={handleCreateItemSubmit}
              placeholder={placeholderText}
              autoFocus
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
});

export default ArchiveScreen;
