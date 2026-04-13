import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Event from './Event.js';
import User from './User.js';

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Completed'),
    defaultValue: 'Pending',
  },
}, {
  timestamps: true,
});

// Associations
Ticket.belongsTo(Event, { foreignKey: 'eventId' });
Ticket.belongsTo(User, { foreignKey: 'userId' });
Event.hasMany(Ticket, { foreignKey: 'eventId' });
User.hasMany(Ticket, { foreignKey: 'userId' });

export default Ticket;
