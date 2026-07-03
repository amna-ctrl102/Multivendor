import { useState } from "react";
import Header from "../components/layout/Header";
import styles from "../styles/styles";
import ProfileSideBar from "../components/Profile/ProfileSideBar";
import ProfileContent from "../components/Profile/ProfileContent";

const ProfilePage = () => {
  const [active, setActive] = useState(1);

  return (
    <div>
      <Header />

      <div className="min-h-screen bg-[#f5f5f5] py-6 md:py-10">
        <div
          className={`${styles.section} flex flex-col lg:flex-row gap-6`}
        >
          {/* Sidebar */}
          <div className="w-full lg:w-[300px] xl:w-[335px] flex-shrink-0">
            <ProfileSideBar
              active={active}
              setActive={setActive}
            />
          </div>

          {/* Content */}
          <div className="w-full flex-1 min-w-0">
            <ProfileContent active={active} />
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProfilePage;
