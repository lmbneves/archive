import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LeafyGreen } from 'lucide-react-native';
import { Archive } from '../models';

export const ArchiveTile: React.FC<{
  archive: Archive;

}> = ({ archive: {name}}) => {

  return (
    <View style={styles.tileContainer}>
      <View style={styles.tileDetail}>
        <LeafyGreen size="16" />
        <Text style={styles.title}>
          {name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tileContainer: {
    flex: 1,
    marginBottom: 15,  
    padding: 20,
    backgroundColor: 'white',
    borderColor: 'bbb',
    borderRadius: 6,
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  tileDetail: {
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center'
  },
  title: {
    marginLeft: 12,
    fontSize: 16,
  }
})