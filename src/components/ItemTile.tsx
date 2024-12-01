import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Item } from '../models';

export const ItemTile: React.FC<{
  item: Item;

}> = ({ item: {name} }) => {

  return (
    <View style={styles.tileWrapper}>
      <Text>
        {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tileWrapper: {
  }
})