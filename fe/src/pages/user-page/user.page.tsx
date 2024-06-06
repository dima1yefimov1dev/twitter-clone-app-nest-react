import { FC, useEffect, useState } from "react";
import axios from "axios";
import { USER_ENDPOINT } from "../../lib/constants/constants";
import { IUser } from "../../lib/interfaces";
import { UserList } from "../../components/user-list/user.list";


export const UsersPage:FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  const getAllUSers = async () => {
    try{
      const { data } = await axios.get(USER_ENDPOINT);

      setUsers(data);
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getAllUSers();
  })

  if (!users) {
    return (
      <div className="">
        ...loading
      </div>
    )
  }

  return (
    <div 
      className=""
    >
      <UserList users={users}/>
    </div>
  )
}