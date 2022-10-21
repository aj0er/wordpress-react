import { useContext } from 'react'
import { PostContext } from '../../context/post_context'
import { UserContext } from '../../context/user_context';
import Modal from '../Modal';

export default function PostCreateModal() {
    const {setCurrentModal, setPosts}: any = useContext(PostContext);
    const {user}: any = useContext(UserContext);

    async function save(event: any){
        event.preventDefault();

        let res = await fetch("http://localhost/wordpress/wp-json/api/posts", {
            method: "post",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-WP-Nonce": user.nonce
            },
            body: JSON.stringify({
                post_title: event.target.title.value,
                post_content: event.target.content.value
            })
        });

        if(!res.ok){
            alert("Kunde inte lägga till inlägget, är du inloggad?");
            return;
        }

        let json = await res.json();
        setPosts(json);
        setCurrentModal(null);
    }

    return (
        <>
            <Modal id="create" title="Skapa nytt inlägg">
                <form onSubmit={save}>
                    <input name="title" type="text" placeholder="Titel"></input>
                    <textarea name="content" placeholder="Innehåll" style={{resize: "none"}}></textarea>
                    <button>Spara</button>
                </form>
            </Modal>
        </>
      )
}
