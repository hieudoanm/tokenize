import type { NextApiRequest, NextApiResponse } from 'next';
import { OrderType } from '../../components/molecules/Orders';
import { axiosGet } from '../../utils/axios';

type Data = {
  ask: OrderType[];
  bid: OrderType[];
};

const getOrders = (orders: OrderType[], action: string) => {
  const orderDir = action === 'bid' ? -1 : 1;
  let sideOrders = orders
    .filter((order: OrderType) => {
      if (action === 'bid') return order.size > 0;
      if (action === 'ask') return order.size < 0;
    })
    .sort((a: OrderType, b: OrderType) =>
      a.rate > b.rate ? orderDir * 1 : orderDir * -1
    )
    .map((order: OrderType, index: number, array: OrderType[]) => {
      const totalSize = array
        .slice(0, index + 1)
        .reduce((previousValue: number, currentValue: OrderType) => {
          return previousValue + Math.abs(currentValue.size);
        }, 0);

      const totalAmount = array
        .slice(0, index + 1)
        .reduce((previousValue: number, currentValue: OrderType) => {
          return (
            previousValue +
            Math.abs(currentValue.size) * parseFloat(currentValue.rate)
          );
        }, 0);
      return { ...order, totalAmount, totalSize };
    });

  return sideOrders;
};

const handler = async (
  _request: NextApiRequest,
  response: NextApiResponse<Data>
) => {
  const data = await axiosGet<number[][]>(
    'https://api-pub.bitfinex.com/v2/book/tETHBTC/P0'
  );

  const orders: OrderType[] = data.map((order: number[]) => {
    const [rate, count, size] = order;
    const fixedRate = rate.toFixed(6);
    return {
      count,
      rate: fixedRate,
      size,
      totalAmount: 0,
      totalSize: 0,
    };
  });

  const bid = getOrders(orders, 'bid').filter((order: OrderType) => {
    return order.totalAmount < 5;
  });

  const ask = getOrders(orders, 'ask').filter((order: OrderType) => {
    return order.totalSize < 150;
  });

  response.status(200).json({
    ask,
    bid,
  });
};

export default handler;
