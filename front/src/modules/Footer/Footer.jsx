import { useLocation, Link } from "react-router-dom"

import styles from "./Footer.module.css"

import menu from "../../shared/data/menu"

import { useDispatch } from "react-redux"
import { showModal } from "../../redux/modal/modal.slice"

const Footer = () => {
    const location = useLocation()
    const dispatch = useDispatch()

    const handleClick = (e, type) => {
        e.preventDefault()
        dispatch(showModal(type))
    }

    const elements = menu.map((item) => {
        const isModal = item.type === "modal"
        const path = item.href
        const state = item.openAsPanel ? { backgroundLocation: location } : undefined;

        return (
            <li key={item.id}>
                <Link to={path} state={state} className={styles.navAnchor} onClick={isModal ? (e) => handleClick(e, item.modalType) : undefined}>
                    {item.text}
                </Link>

            </li>
        )
    })

    return (
        <>
            <footer className={styles.shellWrap}>
                <div className={styles.contentBox}>
                    <ul className={styles.navRow}>{elements}</ul>
                    <div className={styles.footerSpacer}>  <p className={styles.copyrightNote}>© 2025 ICHgram</p> </div>
                </div>
            </footer>
        </>
    )

}

export default Footer;