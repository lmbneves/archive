import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { 
  Button, 
  Modal, 
  Pressable, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Text } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { AppContext } from '../context/app-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList  } from '../navigation/types';
import { getDBConnection, createTable, getItems, saveItems, deleteArchive } from '../services/db-service';
import { ItemEntryComponent } from '../components/ItemEntryComponent';
import { Item } from '../models';
import uuid from 'react-native-uuid';

type Props = NativeStackScreenProps<RootStackParamList, 'Archive'>;

const ArchiveScreen: React.FC<Props> = ({ navigation, route }) => {
  const { archives, updateState } = useContext(AppContext);

  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState('');
  const [placeholderText, setPlaceholderText] = useState(`Add to ${route.params.archive.name}...`)

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const bottomSheetMenuModalRef = useRef<BottomSheetModal>(null);
  const snapPointsMenu = useMemo(() => ["40%"], []);
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
  const handlePresentMenuModalPress = useCallback(() => {
    bottomSheetMenuModalRef.current?.present();
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
  const handleRemoveArchive = async () => {
    removeArchive();
    navigation.navigate('Home');
  };
  const removeArchive = async () => {
    try {
      const db = await getDBConnection();
      await deleteArchive(db, route.params.archive.id);
      const newArchives = archives?.filter(archive => archive.id != route.params.archive.id);
      updateState({ archives: newArchives });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handlePresentMenuModalPress}>
          <Text>Menu</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
      {/* Add new item modal sheet */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
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
      {/* Additional archive actions modal sheet */}
      <BottomSheetModal
        ref={bottomSheetMenuModalRef}
        snapPoints={snapPointsMenu}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View>
            <Button 
              title="Delete archive"
              onPress={() => setConfirmModalVisible(true)}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
      {/* Confirm delete archive modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => {setConfirmModalVisible(!confirmModalVisible)}}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Are you sure you want to delete this archive?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleRemoveArchive}>
                <Text style={styles.confirmButton}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setConfirmModalVisible(!confirmModalVisible)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  confirmButton: {
    color: 'blue',
  },
  cancelButton: {
    color: 'red',
  }
});

export default ArchiveScreen;
