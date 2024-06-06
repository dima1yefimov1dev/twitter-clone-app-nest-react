import { FC } from "react";
import { User } from "../user/user";
import { IUser } from "../../lib/interfaces";

interface Props {
  users: IUser[],
}

export const UserList:FC<Props> = ({users}) => {
  return (
    <ul>
      {
        users.map((user) => 
          <User 
            user={user} 
            key={user.uid}
          />
      )}
    </ul>
  )
}