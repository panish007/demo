const Contact = require("../../models/contactModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorhandler");
const { resolve } = require("path");
const mongoose = require("mongoose");
const Group = require("../../models/groupModels");
const User = require("../../models/userModels");


exports.userContact = async (req, res, next) => {
    try {
        const { id,action,name, mobileNo,group } = req.body;
        //  if(!contactId) {    
            if(action === "Add"){

            if (!name) {
                return res.status(200).json({ flag: 0, msg: 'Please Enter Your Name' });
            }
            if(!mobileNo){
                return res.status(200).json({ flag: 0, msg: 'Please Enter Your MobileNO' });
            }
            if (isNaN(mobileNo)) {
                return res.status(200).json({ flag: 0, msg: 'Mobile Number should only contain numbers' });
            }    
            if (mobileNo.length !== 10) {
                return res.status(200).json({ flag: 0, msg: 'required 10 digits Mobile Number ' });
            }    
            const checkMobile = await Contact.findOne({ user: req.user.id, mobileNo: mobileNo });
            if (checkMobile) {
                return res.status(200).json({ flag: 0, msg: 'Mobile number already exists' });
            }
    
            const contact = await Contact.create({
                name,
                mobileNo,
                user: req.user.id,
                group
            });
            res.status(201).json({ flag: 1, msg: 'Contact has been created successfully', data: contact });
         }else{
            const userId = req.user.id;
            const checkMobile = await Contact.findOne({ user: userId, mobileNo });
            const contactToUpdate = await Contact.findOne({ _id: id, user: userId });

            if (!contactToUpdate) {
                return res.status(200).json({ flag: 0, msg: 'Contact not found' });
            }
              
            if (!id) {
                return res.status(200).json({ flag: 0, msg: 'No Task With Id ${id}' });
            }
            if (!req.body.name || !req.body.mobileNo) {
                return res.status(200).json({ flag: 0, msg: 'Please enter your name' });
            }
            if (isNaN(mobileNo)) {
                return res.status(200).json({ flag: 0, msg: 'Mobile Number should only contain numbers' });
            }
            if (mobileNo.length !== 10) {
                return res.status(200).json({ flag: 0, msg: 'required 10 digits Mobile Number' });
            }
            if (checkMobile && checkMobile._id != id) {
                return res.status(200).json({ flag: 0, msg: 'Mobile number already present!! please try another mobile number' });
            }
            const contact = await Contact.findOneAndUpdate({ _id: id }, { name, mobileNo,group}, { new: true, runValidators: true });
           
            res.status(200).json({ flag: 1, msg: 'Contact updated successfully', data: contact });

}
} catch (error) {
        console.error('Error creating contact:', error);
        res.status(200).json({ flag: 0, msg: 'Internal server error' });
    }
};

exports.ContactDetails = catchAsyncErrors(async (req, res, next) => {
        const userName = await User.findById(req.user.id);
    res.render('user/contact',{name:userName.name});
})

exports.groupdeatils = catchAsyncErrors(async (req, res, next) =>{
    const group = await Group.find({user: req.user.id});
   
    res.status(200).json({flag:1,msg: 'Group data name added successfully',data:group});

})

exports.postContactDetails = catchAsyncErrors(async (req, res, next) => {
    const {name,groups,mobile} = req.body;


    let page = parseInt(req.body.page) || 1;
    let perPage = parseInt(req.body.perPage) || 3;
    
    const group = await Group.find({user: req.user.id});

    // Adjust the default items per page as needed

    // Check if it's a filter request
    // Add your filter logic here if needed
    const actual = req.query.perPage;

   
    const nameFilter = name ? { name: { $regex: '.*' + name + '.*', $options: 'i' } } : {};
    const mobileNoFilter = mobile ? { mobileNo: { $regex: '.*' + mobile + '.*' } } : {};
    const groupFilter = groups ? { group: { $regex: '.*' + groups + '.*' } } : {};
    const userId = req.user.id;


    const filters = { ...nameFilter,...mobileNoFilter,...groupFilter};
    
    const search = await Contact.find({ user: userId, ...filters }).skip((page - 1) * perPage)
        .limit(perPage);
    const count = await Contact.countDocuments({ user: userId,...filters});
    res.status(200).json({ flag: 1, msg: "successfully added", data: search, current: page, perPage, pages: Math.ceil(count / perPage),group});
});

exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;

    const orders = await Contact.findOne({ user: userId });

    res.status(200).json({
        success: true,
        orders,
    });
});

exports.Orders = catchAsyncErrors(async (req, res, next) => {
    const userId = req.params.id;

    const orders = await Contact.findOne({ user: userId });

    res.status(200).json({
        success: true,
        orders,
    });
});

exports.allContactDetails = catchAsyncErrors(async (req, res, next) => {
    const messages = await req.flash('success');
    const error = await req.flash('error');



    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 2; // Adjust the default items per page as needed

    // Check if it's a filter request
    // Add your filter logic here if needed
    const actual = req.query.perPage;
    // If it's not a filter request, proceed with rendering contact details page
    const userId = req.user.id;

    const contacts = await Contact.find({ user: userId })
        .skip((page - 1) * perPage)
        .limit(perPage);

    const count = await Contact.countDocuments({ user: userId });
    res.json({ msg: 'success', data: contacts });
    res.render('user/contact', {
        id: userId,
        contact: contacts,
        numberpage: actual,
        messages,
        search: "",
        error,
        userid: userId,
        current: page,
        pages: Math.ceil(count / perPage),
        perPage,
        data: contacts
    });
});

// res.status(200).json({
//     success: true,
//     contact,
// });

exports.getUser = async(req, res, next) => {
    const id =req.body.id;
    const user = await Contact.findById(id);

    if(!id){
       return res.status(200).json({ flag: 0, msg: 'No Task With Id ${id}' });
    }
   if(!user){
    return res.status(200).json({ flag: 0, msg: 'contact will be not found' });
   }
    res.status(200).json({
        flag: 1,
        msg: 'User Details',
        data: user
    })

    
}


exports.UpdateContactDetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.body.id;

    const { name, mobileNo } = req.body;
    const userId = req.user.id;
    const checkMobile = await Contact.findOne({ user: userId,mobileNo });
    const check = await Contact.findOne({user:userId});

    if(check){
        await res.status(200).json({ flag: 0, msg: 'you can not access ' });
    }
    
    if (!id) {
        await res.status(200).json({ flag: 0, msg: 'No Task With Id ${id}' });
    }
    if (!req.body.name || !req.body.mobileNo) {
        return res.status(200).json({ flag: 0, msg: 'Please enter all fields' });
    }
    if (mobileNo.length !== 10) {
        await res.status(200).json({ flag: 0, msg: 'Invalid Mobile Number' });
    }
    if (checkMobile && checkMobile._id != id) {
        await res.status(200).json({ flag: 0, msg: 'Mobile number already present!! please try another mobile number' });
    }
    const contact = await Contact.findOneAndUpdate({ _id: id }, { name, mobileNo }, { new: true, runValidators: true });

    res.status(200).json({ flag: 1, msg: 'Contact updated successfully', data: contact });

});


exports.addUser = catchAsyncErrors(async (req, res, next) => {
    const messages = await req.flash("success");
    const error = await req.flash("error");

    res.render('customer/add', { messages, error, userids: req.userid });
})

exports.getUpdate = catchAsyncErrors(async (req, res, next) => {
    const messages = await req.flash("success");
    const error = await req.flash("error");
    const id = req.body.id;
    const contact = await Contact.findOne({ _id: id });
    // if (!id) {
    //     req.flash('error', `No Task With Id ${id}`)
    //     return res.redirect('/');
    //     //return next(ErrorHandler(`No Task With Id ${id}`, 404))
    // }

    res.render('customer/edit', { messages, contact, error });
})


exports.DeleteContactDetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.body.id;
    const userId = req.user.id;
    const contactToUpdate = await Contact.findOne({ _id: id, user: userId });

    if (!contactToUpdate) {
        return res.status(200).json({ flag: 0, msg: 'Contact not found' });
    }
  
    if (!id) {
        await res.status(200).json({ flag: 0, msg: 'No Task With Id ${id}' });
        //return next(ErrorHandler(`No Task With Id ${id}`, 404))
    }
    const contact = await Contact.findOneAndDelete({ _id: id });
    res.status(200).json({ flag: 1, msg: 'hey !! Contact has been deleted successfully', data: contact });

});


exports.filterContact = catchAsyncErrors(async (req, res, next) => {
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

    const search = await Contact.find({ user: userId, ...filters }).skip((page - 1) * perPage)
        .limit(perPage);;
    const count = await Contact.countDocuments({ user: userId });
    res.render('user/contact', {
        id: userId,
        contact: search,
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




exports.deletePostById = async (req, res, next) => {
    try {
        const postId = req.body.id; // Get the id from the request body

        if (!postId) {
            return res.status(200).json({ flag: 0, msg: 'ID is required in the request body' });
        }

        // Find the post by ID and delete
        const deletedPost = await Contact.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(200).json({ flag: 0, msg: 'something went wrong' });
        }
        // Optionally, you can send a success message
        return res.status(200).json({ flag: 1, msg: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};