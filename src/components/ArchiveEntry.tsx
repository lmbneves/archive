import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Archive } from '../models';

export const ArchiveEntryComponent: React.FC<{
  archive: Archive;
  deleteArchiveEntry: Function;

}> = ({ archive: {id, name}, deleteArchiveEntry}) => {

    return (
      <View
        style={styles.container}
      >
          <Text>
            {name} ({id})
          </Text>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    borderColor: '#ccc',
    borderBottomWidth: 1,
  }
})