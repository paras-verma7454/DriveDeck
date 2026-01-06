import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/context/UserContext";
import {  VITE_IMG_URL } from "@/hooks/user"

const Profile = () => {
  const { user } = useUser();
  const profileImage = user && user.Image ? `${VITE_IMG_URL}${user.Image}` : "";
  const firstNameInitial = user && user.FirstName ? user.FirstName[0] : "";

  return (
    <Avatar>
      {profileImage ? (
        <AvatarImage src={profileImage} />
      ) : null}
      <AvatarFallback>{firstNameInitial}</AvatarFallback>
    </Avatar>
  )
}

export default Profile