import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { IMAGES } from '@/constants/linkMedia'; // Đảm bảo bạn đã import dòng này
import { useGardenArchives, useGardenPlantations } from '@/hooks/queries/useGamification';
import { useCreateGardenPlantation } from '@/hooks/mutations/useGamification';
import { GardenBuilding } from '@/types/gamification.types';
import { useCurrentUser } from '@/hooks/queries/useAuth';

const { width: screenWidth } = Dimensions.get('window');
const MAP_SIZE = screenWidth * 2;

export default function AreaDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const areaData = route.params?.areaData;

  const getErrorMessage = (error: any) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Không thể trồng cây. Vui lòng thử lại.'
    );
  };

  const [newSpot, setNewSpot] = useState<{ xratio: number; yratio: number } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const { data: archives = [] } = useGardenArchives(isModalVisible);

  const { data: currentUser } = useCurrentUser();
  // Lấy danh sách cây đã trồng ở khu vực này
  const { data: plantedTreesData = [] } = useGardenPlantations(
    areaData?.building as GardenBuilding
  );

  // Mutation để trồng cây mới
  const { mutate: createPlantation, isPending: isCreating } = useCreateGardenPlantation();

  // 1. Chỉ cắm chốt đỏ khi bấm vào map
  const handleMapPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;

    const tapXRatio = Number((locationX / MAP_SIZE).toFixed(4));
    const tapYRatio = Number((locationY / MAP_SIZE).toFixed(4));

    setNewSpot({ xratio: tapXRatio, yratio: tapYRatio });
  };

  // 2. Nút nhà dưới góc phải mở Modal
  const handleOpenModal = () => {
    if (!newSpot) {
      Alert.alert('Thông báo', 'Vui lòng chạm vào bản đồ để chọn một ô trống trước nhé!');
      return;
    }
    setIsModalVisible(true);
  };

  const handlePlantTree = () => {
    if (newSpot && selectedPlant && areaData?.building) {
      // Tạo slotId unique từ vị trí được chọn
      const slotId = `${areaData.building}-${newSpot.xratio.toFixed(2)}-${newSpot.yratio.toFixed(2)}`;

      createPlantation(
        {
          archiveId: selectedPlant,
          slotId: slotId,
          building: areaData.building as GardenBuilding,
        },
        {
          onSuccess: () => {
            setIsModalVisible(false);
            setSelectedPlant(null);
            setNewSpot(null);
            Alert.alert('Thành công', 'Trồng cây thành công!');
          },
          onError: (error) => {
            Alert.alert('Lỗi', getErrorMessage(error));
          },
        }
      );
    }
  };

  const getGridSource = () => {
    if (!areaData?.gridDetail) return null;
    if (typeof areaData.gridDetail === 'string' && areaData.gridDetail.startsWith('http')) {
      return { uri: areaData.gridDetail };
    }
    return areaData.gridDetail;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="border-border/20 z-20 flex-row items-center justify-between border-b bg-white px-4 py-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-9 w-9 items-center justify-center rounded-full bg-primary-50">
          <Ionicons name="chevron-back" size={20} color="#16a34a" />
        </TouchableOpacity>
        <Text className="font-inter-bold text-lg text-foreground">UIT Xanh</Text>
        <View className="h-9 w-9" />
      </View>

      {/* Map Area */}
      <View className="relative flex-1 bg-gray-50">
        <View className="pointer-events-none absolute left-0 right-0 top-4 z-10 items-center">
          <View className="mb-2 rounded-full bg-primary-100/90 px-4 py-1.5">
            <Text className="font-inter-semibold text-sm text-primary-800">
              {areaData?.name || 'Khu vực'}
            </Text>
          </View>
        </View>

        {/* NÚT FLOAT ICON HOUSE GÓC PHẢI DƯỚI */}
        <TouchableOpacity
          onPress={handleOpenModal}
          className="absolute bottom-8 right-6 z-20 h-16 w-16 items-center justify-center rounded-full border border-gray-100 bg-white shadow-lg">
          {/* Đảm bảo IMAGES.house đã được import */}
          <Image source={{ uri: IMAGES.house }} className="h-8 w-8" resizeMode="contain" />
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          className="flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            maximumZoomScale={4}
            minimumZoomScale={0.5}
            zoomScale={1}
            contentContainerStyle={{ flexGrow: 1 }}>
            <Pressable
              style={{ width: MAP_SIZE, height: MAP_SIZE }}
              className="relative items-center justify-center"
              onPress={handleMapPress}>
              <Image
                source={getGridSource()}
                className="absolute h-full w-full"
                resizeMode="contain"
              />

              {/* RENDER CÂY (Tạo kích thước Touch to hơn 1 tí (40x40) để block click vào nền map) */}
              {/* RENDER CÂY */}
              {/* RENDER CÂY */}
              {plantedTreesData?.map((tree) => {
                const [, xStr, yStr] = tree.slotId?.split('-') || [];
                const xratio = xStr ? parseFloat(xStr) : Math.random();
                const yratio = yStr ? parseFloat(yStr) : Math.random();
                const isMyTree = Boolean(
                  currentUser?.userProfile?.id && tree.user?.id === currentUser.userProfile.id
                );
                const planterName = isMyTree
                  ? 'Bạn'
                  : tree.user?.displayName?.trim().split(/\s+/).pop() || 'Ẩn danh';

                return (
                  <TouchableOpacity
                    key={tree.id}
                    activeOpacity={0.9}
                    onPress={() =>
                      Alert.alert('UIT Xanh', `Trồng bởi ${tree.user?.displayName || 'Ẩn danh'}`)
                    }
                    style={{
                      position: 'absolute',
                      left: `${xratio * 100}%`,
                      top: `${yratio * 100}%`,
                      width: 46,
                      height: 58,
                      transform: [{ translateX: -23 }, { translateY: -35 }],
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: isMyTree ? 10 : 1,
                    }}>
                    {/* TOOLTIP TÊN NGƯỜI TRỒNG (Màu mới, chữ nhỏ hơn) */}
                    <View
                      className={`absolute -top-1 z-20 items-center justify-center rounded ${
                        isMyTree ? 'bg-blue-500' : 'border border-gray-200 bg-background'
                      }`}
                      style={{
                        minWidth: 30,
                        maxWidth: 140,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.2,
                        shadowRadius: 1.41,
                        elevation: 2,
                      }}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className={`text-center text-[10px] font-thin ${
                          isMyTree ? 'text-white' : 'text-gray-700'
                        }`}>
                        {planterName}
                      </Text>
                      {/* Mũi nhọn (Caret) trỏ xuống */}
                    </View>

                    {/* ẢNH CÂY CÓ VIỀN XANH KHI LÀ CỦA MÌNH */}
                    <View
                      className={`mt-2 items-center justify-center rounded-full ${
                        isMyTree ? 'border-2 border-primary-500 bg-primary-50 p-1' : 'p-1'
                      }`}>
                      <Image
                        source={{ uri: tree.seedStage4ImageUrl }}
                        style={{ width: 22, height: 22 }}
                        resizeMode="contain"
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
              {/* CHỐT ĐÁNH DẤU TẠM THỜI (Giờ sẽ luôn hiện khi có newSpot) */}
              {newSpot && (
                <View
                  style={{
                    position: 'absolute',
                    left: `${newSpot.xratio * 100}%`,
                    top: `${newSpot.yratio * 100}%`,
                    transform: [{ translateX: -16 }, { translateY: -32 }], // Đẩy pin lên cho mũi nhọn cắm vào tọa độ
                  }}
                  pointerEvents="none">
                  <Ionicons name="location" size={32} color="#ef4444" />
                </View>
              )}
            </Pressable>
          </ScrollView>
        </ScrollView>
      </View>

      {/* Modal Xuất Hiện Ở GIỮA MÀN HÌNH */}
      <Modal
        animationType="fade" // Đổi từ slide sang fade cho popup giữa màn hình
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/50 px-4">
          {/* Box chứa Modal - Bo góc tròn, giới hạn chiều cao max-h-[80%] */}
          <View className="max-h-[80%] w-full rounded-2xl bg-background p-5 shadow-xl">
            <Text className="mb-4 text-center font-inter-bold text-xl text-foreground">
              Chọn cây trồng
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
              {archives.length > 0 ? (
                <FlatList
                  data={archives}
                  keyExtractor={(item) => item.id}
                  numColumns={4}
                  scrollEnabled={false}
                  columnWrapperStyle={{ justifyContent: 'space-between' }}
                  contentContainerStyle={{ paddingHorizontal: 4 }}
                  renderItem={({ item }) => {
                    const iconUrl = item.displayImageUrl || item.seed?.stage4ImageUrl;
                    const isPlanted = Boolean(item.isPlanted);

                    return (
                      <TouchableOpacity
                        disabled={isPlanted}
                        onPress={() => {
                          if (!isPlanted) {
                            setSelectedPlant(item.id);
                          }
                        }}
                        style={{ width: '18%', aspectRatio: 1 }}
                        className={`mb-3 items-center justify-center rounded-xl border-2 ${isPlanted ? 'border-gray-200 bg-gray-100 opacity-50' : selectedPlant === item.id ? 'border-primary-500 bg-primary-50' : 'border-transparent bg-gray-50'}`}>
                        {iconUrl ? (
                          <Image
                            source={{ uri: iconUrl }}
                            className="h-10 w-10"
                            resizeMode="contain"
                          />
                        ) : (
                          <Text className="text-3xl">🌱</Text>
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              ) : (
                <View className="w-full items-center rounded-xl bg-gray-50 px-4 py-6">
                  <Text className="text-center text-sm text-gray-500">
                    Chưa có cây trồng nào để hiển thị
                  </Text>
                </View>
              )}
            </ScrollView>

            <View className="flex-row justify-between pt-2">
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  setSelectedPlant(null);
                }}
                className="mr-2 flex-1 items-center rounded-xl bg-gray-100 py-3.5">
                <Text className="font-inter-semibold text-gray-600">Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePlantTree}
                disabled={!selectedPlant || isCreating}
                className={`ml-2 flex-1 items-center rounded-xl py-3.5 transition-colors ${selectedPlant && !isCreating ? 'bg-primary-500' : 'bg-gray-300'}`}>
                <Text
                  className={`font-inter-semibold ${selectedPlant && !isCreating ? 'text-white' : 'text-gray-500'}`}>
                  {isCreating ? 'Đang trồng...' : 'Xác nhận'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
