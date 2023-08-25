const { User, Thought } = require('../models');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.id })
            .select('-__v')
            .populate('reactions');
            if(!thought){
                return res.status(404).json({ message: 'No thought with that id!'});
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createThought(req, res) {
        try {
            const createThought = await Thought.create(
                req.body,
                { runValidators: true, new: true }
            )
            const userThought = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: createThought._id }},
                { runValidators: true, new: true }
            );
                res.json(createThought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async updateThought(req, res) {
        try {
            const updateThought = await Thought.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { runValidators: true, new: true }
            )
            if(!updateThought){
                res.status(404).json({ message: 'No thought with that id! '});
            }
            res.json(updateThought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteThought(req, res) {
        try {
            const deleteThought = await Thought.findOneAndDelete({ _id: req.params.id });
            if (!deleteThought) {
                res.status(404).json({ message: 'No thought with that id! '});
            }
            const deleteThoughts = await Thought.deleteMany({ $in: deleteThought.thoughtId })

            res.status(200).json({ message: 'Thought(s) deleted!', deleteThought, deleteThoughts });

        } catch (err) {
            res.status(500).json(err);
        }
    },
    async addReaction(req, res) {
        try {
            const addReaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId},
                { $addToSet: { reactions: req.body }},
                { runValidators: true, new: true}
            )
            res.status(200).json({ message: 'Added new reaction!', addReaction });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteReaction(req, res) {
        try {
            const deleteReaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: 
                    {reactionId: req.params.reactionId }
                    }
                },
                { runValidators: true, new: true}
            )
            if (!deleteReaction) {
                res.status(404).json({ message: 'No thought with that id! '});
            }
            res.status(200).json({ message: 'Deleted reaction!', deleteReaction });
        } catch (err) {
            res.status(500).json(err);
        }
    },
}