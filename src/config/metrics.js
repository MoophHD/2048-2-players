import { Dimensions, Platform } from 'react-native';

const IS_ANDROID = Platform.OS === 'android';
const { height, width } = Dimensions.get('window');

export const DEVICE_HEIGHT = height;
export const DEVICE_WIDTH = width;
export const BOARD_SIDE = width * .75;

export const CELLS = 3;
export const CELL_PADDING = 2.5;
export const BOARD_PADDING = 5 - CELL_PADDING;
export const CELL_SIDE = (BOARD_SIDE - 2 * BOARD_PADDING) / CELLS;