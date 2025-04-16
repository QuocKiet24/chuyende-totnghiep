import monggose from "mongoose";

const UserSchema = new monggose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    avatar: {
      type: String,
      default:
        "https://as2.ftcdn.net/v2/jpg/05/49/98/39/1000_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
    },
    bio: {
      type: String,
      default: "not yet",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = monggose.model("User", UserSchema);
export default User;
