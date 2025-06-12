// backend/src/models/diseaseRecord.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './user.js';

const DiseaseRecord = sequelize.define('DiseaseRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  disease: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  confidence: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  schema: 'smart_farm',
  tableName: 'disease_records',
  timestamps: true,
});

// Association (optional, for eager loading)
DiseaseRecord.belongsTo(User, { foreignKey: 'userId' });

export default DiseaseRecord;
