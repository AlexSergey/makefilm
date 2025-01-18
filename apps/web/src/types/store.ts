import { ThunkDispatch } from '@reduxjs/toolkit';
import { Action } from 'redux';

/*import { Services } from '../services';
import { ImageState } from './image';*/

// export type Dispatcher = ThunkDispatch<RootState, ThunkExtras, Action>;
export type Dispatcher = ThunkDispatch<void, void, Action>;

/* export interface ThunkExtras {
  services: Services;
} */

/*export interface StoreProps extends ThunkExtras {
  initialState?: Record<string, unknown>;
}*/

export type RootState = Record<string, unknown>;

export interface StoreProps {
  initialState?: Record<string, unknown>;
}
/* export interface RootState {
  image: ImageState;
}
*/
