import React from 'react';
import { Button, Text, View } from 'react-native';
import { Archive } from '../models';

export const ArchiveEntryComponent: React.FC<{
  archive: Archive;
  deleteArchiveEntry: Function;

}> = ({ archive: {id, name}, deleteArchiveEntry}) => {

    return (
      <View>
        <View>
          <Text>
            {id}: {name}
          </Text>
          <Button
            onPress={() => deleteArchiveEntry(id)}
            title="done"
            color="#841584"
            accessibilityLabel="add todo item"
          />
        </View>
      </View>
    );
};