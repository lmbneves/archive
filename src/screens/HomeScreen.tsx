import React, { useCallback, useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, View, TextInput, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList  } from '../navigation/types';
import { ArchiveEntryComponent } from '../components/ArchiveEntry';
import { Archive } from '../models'
import { getDBConnection, createTable, deleteTable, getArchives, saveArchives, deleteArchive } from '../services/db-service';
import uuid from 'react-native-uuid';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [newArchive, setNewArchive] = useState('');

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

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  const addArchiveEntry = async () => {
    if (!newArchive.trim()) return;
    try {
      const newArchives = [...archives, {
        id: uuid.v4() as string, name: newArchive
      }];
      setArchives(newArchives);
      const db = await getDBConnection();
      await saveArchives(db, newArchives);
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
  
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          {archives.map((archive) => (
            <Pressable
              onPress={() => 
                navigation.navigate('Archive', { archive: archive })
              }
            >
              <ArchiveEntryComponent key={archive.id} archive={archive} deleteArchiveEntry={deleteArchiveEntry} />
            </Pressable>
            // <ArchiveEntryComponent key={archive.id} archive={archive} />
          ))}
        </View>
        <View>
          <TextInput value={newArchive} onChangeText={text => setNewArchive(text)} />
          <Button
            onPress={addArchiveEntry}
            color="#841584"
            accessibilityLabel="add archive"
            title="Add new archive"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen;