import Order from '../../atoms/Order';

export type Action = 'ask' | 'bid';

export type OrderType = {
  count: number;
  size: number;
  rate: string;
  totalAmount: number;
  totalSize: number;
};

export type OrdersProps = {
  action: Action;
  orders: OrderType[];
  maxTotalSize: number;
};

const Orders: React.FC<OrdersProps> = ({
  action,
  orders = [],
  maxTotalSize = 0,
}) => {
  return (
    <div>
      {orders.map((order: OrderType) => {
        const { size, rate, totalSize } = order;

        return (
          <Order
            key={`order-${rate}`}
            action={action}
            rate={rate}
            size={size}
            totalSize={totalSize}
            maxTotalSize={maxTotalSize}
          />
        );
      })}
    </div>
  );
};

export default Orders;
