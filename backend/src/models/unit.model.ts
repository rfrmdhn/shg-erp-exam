import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface UnitAttributes {
  id: number;
  name: string;
}

type UnitCreationAttributes = Optional<UnitAttributes, 'id'>;

export class Unit
  extends Model<UnitAttributes, UnitCreationAttributes>
  implements UnitAttributes
{
  declare id: number;
  declare name: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Unit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'units',
    underscored: true,
  }
);
