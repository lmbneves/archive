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
import { ArchiveEntryComponent } from '../components/ArchiveEntry';
import { Archive } from '../models'
import { getDBConnection, createTable, getArchives, saveArchives, deleteArchive } from '../services/db-service';
import uuid from 'react-native-uuid';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [newArchive, setNewArchive] = useState('');

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["15%"], []);

  const loadDataCallback = useCallback(async () => {
    try {
      const initArchives = [
        { id: uuid.v4() as string, name: 'Books' }
      ];
      const db = await getDBConnection();
      await createTable(db);
      const storedArchives = await getArchives(db);
      if (storedArchives.length) {
        setArchives(storedArchives);
      } else {
        await saveArchives(db, initArchives);
        setArchives(initArchives);
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

  const handleCreateArchiveSubmit = () => {
    addArchiveEntry();
    // chain these actions?
    handlePresentModalDismiss();
  };

  const addArchiveEntry = async () => {
    handlePresentModalPress();
    if (!newArchive.trim()) return;
    try {
      const newArchives = [...archives, {
        id: uuid.v4() as string, name: newArchive
      }];
      setArchives(newArchives);
      const db = await getDBConnection();
      await saveArchives(db, newArchives)
      setNewArchive('');
    } catch (error) {
      console.error(error);
    }
  };
  const deleteArchiveEntry = async (id: string) => {
    try {
      const db = await getDBConnection();
      await deleteArchive(db, id);
      setArchives(archives.filter(archive => archive.id != id));
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
            {archives.map((archive) => (
              <Pressable
                key={archive.id}
                onPress={() => 
                  navigation.navigate('Archive', { archive: archive })
                }
              >
                <ArchiveEntryComponent key={archive.id} archive={archive} deleteArchiveEntry={deleteArchiveEntry} />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      <Button
        onPress={handlePresentModalPress}
        title="Create archive"
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
              value={newArchive}
              onChangeText={setNewArchive}
              onSubmitEditing={handleCreateArchiveSubmit}
              placeholder="Name archive..."
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

export default HomeScreen;