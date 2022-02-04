/* import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PriceWsEvent } from '../api/api.enums';
import { IChompPrice, IUser } from '../api/api.interfaces';
import { setUserPriceEffect } from '../redux/user_prices/user_prices.effects';
import { useWSConnect } from './useWSconnect';

export const useWSPrices = (userProfile: IUser) => {
  const dispatch = useDispatch();
  const socket = useWSConnect(userProfile);

  useEffect(() => {
    if (socket) {
      socket.on(PriceWsEvent.CHOMP_PRICE, (data: any) => {
        const chompPrice: IChompPrice = JSON.parse(data);
        dispatch(setUserPriceEffect(chompPrice));
      });
    }
  }, [socket, dispatch]);
};
 */
export const hello = "";
