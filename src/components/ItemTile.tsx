import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Item } from '../models';

export const ItemTile: React.FC<{
  item: Item;

}> = ({ item: {name} }) => {

  return (
    <Pressable style={styles.tileContainer}>
      <Text>
        {name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tileContainer: {
    flex: 0.5,
    height: 200,
    marginVertical: 15,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderColor: 'bbb',
    borderRadius: 3,
  }
})