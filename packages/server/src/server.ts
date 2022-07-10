import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import WebSocket from 'ws';
import { axiosGet } from './utils/axios';

const PORT = process.env.PORT || 8080;

type Order = {
  count: number;
  size: number;
  rate: string;
  totalAmount: number;
  totalSize: number;
};

// bitfinex ws
const wss = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

const subscribeMessage = JSON.stringify({
  event: 'subscribe',
  channel: 'book',
  symbol: 'tETHBTC',
  prec: 'P0',
  freq: 'F1',
  len: 25,
});

wss.on('open', () => {
  wss.send(JSON.stringify({ event: 'conf', flags: 536870912 }));
  wss.send(subscribeMessage);
});

// tokenize ws
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'https://tokenize-web.vercel.app'],
    // allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

const getOrders = (orders: Order[], action: string) => {
  const orderDir = action === 'bid' ? -1 : 1;
  const sideOrders = orders
    .filter((order: Order) => {
      if (action === 'bid') return order.size > 0;
      if (action === 'ask') return order.size < 0;
    })
    .sort((a: Order, b: Order) =>
      a.rate > b.rate ? orderDir * 1 : orderDir * -1
    )
    .map((order: Order, index: number, array: Order[]) => {
      const totalSize = array
        .slice(0, index + 1)
        .reduce((previousValue: number, currentValue: Order) => {
          return previousValue + Math.abs(currentValue.size);
        }, 0);

      const totalAmount = array
        .slice(0, index + 1)
        .reduce((previousValue: number, currentValue: Order) => {
          return (
            previousValue +
            Math.abs(currentValue.size) * parseFloat(currentValue.rate)
          );
        }, 0);
      return { ...order, totalAmount, totalSize };
    });

  return sideOrders;
};

io.on('connection', (socket) => {
  wss.on('message', async (rawData: WebSocket.RawData) => {
    try {
      const message = rawData.toString();
      const event = JSON.parse(message);

      if (typeof event === 'object' && !Array.isArray(event)) {
        console.log('event', event);
        return;
      }

      const [channelId, data] = event;

      if (typeof data === 'string') {
        console.log(channelId, 'data', data);
        return;
      }

      if (typeof data === 'object' && !Array.isArray(data)) {
        console.log(channelId, 'data', data);
        return;
      }

      const axiosData = await axiosGet<number[][]>(
        'https://api-pub.bitfinex.com/v2/book/tETHBTC/P0'
      );

      const orders: Order[] = axiosData.map((order: number[]) => {
        const [rate, count, size] = order;
        const fixedRate = rate.toFixed(6);
        return { rate: fixedRate, count, size, totalAmount: 0, totalSize: 0 };
      });

      const bid = getOrders(orders, 'bid').filter((order: Order) => {
        return order.totalAmount < 5;
      });

      const ask = getOrders(orders, 'ask').filter((order: Order) => {
        return order.totalSize < 150;
      });

      socket.broadcast.emit('update-book', { ask, bid });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
