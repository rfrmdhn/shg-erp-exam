import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface VendorAttributes {
  id: number;
  vendorId: string; // business code, e.g. "Vendor001"
  name: string;
  address: string;
  unitId: number;
}

type VendorCreationAttributes = Optional<VendorAttributes, 'id'>;

export class Vendor
  extends Model<VendorAttributes, VendorCreationAttributes>
  implements VendorAttributes
{
  declare id: number;
  declare vendorId: string;
  declare name: string;
  declare address: string;
  declare unitId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Vendor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vendorId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'vendor_id',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'unit_id',
    },
  },
  {
    sequelize,
    tableName: 'vendors',
    underscored: true,
    indexes: [
      // vendor_id is unique within a unit (same code can exist across units)
      { unique: true, fields: ['vendor_id', 'unit_id'] },
    ],
  }
);
