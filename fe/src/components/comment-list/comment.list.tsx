import { FC } from "react";
import { Comment } from "../comment/comment";
import { IComment } from "../../lib/interfaces";

interface Props {
  comments: IComment[];
}
export const CommentsList:FC<Props> = ({ comments }) => {
  return (
    <div className="">
      <ul>
        {comments.map(comment => 
          <Comment 
            comment={comment}
            key={comment.id}
          />
        )}
      </ul>
    </div>
  )
}