import { sequelize } from '../config/database';
import { Unit } from './unit.model';
import { User } from './user.model';
import { Vendor } from './vendor.model';

// Associations: a Unit has many Vendors; a Vendor belongs to a Unit.
Unit.hasMany(Vendor, { foreignKey: 'unitId', as: 'vendors' });
Vendor.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });

export { sequelize, Unit, User, Vendor };
