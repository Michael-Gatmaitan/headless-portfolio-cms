import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@portfolio-types/shared';

const AvatarUserProfilePicture = ({ user, size = "default" }: { user: User; size?: "default" | "sm" | "lg"; }) => {
  return (
    <Avatar size={size}>
      <AvatarImage
        // src={`${process.env.NEXT_PUBLIC_AWS_LINK}/${user}` || undefined}
        src={undefined}
        alt="User Profile Picture"
      />
      <AvatarFallback>
        {user.name[0]}
      </AvatarFallback>
    </Avatar>
  )
}

export default AvatarUserProfilePicture