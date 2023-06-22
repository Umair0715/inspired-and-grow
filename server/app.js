const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./utils/db');


connectDB();

app.use(cors({ origin : '*' }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit : '10mb' }));
app.use(express.static(path.join(__dirname , 'uploads')));

app.use('/api/user' , require('./routes/userRoutes'));
app.use('/api/admin' , require('./routes/adminRoutes'));
app.use('/api/category' , require('./routes/categoryRoutes'));
app.use('/api/sub-category' , require('./routes/subCategoryRoutes'));
app.use('/api/inventory' , require('./routes/inventoryRoutes'));
app.use('/api/driver' , require('./routes/driverRoutes'));
app.use('/api/banner' , require('./routes/bannerRoutes'));
app.use('/api/pre-booking' , require('./routes/preBookingRoutes'));
app.use('/api/order' , require('./routes/orderRoutes'));
app.use('/api/coupon' , require('./routes/couponRoutes'));
app.use('/api/wishlist' , require('./routes/wishlistRoutes'));

app.use(require('./middlewares/errorHandler'));

const PORT = process.env.PORT || 4400;
app.listen(PORT , () => console.log(`server is listening on port ${PORT}`))