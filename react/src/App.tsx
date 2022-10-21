import { useState } from 'react'
import PostCreateModal from './components/modals/PostCreateModal';
import PostEditModal from './components/modals/PostEditModal';
import Posts from './components/post/Posts';
import { PostContext } from './context/post_context'
import { UserContext } from './context/user_context';

function App(user: any) {
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [currentModal, setCurrentModal] = useState("");

  return (
    <div className="App">
      <UserContext.Provider value={user}>
        <PostContext.Provider value={{posts, setPosts, editPost, setEditPost, currentModal, setCurrentModal}}>
          <Posts />
          
          <PostEditModal />
          <PostCreateModal />
        </PostContext.Provider> 
      </UserContext.Provider>
    </div>
  )
}

export default App
