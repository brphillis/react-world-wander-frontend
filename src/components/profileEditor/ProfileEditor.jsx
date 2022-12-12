import "./profileEditor.css";
import { motion, useDragControls } from "framer-motion";
import { RiCloseCircleFill } from "react-icons/ri";

export default function ProfileEditor({
  profileEditor,
  setProfileEditor,
  width,
}) {
  const dragControls = useDragControls();
  const motionValues = {
    desktop: {
      position: "absolute",
      left: "35%",
      top: "1%",
      margin: "0",
    },
    mobile: {
      position: "absolute",
      left: "0",
      right: "0",
      marginLeft: "auto",
      marginRight: "auto",
      width: width,
    },
  };
  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={width > 600 ? motionValues.desktop : motionValues.mobile}
    >
      <div id="profileEditor">
        <div
          className="menuTopBar"
          onPointerDown={(e) => {
            dragControls.start(e);
          }}
        >
          <RiCloseCircleFill
            className="xCloseButtonWhite"
            onClick={() => setProfileEditor(false)}
          />
          <p>Edit Profile</p>
        </div>

        <div className="profileEditorContent"></div>
      </div>
    </motion.div>
  );
}
