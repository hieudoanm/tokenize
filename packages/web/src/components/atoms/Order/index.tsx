import React from 'react';

export type OrderProps = {
  action: string;
  rate: string;
  size: number;
  totalSize: number;
  maxTotalSize: number;
};

const Order: React.FC<OrderProps> = ({
  action,
  rate,
  size,
  totalSize,
  maxTotalSize,
}) => {
  const columnSize = action === 'bid' ? 'order-first' : 'order-last';
  const columnAction = action === 'bid' ? 'order-last' : 'order-first';
  const bgColor = action === 'bid' ? 'bg-green-500/25' : 'bg-red-500/25';
  const textColor = action === 'bid' ? 'text-green-500' : 'text-red-500';
  const positionAlign = action === 'bid' ? 'right-0' : 'left-0';

  const width = `${(totalSize / maxTotalSize) * 100}%`;

  return (
    <div key={`order-${rate}`} className="text-xs sm:text-sm md:text-base">
      <div className="relative p-2 md:px-4 md:py-2">
        <div
          style={{ width }}
          className={`top-0 absolute h-full ${bgColor} ${positionAlign}`}
        />
        <div className="flex justify-between items-center">
          <div className={`${columnSize} text-gray-300`}>{Math.abs(size)}</div>
          <div className={`${columnAction} ${textColor} font-bold capitalize`}>
            {rate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
