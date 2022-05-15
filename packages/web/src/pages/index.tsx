import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { OrderType } from '../components/molecules/Orders';
import Orderbook from '../components/organisms/Orderbook';
import { axiosGet } from '../utils/axios';

const API = process.env.API || 'http://localhost:3000';
const NODE_ENV = process.env.NODE_ENV || 'development';

let socket: any;

type OrderbookType = {
  ask: OrderType[];
  bid: OrderType[];
};

type HomePageProps = { orderbook: OrderbookType };

const HomePage: NextPage<HomePageProps> = ({ orderbook: { ask, bid } }) => {
  const [orderbook, setOrders] = useState<OrderbookType>({ ask, bid });

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    const devSocket = 'http://localhost:8080';
    const prodSocket = 'https://tokenize-socket.herokuapp.com';
    console.log('NODE_ENV', NODE_ENV);
    const uri = NODE_ENV === 'production' ? prodSocket : devSocket;
    socket = io(uri);

    socket.on('connect', () => {
      console.log(socket.connected);
    });

    socket.on('update-book', (orderbook: OrderbookType) => {
      setOrders(orderbook);
    });
  };

  return (
    <div className="bg-[#14151a] text-white">
      <div className="container mx-auto p-8">
        <Orderbook orderbook={orderbook} />
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  const orderbook = await axiosGet<OrderbookType>(`${API}/api/book`);
  return { props: { orderbook } };
};

export default HomePage;
