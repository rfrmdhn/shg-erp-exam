import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import type { UserRole } from '../types';

export interface UserAttributes {
  id: number;
  username: string;
  passwordHash: string;
  name: string;
  role: UserRole;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'role'>;

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare username: string;
  declare passwordHash: string;
  declare name: string;
  declare role: UserRole;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    tableName: 'users',
    underscored: true,
  }
);
