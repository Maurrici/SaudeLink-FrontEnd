import { ReactNode } from "react"
import { Button } from "@mui/material"
import logo from "../../assets/logo.png"

interface SideBarProps {
        onClickNewChat: () => void;
        children: ReactNode;
}
      

const SideBar = ({onClickNewChat, children} : SideBarProps) => {
        return(
                <div style={{ display: 'flex', height: '100%', width: '100%' }}>
                        {/* Sidebar fixa */}
                        <div className="sidebar">
                                <div className="elementsInCenter">
                                        <img src={logo} alt="Logo do Sistema" />
                                </div>
                                <Button className="btn-newChat" onClick={onClickNewChat} variant="contained">Nova Análise</Button>
                        </div>

                        {/* Conteúdo principal */}
                        <div
                                style={{
                                        marginLeft: '280px',
                                        paddingLeft: '10px',
                                        flex: 1,
                                        overflowY: 'auto',
                                        height: '100%',
                                }}
                        >
                                {children}
                        </div>
                </div>
        )
}

export default SideBar;