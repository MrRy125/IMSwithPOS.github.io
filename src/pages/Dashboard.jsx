import  { useState, useEffect } from 'react';
import { loadFromLocalStorage } from '../utils/localStorageHelpers';
import 
{ BsPeopleFill, BsListCheck, BsCartFill, BsFillArchiveFill}
 from 'react-icons/bs'
 import 
 { Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie } 
 from 'recharts';

const Dashboard = () => {

  const [metrics, setMetrics] = useState({
    salesAmount: 0,
    purchasesAmount: 0,
    inventoryQuantity: 0,
    inventoryAmount: 0,
  });
  console.log(metrics.purchaseAmount)

  

  const [weeklySalesData, setWeeklySalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [inStockProducts, setInStockProducts] = useState([]);

  useEffect(() => {
    // Load data from localStorage or initialData
    const products = loadFromLocalStorage('products') || [];
    const sales = loadFromLocalStorage('sales') || [];
    const purchases = loadFromLocalStorage('purchases') || [];


    // products.reduce((acc, product) => acc + (product.price * (product.purchasesAmount - product.salesAmount)), 0);

    // Calculate metrics
    const salesAmount = sales.reduce((acc, sale) => acc + sale.price * sale.quantity, 0);
    const inventoryAmount = purchases.reduce((acc, purchase) => acc + purchase.price * purchase.quantity, 0);
    const purchasesAmount = inventoryAmount - salesAmount;
    const inventoryQuantity = products.reduce((acc, product) => acc + product.purchasesAmount, 0);

    setMetrics({ salesAmount, purchasesAmount, inventoryQuantity, inventoryAmount });

    // Prepare weekly sales data (dummy data here, replace with actual data)
    const dummyWeeklySalesData = [
      { name: 'Mon', currentWeek: 20, previousWeek: 5 },
      { name: 'Tue', currentWeek: 45, previousWeek: 50 },
      { name: 'Wed', currentWeek: 30, previousWeek: 73 },
      { name: 'Thu', currentWeek: 70, previousWeek: 42 },
      { name: 'Fri', currentWeek: 90, previousWeek: 26 },
      { name: 'Sat', currentWeek: 103, previousWeek: 11 },
      { name: 'Sun', currentWeek: 69, previousWeek: 110 },
      // Add more days as needed
    ];
    setWeeklySalesData(dummyWeeklySalesData);

    // Prepare inventory data for pie chart
    if(inventoryData){
    const inventoryData = products.map((product) => ({
      name: product.name,
      value: product.purchasesAmount,
    }));
    setInventoryData(inventoryData);
    }
    else {
      const inventoryData = {
        name: 'None',
        value: 0,
      };
      setInventoryData(inventoryData);
    }

    // Prepare notifications
    const outOfStockNotifications = products
      .filter((product) => product.purchasesAmount - product.salesAmount === 0)
      .map((product) => `${product.name} is out of stock`);
    setNotifications(outOfStockNotifications);

    // Prepare in-stock products list
    const inStockProducts = products.filter((product) => product.purchasesAmount - product.salesAmount > 0);
    setInStockProducts(inStockProducts);
  }, []);
  
      
      const COLORS = ['#1D9A6C', '#39A96B', '#56B870', '#74C67A', '#99D492', '#BFE1B0', '#DEEDCF', '#74C67A', '#99D492', '#BFE1B0', '#DEEDCF'];
      
     

  return (
    <main className='main-container'>
        <div className='main-title'>
            <h3>DASHBOARD</h3>
        </div>

        <div className='main-cards'>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Sales</h3>
                    <BsPeopleFill className='card_icon'/>
                </div>
                <h1>₱ {metrics.salesAmount}</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Purchases</h3>
                    <BsListCheck className='card_icon'/>
                </div>
                <h1>₱ {metrics.purchasesAmount}</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Inventory Quantity</h3>
                    <BsFillArchiveFill className='card_icon'/>
                </div>
                <h1>{metrics.inventoryQuantity}</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Inventory Amount</h3>
                    <BsCartFill className='card_icon'/>
                </div>
                <h1>₱ {metrics.inventoryAmount}</h1>
            </div>
        </div>

        <div className='charts'>
          <div style={styles.graphContainer}>
            <ResponsiveContainer width="100%" height={300}>
            <h2>Inventory Products Volume</h2>
              <PieChart>
                <Pie
                  data={inventoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height="100%">
            <h2>Weekly Sales</h2>
                <LineChart
                width={500}
                height={300}
                data={weeklySalesData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="previousWeek" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="currentWeek" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
          </div>
      <div className="notifications">
        <h3>Notifications</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification, index) => (
              <tr key={index}>
                <td>{notification}</td>
                {/* <td>{notification.status}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="instock-products">
        <h3>In Stock Products</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
            </tr>
          </thead>
          <tbody>
            {inStockProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    </main>
  )
}

const styles = {
  heading: {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '20px',
  },
  graphContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    marginBottom: '20px',
  },
}

export default Dashboard


