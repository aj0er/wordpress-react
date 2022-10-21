import { useContext, useEffect } from 'react'
import Post from './Post';
import { PostContext } from '../../context/post_context';
import { UserContext } from '../../context/user_context';

export default function Posts() {
    const {posts, setPosts, setCurrentModal}: any = useContext(PostContext);
    const {user}: any = useContext(UserContext);

    useEffect(() => {
        async function fetchPosts(){
            let res = await fetch("http://localhost/wordpress/wp-json/api/posts");
            if(!res.ok)
                return;

            setPosts(await res.json());
        }

        fetchPosts();
    }, []);

    function createPost(){
        setCurrentModal("create");
    }

    return (
        <div>
            <h1>Inlägg</h1>
            {user != null && user.roles.includes("administrator") && (
                <button onClick={createPost}>Skapa nytt inlägg</button>
            )}

            {posts.map((post: any) => (
                <Post key={post.ID} data={post} />
            ))}
        </div>
    )
}
