import { DataTypes, Model, Optional, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';
import { UserFields, UserRole } from '../types';
import bcrypt from 'bcryptjs';

interface UserCreationAttributes extends Optional<UserFields, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'profilePicture'> { }

class User extends Model<UserFields, UserCreationAttributes> implements UserFields {
    declare id: CreationOptional<number>;
    declare firstName: string;
    declare lastName: string;
    declare profilePicture?: string;
    declare username: string;
    declare password: string;
    declare role: UserRole;
    declare isDeleted: boolean;
    declare deletedAt?: Date;
    declare readonly createdAt: CreationOptional<Date>;
    declare readonly updatedAt: CreationOptional<Date>;

    async comparePassword(candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.password);
    }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    toJSON(): object {
        const { password, ...values } = this.get();
        return values;
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'first_name'
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'last_name'
        },
        profilePicture: {
            type: DataTypes.STRING(500),
            allowNull: true,
            field: 'profile_picture'
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM(...Object.values(UserRole)),
            allowNull: false,
            defaultValue: UserRole.PENDING
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_deleted'
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'deleted_at'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'updated_at'
        }
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            {
                name: 'idx_users_username',
                unique: true,
                fields: ['username']
            },
            {
                name: 'idx_users_role',
                fields: ['role']
            },
            {
                name: 'idx_users_is_deleted',
                fields: ['is_deleted']
            },
            {
                name: 'idx_users_role_deleted',
                fields: ['role', 'is_deleted']
            }
        ],
        hooks: {
            beforeCreate: async (user: User) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(12);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user: User) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(12);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    }
);

export default User;