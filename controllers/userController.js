// const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

// export all controllers to be utilized in routes
module.exports = {
async getUsers(req, res) {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
},

async getSingleUser(req, res) {
    try {
        const user = await User.findOne({ _id: req.params.userId })
        .populate('thoughts')
        .populate('friends')
        .select('-__v');
        if(!user){
            return res.status(404).json({ message: 'No user with that id!'});
        }
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
},

async createUser(req, res) {
    try {
        const createUser = await User.create(req.body);
        res.json(createUser);
    } catch (err) {
        res.status(500).json(err);
    }
},

async updateUser(req, res) {
    try {
        const updateUser = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        if(!updateUser){
            res.status(404).json({ message: 'No user with that id! '});
        }
        res.json(updateUser);
    } catch (err) {
        res.status(500).json(err);
    }
},

async deleteUser(req, res) {
    try {
        const deleteUser = await User.findOneAndDelete({ _id: req.params.userId });
        if(!deleteUser){
            res.status(404).json({ message: 'No user with that id! '});
        }
         const deleteUserThoughts = await Thought.deleteMany({ _id: {$in: deleteUser.thoughts} });

        // await User.deleteMany({ $in: deleteUser.username });
        
        res.status(200).json({ message: 'User(s) and thoughts deleted!', deleteUser, deleteUserThoughts });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
},

async addUserFriend(req, res) {
    try {
        const addFriend = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId }},
            { runValidators: true, new: true }
            );

        if(!addFriend){
            res.status(404).json({ message: 'No user with that id! '});
        }

        res.status(200).json({ message:'Added new friend!', addFriend});

    } catch (err) {
        res.status(500).json(err);
    }
},

async deleteUserFriend(req, res) {
    try {
        const deleteFriend = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: {friends: req.params.friendId }},
            { runValidators: true, new: true }
        )
        if(!deleteFriend){
            res.status(404).json({ message: 'No user with that id! '});
        }
        res.status(200).json({ message:'Deleted friend!', deleteFriend});

    } catch(err) {
        res.status(500).json(err);
    }
}

};