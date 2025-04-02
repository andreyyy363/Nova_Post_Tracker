import {FC} from 'react';
import {useGetAllPostsQuery} from '../services/api/api';
import {View, Text, FlatList} from 'react-native';
import {styles} from './styles';

const renderItem = ({item}: {item: {title: string}}) => (
  <View style={styles.item}>
    <Text style={{fontSize: 16, textAlign: 'center', fontWeight: 600}}>{item.title}</Text>
    <View style={{height: 1, backgroundColor: 'black'}} />
  </View>
);

const Track: FC = () => {
  const {data} = useGetAllPostsQuery();
  console.log(data);


  return (
    <View style={styles.container}>
      <Text>Track</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default Track;
