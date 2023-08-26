const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought');
const  dayjs = require('dayjs');

const userSchema = new Schema(
{
   username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    },
    email: {
    type: String,
    required: [true, 'Email address is a required field'],
    unique: true,
    validate: {
        validator: function (v) {
            return /^([a-zA-Z0-9_\.-]+)@([a-zA-Z\d\.-]+)\.([a-zA-Z\.]{2,6})$/
            .test(v);
        },
        message: props => `${props.value} is not a valid email address`
    },
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought',
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
    },
],
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false,
}
);
userSchema.virtual('friendsCount').get(function (){
    return this.friends.length;
})

const User = model('User', userSchema);

module.exports = User;