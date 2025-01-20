import cloudinary from 'cloudinary';

export const completeUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { age, nationality, city, fatherName, motherName, emergencyContact, bloodType } = req.body;

  // Check if a profile picture was uploaded
  let profilePicUrl = null;
  if (req.file) {
    try {
      // Upload to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'user_profiles', // Optional: Store images in a specific folder on Cloudinary
      });
      profilePicUrl = result.secure_url; // This URL will be saved in the user's profile
    } catch (error) {
      return res.status(500).json({ error: 'Cloudinary upload failed', details: error.message });
    }
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user data
    user.age = age;
    user.nationality = nationality;
    user.city = city;
    user.fatherName = fatherName;
    user.motherName = motherName;
    user.emergencyContact = emergencyContact;
    user.bloodType = bloodType;

    // Only update profilePic if the user uploaded a new one
    if (profilePicUrl) {
      user.profilePic = profilePicUrl;
    }

    await user.save();

    res.status(200).json({ message: 'Profile completed successfully', user });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};
