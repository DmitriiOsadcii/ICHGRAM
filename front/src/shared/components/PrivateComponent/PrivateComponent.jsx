import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChatProvider } from "../../../modules/Chat/Chat";
import { selectToken } from "../../../redux/auth/auth.selectors";

import Header from "../../../modules/Header/Header";
import Footer from "../../../modules/Footer/Footer";
import Modal from "../../../modules/Modals/Modal";

import MainPage from "../../../pages/MainPage/MainPage";
import SearchPage from "../../../pages/SearchPage/SearchPage";
import ExplorePage from "../../../pages/ExplorePage/ExplorePage";
import MessagePage from "../../../pages/MessagePage/MessagePage";
import NotificationPage from "../../../pages/NotificationPage/NotificationPage";
import UserProfilePage from "../../../pages/UserProfilePage/UserProfilePage";
import MyProfilePage from "../../../pages/MyProfilePage/MyProfilePage";
import EditProfilePage from "../../../pages/EditProfilePage/EditProfilePage";
import PostPage from "../../../pages/PostPage/PostPage";
import LogoutPage from "../../../pages/LogoutPage/LogoutPage";
import NotFoundPage from "../../../pages/NotFoundPage/NotFoundPage";

import NotificationBox from "../../../modules/SidePanelBox/NotificationBox/NotificationBox";
import SearchBox from "../../../modules/SidePanelBox/SearchBox/SearchBox";
import ChatBox from "../../../modules/SidePanelBox/ChatBox/ChatBox";
import PostBox from "../../../modules/SidePanelBox/PostBox/PostBox";

import styles from "./PrivateComponent.module.css";

function PrivateComponent() {
  const token = useSelector(selectToken); // нужен только чтобы «включить» сокет
  const location = useLocation();
  const navigate = useNavigate();

  const navState = location.state || {};
const bgLocation = navState.backgroundLocation || null;

// "Фоновая" локация для основного контента
const contentLocation = bgLocation || location;

const handleClosePanel = () => {
  navigate(-1); // всегда возвращаемся на фон
};

const content = (
  <div className={styles.appLayout}>
    <div className={styles.appHeader}>
      <Header />
      <div className={styles.appMain}>
        {/* основной контент рисуем по фону */}
        <Routes location={contentLocation}>
          <Route path="/main" element={<MainPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/messages" element={<MessagePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/users/:id" element={<UserProfilePage />} />
          <Route path="/api/profile" element={<MyProfilePage />} />
          <Route path="/api/profile/edit-profile" element={<EditProfilePage />} />
          <Route path="/posts/:id" element={<PostPage />} />
          <Route path="/api/auth/logout" element={<LogoutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Modal />

        {/* показываем оверлей, только если есть фон */}
        {bgLocation && (
          <>
            <div className={styles.overlayBackdrop} onClick={handleClosePanel} />
            <aside className={styles.overlayPanel}>
              <Routes>
                <Route path="/notifications" element={<NotificationBox />} />
                <Route path="/search" element={<SearchBox />} />
                <Route path="/messages" element={<ChatBox />} />
              </Routes>
            </aside>

            {/* центр для поста */}
            <Routes>
              <Route
                path="/posts/:id"
                element={
                  <>
                    <div className={styles.appModalBackdrop} onClick={() => navigate(-1)} />
                    <div className={styles.appModalCenter}>
                      <PostBox />
                    </div>
                  </>
                }
              />
            </Routes>
          </>
        )}
      </div>
    </div>
    <Footer />
  </div>
);

return token ? <ChatProvider key={token}>{content}</ChatProvider> : content;
}

export default PrivateComponent;