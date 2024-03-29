const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//  we can track the posts that users vote on. When a user votes on a post, we'll insert a new row of data to the table, which lists the primary key of the user and the primary key of the post they voted on.
class Vote extends Model {}
Vote.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'vote'
    }    
);

module.exports = Vote;