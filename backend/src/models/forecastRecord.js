// backend/src/models/forecastRecord.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './user.js';

const ForecastRecord = sequelize.define('ForecastRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.DECIMAL(9,6),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(9,6),
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  resultJson: {
    // store forecast data (e.g. array of {date, value})
    type: DataTypes.JSONB,
    allowNull: false,
  },
}, {
  schema: 'smart_farm',
  tableName: 'forecast_records',
  timestamps: true,
});

// Association
ForecastRecord.belongsTo(User, { foreignKey: 'userId' });

export default ForecastRecord;