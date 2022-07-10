import React from 'react';
import Orders, { OrderType } from '../../molecules/Orders';

type Orderbook = { ask: OrderType[]; bid: OrderType[] };

type OrderbookProps = { orderbook: Orderbook };

const Orderbook: React.FC<OrderbookProps> = ({ orderbook }) => {
  const { ask = [], bid = [] } = orderbook;

  const askTotalAmount = Math.max(...ask.map((order) => order.totalAmount));
  const askTotalSize = Math.max(...ask.map((order) => order.totalSize));
  const bidTotalAmount = Math.max(...bid.map((order) => order.totalAmount));
  const bidTotalSize = Math.max(...bid.map((order) => order.totalSize));

  return (
    <div className="rounded-lg border">
      <div className="border-b">
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <div className="px-2 py-1 md:px-4 md:py-2">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm">Size</p>
              <p className="text-xs sm:text-sm">Bid</p>
            </div>
          </div>
          <div className="px-2 py-1 md:px-4 md:py-2">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm">Ask</p>
              <p className="text-xs sm:text-sm">Size</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b">
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <div>
            <Orders action="bid" orders={bid} maxTotalSize={bidTotalSize} />
          </div>
          <div>
            <Orders action="ask" orders={ask} maxTotalSize={askTotalSize} />
          </div>
        </div>
      </div>
      <div className="border-b">
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <div className="px-2 py-1 md:px-4 md:py-2">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm">{bidTotalSize.toFixed(6)}</p>
              <p className="text-xs sm:text-sm">Total Size</p>
            </div>
          </div>
          <div className="px-2 py-1 md:px-4 md:py-2">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm">Total Size</p>
              <p className="text-xs sm:text-sm">{askTotalSize.toFixed(6)}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <div className="px-2 py-1 md:px-4 md:py-2">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm">{bidTotalAmount.toFixed(6)}</p>
              <p className="text-xs sm:text-sm">Total Amount</p>
            </div>
          </div>
          <div className="px-2 py-1 md:px-4 md:py-2">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm">Total Amount</p>
              <p className="text-xs sm:text-sm">{askTotalAmount.toFixed(6)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orderbook;
