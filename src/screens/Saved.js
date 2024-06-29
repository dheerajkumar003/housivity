import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Colors} from '../assets/theme';
import {useDispatch, useSelector} from 'react-redux';
import Heart from 'react-native-vector-icons/Octicons';
import Location from 'react-native-vector-icons/FontAwesome6';
import {removeFromCart} from '../../src/redux/CartSlice';
import {removeFromSavedList} from '../redux/SavedPropertySlice';
import {convertToCrLac} from '../utils/convertCurrency';
const Saved = () => {
  const savedProperties = useSelector(state => state.myProperties);
  const dispatch = useDispatch();
  console.log('saved----saved----', savedProperties?.length);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleScroll = event => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(xOffset / Dimensions.get('window').width);
    setCurrentIndex(index);
  };

  const handleScrollToIndexFailed = info => {
    const offset = info.index * Dimensions.get('window').width;
    flatListRef.current.scrollToOffset({offset, animated: true});
  };
  const renderProperty = ({item}) => {
    return (
      <View style={styles.card}>
        <FlatList
          horizontal
          ref={flatListRef}
          data={item.images}
          renderItem={({item}) => (
            <Image
              source={{
                uri: `https://logiqproperty.blr1.digitaloceanspaces.com/${item}`,
              }}
              style={styles.image}
            />
          )}
          keyExtractor={(image, index) => `${image}-${index}`}
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScrollToIndexFailed={handleScrollToIndexFailed}
        />
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {item.images.length}
          </Text>
        </View>
        <View style={styles.featuredTypeView}>
          <Text style={styles.featuredTypeText}>
            {item?.isFeaturedListing === true
              ? 'Featured Project'
              : item?.isLimelightListing === true
              ? 'Limelight'
              : 'Sample House Ready'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 10,
            alignItems: 'center',
          }}>
          {item?.displayPrice?.priceRange == null ? (
            <Text>Price range not decided</Text>
          ) : (
            <Text style={styles.priceRangeText}>
              {/* {`₹${item?.displayPrice?.priceRange?.from} to ₹${item?.displayPrice?.priceRange?.to}`} */}
              {`${convertToCrLac(
                item?.displayPrice?.priceRange?.from,
              )} to ${convertToCrLac(item?.displayPrice?.priceRange?.to)}`}
            </Text>
          )}
          <TouchableOpacity onPress={() => dispatch(removeFromSavedList(item))}>
            <Heart name="heart-fill" size={20} color={Colors.orange} />
          </TouchableOpacity>
        </View>
        <View style={{paddingVertical: 15}}>
          <Text style={styles.propertyNameText}>{item?.name}</Text>
          <Text style={styles.byText}>{`by ${item?.company?.name}`}</Text>
        </View>
        <View
          style={{flexDirection: 'row', columnGap: 10, alignItems: 'center'}}>
          <Location name="location-dot" size={20} color={Colors.orange} />
          <Text
            style={
              styles.locationText
            }>{`${item?.address?.area}, ${item?.address?.city?.name}`}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          {item?.configuration?.map((type, index) => {
            return <Text style={styles.typeText}>{`${type} `}</Text>;
          })}
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.main}>
      <View style={{padding: 16, elevation: 4, backgroundColor: Colors.white}}>
        <Text style={styles.title}>Saved Property</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.userView}>
          {savedProperties?.length > 0 && (
            <Text style={styles.userText}>
              Dear User{' '}
              <Text style={styles.normalText}>
                , here are your liked properties
              </Text>
            </Text>
          )}
        </View>
        <FlatList
          data={savedProperties}
          renderItem={renderProperty}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{marginBottom: 15}} />}
          key={item => item.id}
          ListEmptyComponent={() => {
            return (
              <View style={styles.noDataView}>
                <Text style={styles.noDataText}>No properties saved yet.</Text>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Saved;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    // padding: 16,
  },
  card: {
    flex: 1,
    borderWidth: 0.5,
    // paddingHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    borderColor: Colors.grey,
  },
  propertyNameText: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: '500',
  },
  byText: {
    color: Colors.black,
    fontSize: 14,
  },
  image: {
    width: Dimensions.get('window').width / 1.3,
    height: 160,
    marginRight: 15,
    borderRadius: 10,
  },
  locationText: {
    color: Colors.black,
    fontSize: 13,
  },
  typeText: {
    color: Colors.black,
    fontSize: 13,
    paddingTop: 15,
  },
  rangeAndHeartView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    alignItems: 'center',
  },
  priceRangeText: {
    color: Colors.black,
    fontSize: 13,
    fontWeight: '700',
    paddingTop: 10,
  },
  title: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: '500',
  },
  userView: {
    paddingVertical: 20,
  },
  userText: {
    color: Colors.orange,
    fontStyle: 'italic',
    fontWeight: '700',
    fontSize: 15,
  },
  normalText: {
    color: Colors.black,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 15,
  },
  counterContainer: {
    backgroundColor: Colors.black,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignSelf: 'center',
    borderRadius: 999,
    marginTop: 10,
  },
  counterText: {
    color: Colors.white,
    fontSize: 15,
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: Colors.black,
    fontSize: 15,
  },
  featuredTypeView: {
    backgroundColor: Colors.green,
    paddingVertical: 8,
    marginTop: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    flex: 1,
  },
  featuredTypeText: {
    color: Colors.white,
    fontSize: 12,
  },
});
