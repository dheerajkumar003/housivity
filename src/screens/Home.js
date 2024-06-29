import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import {Colors} from '../assets/theme';
import Heart from 'react-native-vector-icons/Octicons';
import Location from 'react-native-vector-icons/FontAwesome6';
import {addToSavedList, removeFromSavedList} from '../redux/SavedPropertySlice';
import {useDispatch, useSelector} from 'react-redux';
import FilterModal from '../components/FilterModal';
import {convertToCrLac} from '../utils/convertCurrency';

const filterData = [
  {
    title: 'Filters',
    id: 1,
    icon: require('../assets/images/filter.png'),
  },
  {
    title: 'Types of Property',
    id: 2,
    icon: require('../assets/images/down-caret.png'),
  },
  {
    title: 'BHK Type',
    id: 3,
    icon: require('../assets/images/down-caret.png'),
  },
];

const Home = () => {
  const isFocused = useIsFocused();
  const [propertyList, setPropertyList] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const savedProperties = useSelector(state => state.myProperties);

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
  const getPropertyList = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://api.housivity.com/api/v1/property',
        {
          params: {
            city: 'Gandhinagar',
            // projectType: ['pgHostel'],
            page: 1,
          },
        },
      );

      // console.log('getPropertyList success', response?.data?.propertyList);
      if (response?.data?.statusCode === 200) {
        setPropertyList(response?.data?.propertyList);
        const newProperties = response?.data?.propertyList;
        if (pageNumber === 1) {
          setPropertyList(newProperties);
          setLoading(false);
        } else {
          setPropertyList(prevList => [...prevList, ...newProperties]);
          setLoading(false);
        }
        setHasMore(newProperties.length > 0);
      }
    } catch (error) {
      console.log('getPropertyList error', error?.response);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProperties = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      getPropertyList(nextPage);
    }
  };

  useEffect(() => {
    getPropertyList();
  }, [isFocused]);

  const handleSaveProperty = property => {
    if (savedProperties?.some(item => item.id === property.id)) {
      dispatch(removeFromSavedList(property));
    } else {
      dispatch(addToSavedList(property));
    }
  };

  // const convertToCrLac = amount => {
  //   if (amount >= 10000000) {
  //     return `₹${(amount / 10000000).toFixed(2)} Cr`;
  //   } else if (amount >= 100000) {
  //     return `₹${(amount / 100000).toFixed(2)} Lac`;
  //   } else {
  //     return `₹${amount.toLocaleString()}`;
  //   }
  // };

  const renderProperty = ({item}) => {
    // console.log('itemmmmmmmm', item);
    const isSaved = savedProperties?.some(property => property.id === item.id);
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
        <View style={styles.rangeAndHeartView}>
          {item?.displayPrice?.priceRange == null ? (
            <Text style={styles.priceRangeText}>Price range not decided</Text>
          ) : (
            <Text style={styles.priceRangeText}>
              {/* {`₹${item?.displayPrice?.priceRange?.from} to ₹${item?.displayPrice?.priceRange?.to}`} */}
              {`${convertToCrLac(
                item?.displayPrice?.priceRange?.from,
              )} to ${convertToCrLac(item?.displayPrice?.priceRange?.to)}`}
            </Text>
          )}

          <TouchableOpacity onPress={() => handleSaveProperty(item)}>
            <Heart
              name={isSaved ? 'heart-fill' : 'heart'}
              size={20}
              color={Colors.orange}
            />
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

  const renderFilters = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: Colors.white,
          paddingHorizontal: 16,
          paddingVertical: 8,
          columnGap: 10,
          borderColor: item.title === filterType ? Colors.orange : Colors.grey,
          borderWidth: 1,
          borderRadius: 30,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          setFilterType(item.title);
          setIsOpenModal(true);
        }}>
        {item.title === filterType && (
          <View style={styles.filtersCountView}>
            <Text style={styles.filtercountText}>0</Text>
          </View>
        )}

        <Text
          style={{
            color: item.title === filterType ? Colors.orange : Colors.grey,
          }}>
          {item.title}
        </Text>
        <Image
          source={item.icon}
          style={{
            width: 20,
            height: 20,
          }}
        />
      </TouchableOpacity>
    );
  };

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
  };
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <View style={{paddingVertical: 16}}>
          <FlatList
            horizontal
            data={filterData}
            ItemSeparatorComponent={() => <View style={{marginRight: 20}} />}
            renderItem={renderFilters}
          />
        </View>
        <FlatList
          data={propertyList}
          renderItem={renderProperty}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{marginBottom: 15}} />}
          onEndReached={loadMoreProperties}
          onEndReachedThreshold={0.5}
          key={item => item.id}
          ListFooterComponent={
            loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color={Colors.orange} />
              </View>
            ) : null
          }
        />
      </View>
      {isOpenModal && (
        <FilterModal
          isModalVisible={isOpenModal}
          setModalVisible={setIsOpenModal}
          toggleModal={() => toggleModal()}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    flex: 1,
    borderWidth: 0.5,
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
  featuredTypeView: {
    backgroundColor: Colors.green,
    paddingVertical: 8,
    marginTop: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    flex: 1,
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
  featuredTypeText: {
    color: Colors.white,
    fontSize: 12,
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
  filtersCountView: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 999,
  },
  filtercountText: {
    color: Colors.white,
    fontSize: 10,
  },
});