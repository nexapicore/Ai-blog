const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const postRoutes = require('./src/routes/posts');
const communityRoutes = require('./src/routes/community');
const authRoutes = require('./src/routes/auth');
const aiRoutes = require('./src/routes/ai');
const subscriptionRoutes = require('./src/routes/subscription');
const adminRoutes = require('./src/routes/admin');
const tipRoutes = require('./src/routes/tips');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/v1', postRoutes);
app.use('/api/v1', communityRoutes);
app.use('/auth', authRoutes);
app.use('/api/v1', aiRoutes);
app.use('/api/v1', subscriptionRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1', tipRoutes);

const swaggerDocument = yaml.load('./src/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => console.log('Server running on port 3000'));
