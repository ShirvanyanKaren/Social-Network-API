const { Schema, model, Types } = require('mongoose');
const  dayjs = require('dayjs');
// const userSchema = require('./User');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: dateVal => dayjs(dateVal).format(`MMMM D, YYYY [at] h:mm A`)
        },
        username: {
            type: String,
            required: true,
        },
    
    },
    {
        toJSON: {
            getters: true,
            virtuals: true,
        },
        id: false,
    }
    );

const thoughtSchema = new Schema(
{
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: dateVal => dayjs(dateVal).format(`MMMM D, YYYY [at] h:mm A`)
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema],

},
{
    toJSON: {
        getters: true,
        virtuals: true,
    },
}
);

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;