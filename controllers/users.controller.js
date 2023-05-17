import User from "../models/User.js";

// read
export const getUser = async (req, res) => {
    try {
        // step 1: destructure id from params
        const {id} = req.params;

        // step 2: find user with that id in db and return to front end
        const user = await User.findById(id);
        res.status(200).json(user);

    } catch (err) {
        res.status(404).json({message: err.message}) // maybe wrong id => user not exists
    }
}

export const getUserFriends = async (req, res) => {
    try {
        // step 1: destructure id from params and find user with that id in db
        const {id} = req.params;
        const user = await User.findById(id);
        
        // step 2: find the friends list of that user
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        // format the properties and send back to front end
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        );
        res.status(200).json(formattedFriends)

    } catch (err) {
        res.status(404).json({message: err.message}) 
    }
}


// UPDATE
export const addRemoveFriend = async (req, res) => {
    try {
        // step 1: destructure id from params
        const {id, friendId} = req.params;

        // step 2: find the user and friend in db
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        // step 3: check if that friend exist in user friends list
        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId); // if exist => delete that friend for user
            friend.friends = friend.friends.filter((id) => id !== id); // delete that user as friend
        }

        // step 4: if not exist => add friend
        user.friends.push(friendId); // add friend for user
        friend.friends.push(id); // add user as friend 

        // step 5: save that change to db
        await user.save();
        await friend.save();

        // step 6: find the friends list of that user
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        // step 7: format the properties and send back to front end
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        );
        res.status(200).json(formattedFriends);

    } catch (err) {
        res.status(404).json({message: err.message})
    }
}