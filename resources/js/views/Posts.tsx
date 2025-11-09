import { useContext } from "react";
import { AuthContext } from "../context/auth";
import PostList from "../components/post/PostList";

function Posts() {
    const auth = useContext(AuthContext);

    return (
        <div className="main-center">
            <PostList canPost={auth.authenticatedUser != null} />
        </div>
    );
}

export default Posts;
