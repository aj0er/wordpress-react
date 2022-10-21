import { useContext } from "react"
import { PostContext } from "../context/post_context"

export default function Modal(props: {id: string, title: string, children: any}) {

    const {currentModal, setCurrentModal}: any = useContext(PostContext);

    function close(){
        setCurrentModal(null);
    }

    function closeBg(e: any){
        if(!e.target.className.includes("modal-bg")) // stopPropagation verkar inte fungera i React, kolla target manuellt.
            return;

        close();
    }

    return (
        <>
            {currentModal == props.id && (
                <div className="modal-bg" onClick={closeBg}>
                    <div className="modal-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h1>{props.title}</h1>
                            <button style={{ float: 'right' }} onClick={close}>X</button>
                        </div>

                        {props.children}
                    </div>
                </div>
            )}
        </>
    )
}
