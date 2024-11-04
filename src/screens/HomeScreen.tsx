import React, { useCallback, useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, View, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList  } from '../navigation/types';
import { ArchiveEntryComponent } from '../components/ArchiveEntry';
import { AddModal } from '../components/AddModal';
import { Archive } from '../models'
import { getDBConnection, createTable, getArchives, saveArchives, deleteArchive } from '../services/db-service';
import uuid from 'react-native-uuid';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [newArchive, setNewArchive] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleModalNewArchive = (name: string) => {
    addArchiveEntry(name);
    setModalVisible(false);
  };
  const addArchiveEntry = async (name: string) => {
    if (!name.trim()) return;
    try {
      const newArchives = [...archives, {
        id: uuid.v4() as string, name: name
      }];
      setArchives(newArchives);
      const db = await getDBConnection();
      await saveArchives(db, newArchives)
      // setNewArchive('');
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
        <View>
          <Button
            onPress={() => setModalVisible(true)}
            color="#841584"
            accessibilityLabel="open add archive modal"
            title="Create archive"
          />
          <AddModal
            isVisible={modalVisible}
            setInputValue={handleModalNewArchive}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen;