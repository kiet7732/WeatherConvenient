import { Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

// Ngưỡng phân biệt mobile và tablet/pc
export const IS_MOBILE = SCREEN_WIDTH < 600;

// Thông số cho mobile
const MOBILE_CARD_MIN_WIDTH = 200;
const MOBILE_CARD_MAX_WIDTH = 360;

// Thông số cho tablet/pc
const PC_CARD_MIN_WIDTH = 340;
const PC_CARD_MAX_WIDTH = 500;

// Chọn thông số phù hợp
export const CARD_MIN_WIDTH = IS_MOBILE ? MOBILE_CARD_MIN_WIDTH : PC_CARD_MIN_WIDTH;
export const CARD_MAX_WIDTH = IS_MOBILE ? MOBILE_CARD_MAX_WIDTH : PC_CARD_MAX_WIDTH;

// Card width responsive
export const CARD_WIDTH = Math.max(
  CARD_MIN_WIDTH,
  Math.min(SCREEN_WIDTH - 32, CARD_MAX_WIDTH)
);
export const CARD_HEIGHT = Math.round(CARD_WIDTH * 0.54);   // Tỉ lệ gần giống 342x184 