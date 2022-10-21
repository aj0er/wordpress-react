import { useContext } from 'react'
import { PostContext } from '../../context/post_context'
import { UserContext } from '../../context/user_context';
import Modal from '../Modal';

export default function PostEditModal() {
    const {editPost, setEditPost, setPosts, setCurrentModal}: any = useContext(PostContext);
    const {user}: any = useContext(UserContext); 

    async function save(){
        let res = await fetch("http://localhost/wordpress/wp-json/api/posts/" + editPost.ID, {
            method: "put",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-WP-Nonce": user.nonce
            },
            body: JSON.stringify(editPost)
        });

        if(!res.ok){
          alert("Kunde inte spara ändringen, är du inloggad?");
          return;
        }

        setPosts((prev: any[]) => prev.map(g => g.ID != editPost.ID ? g : editPost));
        setEditPost(null);
        setCurrentModal(null);
    }

    function setValue(event: any){
      editPost[event.target.name] = event.target.value;
      setEditPost({... editPost});
    }

    return (
      <>
        <Modal id="edit" title="Ändra inlägg">
          {editPost != null && (
            <>
              <input name="post_title" value={editPost.post_title} onChange={setValue} type="text" placeholder="Titel"></input>
              <textarea name="post_content" value={editPost.post_content} onChange={setValue} style={{resize: "none"}}></textarea>
              <button onClick={save}>Spara</button>
            </>
          )}
        </Modal>
      </>
    )
}
