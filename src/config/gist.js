import { DEVICE_HEIGHT } from "config/metrics";

export const getAdjustedSize = ( size ) => {
    return Math.round(size * DEVICE_HEIGHT / 375);
}