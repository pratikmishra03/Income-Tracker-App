const bcrypt = require("bcryptjs");
const User = require("../../model/User");
const {AppErr,appErr}=require("../../utils/appErr");
const generateToken = require("../../utils/generateToken");



//Register
const registerUserCtrl = async (req, res, next) => {
  const { fullname, password, email } = req.body;
  try {
    // Check if email already exists
    const userFound = await User.findOne({ email });
    if (userFound) {
      // return next(new Error('Email already exists'));
      //!if use class
      // return next(new AppErr('Email already exists',400));
      //!if use function
      return next(appErr('Email already exists',400)); 
    }

    // Check if fields are empty
    if (!email || !password || !fullname) {
      return next(new Error('Please provide all required fields'));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    res.json({
      status: "success",
      fullname: user.fullname,
      email: user.email,
      id: user._id,
    });
  } catch (error) {
    next(new AppErr(error.message,500)); // Pass the error to the error-handling middleware
  }
};

//login

const userLoginCtrl = async (req, res,next) => {
  const { password, email } = req.body;
  try {
  //!Check is email exist
  const userFound = await User.findOne({ email });
  if (!userFound) {
    next(new Error('invallid login credentials'))
  }
  //!Check password
  const isPasswordMatch=await bcrypt.compare(password, userFound.password);
  if(!isPasswordMatch)  {
    next(new Error('Invalid login credentials'))
  }
  res.json({status: 'success',
    fullname:userFound.fullname,
    email:userFound.email,
    id:userFound.id,
    token:generateToken(userFound._id)
  });
  } catch (error) {
    next(new AppErr(error.message,500));
  }
};

//profile
const userProfileCtrl = async (req, res) => {
  try {
    const user=await User.findById(req.user).populate({
      path:"accounts",
      populate:{
        path:'transactions',
        "model":"Transaction"

      },
    })
    res.json(user);
  } catch (error) {
    next(new AppErr(error.message,500));
  }
};

//delete
const deleteUserCtrl = async (req, res,next) => {

  try {
    await User.findByIdAndDelete(req.user);
    res.status(200).json({
      status: 'success',
      data:null
    })
   
  } catch (error) {
    next(new AppErr(error.message,500));
  }
};

//update
const updateUserCtrl = async (req, res,next) => {
  try {
  //!1.Check if email exist
  if(req.body.email){
    const userFound=await User.findOne({email:req.body.email});
    if(userFound) {
      return next(new AppErr('Email is already in use',400))
    }
  }

  //!2 Check if user updating password
  if(req.body.password){
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(req.body.password,salt);
    //!Update the user
    const user=await User.findByIdAndUpdate(req.user,{
      password:hashedPassword,
    },{
      new :true,
      runValidators:true,
    });
    //Send the response
   return res.status(200).json({
      status: 'success',
      data:user,
    })
  }
  const user=await User.findByIdAndUpdate(req.user,req.body,{
    new :true,
    runValidators:true,
  })
  res.status(200).json({
    status: 'success',
    data:user,
  })
  } catch (error) {
    next(new AppErr(error.message,500));
  }
};

module.exports = {
  registerUserCtrl,
  userLoginCtrl,
  userLoginCtrl,
  userProfileCtrl,
  deleteUserCtrl,
  updateUserCtrl,
};
