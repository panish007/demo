const Group = require('../../models/groupModels');
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorhandler");
const { resolve } = require("path");
const Contact = require("../../models/contactModel");
const User = require("../../models/userModels")

exports.userGroup = async (req, res, next) => {
    try {
        const {id,action,name,groupname} = req.body;
        const userId = req.user.id;
    
        const checkName = await Group.findOne({ user: userId, name });
      if(action === 'Add'){
            if (!name) {
                return res.status(200).json({ flag: 0, msg: 'Please Enter Your Group Name' });
            }
            if(checkName){
                return res.status(200).json({ flag: 0, msg: 'group name already present' });
            }
    
            const group = await Group.create({
                name,
                user: req.user.id,
            });
    
            res.status(201).json({ flag: 1, msg: 'Group has been created successfully', data: group });
        }else{   
            const contactToUpdate = await Group.findOne({ _id: id, user: userId });
           
            if (!contactToUpdate) {
                return res.status(200).json({ flag: 0, msg: 'Contact not found' });
            }
                
            if (!id) {
                await res.status(200).json({ flag: 0, msg: 'No Task With Id ${id}' });
            }
            if (!name) {
                return res.status(200).json({ flag: 0, msg: 'Please enter your name' });
            }
            if (checkName && checkName._id != id) {
                return res.status(200).json({ flag: 0, msg: 'Group Name already present!! please try another Group Name' });
            }
           
            const group = await Group.findOneAndUpdate({ _id: id }, { name}, { new: true, runValidators: true });
         
            await Contact.updateMany({ group: groupname},{ $set: { group: group.name } });
            res.status(200).json({ flag: 1, msg: 'Group updated successfully', data: group });
        }
} catch (error) {
        console.error('Error creating contact:', error);
        res.status(200).json({ flag: 0, msg: 'Internal server error' });
    }
};

exports.GroupDetails = catchAsyncErrors(async (req, res, next) => {
    const userName = await User.findById(req.user.id);
    res.render('user/group',{name:userName.name});
})

exports.postGroupDetails = catchAsyncErrors(async (req, res, next) => {

    let page = parseInt(req.body.page) || 1;
    let perPage = parseInt(req.body.PerPage) || 3; // Adjust the default items per page as needed

    // Check if it's a filter request
    // Add your filter logic here if needed
    const actual = req.body.PerPage;


    const name = req.body.search;

    const nameFilter = name ? { name: { $regex: '.*' + name + '.*', $options: 'i' } } : {};
    const userId = req.user.id;


    const filters = { ...nameFilter };

    const search = await Group.find({ user: userId, ...filters }).skip((page - 1) * perPage)
        .limit(perPage);;
    const count = await Group.countDocuments({ user: userId ,...filters });
    res.status(200).json({ flag: 1, msg: "successfully added", data: search, current: page, perPage, pages: Math.ceil(count / perPage) });
});


exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;

    const orders = await Group.findOne({ user: userId });

    res.status(200).json({
        success: true,
        orders,
    });
});
exports.Orders = catchAsyncErrors(async (req, res, next) => {
    const userId = req.params.id;

    const orders = await Group.findOne({ user: userId });

    res.status(200).json({
        success: true,
        orders,
    });
});

exports.allGroupDetails = catchAsyncErrors(async (req, res, next) => {
    const messages = await req.flash('success');
    const error = await req.flash('error');



    let page = parseInt(req.body.page) || 1;
    let perPage = parseInt(req.body.perPage) || 3; // Adjust the default items per page as needed

    // Check if it's a filter request
    // Add your filter logic here if needed
    const actual = req.body.perPage;
    // If it's not a filter request, proceed with rendering Group details page
    const userId = req.user.id; 

    const Groups = await Group.find({ user: userId })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const count = await Group.countDocuments({ user: userId });
    res.json({ msg: 'success', data: Groups });
    res.render('user/Group', {
        id: userId,
        Group: Groups,
        numberpage: actual,
        messages,
        search: "",
        error,
        userid: userId,
        current: page,
        pages: Math.ceil(count / perPage),
        perPage,
        data: Groups
    });
});

// res.status(200).json({
//     success: true,
//     Group,
// });

exports.getUser = async(req, res, next) => {
    const id =req.body.id;
    const user = await Group.findById(id);

    if(!id){
       return res.status(200).json({ flag: 0, msg: 'No Task With Id ${id}' });
    }
   if(!user){
    return res.status(200).json({ flag: 0, msg: 'Group will be not found' });
   }
    res.status(200).json({
        flag: 1,
        msg: 'group Details',
        data: user
    })
}


exports.UpdateGroupDetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.body.id;

    const { name} = req.body;
    const userId = req.user.id;
   
    if (!id) {
        await res.status(200).json({ flag: 0, msg: 'No Task With Id ${id}' });
    }
    if (!name) {
        return res.status(200).json({ flag: 0, msg: 'Please enter your name' });
    }
 
   
    const group = await Group.findOneAndUpdate({ _id: id }, { name}, { new: true, runValidators: true });
   
    res.status(200).json({ flag: 1, msg: 'Group updated successfully', data: group });

});




exports.getUpdate = catchAsyncErrors(async (req, res, next) => {
    const messages = await req.flash("success");
    const error = await req.flash("error");
    const id = req.body.id;
    const Group = await Group.findOne({ _id: id });
    // if (!id) {
    //     req.flash('error', `No Task With Id ${id}`)
    //     return res.redirect('/');
    //     //return next(ErrorHandler(`No Task With Id ${id}`, 404))
    // }

    res.render('group/edit', { messages, Group, error });
})


exports.DeleteGroupDetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.body.id;
 
    const group = req.body.groupName;

    if (!id) {
        await res.status(200).json({ flag: 0, msg: 'No Task With Id ${id}' });
        //return next(ErrorHandler(`No Task With Id ${id}`, 404))
    }
    const type = await Group.findOne({ _id: id });

    const Group = await Group.findOneAndDelete({ _id: id });
    const contact = await Contact.deleteMany({group:group});
    res.status(200).json({ flag: 1, msg: 'hey !! Group has been deleted successfully', data: Group });

});

exports.filterGroup = catchAsyncErrors(async (req, res, next) => {
    const messages = await req.flash('success');
    const error = await req.flash('error');


    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.body.perPage); // Adjust the default items per page as needed

    // Check if it's a filter request
    // Add your filter logic here if needed
    const actual = req.body.perPage;

    const name = req.body.search;

    const nameFilter = name ? { name: { $regex: '.*' + name + '.*', $options: 'i' } } : {};
    const userId = req.user.id;


    const filters = { ...nameFilter };

    const search = await Group.find({ user: userId, ...filters }).skip((page - 1) * perPage)
        .limit(perPage);;
    const count = await Group.countDocuments({ user: userId });
    res.render('user/group', {
        id: userId,
        Group: search,
        numberpage: actual,
        search: name,
        messages,
        error,
        userid: userId,
        current: page,
        pages: Math.ceil(count / perPage),
        perPage,
    });
});

exports.searchGroup = async (req, res) => {
    const messages = await req.flash('success');
    const error = await req.flash('error');


    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 2;
    let searchTerm = req.body.search;
    let Group = await Group.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });

    res.render('/dashboard', { title: 'Cooking Blog - Search', Group });


}


exports.deletePostById = async (req, res, next) => {
    try {
        const group = req.body.groupName;
        const postId = req.body.id;
        const userId = req.user.id; // Get the id from the request body

        const contactToUpdate = await Group.findOne({ _id: postId, user: userId });

        if (!contactToUpdate) {
            return res.status(200).json({ flag: 0, msg: 'Contact not found' });
        }
        if (!postId) {
            return res.status(200).json({ flag: 0, msg: 'ID is required in the request body' });
        }
         const contact = await Contact.deleteMany({group:group});
        // Find the post by ID and delete
        const deletedPost = await Group.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(200).json({ flag: 0, msg: 'something went wrong' });
        }
        // Optionally, you can send a success message
        return res.status(200).json({ flag: 1, msg: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(200).json({ success: false, message: 'Internal Server Error' });
    }
};