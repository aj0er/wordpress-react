import { useContext } from 'react'
import { PostContext } from '../../context/post_context'
import { UserContext } from '../../context/user_context';

export default function Post({data}: any) {
    const {setEditPost, setPosts, setCurrentModal}: any = useContext(PostContext);
    const {user}: any = useContext(UserContext);

    async function deletePost(){
        let res = await fetch("http://localhost/wordpress/wp-json/api/posts/" + data.ID, {
            headers: {
                "X-WP-Nonce": user.nonce,
            },
            method: "delete",
            credentials: "include"
        });

        if(!res.ok){
            alert("Kunde inte ta bort inlägget, är du inloggad?");
            return;
        }

        setPosts((prev: any[]) => prev.filter(f => f.ID != data.ID));
    }

    async function editPost(){
        setEditPost({... data});
        setCurrentModal("edit");
    }

    return (
        <div className='post'>
            <h1>{data.post_title}</h1>
            <p>{data.post_content}</p>
            
            {user != null && user.roles.includes("administrator") && (
                <div style={{display: "flex", gap: "10px"}}>
                    <button onClick={editPost}>Ändra</button>
                    <button onClick={deletePost}>Ta bort</button>
                </div>
            )}
        </div>
    )
}
