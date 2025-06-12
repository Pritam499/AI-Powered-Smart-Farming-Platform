// models/ipAccess.js (Sequelize Model)
import { DataTypes } from 'sequelize';
import {sequelize} from '../config/db.js';

const IpAccess = sequelize.define('IpAccess', {
  ip: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  schema: 'smart_farm',
  tableName: 'ip_access',
  timestamps: true,
});

export default IpAccess;
