export const MAIN_URL = 'https://us-central1-twt-clone-b4321.cloudfunctions.net/api/';

export const USER_ENDPOINT = MAIN_URL + 'user/';
export const POSTS_ENDPOINT = MAIN_URL +'posts/';
export const LIKES_ENDPOINT = MAIN_URL + 'likes/';
export const COMMENTS_ENDPOINT = MAIN_URL + 'comments/';

export const GET_PROFILE_URL = USER_ENDPOINT + 'profile';
export const GET_IS_LIKED = LIKES_ENDPOINT + 'liked';

export const POST_LOGIN_URL = USER_ENDPOINT + 'signin';
export const POST_LOGOUT_URL = USER_ENDPOINT + 'signout';
export const POST_REGISTRATION_URL = USER_ENDPOINT + 'signup';
export const POST_COMMENT_ENDPOINT = MAIN_URL + 'comments/';

export const PATCH_NEW_PASSWORD = USER_ENDPOINT + 'password';

export const DELETE_ACCOUNT_URL = USER_ENDPOINT + 'delete';