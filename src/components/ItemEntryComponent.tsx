import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Item } from '../models';

export const ItemEntryComponent: React.FC<{
  item: Item;

}> = ({ item: {id, name} }) => {

    return (
      <View
        style={styles.container}
        // onPress={gotoArchiveView}
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